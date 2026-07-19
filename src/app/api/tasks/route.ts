import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validation";

// GET /api/tasks — list all tasks
export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

// POST /api/tasks — create a new task
export async function POST(request: Request) {
  const body = await request.json();
  const result = createTaskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 422 }
    );
  }

  const task = await prisma.task.create({ data: result.data });
  return NextResponse.json(task, { status: 201 });
}