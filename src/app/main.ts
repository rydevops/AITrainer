import { STORAGE_KEY, parseTasks, serializeTasks } from "../core/storage";
import {
  createTask,
  deleteTask,
  setTaskCompleted,
  toIsoDate,
  updateTask,
  type Task,
  type TaskInput,
} from "../core/tasks";
import { createTaskForm } from "../ui/taskForm";
import { renderTaskList } from "../ui/taskList";

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function requireElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (element === null) {
    throw new Error(`Missing required element: #${id}`);
  }
  return element as T;
}

function start(): void {
  const storage = window.localStorage;
  let tasks: Task[] = parseTasks(storage.getItem(STORAGE_KEY));

  const listContainer = requireElement<HTMLElement>("task-list");
  const newTaskButton = requireElement<HTMLButtonElement>("new-task");
  const form = requireElement<HTMLFormElement>("task-form");

  function persist(): void {
    storage.setItem(STORAGE_KEY, serializeTasks(tasks));
  }

  function render(): void {
    renderTaskList(listContainer, tasks, {
      onToggleCompleted: (id, completed) => {
        const task = findTask(id);
        if (task === undefined) {
          return;
        }
        replaceTask(setTaskCompleted(task, completed, today()));
      },
      onEdit: (id) => {
        const task = findTask(id);
        if (task !== undefined) {
          taskForm.open(task, today());
        }
      },
      onDelete: (id) => {
        tasks = deleteTask(tasks, id);
        persist();
        render();
      },
    });
  }

  function findTask(id: string): Task | undefined {
    return tasks.find((task) => task.id === id);
  }

  function replaceTask(updated: Task): void {
    tasks = tasks.map((task) => (task.id === updated.id ? updated : task));
    persist();
    render();
  }

  function saveInput(input: TaskInput, editingId: string | null): void {
    if (editingId === null) {
      tasks = [...tasks, createTask(createId(), input)];
    } else {
      const existing = findTask(editingId);
      if (existing === undefined) {
        return;
      }
      tasks = tasks.map((task) => (task.id === editingId ? updateTask(existing, input) : task));
    }
    persist();
    render();
  }

  const taskForm = createTaskForm(form, { onSubmit: saveInput });
  newTaskButton.addEventListener("click", () => taskForm.open(null, today()));

  render();
  registerServiceWorker();
}

function today(): string {
  return toIsoDate(new Date());
}

function registerServiceWorker(): void {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch((error: unknown) => {
      console.error("Service worker registration failed", error);
    });
  }
}

start();
