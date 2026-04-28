'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { TaskStatus, type Task } from '@/types';
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { getErrorMessage, cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface TaskFormProps {
  // Si se pasa task → modo edición. Si no → modo creación.
  task?: Task;
  defaultStatus?: TaskStatus;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormState {
  title: string;
  description: string;
  status: TaskStatus;
}

interface FormErrors {
  title?: string;
}

// ─── TaskForm ─────────────────────────────────────────────────────────────────
// Un solo componente para crear Y editar — evita duplicar lógica de formulario.
// El modo se determina por si existe la prop `task`.
export const TaskForm = ({
  task,
  defaultStatus = TaskStatus.TODO,
  onSuccess,
  onCancel,
}: TaskFormProps) => {
  const isEditing = !!task;

  const [formState, setFormState] = useState<FormState>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? defaultStatus,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate: createTask, isPending: isCreating, error: createError } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating, error: updateError } = useUpdateTask();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  // Sincroniza el form si cambia la tarea en modo edición
  useEffect(() => {
    if (task) {
      setFormState({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
      });
    }
  }, [task]);

  // ─── Validation ─────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formState.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formState.title.trim().length < 2) {
      newErrors.title = 'El título debe tener al menos 2 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      title: formState.title.trim(),
      description: formState.description.trim() || undefined,
      status: formState.status,
    };

    if (isEditing && task) {
      updateTask(
        { id: task.id, data },
        { onSuccess },
      );
    } else {
      createTask(data, { onSuccess });
    }
  };

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: TaskStatus.TODO, label: 'Por hacer' },
    { value: TaskStatus.IN_PROGRESS, label: 'En progreso' },
    { value: TaskStatus.DONE, label: 'Completado' },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* API Error */}
      {apiError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {getErrorMessage(apiError)}
        </div>
      )}

      {/* Title */}
      <Input
        label="Título"
        required
        placeholder="¿Qué necesitas hacer?"
        value={formState.title}
        onChange={(e) => handleFieldChange('title', e.target.value)}
        error={errors.title}
        disabled={isPending}
        autoFocus
      />

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="task-description"
          className="text-sm font-medium text-gray-700"
        >
          Descripción <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <textarea
          id="task-description"
          rows={3}
          placeholder="Agrega más detalles..."
          value={formState.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          disabled={isPending}
          className={cn(
            'w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900',
            'placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500',
            'disabled:cursor-not-allowed disabled:bg-gray-50',
          )}
        />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-700">Estado</span>
        <div className="flex gap-2" role="radiogroup" aria-label="Estado de la tarea">
          {statusOptions.map(({ value, label }) => (
            <label
              key={value}
              className={cn(
                'flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                formState.status === value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              <input
                type="radio"
                name="status"
                value={value}
                checked={formState.status === value}
                onChange={() => handleFieldChange('status', value)}
                className="sr-only"
                aria-label={label}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Guardar cambios' : 'Crear tarea'}
        </Button>
      </div>
    </form>
  );
};
