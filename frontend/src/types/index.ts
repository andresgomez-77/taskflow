// ─── Enums ────────────────────────────────────────────────────────────────────
// Espejamos los enums de Prisma aquí.
// En un monorepo avanzado esto estaría en un paquete /shared compartido.
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

// ─── Entities ─────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  order: number;
  createdAt: string; // ISO string desde la API
  updatedAt: string;
  userId: string;
}

// ─── API DTOs ─────────────────────────────────────────────────────────────────
export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  order?: number;
}

// ─── Kanban ───────────────────────────────────────────────────────────────────
export type KanbanBoard = Record<TaskStatus, Task[]>;

// ─── Utility types ────────────────────────────────────────────────────────────
// ApiError es lo que retorna nuestro HttpExceptionFilter del backend
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}
