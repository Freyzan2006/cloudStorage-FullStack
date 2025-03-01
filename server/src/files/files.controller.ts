import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { EFileType } from './entities/file.entity';

@Controller('files')
@ApiTags("files")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(@UserId() userId: number, @Query('type') fileType: EFileType) {
    console.log('Received request for files with type:', fileType);

    
    return this.filesService.findAll(userId, fileType);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary"
        }
      }
    }
  })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({maxSize: 1024 * 1024 * 5})],
      }),
    ) file: Express.Multer.File,
    @UserId() userId: number
  ) {
    return this.filesService.create(file, userId);
  }

  @Delete()
  async remove(@UserId() userId: number, @Query('ids') ids: string) {
    try {
      if (!ids) {
        throw new BadRequestException('IDs parameter is required');
      }
      return await this.filesService.remove(userId, ids);
    } catch (error) {
      console.error('Error in remove controller:', error);
      throw error;
    }
  }

  @Delete('permanent')
  async permanentlyDelete(@UserId() userId: number, @Query('ids') ids: string) {
    try {
      return await this.filesService.permanentlyDeleteFile(userId, ids);
    } catch (error) {
      console.error('Error in permanentlyDelete controller:', error);
      throw error;
    }
  }

  @Post('restore')
  async restore(@UserId() userId: number, @Query('ids') ids: string) {
    try {
      if (!ids) {
        throw new BadRequestException('IDs parameter is required');
      }
      return await this.filesService.restore(userId, ids);
    } catch (error) {
      console.error('Error in restore controller:', error);
      throw error;
    }
  }
}
