import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import * as fs from 'fs';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getProducts(): string {
    const data = fs.readFileSync('./files/products.json', 'utf8');

    return JSON.parse(data);
  }

  saveOrder(name: string, lastname: string, file: Express.Multer.File): string {
    const directory = `./orders/${name}_${lastname}_${Date.now()}`; // Directorio para la orden
    const fileName = `${name}_${lastname}.${file.originalname.split('.').pop()}`; // Nombre del archivo

    try {
      fs.mkdirSync(directory, { recursive: true });

      fs.writeFileSync(`${directory}/${fileName}`, file.buffer);
      log('Order saved succesfuly' + fileName);
      return 'Order saved succesfuly';
    } catch (error) {
      console.error('Error saving orden', error);
      return 'Error saving orden';
    }
  }

  saveOrderStorage(
    name: string,
    lastname: string,
    file: Express.Multer.File,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = new Storage({
        projectId: this.configService.get('BUCKET_NAME'),
        credentials: {
          client_email: this.configService.get('STORAGE_CLIENT_EMAIL'),
          client_id: this.configService.get('STORAGE_CLIENT_ID'),
          private_key: this.configService.get('STORAGE_PRIVATE_KEY'),
        },
      });
      const bucket = storage.bucket(this.configService.get('BUCKET_NAME'));

      const fileName = `${name}_${lastname}_${Date.now()}.${file.originalname.split('.').pop()}`;

      const fileUpload = bucket.file(fileName);
      const stream = fileUpload.createWriteStream();

      stream.on('error', (err) => {
        log('Error saving orden', err);
        reject('Error al guardar la orden.');
      });

      stream.on('finish', () => {
        log('Order saved succesfuly filename: ' + fileName);
        resolve('Orden guardada exitosamente.');
      });

      stream.end(file.buffer);
    });
  }
}
