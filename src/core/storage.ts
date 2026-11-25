import type { Task } from "./tasks";

export const STORAGE_KEY = "aitrainer.tasks";

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.details === "string" &&
    isNullableString(candidate.dueDate) &&
    isNullableString(candidate.completedDate) &&
    isNullableString(candidate.lastActionedDate)
  );
}

export function parseTasks(raw: string | null): Task[] {
  if (raw === null) {
    return [];
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  return Array.isArray(data) ? data.filter(isTask) : [];
}

export function serializeTasks(tasks: readonly Task[]): string {
  return JSON.stringify(tasks);
}
