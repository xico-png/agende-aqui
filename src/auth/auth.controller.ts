import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  @Get('google')
  @ApiOperation({
    summary: 'Iniciar autenticação com o Google',
    description:
      'Redireciona para a tela de autorização do Google. Faça isso uma vez para liberar o acesso ao Google Calendar.',
  })
  @Redirect()
  googleAuth() {
    const url = this.googleCalendarService.getAuthUrl();
    return { url, statusCode: 302 };
  }

  @Get('google/callback')
  @ApiOperation({
    summary: 'Callback OAuth2 do Google',
    description: 'Chamado automaticamente pelo Google após a autorização.',
  })
  @ApiQuery({ name: 'code', description: 'Código de autorização do Google' })
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    await this.googleCalendarService.handleCallback(code);
    return res.status(200).json({
      message:
        '✅ Autenticação realizada com sucesso! Você já pode usar a API.',
    });
  }

  @Get('status')
  @ApiOperation({ summary: 'Verificar status da autenticação' })
  status() {
    const authenticated = this.googleCalendarService.isAuthenticated();
    return {
      authenticated,
      message: authenticated
        ? '✅ Autenticado com o Google Calendar.'
        : '❌ Não autenticado. Acesse GET /auth/google para autorizar.',
    };
  }
}
