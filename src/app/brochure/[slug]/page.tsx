import { notFound, redirect } from "next/navigation";
import { getVehicleBySlug, getVehicleById } from "@/lib/db/inventory";
import { getImageUrl } from "@/lib/utils";
import QRCode from "qrcode";
import {
  BatteryFull, Zap, Gauge, MapPinned, Hourglass, BatteryCharging,
  SlidersVertical, TrendingUp, Weight, Package, Plug, ShieldCheck,
  CircleDashed, CircleDot, Diameter, ArrowDownFromLine, Smartphone,
  ShoppingBag, Siren, Radar, Usb, KeyRound, LampCeiling, Sun, ChevronRight,
} from "lucide-react";

type AnyVehicle = Record<string, any>;

const getFeatureIcon = (featureName: string) => {
  const name = featureName.toLowerCase();
  if (name.includes("anti theft") || name.includes("anti-theft") || name.includes("siren") || name.includes("alarm")) return <Siren size={16} />;
  if (name.includes("find my") || name.includes("radar") || name.includes("tracking")) return <Radar size={16} />;
  if (name.includes("charging port") || name.includes("usb") || name.includes("socket")) return <Usb size={16} />;
  if (name.includes("keyless") || name.includes("smart key") || name.includes("remote key")) return <KeyRound size={16} />;
  if (name.includes("projector") || name.includes("lamp") || name.includes("headlight")) return <LampCeiling size={16} />;
  if (name.includes("drl") || name.includes("daytime") || name.includes("sun")) return <Sun size={16} />;
  return <ChevronRight size={16} />;
};

