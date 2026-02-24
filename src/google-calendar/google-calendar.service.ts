import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;
  private calendar: calendar_v3.Calendar;
  private readonly tokenPath = path.join(process.cwd(), 'tokens.json');

  constructor(private configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    );

    if (fs.existsSync(this.tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(this.tokenPath, 'utf-8'));
      this.oauth2Client.setCredentials(tokens);
    }

    this.oauth2Client.on('tokens', (tokens) => {
      const current = fs.existsSync(this.tokenPath)
        ? JSON.parse(fs.readFileSync(this.tokenPath, 'utf-8'))
        : {};
      fs.writeFileSync(
        this.tokenPath,
        JSON.stringify({ ...current, ...tokens }),
      );
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      prompt: 'consent',
    });
  }

  async handleCallback(code: string): Promise<void> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    fs.writeFileSync(this.tokenPath, JSON.stringify(tokens));
  }

  isAuthenticated(): boolean {
    return fs.existsSync(this.tokenPath);
  }

  getCalendar(): calendar_v3.Calendar {
    if (!this.isAuthenticated()) {
      throw new UnauthorizedException(
        'Não autenticado. Acesse GET /auth/google para autorizar.',
      );
    }
    return this.calendar;
  }

  getTimezone(): string {
    return this.configService.get<string>('TIMEZONE') ?? 'America/Sao_Paulo';
  }
}
