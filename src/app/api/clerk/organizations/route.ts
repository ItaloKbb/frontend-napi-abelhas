import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  if (!session.userId) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  if (session.orgRole !== "org:admin") {
    return NextResponse.json({ message: "Acesso não autorizado." }, { status: 403 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim();

  try {
    const clerk = await clerkClient();
    const result = await clerk.organizations.getOrganizationList({
      query: query || undefined,
      limit: 500,
      orderBy: "name",
    });

    return NextResponse.json(
      result.data.map((organization) => ({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      })),
    );
  } catch {
    return NextResponse.json(
      { message: "Não foi possível carregar as organizações do Clerk." },
      { status: 502 },
    );
  }
}
