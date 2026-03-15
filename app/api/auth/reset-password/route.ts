import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const ResetSchema = z.object({
  email: z.string().email(),
  resetSecret: z.string().min(1),
  newPassword: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, resetSecret, newPassword } = ResetSchema.parse(body);

    if (resetSecret !== process.env.RESET_SECRET) {
      return NextResponse.json({ error: "Token de reset inválido." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Resposta genérica para não revelar se o email existe
      return NextResponse.json({ error: "Token de reset inválido." }, { status: 401 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { email }, data: { password: hashed } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
}
