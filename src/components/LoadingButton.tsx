"use client";

import { Loader2 } from "lucide-react";
import React, { useState } from "react";

type Props = {
  handleAddTodo: (data: FormData) => Promise<void>;
};

const LoadingButton = ({ handleAddTodo }: Props) => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAddTodoClick = async () => {
    setPending(true);
    setError("");
    const form = document.querySelector("form");
    const formData = new FormData(form as HTMLFormElement);

    try {
      await handleAddTodo(formData);
    } catch (error) {
      setError("Invalid title");
      setPending(false);
    }

    setPending(false);
    form?.reset();
  };
  return (
    <>
      <button
        className={`border px-2 py-1 rounded-md `}
        disabled={pending}
        onClick={handleAddTodoClick}
      >
        {pending ? (
          <div className="animate-spin">
            <Loader2 />
          </div>
        ) : (
          "Submit"
        )}
      </button>

      {error && (
        <div className="bg-red-700 text-white p-1 rounded-md">{error}</div>
      )}
    </>
  );
};

export default LoadingButton;
