import { NextRequest, NextResponse } from "next/server";
import { getVehicleBySlug, getVehicleById } from "@/lib/db/inventory";
import QRCode from "qrcode";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type AnyVehicle = Record<string, any>;

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingLeft: 28,
    paddingRight: 28,
    paddingBottom: 80,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#171717",
    backgroundColor: "#ffffff",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#171717",
    paddingBottom: 10,
    marginBottom: 16,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#171717",
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    textAlign: "center",
    paddingTop: 7,
  },
  brandName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  brandTag: {
    fontSize: 7,
    color: "#737373",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 1,
  },
  modelBlock: { textAlign: "right" },
  modelMake: {
    fontSize: 8,
    color: "#dc2626",
    letterSpacing: 3,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  modelName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    marginTop: 2,
  },
  photos: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  photo: {
    flex: 1,
    aspectRatio: "1.35",
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 8,
    color: "#737373",
    letterSpacing: 1.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  price: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    letterSpacing: -0.5,
  },
  categoryPill: {
    marginLeft: "auto",
    backgroundColor: "#171717",
    color: "#ffffff",
    fontSize: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  overview: {
    fontSize: 10,
    color: "#525252",
    lineHeight: 1.5,
    marginBottom: 14,
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 12,
  },
  accent: {
    width: 20,
    height: 3,
    backgroundColor: "#dc2626",
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  specCard: {
    width: "31.5%",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 4,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff",
  },
  specIcon: {
    width: 22,
    height: 22,
    borderRadius: 3,
    backgroundColor: "#171717",
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textAlign: "center",
    paddingTop: 6,
  },
  specLabel: {
    fontSize: 6.5,
    color: "#737373",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  specValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginTop: 1,
  },
  featureCard: {
    width: "48.5%",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 4,
    padding: 7,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  featureTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: "#171717",
  },
  featureDesc: {
    fontSize: 8,
    color: "#525252",
    marginTop: 2,
    lineHeight: 1.35,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#171717",
    color: "#ffffff",
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLinks: {
    flexDirection: "row",
    gap: 18,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
  },
  footerQr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerQrLabel: {
    fontSize: 6.5,
    color: "#a3a3a3",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    maxWidth: 70,
    textAlign: "right",
    lineHeight: 1.2,
  },
});

const shortLabel = (s: string) => {
  const firstWord = (s.split(" ").find((w) => /[A-Za-z]/.test(w)) || s).replace(/[^A-Za-z]/g, "");
  return firstWord.slice(0, 3).toUpperCase().padEnd(3, "X");
};

const fetchImageBuffer = async (url: string): Promise<{ buf: Buffer; mime: string } | null> => {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "ShaikhAnd Sons Brochure/1.0",
        Accept: "image/*,*/*",
      },
    });
    if (!res.ok) return null;
    const arr = await res.arrayBuffer();
    if (!arr || arr.byteLength === 0) return null;
    const mime = (res.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
    return { buf: Buffer.from(arr), mime: mime.startsWith("image/") ? mime : "image/jpeg" };
  } catch {
    return null;
  }
};

const toDataUrl = (buf: Buffer, mime: string) =>
  `data:${mime};base64,${buf.toString("base64")}`;

/**
 * Build a list of candidate URLs for a vehicle image — try local origin first
 * (server fetching itself is more reliable than going through the public duckdns hostname),
 * then fall back to the public duckdns URL, then the raw path.
 */
const imageCandidates = (rawPath: string, origin: string): string[] => {
  if (!rawPath) return [];
  const out: string[] = [];
  if (rawPath.startsWith("data:")) return [rawPath];
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    out.push(rawPath);
    // Also try local rewrite for duckdns in case Node can't reach its own public hostname
    try {
      const u = new URL(rawPath);
      if (u.hostname.includes("duckdns") || u.hostname.includes("shaikhandsons")) {
        const local = `${origin}${u.pathname}${u.search}`;
        if (!out.includes(local)) out.unshift(local);
      }
    } catch {}
    return out;
  }
  // Relative path — local first, then public duckdns
  const rel = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  out.push(`${origin}${rel}`);
  out.push(`https://shaikhandsons.duckdns.org${rel}`);
  return out;
};

