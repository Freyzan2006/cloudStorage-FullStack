import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EFileType, FileEntity } from './entities/file.entity';
import { Repository, In } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>
  ) {}

  findAll(userId: number, fileType: EFileType) {
    console.log('Finding files with type:', fileType);
    
    const qb = this.repository.createQueryBuilder("file");

    // Базовый запрос для пользователя
    qb.where("file.userId = :userId", { userId });
    

    switch (fileType) {
      case EFileType.TRASH:
        console.log('Processing TRASH filter');
        qb.withDeleted()
          .andWhere("file.deletedAt IS NOT NULL");
        break;

      case EFileType.PHOTOS:
        console.log('Processing PHOTOS filter');
        qb.andWhere("file.mimetype ILIKE :type", { type: "%image%" })
          .andWhere("file.deletedAt IS NULL");
        break;

      case EFileType.FILES:
        console.log('Processing FILES filter');
        qb.andWhere("file.mimetype NOT ILIKE :type", { type: "%image%" })
          .andWhere("file.deletedAt IS NULL");
        break;

      case EFileType.ALL:
      default:
        console.log('Processing ALL filter');
        qb.andWhere("file.deletedAt IS NULL");
        break;
    }

    // Добавляем логирование SQL запроса
    const query = qb.getQuery();
    const params = qb.getParameters();
    // console.log('Generated SQL query:', query);
    // console.log('Query parameters:', params);

    return qb.orderBy("file.id", "DESC").getMany();
  }

  create(file: Express.Multer.File, userId: number)  {
    return this.repository.save({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    })
  }

  async remove(userId: number, ids: string) {
    try {
      if (!ids) {
        throw new BadRequestException('IDs parameter is required');
      }

      // Преобразуем строку с ID в массив чисел
      const idsArray = ids.split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

      if (idsArray.length === 0) {
        throw new BadRequestException('No valid file IDs provided');
      }

      // Сначала проверяем существование файлов
      const files = await this.repository.find({
        where: {
          id: In(idsArray),
          user: { id: userId }
        }
      });

      if (files.length === 0) {
        throw new NotFoundException('No files found for deletion');
      }

      // Выполняем мягкое удаление найденных файлов
      await this.repository.softRemove(files);

      return {
        success: true,
        message: `Successfully deleted ${files.length} files`,
        deletedIds: files.map(file => file.id)
      };

    } catch (error) {
      console.error('Error in remove method:', error);
      
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to remove files: ' + error.message);
    }
  }

  async permanentlyDeleteFile(userId: number, ids: string) {
    try {
      if (!ids) {
        throw new BadRequestException('IDs parameter is required');
      }

      const idsArray = ids.split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

      if (idsArray.length === 0) {
        throw new BadRequestException('No valid file IDs provided');
      }

      // Находим удаленные файлы
      const files = await this.repository
        .createQueryBuilder('file')
        .withDeleted()
        .where('file.id IN (:...ids)', { ids: idsArray })
        .andWhere('file.userId = :userId', { userId })
        .andWhere('file.deletedAt IS NOT NULL')
        .getMany();

      if (files.length === 0) {
        throw new NotFoundException('No deleted files found for permanent deletion');
      }

      // Удаляем физические файлы
      for (const file of files) {
        const filePath = path.join(process.cwd(), 'uploads', file.filename);
        
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error(`Error deleting file ${file.filename}:`, error);
        }
      }

      // Удаляем записи из БД, сохраняя дату удаления
      await this.repository
        .createQueryBuilder()
        .delete()
        .from(FileEntity)
        .where('id IN (:...ids)', { ids: idsArray })
        .andWhere('userId = :userId', { userId })
        .execute();

      return {
        success: true,
        message: `Successfully permanently deleted ${files.length} files`,
        deletedIds: files.map(file => file.id)
      };

    } catch (error) {
      console.error('Error in permanentlyDeleteFile method:', error);
      
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to permanently delete files: ' + error.message);
    }
  }

  async restore(userId: number, ids: string) {
    try {
      if (!ids) {
        throw new BadRequestException('IDs parameter is required');
      }

      const idsArray = ids.split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

      if (idsArray.length === 0) {
        throw new BadRequestException('No valid file IDs provided');
      }

      // Находим удаленные файлы
      const files = await this.repository
        .createQueryBuilder('file')
        .withDeleted()
        .where('file.id IN (:...ids)', { ids: idsArray })
        .andWhere('file.userId = :userId', { userId })
        .andWhere('file.deletedAt IS NOT NULL')
        .getMany();

      if (files.length === 0) {
        throw new NotFoundException('No deleted files found for restoration');
      }

      // Восстанавливаем файлы
      await this.repository.restore({
        id: In(files.map(file => file.id))
      });

      return {
        success: true,
        message: `Successfully restored ${files.length} files`,
        restoredIds: files.map(file => file.id)
      };

    } catch (error) {
      console.error('Error in restore method:', error);
      
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to restore files: ' + error.message);
    }
  }
}
