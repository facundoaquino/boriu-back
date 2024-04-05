import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/EmailDto';
import { IResponse } from 'src/models/IResponse';

@Controller('api/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: () => {
        return new BadRequestException('Campos incorrectos');
      },
    }),
  )
  async sendEmail(@Body() emailDto: EmailDto): Promise<IResponse> {
    await this.emailService.sendEmail(emailDto);
    return { status: 'success', message: 'Orden enviada' };
  }
}
