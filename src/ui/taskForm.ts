import { validateTaskInput, type Task, type TaskInput } from "../core/tasks";

export interface TaskFormHandlers {
  onSubmit(input: TaskInput, editingId: string | null): void;
}

export interface TaskForm {
  open(task: Task | null, today: string): void;
  close(): void;
}

export function createTaskForm(form: HTMLFormElement, handlers: TaskFormHandlers): TaskForm {
  const heading = requireElement<HTMLElement>(form, "[data-form-heading]");
  const titleInput = requireElement<HTMLInputElement>(form, "[name=title]");
  const detailsInput = requireElement<HTMLTextAreaElement>(form, "[name=details]");
  const dueDateInput = requireElement<HTMLInputElement>(form, "[name=dueDate]");
  const completedDateInput = requireElement<HTMLInputElement>(form, "[name=completedDate]");
  const lastActionedInput = requireElement<HTMLInputElement>(form, "[name=lastActionedDate]");
  const errorOutput = requireElement<HTMLElement>(form, "[data-form-error]");
  const cancelButton = requireElement<HTMLButtonElement>(form, "[data-form-cancel]");
  let editingId: string | null = null;

  function close(): void {
    form.hidden = true;
    errorOutput.textContent = "";
    editingId = null;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input: TaskInput = {
      title: titleInput.value,
      details: detailsInput.value,
      dueDate: emptyToNull(dueDateInput.value),
      completedDate: emptyToNull(completedDateInput.value),
      lastActionedDate: emptyToNull(lastActionedInput.value),
    };
    const error = validateTaskInput(input);
    if (error !== null) {
      errorOutput.textContent = error;
      titleInput.focus();
      return;
    }
    handlers.onSubmit(input, editingId);
    close();
  });

  cancelButton.addEventListener("click", close);

  return {
    open(task, today) {
      editingId = task?.id ?? null;
      heading.textContent = task === null ? "New task" : "Edit task";
      titleInput.value = task?.title ?? "";
      detailsInput.value = task?.details ?? "";
      dueDateInput.value = task?.dueDate ?? "";
      completedDateInput.value = task?.completedDate ?? "";
      lastActionedInput.value = today;
      errorOutput.textContent = "";
      form.hidden = false;
      titleInput.focus();
    },
    close,
  };
}

function emptyToNull(value: string): string | null {
  return value === "" ? null : value;
}

function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (element === null) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}
