import { Injectable } from '@nestjs/common';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { CreateSubjectDto, DayOfWeek } from './dto/create-subject.dto';
import { buildDateTime } from '../utils/datetime.util';

const DAY_OF_WEEK_INDEX: Record<DayOfWeek, number> = {
  [DayOfWeek.DOMINGO]: 0,
  [DayOfWeek.SEGUNDA]: 1,
  [DayOfWeek.TERCA]: 2,
  [DayOfWeek.QUARTA]: 3,
  [DayOfWeek.QUINTA]: 4,
  [DayOfWeek.SEXTA]: 5,
  [DayOfWeek.SABADO]: 6,
};

@Injectable()
export class SubjectsService {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  async create(dto: CreateSubjectDto) {
    const calendar = this.googleCalendarService.getCalendar();
    const timezone = this.googleCalendarService.getTimezone();
    const calendarId = dto.calendarId ?? 'primary';

    const createdEvents: { day: string; eventId: string }[] = [];

    for (const weeklyClass of dto.weeklyClasses) {
      const firstOccurrence = this.findFirstOccurrence(
        dto.semester.startDate,
        weeklyClass.dayOfWeek,
      );

      const startDateTime = buildDateTime(
        firstOccurrence,
        weeklyClass.startTime,
      );
      const endDateTime = buildDateTime(
        firstOccurrence,
        weeklyClass.endTime,
      );
      const until = this.dateToRRuleUntil(dto.semester.endDate);

      const description = this.buildDescription(dto);

      const event = await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: dto.name,
          description,
          location: dto.location,
          colorId: dto.colorId,
          start: { dateTime: startDateTime, timeZone: timezone },
          end: { dateTime: endDateTime, timeZone: timezone },
          recurrence: [
            `RRULE:FREQ=WEEKLY;BYDAY=${weeklyClass.dayOfWeek};UNTIL=${until}`,
          ],
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 30 }],
          },
        },
      });

      createdEvents.push({
        day: this.dayLabel(weeklyClass.dayOfWeek),
        eventId: event.data.id!,
      });
    }

    return {
      message: `✅ Matéria "${dto.name}" adicionada ao calendário!`,
      semester: dto.semester,
      events: createdEvents,
    };
  }

  async remove(eventId: string, calendarId = 'primary') {
    const calendar = this.googleCalendarService.getCalendar();
    await calendar.events.delete({ calendarId, eventId });
    return { message: `✅ Evento ${eventId} e todas as suas recorrências foram removidos.` };
  }

  private findFirstOccurrence(startDate: string, dayOfWeek: DayOfWeek): Date {
    const [year, month, day] = startDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const targetDay = DAY_OF_WEEK_INDEX[dayOfWeek];
    const currentDay = date.getDay();
    const diff = (targetDay - currentDay + 7) % 7;
    date.setDate(date.getDate() + diff);
    return date;
  }

  private dateToRRuleUntil(date: string): string {
    return date.replace(/-/g, '') + 'T235959Z';
  }

  private buildDescription(dto: CreateSubjectDto): string {
    const lines: string[] = [];
    if (dto.professor) lines.push(`Professor: ${dto.professor}`);
    if (dto.description) lines.push(dto.description);
    return lines.join('\n');
  }

  private dayLabel(day: DayOfWeek): string {
    const labels: Record<DayOfWeek, string> = {
      [DayOfWeek.DOMINGO]: 'Domingo',
      [DayOfWeek.SEGUNDA]: 'Segunda-feira',
      [DayOfWeek.TERCA]: 'Terça-feira',
      [DayOfWeek.QUARTA]: 'Quarta-feira',
      [DayOfWeek.QUINTA]: 'Quinta-feira',
      [DayOfWeek.SEXTA]: 'Sexta-feira',
      [DayOfWeek.SABADO]: 'Sábado',
    };
    return labels[day];
  }
}
