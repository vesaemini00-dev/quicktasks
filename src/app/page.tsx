"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Task = {
  id: string;
  title: string;
  priority: string;
  completed: boolean;
};

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  return res.json();
}

export default function Home() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const addTask = useMutation({
    mutationFn: async (newTask: { title: string; priority: string }) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
    },
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return (
    <main style={{ maxWidth: 600, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1>QuickTasks</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addTask.mutate({ title, priority });
        }}
        style={{ display: "flex", gap: 8, marginBottom: 24 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          style={{ flex: 1, padding: 8 }}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" disabled={addTask.isPending}>
          Add
        </button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks?.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom: "1px solid #eee",
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  toggleTask.mutate({ id: task.id, completed: e.target.checked })
                }
              />
              <span style={{ flex: 1 }}>{task.title}</span>
              <span style={{ fontSize: 12, color: "#888" }}>{task.priority}</span>
              <button onClick={() => deleteTask.mutate(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}