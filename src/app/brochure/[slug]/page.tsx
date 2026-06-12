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

const COLOR_MAP: Record<string, string> = {
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
  // Generate QR server-side
  const vehicleUrl = `https://shaikhandsons.in/vehicles/${vehicle.slug}`;
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(vehicleUrl, {
      width: 200, margin: 1,
      color: { dark: "#0a0a0a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
  } catch { }

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

  // Extract Hero highlights for the premium highlight banner
  const findSpecValue = (specsList: any[], labels: string[]) => {
    const found = specsList.find(s => labels.some(l => s.label.toLowerCase().includes(l.toLowerCase())));
    return found ? found.value : null;
  };

  const topSpeedVal = findSpecValue(techSpecs, ["speed", "top speed"]) || vehicle.topSpeed || null;
  const rangeVal = findSpecValue(techSpecs, ["range", "certified", "real-world"]) || vehicle.certifiedRange || vehicle.realWorldRange || null;
  const motorVal = findSpecValue(hardware, ["power", "motor"]) || vehicle.motorPower || null;

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-body selection:bg-neutral-900/10">
      <style>{`
        @media print {
          html, body { background: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* NAVBAR: Luxury Editorial Brand Header */}
      <header className="mx-6 md:mx-16 pt-10 pb-6 border-b border-neutral-800 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-neutral-900 flex items-center justify-center font-headline text-xl font-bold bg-neutral-900 text-white">
            S
          </div>
          <div>
            <h1 className="font-headline text-2xl font-black uppercase tracking-wider text-neutral-900 leading-none">
              Shaikh & Sons
            </h1>
            <p className="font-accent text-[9px] uppercase tracking-[0.25em] text-neutral-500 mt-1.5">
              High-Performance Mobility
            </p>
          </div>
        </div>
        <div className="md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-neutral-200">
          <span className="font-accent text-[9px] font-bold uppercase tracking-[0.3em] text-red-600 block">
            {vehicle.make}
          </span>
          <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-neutral-900 mt-1 leading-tight">
            {vehicle.model}
            {vehicle.trim ? <span className="font-light text-neutral-500"> ({vehicle.trim})</span> : ""}
          </h2>
        </div>
      </header>

      {/* HERO IMAGES: Portfolio Lookbook Gallery */}
      <section className="px-6 md:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-[4/3] bg-neutral-50 border border-neutral-100 rounded-lg overflow-hidden flex items-center justify-center group shadow-sm">
            <span className="font-accent text-[9px] tracking-widest text-neutral-400 absolute top-4 left-4 uppercase select-none">
              [ FIG. 01 // FRONT PERSPECTIVE ]
            </span>
            {photo1 && (
              <img
                src={getImageUrl(photo1)}
                alt={`${vehicle.model} Front`}
                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <div className="relative aspect-[4/3] bg-neutral-50 border border-neutral-100 rounded-lg overflow-hidden flex items-center justify-center group shadow-sm">
            <span className="font-accent text-[9px] tracking-widest text-neutral-400 absolute top-4 left-4 uppercase select-none">
              [ FIG. 02 // SIDE VIEW ]
            </span>
            {photo2 && (
              <img
                src={getImageUrl(photo2)}
                alt={`${vehicle.model} Side`}
                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
        </div>
      </section>

      {/* OVERVIEW & HIGHLIGHT SPECS (Tesla-Style Banner) */}
      <section className="px-6 md:px-16 pb-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <span className="font-accent text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              Starting From
            </span>
            <p className="font-headline text-4xl font-black text-neutral-900 tracking-tight mt-1">
              {formattedPrice}
            </p>
          </div>
          {vehicle.category && (
            <span className="font-accent px-4 py-1.5 bg-neutral-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full self-start md:self-auto shadow-sm">
              {vehicle.category}
            </span>
          )}
        </div>

        {/* HERO SPEC HIGHLIGHTS */}
        {(topSpeedVal || rangeVal || motorVal) && (
          <div className="grid grid-cols-3 divide-x divide-neutral-200 border-b border-neutral-200 py-8 mb-8 text-center bg-neutral-50/50 rounded-lg mt-6">
            {topSpeedVal && (
              <div className="px-4">
                <span className="font-accent text-[9px] uppercase tracking-widest text-neutral-400 block">
                  Top Speed
                </span>
                <p className="font-headline text-2xl md:text-3xl font-black text-neutral-900 mt-2">
                  {topSpeedVal}
                </p>
              </div>
            )}
            {rangeVal && (
              <div className="px-4">
                <span className="font-accent text-[9px] uppercase tracking-widest text-neutral-400 block">
                  Range
                </span>
                <p className="font-headline text-2xl md:text-3xl font-black text-neutral-900 mt-2">
                  {rangeVal}
                </p>
              </div>
            )}
            {motorVal && (
              <div className="px-4">
                <span className="font-accent text-[9px] uppercase tracking-widest text-neutral-400 block">
                  Motor Power
                </span>
                <p className="font-headline text-2xl md:text-3xl font-black text-neutral-900 mt-2">
                  {motorVal}
                </p>
              </div>
            )}
          </div>
        )}

        {/* DESCRIPTION BLOCKS */}
        <div className="space-y-6 mt-6">
          {vehicle.shortDescription && (
            <p className="font-body text-base text-neutral-600 leading-relaxed font-light">
              {vehicle.shortDescription}
            </p>
          )}
          {vehicle.designPhilosophy && (
            <div className="border-l-2 border-neutral-900 pl-6 py-1 my-6">
              <p className="font-headline text-lg italic text-neutral-500 leading-relaxed">
                "{vehicle.designPhilosophy}"
              </p>
            </div>
          )}
        </div>

        {/* COLOR CONFIGURATOR */}
        {allColors.length > 0 && (
          <div className="flex flex-col gap-3 pt-6 border-t border-neutral-100 mt-8">
            <span className="font-accent text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              Exterior Color Variants
            </span>
            <div className="flex flex-wrap gap-3">
              {allColors.map((color, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 rounded-full bg-white shadow-sm hover:border-neutral-400 transition-all duration-300"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-200 flex-shrink-0"
                    style={{ backgroundColor: getColorHex(color) }}
                  />
                  <span className="font-accent text-[9px] font-bold uppercase tracking-wider text-neutral-700">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* TECHNICAL CAPABILITIES */}
      {techSpecs.length > 0 && (
        <section className="px-6 md:px-16 py-10 max-w-5xl mx-auto border-t border-neutral-200">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-headline text-lg font-black uppercase tracking-widest text-neutral-900 whitespace-nowrap">
              Technical Capabilities
            </h3>
            <div className="w-full h-[1px] bg-neutral-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {techSpecs.map((it, i) => (
              <div key={i} className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3 text-neutral-500">
                  <span className="text-neutral-400 flex-shrink-0">{it.icon}</span>
                  <span className="font-accent text-[10px] uppercase tracking-wider">
                    {it.label}
                  </span>
                </div>
                <span className="font-body text-sm font-bold text-neutral-900">
                  {it.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BATTERY & CHARGING */}
      {batteryCharging.length > 0 && (
        <section className="px-6 md:px-16 py-10 max-w-5xl mx-auto border-t border-neutral-200">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-headline text-lg font-black uppercase tracking-widest text-neutral-900 whitespace-nowrap">
              Battery & Charging
            </h3>
            <div className="w-full h-[1px] bg-neutral-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {batteryCharging.map((it, i) => (
              <div key={i} className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3 text-neutral-500">
                  <span className="text-neutral-400 flex-shrink-0">{it.icon}</span>
                  <span className="font-accent text-[10px] uppercase tracking-wider">
                    {it.label}
                  </span>
                </div>
                <span className="font-body text-sm font-bold text-neutral-900">
                  {it.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HARDWARE & CONTROL */}
      {hardware.length > 0 && (
        <section className="px-6 md:px-16 py-10 max-w-5xl mx-auto border-t border-neutral-200">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-headline text-lg font-black uppercase tracking-widest text-neutral-900 whitespace-nowrap">
              Hardware & Control
            </h3>
            <div className="w-full h-[1px] bg-neutral-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {hardware.map((it, i) => (
              <div key={i} className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3 text-neutral-500">
                  <span className="text-neutral-400 flex-shrink-0">{it.icon}</span>
                  <span className="font-accent text-[10px] uppercase tracking-wider">
                    {it.label}
                  </span>
                </div>
                <span className="font-body text-sm font-bold text-neutral-900">
                  {it.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SMART TECH */}
      {smartFeatures.length > 0 && (
        <section className="px-6 md:px-16 py-10 max-w-5xl mx-auto border-t border-neutral-200">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-headline text-lg font-black uppercase tracking-widest text-neutral-900 whitespace-nowrap">
              Smart Tech
            </h3>
            <div className="w-full h-[1px] bg-neutral-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {smartFeatures.map((it, i) => (
              <div key={i} className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3 text-neutral-500">
                  <span className="text-neutral-400 flex-shrink-0">{it.icon}</span>
                  <span className="font-accent text-[10px] uppercase tracking-wider">
                    {it.label}
                  </span>
                </div>
                <span className="font-body text-sm font-bold text-neutral-900">
                  {it.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SIGNATURE INNOVATIONS */}
      {vehicle.keyFeatures && vehicle.keyFeatures.length > 0 && (
        <section className="px-6 md:px-16 py-10 max-w-5xl mx-auto border-t border-neutral-200">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-headline text-lg font-black uppercase tracking-widest text-neutral-900 whitespace-nowrap">
              Signature Innovations
            </h3>
            <div className="w-full h-[1px] bg-neutral-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicle.keyFeatures.map((feature: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 border border-neutral-200 rounded-lg hover:border-neutral-400 transition-colors bg-white shadow-sm"
              >
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-headline text-sm font-bold text-neutral-900">
                    {feature}
                  </h4>
                  <p className="font-body text-xs text-neutral-500 mt-1 leading-relaxed">
                    Intelligent luxury technology integrated perfectly into every ride.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CORPORATE MESSAGE / BATTERY SOLUTIONS */}
      <section className="px-6 md:px-16 py-8 max-w-5xl mx-auto">
        <div className="p-8 border border-neutral-800 bg-neutral-900 text-white rounded-lg shadow-md relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-8 bg-red-600 rounded-full" />
            <h3 className="font-accent text-[10px] uppercase tracking-[0.25em] text-neutral-300">
              EV Battery & Customization Solutions
            </h3>
          </div>
          <p className="font-body text-xs text-neutral-300 leading-relaxed font-light">
            We specialize in providing high-performance EV battery packs in vast variants to power all types of electric vehicles. Whether you require custom battery configurations, replacement modules, or capacity upgrades, we deliver industry-grade reliability and advanced thermal management solutions.
          </p>
        </div>
      </section>

      {/* FOOTER: Premium Dark Aesthetic */}
      <footer className="mt-12 bg-neutral-950 text-white px-6 md:px-16 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6 text-[10px] uppercase tracking-widest font-bold font-accent text-neutral-300">
              <a
                href="https://shaikhandsons.in"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                <span>shaikhandsons.in</span>
              </a>
              <a
                href="https://instagram.com/shaikhandsons_ev_bikes"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                <span>@shaikhandsons_ev_bikes</span>
              </a>
            </div>
            <p className="font-body text-[10px] text-neutral-400 max-w-lg leading-relaxed">
              For more details call or whatsapp on{" "}
              <span className="text-white font-semibold">+91 93211 11322</span> and email{" "}
              <span className="text-white font-semibold">shaikhandsons22@gmail.com</span>
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10 shrink-0">
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Scan to view online"
                className="w-16 h-16 bg-white p-1 rounded shadow-sm"
              />
            )}
            <p className="font-accent text-[8px] font-bold uppercase tracking-widest text-neutral-300 max-w-[80px] leading-tight select-none">
              Scan to view online brochure
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

