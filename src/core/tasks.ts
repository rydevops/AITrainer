export interface Task {
  readonly id: string;
  title: string;
  details: string;
  dueDate: string | null;
  completedDate: string | null;
  lastActionedDate: string | null;
}

export interface TaskInput {
  title: string;
  details: string;
  dueDate: string | null;
  completedDate: string | null;
  lastActionedDate: string | null;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateTaskInput(input: TaskInput): string | null {
  return input.title.trim() === "" ? "A title is required." : null;
}

export function isCompleted(task: Task): boolean {
  return task.completedDate !== null;
}

export function createTask(id: string, input: TaskInput): Task {
  return {
    id,
    title: input.title.trim(),
    details: input.details,
    dueDate: input.dueDate,
    completedDate: input.completedDate,
    lastActionedDate: input.lastActionedDate,
  };
}

export function updateTask(task: Task, input: TaskInput): Task {
  return {
    ...task,
    title: input.title.trim(),
    details: input.details,
    dueDate: input.dueDate,
    completedDate: input.completedDate,
    lastActionedDate: input.lastActionedDate,
  };
}

export function setTaskCompleted(task: Task, completed: boolean, today: string): Task {
  return {
    ...task,
    completedDate: completed ? today : null,
    lastActionedDate: today,
  };
}

export function deleteTask(tasks: readonly Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id);
}
