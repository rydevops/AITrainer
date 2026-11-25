import { parseTasks, serializeTasks } from "../../src/core/storage";
import type { Task } from "../../src/core/tasks";

const task: Task = {
  id: "t1",
  title: "Plan",
  details: "",
  dueDate: null,
  completedDate: "2026-11-25",
  lastActionedDate: "2026-11-25",
};

describe("parseTasks", () => {
  it("round-trips serialized tasks", () => {
    expect(parseTasks(serializeTasks([task]))).toEqual([task]);
  });

  it("returns an empty list for missing or corrupt data", () => {
    expect(parseTasks(null)).toEqual([]);
    expect(parseTasks("{not json")).toEqual([]);
    expect(parseTasks(JSON.stringify({ tasks: [] }))).toEqual([]);
  });

  it("drops entries that do not match the task shape", () => {
    const raw = JSON.stringify([task, { id: 42, title: "bad" }, null]);
    expect(parseTasks(raw)).toEqual([task]);
  });
});
