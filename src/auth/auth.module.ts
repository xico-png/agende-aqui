import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';

@Module({
  imports: [GoogleCalendarModule],
  controllers: [AuthController],
})
export class AuthModule {}
