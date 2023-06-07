import {
  Controller,
  FileTypeValidator,
  Inject,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseUserDto } from '@/users/dto/response-user.dto';
import { Serialize } from '@interceptors/serialization.interceptor';

@Controller('upload')
export class UploadController {
  @Inject(UploadService)
  private readonly uploadService: UploadService;

  @Post('avatar/:userId')
  @Serialize(ResponseUserDto)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(jpeg|png|jpg|webp|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('userId', ParseUUIDPipe) id: string,
  ) {
    return this.uploadService.uploadAvatar(file, id);
  }
}
