import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

function TodoList() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    if (!task.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleTask = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <section className="flex h-[360px] w-full max-w-none flex-col rounded-md bg-white/70 p-4 shadow-lg sm:h-[45vh] sm:min-h-[350px] sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-sky-900 sm:mb-6 sm:text-2xl">
        Today Tasks
      </h2>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="min-w-0 flex-1 rounded-md border border-sky-200 p-3 outline-none focus:ring-2 focus:ring-sky-800"
        />

        <button
          onClick={addTask}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-900 px-4 py-2 font-semibold text-sky-50 transition duration-300 hover:bg-sky-800"
          title="Add task"
          type="button"
        >
          <Plus size={18} />
          <span>Add</span>
        </button>
      </div>
      {todos.length === 0 ? (
        <p className="text-center text-gray-500">No tasks yet.</p>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between gap-2 rounded-md bg-sky-800 px-3 py-3 sm:px-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTask(todo.id)}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-sky-700"
                />

                <span
                  className={`break-words pr-2 text-sm sm:text-base ${
                    todo.completed
                      ? "text-gray-400 line-through"
                      : "text-sky-100"
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              <button
                onClick={() => deleteTask(todo.id)}
                className="shrink-0 rounded-md p-1 text-red-200 transition hover:bg-white/10 hover:text-red-100"
                title="Delete task"
                type="button"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TodoList;
