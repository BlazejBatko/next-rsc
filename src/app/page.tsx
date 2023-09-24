import { prisma } from "./db";
import TodoItem from "../components/TodoItem";
import { revalidatePath } from "next/cache";
import SubmitFormButton from "../components/SubmitFormButton";

// QUERIES

const getTodos = () => {
  return prisma.todo.findMany();
};

const updateTodos = async (id: string, complete: boolean) => {
  await prisma.todo.update({
    where: { id },
    data: { complete },
  });
};

const deleteTodo = async (id: string) => {
  await prisma.todo.delete({
    where: { id },
  });
};

const addTodo = async (title: string) => {
  await prisma.todo.create({
    data: { title, complete: false },
  });
};

// REACT SERVER COMPONENT
const Home = async () => {
  const todos = await getTodos();

  // SERVER SIDE
  const handleAddTodo = async (data: FormData) => {
    "use server";

    const title = data.get("title")?.valueOf() as string;
    // simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (!title || typeof title !== "string") {
      throw new Error("Invalid title");
    }

    await addTodo(title);

    revalidatePath("/");
  };

  const handleMarkAsDone = async (id: string, complete: boolean) => {
    "use server";

    await updateTodos(id, complete);

    revalidatePath("/");
  };

  const handleDelete = async (id: string) => {
    "use server";

    await deleteTodo(id);

    revalidatePath("/");
  };

  return (
    <>
      <header>
        <h1 className="text-2xl">Todos</h1>
        <code className="my-2 block rounded-[5px] text-slate-500">
          this is example usage of nextjs{" "}
          <span className="bg-slate-600 text-slate-400 rounded-[5px] px-1 italic">
            react server components
          </span>
          - despite all actions on tasks are being reflected in hosted
          postgresql database there are no api calls and all queries are taking
          place direclty on the server
        </code>
      </header>

      <form className="my-5 flex gap-5">
        <input
          type="text"
          name="title"
          className="rounded-md bg-inherit px-2 py-1 border border-slate-100 "
        />
        <SubmitFormButton handleAddTodo={handleAddTodo} />
      </form>

      <ul className="flex flex-col gap-2">
        {todos
          .sort((a, b) => Number(a.created_at) - Number(b.created_at))
          .map((todo) => (
            <TodoItem
              key={todo.id}
              handleDeleteTodo={handleDelete}
              handleToggleComplete={handleMarkAsDone}
              {...todo}
            />
          ))}
      </ul>
    </>
  );
};

export default Home;
