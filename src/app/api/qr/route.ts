import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");
  const size = Number(searchParams.get("size") || "256");

  if (!data) {
    return NextResponse.json({ error: "Missing data param" }, { status: 400 });
  }

  try {
    const dataUrl = await QRCode.toDataURL(data, {
      width: size,
      margin: 1,
      color: { dark: "#0a0a0a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
    return NextResponse.json({ dataUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "QR generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
