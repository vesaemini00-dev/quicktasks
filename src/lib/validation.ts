import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;