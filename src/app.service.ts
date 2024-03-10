import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    const data = fs.readFileSync('./files/products.json', 'utf8');

    return JSON.parse(data);
  }
}
