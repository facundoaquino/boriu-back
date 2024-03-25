import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getProducts();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 50 * 1024 * 1024, // Límite de tamaño del archivo en bytes (50 MB)
      },
      fileFilter: (req, file, callback) => {
        if (
          !file.originalname.match(
            /\.(jpg|jpeg|png|gif|svg|bmp|webp|tiff|ico|psd|ai|eps)$/,
          )
        ) {
          return callback(
            new BadRequestException('Solo se permiten archivos de imagen.'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(
    @UploadedFile() logo: Express.Multer.File,
    @Body('name') name: string,
    @Body('lastname') lastname: string,
  ) {
    try {
      const result = this.appService.saveOrder(name, lastname, logo);
      return { status: 'success', message: result };
    } catch (error) {
      return { status: 'error', message: 'Error al guardar la orden.' };
    }
  }
}
