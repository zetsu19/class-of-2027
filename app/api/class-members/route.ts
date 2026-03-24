import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image, name, description, gender, instagram } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (gender && !["MALE", "FEMALE"].includes(gender)) {
      return NextResponse.json(
        { error: "Invalid gender value" },
        { status: 400 },
      );
    }

    const member = await prisma.classMember.create({
      data: {
        image,
        name,
        description,
        gender,
        instagram,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const members = await prisma.classMember.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
