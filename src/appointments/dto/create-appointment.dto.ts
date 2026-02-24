import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Consulta médica', description: 'Título do compromisso' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Retorno com Dr. Carlos',
    description: 'Descrição do compromisso',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Clínica São Lucas - Av. Paulista, 1000',
    description: 'Local do compromisso',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: '2026-03-15T14:00:00',
    description: 'Data e hora de início (ISO 8601)',
  })
  @IsISO8601()
  startDateTime: string;

  @ApiProperty({
    example: '2026-03-15T15:00:00',
    description: 'Data e hora de término (ISO 8601)',
  })
  @IsISO8601()
  endDateTime: string;

  @ApiPropertyOptional({
    example: 30,
    description: 'Minutos de antecedência para o lembrete (padrão: 30)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reminderMinutes?: number;

  @ApiPropertyOptional({
    example: 'primary',
    description: 'ID do calendário (padrão: primary)',
  })
  @IsOptional()
  @IsString()
  calendarId?: string;

  @ApiPropertyOptional({
    example: '11',
    description: 'Cor do evento (1–11). Ver documentação para opções.',
  })
  @IsOptional()
  @IsString()
  colorId?: string;
}
