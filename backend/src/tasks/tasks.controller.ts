import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from './dto/task.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

// Todas las rutas de este controller están protegidas por el guard global.
// No necesitamos @UseGuards() aquí — ya está aplicado globalmente.
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET /api/tasks — Lista todas las tareas del usuario autenticado
  @Get()
  findAll(@CurrentUser() user: JwtPayload): Promise<TaskResponseDto[]> {
    return this.tasksService.findAll(user.sub);
  }

  // GET /api/tasks/kanban — Tareas agrupadas por estado para el Kanban
  @Get('kanban')
  getKanbanBoard(@CurrentUser() user: JwtPayload) {
    return this.tasksService.getKanbanBoard(user.sub);
  }

  // GET /api/tasks/:id — Una tarea específica
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaskResponseDto> {
    return this.tasksService.findOne(id, user.sub);
  }

  // POST /api/tasks — Crear nueva tarea
  @Post()
  create(
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(dto, user.sub);
  }

  // PATCH /api/tasks/:id — Actualización parcial (preferimos PATCH sobre PUT)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(id, dto, user.sub);
  }

  // DELETE /api/tasks/:id — Eliminar tarea
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    return this.tasksService.remove(id, user.sub);
  }
}
