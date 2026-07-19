import { useEffect, useState } from "react";

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
    <section className="bg-white/60 rounded-3xl shadow-lg p-6 w-full max-w-xl h-[45vh] min-h-[350px] flex flex-col">
      {" "}
      <h2 className="text-2xl font-bold text-sky-900 mb-6 ">Today Tasks</h2>
      <div className="flex flex-col lg:flex-row gap-3 mb-6 top-2">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="flex-1 border border-sky-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-800 "
        />

        <button
          onClick={addTask}
          className="bg-sky-900 hover:bg-sky-800 text-sky-50 hover:scale-110 duration-700 px-3 py-2 lg:py-0 rounded-xl transition"
        >
          Add
        </button>
      </div>
      {todos.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks yet.</p>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between bg-sky-800  rounded-xl px-4 py-3 gap-2"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTask(todo.id)}
                  className="w-5 h-5 shrink-0 accent-sky-700 cursor-pointer"
                />

                <span
                  className={`break-words pr-2 ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-sky-100"
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              <button
                onClick={() => deleteTask(todo.id)}
                className="text-red-500 hover:text-red-700 transition shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TodoList;