const loadImage = async (rawPath: string, origin: string): Promise<string | null> => {
  if (!rawPath) return null;
  for (const url of imageCandidates(rawPath, origin)) {
    const result = await fetchImageBuffer(url);
    if (result) return toDataUrl(result.buf, result.mime);
  }
  return null;
};

type DebugTrace = { raw: string; candidates: { url: string; status: string; bytes?: number }[] };

const loadImageDebug = async (rawPath: string, origin: string): Promise<DebugTrace> => {
  const trace: DebugTrace = { raw: rawPath, candidates: [] };
  if (!rawPath) return trace;
  for (const url of imageCandidates(rawPath, origin)) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": "ShaikhAndSons/1.0", Accept: "image/*,*/*" },
      });
      const bytes = Number(res.headers.get("content-length") || 0);
      trace.candidates.push({ url, status: `${res.status} ${res.statusText}`, bytes });
      if (res.ok && bytes > 0) {
        await res.arrayBuffer(); // drain
        return trace;
      }
    } catch (e: any) {
      trace.candidates.push({ url, status: `ERR: ${e?.message || "unknown"}` });
    }
  }
  return trace;
};

type Spec = { label: string; value: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const debug = searchParams.get("debug") === "1";

  let vehicle: AnyVehicle | null = (await getVehicleBySlug(slug).catch(() => null)) ?? null;
  if (!vehicle && /^\d+$/.test(slug)) {
    vehicle = (await getVehicleById(Number(slug)).catch(() => null)) ?? null;
  }
  if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  if (vehicle.parentId) {
    const parent = await getVehicleById(vehicle.parentId).catch(() => null);
    if (parent) vehicle = parent;
  }

  const host = req.headers.get("host") || "localhost:9002";
  const proto = req.headers.get("x-forwarded-proto") || (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const images: string[] = vehicle.imageUrls || vehicle.images || [];

  if (debug) {
    const traces = await Promise.all(images.slice(0, 3).map((p) => loadImageDebug(p, origin)));
    return NextResponse.json({
      slug: vehicle.slug,
      make: vehicle.make,
      model: vehicle.model,
      origin,
      imageCount: images.length,
      traces,
    });
  }
  const raw1 = images[0] || "";
  const raw2 = images[1] || "";
  const img1Data = await loadImage(raw1, origin);
  const img2Data = !raw2 || raw2 === raw1
    ? img1Data
    : await loadImage(raw2, origin);

  const qrDataUrl = await QRCode.toDataURL(`${origin}/vehicles/${vehicle.slug}`, {
    width: 200, margin: 1, color: { dark: "#0a0a0a", light: "#ffffff" }, errorCorrectionLevel: "M",
  }).catch(() => "");

  const priceNumber = typeof vehicle.price === "string" ? parseFloat(vehicle.price) : (vehicle.price ?? 0);
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(priceNumber);

  const collect = (arr: any[]): Spec[] => arr.filter(Boolean) as Spec[];
  const techSpecs = collect([
    vehicle.topSpeed && { label: "Top Speed", value: vehicle.topSpeed },
    vehicle.certifiedRange && { label: "Certified Range", value: vehicle.certifiedRange },
    vehicle.realWorldRange && { label: "Real-World Range", value: vehicle.realWorldRange },
    vehicle.climbingDegree && { label: "Climbing Degree", value: vehicle.climbingDegree },
    vehicle.loadCapacity && { label: "Load Capacity", value: vehicle.loadCapacity },
    vehicle.ridingModes && vehicle.ridingModes.length > 0 && { label: "Riding Modes", value: vehicle.ridingModes.join(", ") },
  ]);
  const battery = collect([
    vehicle.batteryType && { label: "Battery Type", value: vehicle.batteryType },
    vehicle.batteryCapacity && { label: "Battery Capacity", value: vehicle.batteryCapacity },
    vehicle.chargingTime && { label: "Charging Time", value: vehicle.chargingTime },
    vehicle.batteryWarranty && { label: "Battery Warranty", value: vehicle.batteryWarranty },
    vehicle.chargerIncluded && { label: "Charger", value: vehicle.chargerIncluded },
    vehicle.fastCharging !== undefined && { label: "Fast Charging", value: vehicle.fastCharging ? "Yes" : "No" },
  ]);
  const hardware = collect([
    vehicle.motorPower && { label: "Motor Power", value: vehicle.motorPower },
    vehicle.brakingSystem && { label: "Braking System", value: vehicle.brakingSystem },
    vehicle.tyreType && { label: "Tyre Type", value: vehicle.tyreType },
    vehicle.wheelType && { label: "Wheel Type", value: vehicle.wheelType },
    vehicle.wheelSize && { label: "Wheel Size", value: vehicle.wheelSize },
    vehicle.groundClearance && { label: "Ground Clearance", value: vehicle.groundClearance },
  ]);
  const smart = collect([
    vehicle.displayType && { label: "Display", value: vehicle.displayType },
    vehicle.bootSpace && { label: "Boot Space", value: vehicle.bootSpace },
  ]);
  const allSpecs = [...techSpecs, ...battery, ...hardware, ...smart];
  const keyFeatures: string[] = vehicle.keyFeatures || [];
  const overview = vehicle.designPhilosophy || vehicle.shortDescription || "";

  const BrochureDoc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* NAVBAR */}
        <View style={styles.navbar}>
          <View style={styles.brandRow}>
            <Text style={styles.logo}>S</Text>
            <View>
              <Text style={styles.brandName}>Shaikh & Sons</Text>
              <Text style={styles.brandTag}>High-Performance EV</Text>
            </View>
          </View>
          <View style={styles.modelBlock}>
            <Text style={styles.modelMake}>{vehicle.make}</Text>
            <Text style={styles.modelName}>
              {vehicle.model}{vehicle.trim ? ` (${vehicle.trim})` : ""}
            </Text>
          </View>
        </View>

        {/* TWO PHOTOS */}
        <View style={styles.photos}>
          <View style={styles.photo}>
            {img1Data ? <Image src={img1Data} style={{ width: "100%", height: "100%" }} /> : null}
          </View>
          <View style={styles.photo}>
            {img2Data ? <Image src={img2Data} style={{ width: "100%", height: "100%" }} /> : null}
          </View>
        </View>

        {/* PRICE + CATEGORY */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Starting At</Text>
          <Text style={styles.price}>{formattedPrice}</Text>
          {vehicle.category && <Text style={styles.categoryPill}>{vehicle.category}</Text>}
        </View>

        {/* OVERVIEW */}
        {overview ? <Text style={styles.overview}>{overview}</Text> : null}

        {/* SPECIFICATIONS */}
        {allSpecs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.accent} />
              <Text style={styles.sectionTitle}>Specifications</Text>
            </View>
            <View style={styles.specGrid}>
              {allSpecs.map((s, i) => (
                <View key={i} style={styles.specCard}>
                  <Text style={styles.specIcon}>{shortLabel(s.label)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.specLabel}>{s.label}</Text>
                    <Text style={styles.specValue}>{s.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* KEY FEATURES */}
        {keyFeatures.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.accent} />
              <Text style={styles.sectionTitle}>Signature Innovations</Text>
            </View>
            <View style={styles.specGrid}>
              {keyFeatures.map((f, i) => (
                <View key={i} style={styles.featureCard}>
                  <Text style={styles.specIcon}>{f.slice(0, 2).toUpperCase()}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.featureTitle}>{f}</Text>
                    <Text style={styles.featureDesc}>Intelligent luxury technology integrated perfectly.</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLinks}>
            <Text>shaikhandsons.com</Text>
            <Text>@shaikhandsons</Text>
          </View>
          <View style={styles.footerQr}>
            <Text style={styles.footerQrLabel}>Scan to view online</Text>
            {qrDataUrl ? <Image src={qrDataUrl} style={{ width: 44, height: 44, backgroundColor: "#ffffff", padding: 2, borderRadius: 3 }} /> : null}
          </View>
        </View>
      </Page>
    </Document>
  );

  try {
    const pdfBuffer = await renderToBuffer(BrochureDoc);
    const safeName = `${vehicle.make}_${vehicle.model}`.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ShaikhAndSons_${safeName}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
