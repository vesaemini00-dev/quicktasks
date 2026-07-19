import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/tasks/:id — toggle completed
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const task = await prisma.task.update({
    where: { id },
    data: { completed: body.completed },
  });

  return NextResponse.json(task);
}

// DELETE /api/tasks/:id — remove a task
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}