"use client";
import { ResponsiveModal } from "../responsive-modal";
import { TodoForm } from "../forms/todo-form";
import { useRepoModal } from "@/hooks/use-modal";

export const TodoModal = () => {
  const { isOpen, closeModal, mode, data } = useRepoModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={closeModal}>
      {mode === "edit" && data && <TodoForm todo={data} />}

      {mode === "create" && <TodoForm />}
    </ResponsiveModal>
  );
};
