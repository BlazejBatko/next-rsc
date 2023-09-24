import { prisma } from "./db";
import TodoItem from "../components/TodoItem";
import { revalidatePath } from "next/cache";
import LoadingButton from "../components/LoadingButton";

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

    revalidatePath("/");

    await addTodo(title);
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
          - despite all actions on tasks are being reflected in sqlite database
          there are no api calls and all queries are taking places on server
        </code>

        <code className="text-slate-400">
          NOTE: there is intentionall throttle on submit calls to test handling
          loading state
        </code>
      </header>

      <form className="my-5 flex gap-5">
        <input
          type="text"
          name="title"
          className="rounded-md bg-inherit px-2 py-1 border border-slate-100 "
        />
        <LoadingButton handleAddTodo={handleAddTodo} />
      </form>

      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoItem
            handleDeleteTodo={handleDelete}
            handleToggleComplete={handleMarkAsDone}
            key={todo.id}
            {...todo}
          />
        ))}
      </ul>
    </>
  );
};

export default Home;
