"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { slugify, extractYouTubeId } from "@/lib/utils";
import { z } from "zod";

const TutorialSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  slug: z.string().min(1, "Slug obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
  content: z.string().optional(),
  youtubeUrl: z.string().url("URL inválida"),
  categoryId: z.string().min(1, "Categoria obrigatória"),
  published: z.boolean().default(false),
});

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Não autorizado");
}

export async function createTutorial(data: unknown) {
  await requireAuth();
  try {
    const parsed = TutorialSchema.parse(data);
    const youtubeId = extractYouTubeId(parsed.youtubeUrl);
    if (!youtubeId) return { success: false, error: "URL do YouTube inválida" };

    await prisma.tutorial.create({
      data: { ...parsed, youtubeId },
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard/tutorials");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    console.error("[createTutorial]", err);
    return { success: false, error: "Erro ao criar tutorial" };
  }
}

export async function updateTutorial(id: string, data: unknown) {
  await requireAuth();
  try {
    const parsed = TutorialSchema.parse(data);
    const youtubeId = extractYouTubeId(parsed.youtubeUrl);
    if (!youtubeId) return { success: false, error: "URL do YouTube inválida" };

    const tutorial = await prisma.tutorial.update({
      where: { id },
      data: { ...parsed, youtubeId },
    });
    revalidatePath("/");
    revalidatePath(`/${tutorial.slug}`);
    revalidatePath("/admin/dashboard/tutorials");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? "Dados inválidos" };
    }
    return { success: false, error: "Erro ao atualizar tutorial" };
  }
}

export async function toggleTutorialPublished(id: string, published: boolean) {
  await requireAuth();
  try {
    const tutorial = await prisma.tutorial.update({
      where: { id },
      data: { published },
    });
    revalidatePath("/");
    revalidatePath(`/${tutorial.slug}`);
    revalidatePath("/admin/dashboard/tutorials");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao atualizar status" };
  }
}

export async function deleteTutorial(id: string) {
  await requireAuth();
  try {
    const tutorial = await prisma.tutorial.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath(`/${tutorial.slug}`);
    revalidatePath("/admin/dashboard/tutorials");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao deletar tutorial" };
  }
}

