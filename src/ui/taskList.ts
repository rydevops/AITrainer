import { renderBlockMarkdown, renderInlineMarkdown } from "../core/markdown";
import { isCompleted, type Task } from "../core/tasks";

export interface TaskListHandlers {
  onToggleCompleted(id: string, completed: boolean): void;
  onEdit(id: string): void;
  onDelete(id: string): void;
}

export function renderTaskList(
  container: HTMLElement,
  tasks: readonly Task[],
  handlers: TaskListHandlers,
): void {
  if (tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No tasks yet. Add one to get started.";
    container.replaceChildren(empty);
    return;
  }
  container.replaceChildren(...tasks.map((task) => renderTaskCard(task, handlers)));
}

function renderTaskCard(task: Task, handlers: TaskListHandlers): HTMLElement {
  const completed = isCompleted(task);
  const card = createElement("article", completed ? "task-card is-completed" : "task-card");

  const header = createElement("div", "task-header");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.setAttribute("aria-label", `Mark "${task.title}" as completed`);
  checkbox.addEventListener("change", () => handlers.onToggleCompleted(task.id, checkbox.checked));
  const title = createElement("div", "task-title");
  title.innerHTML = renderInlineMarkdown(task.title);
  header.append(checkbox, title);

  const details = createElement("div", "task-details");
  if (task.details.trim() !== "") {
    details.innerHTML = renderBlockMarkdown(task.details);
  }

  const meta = createElement("dl", "task-meta");
  meta.append(
    ...metaEntry("Due", task.dueDate),
    ...metaEntry("Completed", task.completedDate),
    ...metaEntry("Last actioned", task.lastActionedDate),
  );

  const actions = createElement("div", "task-actions");
  const editButton = createButton("Edit", () => handlers.onEdit(task.id));
  const deleteButton = createButton("Delete", () => handlers.onDelete(task.id));
  deleteButton.classList.add("danger");
  actions.append(editButton, deleteButton);

  card.append(header, details, meta, actions);
  return card;
}

function metaEntry(label: string, value: string | null): HTMLElement[] {
  const term = createElement("dt", "");
  term.textContent = label;
  const definition = createElement("dd", "");
  definition.textContent = value ?? "—";
  return [term, definition];
}

function createElement(tag: string, className: string): HTMLElement {
  const element = document.createElement(tag);
  if (className !== "") {
    element.className = className;
  }
  return element;
}

function createButton(label: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}
