"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
});

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Não autorizado");
}

export async function createCategory(data: z.infer<typeof CategorySchema>) {
  await requireAuth();
  const { name } = CategorySchema.parse(data);
  const slug = slugify(name);

  try {
    await prisma.category.create({ data: { name, slug } });
    revalidatePath("/");
    revalidatePath("/admin/dashboard/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Categoria já existe ou erro ao criar" };
  }
}

export async function updateCategory(id: string, data: z.infer<typeof CategorySchema>) {
  await requireAuth();
  const { name } = CategorySchema.parse(data);
  const slug = slugify(name);

  try {
    await prisma.category.update({ where: { id }, data: { name, slug } });
    revalidatePath("/");
    revalidatePath("/admin/dashboard/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao atualizar categoria" };
  }
}

export async function deleteCategory(id: string) {
  await requireAuth();
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/dashboard/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Categoria possui tutoriais vinculados" };
  }
}
