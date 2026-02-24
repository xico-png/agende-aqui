import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';


import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Adicionar compromisso avulso',
    description: 'Cria um evento único no Google Calendar.',
  })
  @ApiBody({ type: CreateAppointmentDto })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Delete(':eventId')
  @ApiOperation({
    summary: 'Remover compromisso',
    description: 'Remove um evento do Google Calendar pelo ID.',
  })
  @ApiParam({ name: 'eventId', description: 'ID do evento retornado ao criar o compromisso' })
  @ApiQuery({
    name: 'calendarId',
    required: false,
    description: 'ID do calendário (padrão: primary)',
  })
  remove(
    @Param('eventId') eventId: string,
    @Query('calendarId') calendarId?: string,
  ) {
    return this.appointmentsService.remove(eventId, calendarId);
  }
}
