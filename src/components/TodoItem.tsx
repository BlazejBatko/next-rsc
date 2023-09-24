"use client";

import React from "react";
import { Todo } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

type Props = Todo & {
  handleToggleComplete: (id: string, complete: boolean) => void;
  handleDeleteTodo: (id: string) => Promise<void>;
};

const TodoItem = ({
  id,
  title,
  complete,
  handleToggleComplete,
  handleDeleteTodo,
}: Props) => {
  const { toast } = useToast();

  const handleDeleteClick = async (id: string) => {
    await handleDeleteTodo(id);
    toast({
      title: "Todo Deleted",
      description: "Todo has been deleted",
      duration: 2000,
    });
  };

  return (
    <div className="border border-dashed border-slate-100 p-5 rounded-md max-w-[500px]">
      <li className="flex items-center justify-between">
        <span>{title}</span>
        <span className="flex-none gap-1 flex items-center">
          <label htmlFor={id}>completed</label>
          <input
            id={id}
            type="checkbox"
            defaultChecked={complete}
            onChange={(e) => handleToggleComplete(id, e.target.checked)}
          />
          <button
            className="mx-3 border rounded-md border-slate-100 px-2 py-1"
            onClick={() => {
              handleDeleteClick(id);
            }}
          >
            Delete
          </button>
        </span>
      </li>
    </div>
  );
};

export default TodoItem;
