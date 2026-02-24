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
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectsService } from './subjects.service';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Adicionar matéria semestral',
    description:
      'Cria eventos recorrentes semanais no Google Calendar para uma matéria durante todo o semestre.',
  })
  @ApiBody({ type: CreateSubjectDto })
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(dto);
  }

  @Delete(':eventId')
  @ApiOperation({
    summary: 'Remover matéria do calendário',
    description:
      'Remove o evento e todas as suas recorrências do Google Calendar.',
  })
  @ApiParam({ name: 'eventId', description: 'ID do evento retornado ao criar a matéria' })
  @ApiQuery({
    name: 'calendarId',
    required: false,
    description: 'ID do calendário (padrão: primary)',
  })
  remove(
    @Param('eventId') eventId: string,
    @Query('calendarId') calendarId?: string,
  ) {
    return this.subjectsService.remove(eventId, calendarId);
  }
}
