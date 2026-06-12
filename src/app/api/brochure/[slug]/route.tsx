import { NextRequest, NextResponse } from "next/server";
import { getVehicleBySlug, getVehicleById } from "@/lib/db/inventory";
import QRCode from "qrcode";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import pathModule from "path";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type AnyVehicle = Record<string, any>;

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingLeft: 36,
    paddingRight: 36,
    paddingBottom: 80,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: "#171717",
    backgroundColor: "#ffffff",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#171717",
    paddingBottom: 12,
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
    fontSize: 16,
    textAlign: "center",
    paddingTop: 8,
  },
  brandName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    letterSpacing: 0.5,
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
    gap: 10,
    marginBottom: 14,
  },
  photoContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  photoImage: {
    aspectRatio: "1.35",
    backgroundColor: "#fafafa",
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    borderRadius: 4,
    width: "100%",
  },
  photoFigureLabel: {
    fontSize: 5.5,
    fontFamily: "Helvetica",
    color: "#a3a3a3",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 7.5,
    color: "#737373",
    letterSpacing: 1.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  price: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
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
    fontSize: 9.5,
    color: "#525252",
    lineHeight: 1.5,
    marginBottom: 6,
    marginTop: 6,
  },
  designPhilosophy: {
    fontSize: 9,
    fontFamily: "Helvetica-Oblique",
    color: "#525252",
    lineHeight: 1.45,
    borderLeftWidth: 1.5,
    borderLeftColor: "#171717",
    paddingLeft: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  heroHighlightBanner: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#e5e5e5",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 8,
    marginVertical: 10,
    backgroundColor: "#fafafa",
    borderRadius: 4,
  },
  heroHighlightItem: {
    alignItems: "center",
    flex: 1,
  },
  heroHighlightLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica",
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroHighlightValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e5e5",
    paddingTop: 10,
  },
  sectionHeaderNoBorder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
    marginTop: 4,
  },
  accent: {
    width: 15,
    height: 2,
    backgroundColor: "#dc2626",
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  specGridTwoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 8,
  },
  specCol: {
    flex: 1,
    flexDirection: "column",
    gap: 5,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#f5f5f5",
    paddingBottom: 3,
  },
  specRowLabel: {
    fontSize: 7,
    fontFamily: "Helvetica",
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  specRowValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  featureItem: {
    width: "48.5%",
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    borderRadius: 4,
    padding: 6,
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
  },
  featureDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#dc2626",
    marginTop: 4,
  },
  featureTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: "#171717",
  },
  featureDesc: {
    fontSize: 7.5,
    color: "#737373",
    marginTop: 1.5,
    lineHeight: 1.35,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#171717",
    color: "#ffffff",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLinks: {
    flexDirection: "row",
    gap: 16,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
  },
  footerInfoCol: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  footerContactText: {
    fontSize: 7,
    fontFamily: "Helvetica",
    color: "#a3a3a3",
    marginTop: 2,
  },
  batteryServicesBlock: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#171717",
    borderRadius: 6,
  },
  batteryServicesTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  batteryServicesText: {
    fontSize: 7.5,
    color: "#d4d4d4",
    lineHeight: 1.45,
    marginTop: 4,
  },
  footerQr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerQrLabel: {
    fontSize: 6,
    color: "#a3a3a3",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    maxWidth: 70,
    textAlign: "right",
    lineHeight: 1.2,
  },
  colorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 6,
    gap: 8,
  },
  colorsLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#737373",
    letterSpacing: 0.8,
  },
  colorsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  colorPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    borderRadius: 99,
    paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: "#ffffff",
  },
  colorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 0.5,
    borderColor: "#d4d4d4",
  },
  colorPillText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#404040",
  },
});

const shortLabel = (s: string) => {
  const firstWord = (s.split(" ").find((w) => /[A-Za-z]/.test(w)) || s).replace(/[^A-Za-z]/g, "");
  return firstWord.slice(0, 3).toUpperCase().padEnd(3, "X");
};const COLOR_MAP: Record<string, string> = {
  'red': '#dc2626',
  'blue': '#2563eb',
  'black': '#0a0a0a',
  'white': '#ffffff',
  'grey': '#737373',
  'gray': '#737373',
  'silver': '#cbd5e1',
  'yellow': '#eab308',
  'green': '#16a34a',
  'orange': '#ea580c',
  'purple': '#a855f7',
  'pink': '#ec4899',
  'brown': '#78350f',
  'midnight black': '#0a0a0a',
  'ocean blue': '#1e40af',
  'pearl white': '#f8fafc',
  'electric green': '#4ade80',
  'crimson': '#991b1b',
  'royal blue': '#1e3a8a',
  'matte black': '#1a1a1a',
  'glossy black': '#000000',
  'candy red': '#dc2626',
  'titanium grey': '#52525b',
  'metallic silver': '#94a3b8',
};