export default async function BrochurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) notFound();

  let vehicle: AnyVehicle | null = (await getVehicleBySlug(slug).catch(() => null)) ?? null;
  if (!vehicle && /^\d+$/.test(slug)) {
    vehicle = (await getVehicleById(Number(slug)).catch(() => null)) ?? null;
  }
  if (!vehicle) notFound();

  if (vehicle.parentId) {
    const parent = await getVehicleById(vehicle.parentId).catch(() => null);
    if (parent) redirect(`/brochure/${parent.slug}`);
  }

  const images: string[] = vehicle.imageUrls || vehicle.images || [];
  const photo1 = images[0] || "";
  const photo2 = images[1] || images[0] || "";

  const priceNumber = typeof vehicle.price === "string" ? parseFloat(vehicle.price) : (vehicle.price ?? 0);
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(priceNumber);

  // Generate QR server-side
  const vehicleUrl = `https://shaikhandsons.com/vehicles/${vehicle.slug}`;
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(vehicleUrl, {
      width: 200, margin: 1,
      color: { dark: "#0a0a0a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
  } catch {}

  const collect = (arr: any[]) => arr.filter(Boolean) as { label: string; value: string; icon: React.ReactNode }[];

  const techSpecs = collect([
    vehicle.topSpeed && { label: "Top Speed", value: vehicle.topSpeed, icon: <Gauge size={16} /> },
    vehicle.certifiedRange && { label: "Certified Range", value: vehicle.certifiedRange, icon: <BatteryFull size={16} /> },
    vehicle.realWorldRange && { label: "Real-World Range", value: vehicle.realWorldRange, icon: <MapPinned size={16} /> },
    vehicle.climbingDegree && { label: "Climbing Degree", value: vehicle.climbingDegree, icon: <TrendingUp size={16} /> },
    vehicle.loadCapacity && { label: "Load Capacity", value: vehicle.loadCapacity, icon: <Weight size={16} /> },
    vehicle.ridingModes && vehicle.ridingModes.length > 0 && { label: "Riding Modes", value: vehicle.ridingModes.join(", "), icon: <SlidersVertical size={16} /> },
  ]);

  const batteryCharging = collect([
    vehicle.batteryType && { label: "Battery Type", value: vehicle.batteryType, icon: <Package size={16} /> },
    vehicle.batteryCapacity && { label: "Battery Capacity", value: vehicle.batteryCapacity, icon: <Zap size={16} /> },
    vehicle.chargingTime && { label: "Charging Time", value: vehicle.chargingTime, icon: <Hourglass size={16} /> },
    vehicle.batteryWarranty && { label: "Battery Warranty", value: vehicle.batteryWarranty, icon: <ShieldCheck size={16} /> },
    vehicle.chargerIncluded && { label: "Charger", value: vehicle.chargerIncluded, icon: <Plug size={16} /> },
    vehicle.fastCharging !== undefined && { label: "Fast Charging", value: vehicle.fastCharging ? "Yes" : "No", icon: <BatteryCharging size={16} /> },
  ]);

  const hardware = collect([
    vehicle.motorPower && { label: "Motor Power", value: vehicle.motorPower, icon: <Zap size={16} /> },
    vehicle.brakingSystem && { label: "Braking System", value: vehicle.brakingSystem, icon: <Gauge size={16} /> },
    vehicle.tyreType && { label: "Tyre Type", value: vehicle.tyreType, icon: <CircleDashed size={16} /> },
    vehicle.wheelType && { label: "Wheel Type", value: vehicle.wheelType, icon: <CircleDot size={16} /> },
    vehicle.wheelSize && { label: "Wheel Size", value: vehicle.wheelSize, icon: <Diameter size={16} /> },
    vehicle.groundClearance && { label: "Ground Clearance", value: vehicle.groundClearance, icon: <ArrowDownFromLine size={16} /> },
  ]);

  const smartFeatures = collect([
    vehicle.displayType && { label: "Display", value: vehicle.displayType, icon: <Smartphone size={16} /> },
    vehicle.bootSpace && { label: "Boot Space", value: vehicle.bootSpace, icon: <ShoppingBag size={16} /> },
  ]);

  const allSpecs = [...techSpecs, ...batteryCharging, ...hardware, ...smartFeatures];

  return (
    <main className="min-h-screen bg-white text-neutral-900" style={{ fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @media print {
          html, body { background: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .bh { font-family: 'Playfair Display', ui-serif, Georgia, serif; }
      `}</style>

      {/* NAVBAR: brand left, model right */}
      <header className="px-10 py-5 flex items-center justify-between border-b-2 border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-base bh">S</div>
          <div className="leading-tight">
            <p className="bh font-black text-base tracking-tight">Shaikh & Sons</p>
            <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-500">High-Performance EV</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-600">{vehicle.make}</p>
          <p className="bh text-xl font-black uppercase tracking-tight leading-tight">{vehicle.model}{vehicle.trim ? ` (${vehicle.trim})` : ""}</p>
        </div>
      </header>

      {/* TWO PHOTOS */}
      <section className="px-10 py-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[4/3] bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex items-center justify-center">
            {photo1 && <img src={getImageUrl(photo1)} alt={`${vehicle.model} 1`} className="w-full h-full object-contain p-4" />}
          </div>
          <div className="aspect-[4/3] bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex items-center justify-center">
            {photo2 && <img src={getImageUrl(photo2)} alt={`${vehicle.model} 2`} className="w-full h-full object-contain p-4" />}
          </div>
        </div>
      </section>

      {/* PRICE + OVERVIEW */}
      <section className="px-10 pb-6 space-y-3">
        <div className="flex items-baseline gap-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Starting At</p>
          <p className="text-3xl font-black tracking-tight text-neutral-900">{formattedPrice}</p>
          {vehicle.category && (
            <span className="ml-auto px-3 py-1 bg-neutral-900 text-white text-[8px] font-black uppercase tracking-widest rounded-full">{vehicle.category}</span>
          )}
        </div>
        {(vehicle.shortDescription || vehicle.designPhilosophy) && (
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            {vehicle.designPhilosophy || vehicle.shortDescription}
          </p>
        )}
      </section>

      {/* ALL SPECS in one unified grid */}
      {allSpecs.length > 0 && (
        <section className="px-10 py-6 border-t border-neutral-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-1 w-8 bg-red-600 rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-900">Specifications</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {allSpecs.map((it, i) => (
              <div key={i} className="p-3 border border-neutral-200 rounded-lg bg-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0">{it.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-neutral-500 truncate">{it.label}</p>
                  <p className="text-sm font-black text-neutral-900 leading-tight truncate">{it.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* KEY FEATURES */}
      {vehicle.keyFeatures && vehicle.keyFeatures.length > 0 && (
        <section className="px-10 py-6 border-t border-neutral-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-1 w-8 bg-red-600 rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-900">Signature Innovations</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {vehicle.keyFeatures.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg bg-white">
                <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0">{getFeatureIcon(feature)}</div>
                <div className="min-w-0">
                  <h4 className="font-black text-xs text-neutral-900">{feature}</h4>
                  <p className="text-[10px] text-neutral-600 mt-0.5 leading-snug">Intelligent luxury technology integrated perfectly.</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER: website | instagram | QR */}
      <footer className="mt-4 px-10 py-5 bg-neutral-900 text-white flex items-center justify-between border-t-2 border-neutral-900">
        <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>shaikhandsons.com</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            <span>@shaikhandsons</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {qrDataUrl && <img src={qrDataUrl} alt="Scan to view online" className="w-16 h-16 bg-white p-1 rounded" />}
          <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 max-w-[80px] leading-tight">Scan to view online</p>
        </div>
      </footer>
    </main>
  );
}
