"use client";

import React, { useState } from "react";
import { Todo } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(true);

  const handleDeleteClick = async (id: string) => {
    setLoading(true);
    try {
      await handleDeleteTodo(id);
      setDisplay(false);
      toast({
        title: "Todo Deleted",
        description: "Todo has been deleted",
        duration: 2000,
      });
    } catch (error) {
      console.error(error);
      setDisplay(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`border border-dashed p-5 rounded-md max-w-[500px] ${
        display ? "block" : "hidden"
      }
        ${complete ? "border-green-500" : "border-slate-100"}
      }`}
    >
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
            disabled={loading}
            className="mx-3 min-w-[75px] border rounded-md border-slate-100 px-2 py-1"
            onClick={() => {
              handleDeleteClick(id);
            }}
          >
            {loading ? (
              <div className="animate-spin grid place-content-center">
                <Loader2 />
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </span>
      </li>
    </div>
  );
};

export default TodoItem;
