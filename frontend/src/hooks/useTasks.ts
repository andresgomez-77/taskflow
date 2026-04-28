'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/lib/api/tasks.api';
import { queryKeys } from '@/lib/utils';
import type { CreateTaskData, UpdateTaskData, Task, KanbanBoard } from '@/types';

// ─── useKanbanBoard ───────────────────────────────────────────────────────────
// Carga las tareas ya agrupadas por estado para el tablero Kanban.
// staleTime: 30s — los datos son "frescos" por 30 segundos antes de refetch.
export const useKanbanBoard = () => {
  return useQuery<KanbanBoard>({
    queryKey: queryKeys.tasks.kanban,
    queryFn: tasksApi.getKanban,
    staleTime: 30 * 1000,
  });
};

// ─── useTasks ─────────────────────────────────────────────────────────────────
export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: queryKeys.tasks.all,
    queryFn: tasksApi.getAll,
    staleTime: 30 * 1000,
  });
};

// ─── useCreateTask ────────────────────────────────────────────────────────────
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => tasksApi.create(data),
    onSuccess: () => {
      // Invalidamos la caché del kanban para que React Query refetche
      // automáticamente los datos actualizados.
      // Este patrón es "Invalidate and Refetch" — el más seguro y simple.
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.kanban });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
};

// ─── useUpdateTask ────────────────────────────────────────────────────────────
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      tasksApi.update(id, data),

    // ─── Optimistic Update ────────────────────────────────────────────────
    // onMutate se ejecuta ANTES de la request al servidor.
    // Actualizamos la UI inmediatamente para que se sienta instantáneo.
    // Si la request falla, revertimos en onError.
    // Este patrón mejora drásticamente la UX percibida (Fase 6).
    onMutate: async ({ id, data }) => {
      // Cancelamos cualquier refetch en curso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.kanban });

      // Guardamos el estado anterior para poder revertir
      const previousKanban = queryClient.getQueryData<KanbanBoard>(
        queryKeys.tasks.kanban,
      );

      // Actualizamos la caché optimistamente
      queryClient.setQueryData<KanbanBoard>(queryKeys.tasks.kanban, (old) => {
        if (!old) return old;
        const updated = { ...old };
        for (const status of Object.keys(updated) as Array<keyof KanbanBoard>) {
          updated[status] = updated[status].map((task) =>
            task.id === id ? { ...task, ...data } : task,
          );
        }
        return updated;
      });

      return { previousKanban };
    },

    onError: (_err, _vars, context) => {
      // Si falló, revertimos al estado anterior
      if (context?.previousKanban) {
        queryClient.setQueryData(queryKeys.tasks.kanban, context.previousKanban);
      }
    },

    onSettled: () => {
      // Siempre refetcheamos al terminar para asegurarnos de tener datos reales
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.kanban });
    },
  });
};

// ─── useDeleteTask ────────────────────────────────────────────────────────────
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.kanban });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
};
