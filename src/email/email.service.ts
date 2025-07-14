import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailDto } from './dto/EmailDto';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  private readonly logger = new Logger(EmailService.name);

  async sendEmail(emailDto: EmailDto): Promise<void> {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>New Order</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .image-container {
          text-align: center;
        }
        .image-container img {
          max-width: 100%;
          height: auto;
        }
        table {
          margin: 16px 0;
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #dddddd;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
    }
    @media only screen and (max-width: 600px) {
      /* Estilos para dispositivos móviles */
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        display: block;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
    }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Nuevo pedido</h1>
        <div class="table">
          <table>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Telefono</th>
              <th>Productos</th>
              <th>Total</th>
            </tr>
            <tr>
              <td>${emailDto.name}</td>
              <td>${emailDto.lastname}</td>
              <td>${emailDto.phone}</td>
              <td>${emailDto.order.replaceAll('space', '<br>')}</td>
              <td>${emailDto.total}</td>
            </tr>
          </table>
        </div>
        <div class="image-container" style="background-color: black;">
          <img width="100px" src="https://storage.googleapis.com/br-public-assets/logo.jpg" alt="Imagen" />
        </div>
      </div>
    </body>
    </html>`;
    const transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_ENTERPRISE_FROM'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });

    const mailOptions: Mail.Options = {
      from: this.configService.get('EMAIL_ENTERPRISE_FROM'),
      to: this.configService.get('EMAIL_ENTERPRISE_TO'),
      subject: `PEDIDO-WEB-${emailDto.name}-${emailDto.lastname}`,
      html: htmlContent,
    };
    this.logger.log(
      `Sending new order email to enterprise, client: ${emailDto.name.substring(0, 3)}... ${emailDto.lastname.substring(0, 3)}...`,
    );
    await transporter.sendMail(mailOptions);
  }
}
