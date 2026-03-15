import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@kandle.studio";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-immediately";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email, password: hashed } });
    console.log(`✓ Admin criado: ${email}`);
  } else {
    console.log("Admin já existe, pulando.");
  }

  const categories = [
    { name: "Acesso / Login", slug: "acesso-login", order: 0 },
    { name: "Editar o site", slug: "editar-o-site", order: 1 },
    { name: "Publicação de artigos", slug: "publicacao-de-artigos", order: 2 },
    { name: "Hospedagem / Fatura", slug: "hospedagem-fatura", order: 3 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✓ Categorias padrão criadas.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
