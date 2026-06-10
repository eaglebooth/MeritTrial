import { NextResponse } from "next/server";
import { readContract } from "./genlayer";

function serializeValue(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = serializeValue(v);
    }
    return out;
  }
  return value;
}

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fn = searchParams.get("fn");
    const argsParam = searchParams.get("args");

    if (!fn) {
      return NextResponse.json({ success: false, error: "Missing fn parameter" }, { status: 400 });
    }

    const args: unknown[] = argsParam ? JSON.parse(argsParam) : [];

    const result = await readContract(fn, args);

    return NextResponse.json({
      ...result,
      data: result.data !== undefined ? serializeValue(result.data) : undefined,
      contract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
