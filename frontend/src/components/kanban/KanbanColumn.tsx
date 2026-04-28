'use client';

import { Plus } from 'lucide-react';
import { TaskStatus, type Task } from '@/types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '@/components/ui/Feedback';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

// ─── Column config ────────────────────────────────────────────────────────────
const columnConfig: Record<
  TaskStatus,
  { title: string; headerClass: string; dotClass: string; countClass: string }
> = {
  [TaskStatus.TODO]: {
    title: 'Por hacer',
    headerClass: 'border-t-gray-400',
    dotClass: 'bg-gray-400',
    countClass: 'bg-gray-100 text-gray-600',
  },
  [TaskStatus.IN_PROGRESS]: {
    title: 'En progreso',
    headerClass: 'border-t-blue-500',
    dotClass: 'bg-blue-500',
    countClass: 'bg-blue-50 text-blue-700',
  },
  [TaskStatus.DONE]: {
    title: 'Completado',
    headerClass: 'border-t-green-500',
    dotClass: 'bg-green-500',
    countClass: 'bg-green-50 text-green-700',
  },
};

// ─── KanbanColumn ─────────────────────────────────────────────────────────────
export const KanbanColumn = ({
  status,
  tasks,
  onAddTask,
  onEditTask,
}: KanbanColumnProps) => {
  const { title, headerClass, dotClass, countClass } = columnConfig[status];

  const handleAddClick = () => onAddTask(status);

  return (
    <section
      className={cn(
        'flex w-full min-w-[280px] max-w-xs flex-col rounded-xl',
        'border border-gray-200 border-t-4 bg-gray-50/70',
        headerClass,
      )}
      aria-label={`Columna: ${title}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={cn('h-2.5 w-2.5 rounded-full', dotClass)}
            aria-hidden="true"
          />
          <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
          <span
            className={cn(
              'ml-1 rounded-full px-2 py-0.5 text-xs font-medium',
              countClass,
            )}
            aria-label={`${tasks.length} tareas`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={handleAddClick}
          aria-label={`Agregar tarea en ${title}`}
          tabIndex={0}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Tasks list */}
      <div
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3"
        style={{ maxHeight: 'calc(100vh - 260px)' }}
        role="list"
        aria-label={`Tareas en ${title}`}
      >
        {tasks.length === 0 ? (
          <EmptyState
            title="Sin tareas"
            message="Agrega una tarea en esta columna"
            action={
              <button
                onClick={handleAddClick}
                className="text-xs text-indigo-600 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
                tabIndex={0}
              >
                + Agregar tarea
              </button>
            }
          />
        ) : (
          tasks.map((task) => (
            <div key={task.id} role="listitem">
              <TaskCard task={task} onEdit={onEditTask} />
            </div>
          ))
        )}
      </div>
    </section>
  );
};
