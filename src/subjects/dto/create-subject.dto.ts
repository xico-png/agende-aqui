import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export enum DayOfWeek {
  DOMINGO = 'SU',
  SEGUNDA = 'MO',
  TERCA = 'TU',
  QUARTA = 'WE',
  QUINTA = 'TH',
  SEXTA = 'FR',
  SABADO = 'SA',
}

export enum CalendarColor {
  LAVANDA = '1',
  SALVIA = '2',
  UVA = '3',
  FLAMINGO = '4',
  BANANA = '5',
  TANGERINA = '6',
  PAVAO = '7',
  GRAFITE = '8',
  MIRTILO = '9',
  MANJERICAO = '10',
  TOMATE = '11',
}

export class WeeklyClassDto {
  @ApiProperty({
    enum: DayOfWeek,
    example: DayOfWeek.SEGUNDA,
    description: 'Dia da semana da aula',
  })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    example: '08:00',
    description: 'Horário de início no formato HH:mm',
  })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'startTime deve estar no formato HH:mm' })
  startTime: string;

  @ApiProperty({
    example: '10:00',
    description: 'Horário de término no formato HH:mm',
  })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'endTime deve estar no formato HH:mm' })
  endTime: string;
}

export class SemesterDto {
  @ApiProperty({
    example: '2026-02-16',
    description: 'Data de início do semestre (YYYY-MM-DD)',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate deve estar no formato YYYY-MM-DD',
  })
  startDate: string;

  @ApiProperty({
    example: '2026-06-30',
    description: 'Data de término do semestre (YYYY-MM-DD)',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate deve estar no formato YYYY-MM-DD',
  })
  endDate: string;
}

export class CreateSubjectDto {
  @ApiProperty({ example: 'Cálculo I', description: 'Nome da matéria' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Prof. João Silva',
    description: 'Nome do professor',
  })
  @IsOptional()
  @IsString()
  professor?: string;

  @ApiPropertyOptional({
    example: 'Bloco A - Sala 101',
    description: 'Local das aulas',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: 'Trazer calculadora científica',
    description: 'Descrição ou observações adicionais',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Período do semestre' })
  @ValidateNested()
  @Type(() => SemesterDto)
  semester: SemesterDto;

  @ApiProperty({
    type: [WeeklyClassDto],
    description: 'Aulas semanais (dias e horários)',
    example: [
      { dayOfWeek: 'MO', startTime: '08:00', endTime: '10:00' },
      { dayOfWeek: 'WE', startTime: '08:00', endTime: '10:00' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeeklyClassDto)
  weeklyClasses: WeeklyClassDto[];

  @ApiPropertyOptional({
    enum: CalendarColor,
    example: CalendarColor.MIRTILO,
    description: 'Cor dos eventos no Google Calendar',
  })
  @IsOptional()
  @IsEnum(CalendarColor)
  colorId?: CalendarColor;

  @ApiPropertyOptional({
    example: 'primary',
    description: 'ID do calendário (padrão: primary)',
  })
  @IsOptional()
  @IsString()
  calendarId?: string;
}
