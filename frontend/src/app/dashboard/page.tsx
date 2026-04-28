'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskStatus, type Task } from '@/types';
import { useKanbanBoard } from '@/hooks/useTasks';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingScreen, ErrorState } from '@/components/ui/Feedback';
import { useAuthStore } from '@/store/auth.store';

// ─── Modal state type ─────────────────────────────────────────────────────────
// Union type — el modal puede estar cerrado, en modo creación o en modo edición.
// Este patrón evita tener múltiples booleanos (isCreateOpen, isEditOpen).
type ModalState =
  | { type: 'closed' }
  | { type: 'create'; defaultStatus: TaskStatus }
  | { type: 'edit'; task: Task };

const KANBAN_COLUMNS = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE] as const;

// ─── DashboardContent ─────────────────────────────────────────────────────────
// Separamos el contenido del wrapper de AuthGuard para mejor organización.
const DashboardContent = () => {
  const { user } = useAuthStore();
  const [modalState, setModalState] = useState<ModalState>({ type: 'closed' });

  const { data: kanban, isLoading, isError, refetch } = useKanbanBoard();

  // ─── Modal handlers ────────────────────────────────────────────────────
  const handleOpenCreate = (status: TaskStatus = TaskStatus.TODO) => {
    setModalState({ type: 'create', defaultStatus: status });
  };

  const handleOpenEdit = (task: Task) => {
    setModalState({ type: 'edit', task });
  };

  const handleCloseModal = () => {
    setModalState({ type: 'closed' });
  };

  const handleFormSuccess = () => {
    handleCloseModal();
    // React Query invalida la caché automáticamente desde los hooks
  };

  // ─── Modal title and props ─────────────────────────────────────────────
  const modalTitle =
    modalState.type === 'edit'
      ? 'Editar tarea'
      : modalState.type === 'create'
        ? 'Nueva tarea'
        : '';

  const isModalOpen = modalState.type !== 'closed';

  // ─── Render states ─────────────────────────────────────────────────────
  if (isLoading) return <LoadingScreen message="Cargando tu tablero..." />;

  if (isError) {
    return (
      <ErrorState
        title="Error al cargar el tablero"
        message="No pudimos obtener tus tareas. Verifica tu conexión."
        onRetry={() => void refetch()}
      />
    );
  }

  const totalTasks = kanban
    ? Object.values(kanban).reduce((acc, tasks) => acc + tasks.length, 0)
    : 0;

  return (
    <>
      {/* Page header */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {user?.name ? `Hola, ${user.name} 👋` : 'Mi tablero'}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {totalTasks === 0
                ? 'No tienes tareas aún. ¡Crea la primera!'
                : `${totalTasks} tarea${totalTasks !== 1 ? 's' : ''} en total`}
            </p>
          </div>

          <Button
            onClick={() => handleOpenCreate()}
            leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}
            className="shrink-0"
          >
            Nueva tarea
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div
        className="mx-auto max-w-7xl overflow-x-auto px-4 pb-8 sm:px-6"
        aria-label="Tablero Kanban"
      >
        <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-3">
          {KANBAN_COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={kanban?.[status] ?? []}
              onAddTask={handleOpenCreate}
              onEditTask={handleOpenEdit}
            />
          ))}
        </div>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
      >
        {modalState.type === 'create' && (
          <TaskForm
            defaultStatus={modalState.defaultStatus}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        )}
        {modalState.type === 'edit' && (
          <TaskForm
            task={modalState.task}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </>
  );
};

// ─── DashboardPage ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <DashboardContent />
      </div>
    </AuthGuard>
  );
}
