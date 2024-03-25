import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getProducts(): string {
    const data = fs.readFileSync('./files/products.json', 'utf8');

    return JSON.parse(data);
  }

  saveOrder(name: string, lastname: string, file: Express.Multer.File): string {
    const directory = `./orders/${name}_${lastname}_${Date.now()}`; // Directorio para la orden
    const fileName = `${name}_${lastname}.${file.originalname.split('.').pop()}`; // Nombre del archivo

    try {
      // Crea el directorio
      fs.mkdirSync(directory, { recursive: true });

      // Guarda el archivo en el directorio
      fs.writeFileSync(`${directory}/${fileName}`, file.buffer);

      return 'Orden guardada exitosamente.';
    } catch (error) {
      // Manejo de errores
      console.error('Error al guardar la orden:', error);
      return 'Error al guardar la orden.';
    }
  }
}
