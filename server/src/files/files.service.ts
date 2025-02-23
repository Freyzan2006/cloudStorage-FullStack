import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EFileType, FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>
  ) {}

  findAll(userId: number, fileType: EFileType) {
    const qb = this.repository.createQueryBuilder("file");

    qb.where("file.userId = :userId", { userId });

    if (fileType === EFileType.PHOTOS) {
      qb.andWhere("file.mimetype ILIKE :type", { type: "%image%" })
    }

    if (fileType === EFileType.TRASH) {
      qb.withDeleted().andWhere("file.deletedAt IS NOT NULL")
    }

    return qb.getMany();
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
    const idsArray = ids.split(",");

    const qb = this.repository.createQueryBuilder("file")

    qb.where("id IN (:...ids) AND userId = :userId", {
      ids: idsArray,
      userId,
    })

    return qb.softDelete().execute();
  }

}