const getColorHex = (colorName: string) => {
  const name = colorName.toLowerCase().trim();
  if (name.startsWith('#')) return name;
  return COLOR_MAP[name] || name;
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
    let buf = Buffer.from(arr);
    let mime = "image/png"; // target compatibility format for react-pdf

    try {
      buf = Buffer.from(await sharp(buf).png().toBuffer());
    } catch (err) {
      console.error("Network image sharp conversion error:", err);
      const origMime = (res.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
      return { buf, mime: origMime };
    }

    return { buf, mime };
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
    } catch { }
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
  if (rawPath.startsWith("data:")) return rawPath;

  // 1. Try reading directly from local filesystem if it's an uploaded relative path
  if (rawPath.startsWith("/uploads")) {
    try {
      const localFilePath = pathModule.join(process.cwd(), "public", rawPath);
      if (fs.existsSync(localFilePath)) {
        let buf = fs.readFileSync(localFilePath);
        try {
          buf = Buffer.from(await sharp(buf).png().toBuffer());
          return toDataUrl(buf, "image/png");
        } catch (err) {
          console.error("Local file sharp conversion error:", err);
        }
      }
    } catch (e) {
      console.error("Local file read error in brochure api:", e);
    }
  }

  // 2. Fallback to network fetching
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

  if (rawPath.startsWith("/uploads")) {
    try {
      const localFilePath = pathModule.join(process.cwd(), "public", rawPath);
      const exists = fs.existsSync(localFilePath);
      trace.candidates.push({
        url: `file://${localFilePath}`,
        status: exists ? "FOUND ON LOCAL DISK" : "NOT FOUND ON LOCAL DISK",
        bytes: exists ? fs.statSync(localFilePath).size : 0
      });
      if (exists) {
        return trace;
      }
    } catch (e: any) {
      trace.candidates.push({
        url: `file://${rawPath}`,
        status: `ERR: ${e?.message || "unknown"}`
      });
    }
  }

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
  const rawFormatted = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(priceNumber);
  const formattedPrice = rawFormatted.replace("₹", "Rs. ").replace("\u20B9", "Rs. ").replace("INR", "Rs. ").trim();

  const cvs = vehicle.colorVariants || [];
  const pcs = vehicle.colors || [];
  const seenColors = new Set<string>();
  const allColors: string[] = [];

  pcs.forEach((cName: string) => {
    const trimmed = cName.trim();
    const lowerName = trimmed.toLowerCase();
    if (trimmed && !seenColors.has(lowerName)) {
      seenColors.add(lowerName);
      allColors.push(trimmed);
    }
  });

  cvs.forEach((cv: any) => {
    const cNames = cv.colors || [];
    cNames.forEach((cName: string) => {
      const trimmed = cName.trim();
      const lowerName = trimmed.toLowerCase();
      if (trimmed && !seenColors.has(lowerName)) {
        seenColors.add(lowerName);
        allColors.push(trimmed);
      }
    });
  });

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
  const shortDescription = vehicle.shortDescription || "";
  const designPhilosophy = vehicle.designPhilosophy || "";

  // Extract highlights for the premium spec banner
  const findSpecValue = (specsList: Spec[], labels: string[]) => {
    const found = specsList.find(s => labels.some(l => s.label.toLowerCase().includes(l.toLowerCase())));
    return found ? found.value : null;
  };
  const topSpeedVal = findSpecValue(techSpecs, ["speed", "top speed"]) || vehicle.topSpeed || null;
  const rangeVal = findSpecValue(techSpecs, ["range", "certified", "real-world"]) || vehicle.certifiedRange || vehicle.realWorldRange || null;
  const motorVal = findSpecValue(hardware, ["power", "motor"]) || vehicle.motorPower || null;

  const renderSpecSection = (title: string, list: Spec[]) => {
    if (list.length === 0) return null;
    const leftCol = list.filter((_, idx) => idx % 2 === 0);
    const rightCol = list.filter((_, idx) => idx % 2 !== 0);
    return (
      <View style={{ marginBottom: 10 }}>
        <View style={styles.sectionHeader}>
          <View style={styles.accent} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.specGridTwoCol}>
          <View style={styles.specCol}>
            {leftCol.map((s, i) => (
              <View key={i} style={styles.specRow}>
                <Text style={styles.specRowLabel}>{s.label}</Text>
                <Text style={styles.specRowValue}>{s.value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.specCol}>
            {rightCol.map((s, i) => (
              <View key={i} style={styles.specRow}>
                <Text style={styles.specRowLabel}>{s.label}</Text>
                <Text style={styles.specRowValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

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
          <View style={styles.photoContainer}>
            {img1Data ? <Image src={img1Data} style={styles.photoImage} /> : null}
            <Text style={styles.photoFigureLabel}>FIG 01 // FRONT PERSPECTIVE</Text>
          </View>
          <View style={styles.photoContainer}>
            {img2Data ? <Image src={img2Data} style={styles.photoImage} /> : null}
            <Text style={styles.photoFigureLabel}>FIG 02 // SIDE VIEW</Text>
          </View>
        </View>

        {/* PRICE + CATEGORY */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Starting At</Text>
          <Text style={styles.price}>{formattedPrice}</Text>
          {vehicle.category && <Text style={styles.categoryPill}>{vehicle.category}</Text>}
        </View>

        {/* HERO SPECS HIGHLIGHT BANNER */}
        {(topSpeedVal || rangeVal || motorVal) && (
          <View style={styles.heroHighlightBanner}>
            {topSpeedVal && (
              <View style={styles.heroHighlightItem}>
                <Text style={styles.heroHighlightLabel}>Top Speed</Text>
                <Text style={styles.heroHighlightValue}>{topSpeedVal}</Text>
              </View>
            )}
            {rangeVal && (
              <View style={styles.heroHighlightItem}>
                <Text style={styles.heroHighlightLabel}>Range</Text>
                <Text style={styles.heroHighlightValue}>{rangeVal}</Text>
              </View>
            )}
            {motorVal && (
              <View style={styles.heroHighlightItem}>
                <Text style={styles.heroHighlightLabel}>Motor Power</Text>
                <Text style={styles.heroHighlightValue}>{motorVal}</Text>
              </View>
            )}
          </View>
        )}

        {/* DESCRIPTION & PHILOSOPHY */}
        {shortDescription ? <Text style={styles.overview}>{shortDescription}</Text> : null}
        {designPhilosophy ? <Text style={styles.designPhilosophy}>"{designPhilosophy}"</Text> : null}

        {/* AVAILABLE COLOR VARIANTS */}
        {allColors.length > 0 && (
          <View style={styles.colorsContainer}>
            <Text style={styles.colorsLabel}>Available Colors:</Text>
            <View style={styles.colorsList}>
              {allColors.map((color, i) => (
                <View key={i} style={styles.colorPill}>
                  <View style={[styles.colorDot, { backgroundColor: getColorHex(color) }]} />
                  <Text style={styles.colorPillText}>{color}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TECHNICAL CAPABILITIES */}
        {renderSpecSection("Technical Capabilities", techSpecs)}

        {/* BATTERY & CHARGING */}
        {renderSpecSection("Battery & Charging", battery)}

        {/* HARDWARE & CONTROL */}
        {hardware.length > 0 && (
          <View break>
            {renderSpecSection("Hardware & Control", hardware)}
          </View>
        )}

        {/* SMART TECH */}
        {renderSpecSection("Smart Tech", smart)}

        {/* KEY FEATURES */}
        {keyFeatures.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <View style={styles.accent} />
              <Text style={styles.sectionTitle}>Signature Innovations</Text>
            </View>
            <View style={styles.featuresGrid}>
              {keyFeatures.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.featureTitle}>{f}</Text>
                    <Text style={styles.featureDesc}>Intelligent luxury technology integrated perfectly into every ride.</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* EV BATTERY SOLUTIONS & CUSTOMIZATION */}
        <View style={styles.batteryServicesBlock}>
          <Text style={styles.batteryServicesTitle}>EV Battery & Customization Solutions</Text>
          <Text style={styles.batteryServicesText}>
            We specialize in providing high-performance EV battery packs in vast variants to power all types of electric vehicles. Whether you require custom battery configurations, replacement modules, or capacity upgrades, we deliver industry-grade reliability and advanced thermal management solutions.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <View style={styles.footerInfoCol}>
            <View style={styles.footerLinks}>
              <Text>shaikhandsons.in</Text>
              <Text>@shaikhandsons_ev_bikes</Text>
            </View>
            <Text style={styles.footerContactText}>
              For more details call or whatsapp on +91 93211 11322 and email shaikhandsons22@gmail.com
            </Text>
          </View>
          <View style={styles.footerQr}>
            <Text style={styles.footerQrLabel}>Scan to view online</Text>
            {qrDataUrl ? <Image src={qrDataUrl} style={{ width: 34, height: 34, backgroundColor: "#ffffff", padding: 2, borderRadius: 2 }} /> : null}
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
