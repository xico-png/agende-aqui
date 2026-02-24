import { Injectable } from '@nestjs/common';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  async create(dto: CreateAppointmentDto) {
    const calendar = this.googleCalendarService.getCalendar();
    const timezone = this.googleCalendarService.getTimezone();
    const calendarId = dto.calendarId ?? 'primary';
    const reminderMinutes = dto.reminderMinutes ?? 30;

    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: dto.title,
        description: dto.description,
        location: dto.location,
        colorId: dto.colorId,
        start: { dateTime: dto.startDateTime, timeZone: timezone },
        end: { dateTime: dto.endDateTime, timeZone: timezone },
        reminders: {
          useDefault: false,
          overrides: [{ method: 'popup', minutes: reminderMinutes }],
        },
      },
    });

    return {
      message: `✅ Compromisso "${dto.title}" adicionado ao calendário!`,
      eventId: event.data.id,
      link: event.data.htmlLink,
    };
  }

  async remove(eventId: string, calendarId = 'primary') {
    const calendar = this.googleCalendarService.getCalendar();
    await calendar.events.delete({ calendarId, eventId });
    return { message: `✅ Compromisso ${eventId} removido do calendário.` };
  }
}
