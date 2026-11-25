import {
  createTask,
  deleteTask,
  isCompleted,
  setTaskCompleted,
  toIsoDate,
  updateTask,
  validateTaskInput,
  type Task,
  type TaskInput,
} from "../../src/core/tasks";

const input: TaskInput = {
  title: "  Write report  ",
  details: "Draft **section 2**",
  dueDate: "2026-12-01",
  completedDate: null,
  lastActionedDate: "2026-11-20",
};

const existing: Task = createTask("t1", input);

describe("createTask", () => {
  it("trims the title and keeps the provided dates", () => {
    expect(createTask("t1", input)).toEqual({
      id: "t1",
      title: "Write report",
      details: "Draft **section 2**",
      dueDate: "2026-12-01",
      completedDate: null,
      lastActionedDate: "2026-11-20",
    });
  });
});

describe("updateTask", () => {
  it("keeps the id and applies the edited fields", () => {
    const updated = updateTask(existing, { ...input, title: "Renamed", dueDate: null });
    expect(updated.id).toBe("t1");
    expect(updated.title).toBe("Renamed");
    expect(updated.dueDate).toBeNull();
  });
});

describe("setTaskCompleted", () => {
  it("sets the completed date and last actioned date when completed", () => {
    const completed = setTaskCompleted(existing, true, "2026-11-25");
    expect(isCompleted(completed)).toBe(true);
    expect(completed.completedDate).toBe("2026-11-25");
    expect(completed.lastActionedDate).toBe("2026-11-25");
  });

  it("clears the completed date when reopened", () => {
    const reopened = setTaskCompleted(setTaskCompleted(existing, true, "2026-11-25"), false, "2026-11-26");
    expect(isCompleted(reopened)).toBe(false);
    expect(reopened.completedDate).toBeNull();
  });
});

describe("deleteTask", () => {
  it("removes only the task with the given id", () => {
    const other = createTask("t2", { ...input, title: "Other" });
    expect(deleteTask([existing, other], "t1")).toEqual([other]);
  });
});

describe("validateTaskInput", () => {
  it("requires a non-blank title", () => {
    expect(validateTaskInput({ ...input, title: "   " })).not.toBeNull();
    expect(validateTaskInput(input)).toBeNull();
  });
});

describe("toIsoDate", () => {
  it("formats a local date as YYYY-MM-DD with zero padding", () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
