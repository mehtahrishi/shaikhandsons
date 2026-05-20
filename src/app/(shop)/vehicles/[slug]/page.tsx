"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BatteryFull,
  Zap,
  Gauge,
  ChevronRight,
  ChevronLeft,
  MapPinned,
  Calendar,
  User,
  Phone,
  Clock,
  Hourglass,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  FileText,
  CircleDot,
  ArrowDownFromLine,
  Smartphone,
  Plug,
  Package,
  BatteryCharging,
  SlidersVertical,
  TrendingUp,
  CircleDashed,
  Weight,
  ShoppingBag,
  ShieldCheck,
  Diameter,
  Siren,
  Radar,
  Usb,
  KeyRound,
  LampCeiling,
  Sun
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getImageUrl } from '@/lib/utils';

type Vehicle = {
  id: number | string;
  brandId?: number;
  make: string;
  model: string;
  year?: number;
  trim?: string;
  price: number | string;
  slug: string;
  category?: string;
  modelCode?: string;
  shortDescription?: string;
  topSpeed?: string;
  certifiedRange?: string;
  realWorldRange?: string;
  ridingModes?: string[];
  climbingDegree?: string;
  loadCapacity?: string;
  batteryType?: string;
  chargerIncluded?: string;
  batteryWarranty?: string;
  motorPower?: string;
  brakingSystem?: string;
  tyreType?: string;
  wheelType?: string;
  wheelSize?: string;
  groundClearance?: string;
  displayType?: string;
  bootSpace?: string;
  colors?: string[];
  keyFeatures?: string[];
  batteryCapacity?: string;
  chargingTime?: string;
  fastCharging?: boolean;
  designPhilosophy?: string;
  imageUrls?: string[];
  images?: string[];
};

// Helper color hex map for vehicle color chips
const getColorHex = (colorName: string): string => {
  const name = colorName.toLowerCase().trim();
  if (name.includes('white')) return '#ffffff';
  if (name.includes('black') || name.includes('carbon') || name.includes('midnight')) return '#18181b';
  if (name.includes('red') || name.includes('crimson') || name.includes('chilli')) return '#dc2626';
  if (name.includes('blue') || name.includes('ocean') || name.includes('electric')) return '#2563eb';
  if (name.includes('grey') || name.includes('gray') || name.includes('silver') || name.includes('slate')) return '#71717a';
  if (name.includes('gold') || name.includes('yellow') || name.includes('orange')) return '#eab308';
  if (name.includes('green') || name.includes('emerald') || name.includes('pine')) return '#16a34a';
  return '#a1a1aa'; // fallback zinc
};

// Helper to get feature icons
const getFeatureIcon = (featureName: string) => {
  const name = featureName.toLowerCase();
  if (name.includes('anti theft') || name.includes('anti-theft') || name.includes('siren') || name.includes('alarm')) return <Siren size={16} />;
  if (name.includes('find my') || name.includes('radar') || name.includes('tracking')) return <Radar size={16} />;
  if (name.includes('charging port') || name.includes('usb') || name.includes('socket')) return <Usb size={16} />;
  if (name.includes('keyless') || name.includes('smart key') || name.includes('remote key')) return <KeyRound size={16} />;
  if (name.includes('projector') || name.includes('lamp') || name.includes('headlight')) return <LampCeiling size={16} />;
  if (name.includes('drl') || name.includes('daytime') || name.includes('sun')) return <Sun size={16} />;
  return <ChevronRight size={16} />;
};

export default function VehicleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState<'specs' | 'features'>('specs');

  const images = vehicle ? (vehicle.imageUrls || vehicle.images || []) : [];

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const handleMainImageClick = () => {
    const idx = images.indexOf(selectedImage);
    if (idx !== -1) {
      setLightboxIndex(idx);
      setLightboxOpen(true);
    }
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, images]);

  // Booking Form State
  const [bookingForm, setBookingForm] = React.useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    showroom: 'Mumbai Showroom'
  });
  const [isBookingLoading, setIsBookingLoading] = React.useState(false);
  const [isBooked, setIsBooked] = React.useState(false);

  React.useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/vehicles/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load vehicle.');
        }

        setVehicle(data.vehicle);
        const images = data.vehicle.imageUrls || data.vehicle.images || [];
        if (images.length > 0) {
          setSelectedImage(images[0]);
        }
        if (data.vehicle.colors && data.vehicle.colors.length > 0) {
          setSelectedColor(data.vehicle.colors[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchVehicle();
    }
  }, [slug]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) return;

    setIsBookingLoading(true);
    // Simulate luxury booking reservation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsBookingLoading(false);
    setIsBooked(true);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground py-16">
        <div className="w-full max-w-7xl mx-auto px-6">
          <Skeleton className="h-6 w-36 mb-8 rounded-full" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="aspect-[4/3] w-full rounded-[32px]" />
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="aspect-square rounded-2xl" />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-8">
              <div>
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-14 w-3/4 mb-4 rounded-xl" />
                <Skeleton className="h-8 w-48 rounded-lg" />
              </div>
              <Skeleton className="h-20 w-full rounded-2xl" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !vehicle) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <HelpCircle size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Vehicle Not Found</h1>
            <p className="text-muted-foreground">{error || 'The vehicle details you requested could not be retrieved.'}</p>
          </div>
          <Link href="/vehicles" className="inline-block">
            <Button className="rounded-full bg-primary hover:bg-primary/90 px-8 h-12 text-white font-bold transition-all duration-300">
              Return to Inventory
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const priceNumber = typeof vehicle.price === 'string' ? parseFloat(vehicle.price) : vehicle.price;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceNumber);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24 relative overflow-hidden">
      {/* Visual Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-6 pt-8">

        {/* Hero Section: Media & Primary Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 pt-8">

          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-start">
            {/* Thumbnail Selection Grid */}
            {images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative shrink-0 w-full md:w-24"
              >
                {/* Scrollable strip */}
                <div
                  className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-1 md:pb-2 pr-0.5
                    [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1
                    [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-muted/20
                    [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60"
                >
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`rounded-2xl overflow-hidden aspect-square w-20 md:w-full border-2 transition-all duration-300 relative group bg-card shrink-0 ${selectedImage === img
                        ? 'border-primary shadow-lg shadow-primary/10 scale-95'
                        : 'border-border/40 hover:border-border hover:-translate-y-0.5'
                        }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${vehicle.make} ${vehicle.model} thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain p-2 transition-all duration-500 group-hover:scale-110"
                      />
                    </button>
                  ))}
                </div>
                {/* Bottom fade-out gradient — signals more content below on desktop */}
                <div className="hidden md:block absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/80 to-transparent pointer-events-none rounded-b-2xl" />
              </motion.div>
            )}

            {/* Main Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onClick={handleMainImageClick}
              className="relative aspect-[4/3] flex-1 w-full flex items-center justify-center group cursor-zoom-in"
            >
              {/* Category Badge */}
              {vehicle.category && (
                <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-black tracking-[0.2em] py-2 px-4 rounded-full border border-white/10 shadow-lg">
                  {vehicle.category}
                </div>
              )}

              {/* Zoom overlay — badge anchored to bottom-right */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                <span className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-full border border-white/10 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                  Expand
                </span>
              </div>

              {selectedImage ? (
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={getImageUrl(selectedImage)}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-contain group-hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <Sparkles className="h-8 w-8 text-primary/40 animate-pulse" />
                  <span className="text-sm font-semibold tracking-wider uppercase">Visualizing Vehicle...</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Title, Specs & Color Selector */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="text-xs uppercase tracking-[0.4em] font-black text-primary">
                {vehicle.make}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-foreground uppercase">
                {vehicle.model}
              </h1>

              <div className="flex items-center gap-4 pt-2">
                <div className="bg-primary/5 border border-primary/20 px-5 py-3 rounded-2xl flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Starting Ex-Showroom</span>
                  <span className="text-2xl font-black text-primary tracking-tight">{formattedPrice}</span>
                </div>
                {vehicle.trim && (
                  <div className="bg-muted/40 border border-border/30 px-4 py-2.5 rounded-xl text-xs font-bold text-foreground/80">
                    TRIM: {vehicle.trim}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Color Configurator */}
            {vehicle.colors && vehicle.colors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="p-6 rounded-[24px] border border-border/40 bg-card/10 backdrop-blur-md space-y-4"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs uppercase tracking-[0.2em] font-black text-muted-foreground">Select Colorway</p>
                  <span className="text-xs font-bold text-primary capitalize bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {vehicle.colors.map((color, idx) => {
                    const hex = getColorHex(color);
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        className="relative p-0.5 rounded-full border transition-all duration-300"
                        style={{
                          borderColor: isSelected ? '#dc2626' : 'transparent',
                          boxShadow: isSelected ? '0 0 14px rgba(220, 38, 38, 0.4)' : 'none'
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full border border-border/20 transition-transform duration-300 hover:scale-110 shadow-inner"
                          style={{ backgroundColor: hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Short Description */}
            {vehicle.shortDescription && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm leading-relaxed text-muted-foreground font-light font-sans"
              >
                {vehicle.shortDescription}
              </motion.p>
            )}

            {/* Key Stats Cards Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-4"
            >
              {vehicle.certifiedRange && (
                <div className="relative p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-md overflow-hidden group text-center flex flex-col justify-between h-28">
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/5 rounded-full blur-lg group-hover:bg-primary/15 transition-all duration-500" />
                  <div className="flex justify-center text-primary">
                    <BatteryFull className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Range</p>
                    <p className="text-base font-black tracking-tight text-foreground">{vehicle.certifiedRange}</p>
                  </div>
                </div>
              )}

              {vehicle.motorPower && (
                <div className="relative p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-md overflow-hidden group text-center flex flex-col justify-between h-28">
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/5 rounded-full blur-lg group-hover:bg-primary/15 transition-all duration-500" />
                  <div className="flex justify-center text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Power</p>
                    <p className="text-base font-black tracking-tight text-foreground truncate">{vehicle.motorPower}</p>
                  </div>
                </div>
              )}

              {vehicle.topSpeed && (
                <div className="relative p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-md overflow-hidden group text-center flex flex-col justify-between h-28">
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/5 rounded-full blur-lg group-hover:bg-primary/15 transition-all duration-500" />
                  <div className="flex justify-center text-primary">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Top Speed</p>
                    <p className="text-base font-black tracking-tight text-foreground">{vehicle.topSpeed}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Section 2: Technical Specifications vs Key Features Tabs & Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Block: Interactive Tabs for Details */}
          <div className="lg:col-span-8 space-y-6">

            {/* Tabs Header */}
            <div className="flex border-b border-border/30 relative">
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-4 px-6 text-sm font-black tracking-[0.2em] uppercase transition-colors relative z-10 flex items-center gap-2 ${activeTab === 'specs' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <FileText size={16} />
                Specifications
                {activeTab === 'specs' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('features')}
                className={`py-4 px-6 text-sm font-black tracking-[0.2em] uppercase transition-colors relative z-10 flex items-center gap-2 ${activeTab === 'features' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Sparkles size={16} />
                Key Features
                {activeTab === 'features' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* Tabs Content */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {activeTab === 'specs' ? (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1"
                  >
                    {vehicle.batteryCapacity && (
                      <SpecRowItem label="Battery Capacity" value={vehicle.batteryCapacity} icon={<BatteryFull size={15} />} />
                    )}
                    {vehicle.batteryType && (
                      <SpecRowItem label="Battery Type" value={vehicle.batteryType} icon={<Package size={15} />} />
                    )}
                    {vehicle.chargingTime && (
                      <SpecRowItem label="Charging Time" value={vehicle.chargingTime} icon={<Hourglass size={15} />} />
                    )}
                    {vehicle.fastCharging !== undefined && (
                      <SpecRowItem label="Fast Charging" value={vehicle.fastCharging ? "Yes" : "No"} icon={<BatteryCharging size={15} />} />
                    )}
                    {vehicle.realWorldRange && (
                      <SpecRowItem label="Real World Range" value={vehicle.realWorldRange} icon={<MapPinned size={15} />} />
                    )}
                    {vehicle.ridingModes && vehicle.ridingModes.length > 0 && (
                      <SpecRowItem label="Riding Modes" value={vehicle.ridingModes.join(', ')} icon={<SlidersVertical size={15} />} />
                    )}
                    {vehicle.motorPower && (
                      <SpecRowItem label="Motor Power" value={vehicle.motorPower} icon={<Zap size={15} />} />
                    )}
                    {vehicle.climbingDegree && (
                      <SpecRowItem label="Climbing Degree" value={vehicle.climbingDegree} icon={<TrendingUp size={15} />} />
                    )}
                    {vehicle.brakingSystem && (
                      <SpecRowItem label="Braking System" value={vehicle.brakingSystem} icon={<Gauge size={15} />} />
                    )}
                    {vehicle.tyreType && (
                      <SpecRowItem label="Tyre Type" value={vehicle.tyreType} icon={<CircleDashed size={15} />} />
                    )}
                    {vehicle.wheelType && (
                      <SpecRowItem label="Wheel Type" value={vehicle.wheelType} icon={<CircleDot size={15} />} />
                    )}
                    {vehicle.wheelSize && (
                      <SpecRowItem label="Wheel Size" value={vehicle.wheelSize} icon={<Diameter size={15} />} />
                    )}
                    {vehicle.groundClearance && (
                      <SpecRowItem label="Ground Clearance" value={vehicle.groundClearance} icon={<ArrowDownFromLine size={15} />} />
                    )}
                    {vehicle.loadCapacity && (
                      <SpecRowItem label="Load Capacity" value={vehicle.loadCapacity} icon={<Weight size={15} />} />
                    )}
                    {vehicle.displayType && (
                      <SpecRowItem label="Display" value={vehicle.displayType} icon={<Smartphone size={15} />} />
                    )}
                    {vehicle.bootSpace && (
                      <SpecRowItem label="Boot Space" value={vehicle.bootSpace} icon={<ShoppingBag size={15} />} />
                    )}
                    {vehicle.chargerIncluded && (
                      <SpecRowItem label="Charger" value={vehicle.chargerIncluded} icon={<Plug size={15} />} />
                    )}
                    {vehicle.batteryWarranty && (
                      <SpecRowItem label="Battery Warranty" value={vehicle.batteryWarranty} icon={<ShieldCheck size={15} />} />
                    )}
                    {vehicle.designPhilosophy && (
                      <div className="col-span-1 md:col-span-2 py-6 border-b border-border/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Design Philosophy</p>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">{vehicle.designPhilosophy}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {vehicle.keyFeatures && vehicle.keyFeatures.length > 0 ? (
                      vehicle.keyFeatures.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-4 p-5 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm hover:border-primary/20 hover:bg-card/40 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                            {getFeatureIcon(feature)}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-foreground">{feature}</h4>
                            <p className="text-xs text-muted-foreground leading-normal font-sans">
                              Intelligent luxury technology integrated perfectly into the {vehicle.model} package.
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-12 border border-dashed border-border/40 rounded-2xl">
                        <p className="text-sm text-muted-foreground">No features are registered for this vehicle model.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Block: Elegant Booking / Consultation card */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8 rounded-[32px] border border-border/50 bg-gradient-to-b from-card/60 to-card/20 backdrop-blur-xl relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {!isBooked ? (
                  <motion.form
                    key="booking-form"
                    onSubmit={handleBookingSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em]">
                        <Sparkles size={14} />
                        <span>Experience Luxury</span>
                      </div>
                      <h3 className="text-2xl font-black tracking-tight uppercase">Reserve Test Drive</h3>
                      <p className="text-xs text-muted-foreground leading-normal">
                        Book a premium private viewing and personalized test track session for the {vehicle.make} {vehicle.model}.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Name input */}
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4" />
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={bookingForm.name}
                            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                            className="w-full bg-background/50 border border-border/60 hover:border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-11 pr-4 text-sm font-semibold transition-all outline-none"
                          />
                        </div>
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4" />
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={bookingForm.phone}
                            onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                            className="w-full bg-background/50 border border-border/60 hover:border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-11 pr-4 text-sm font-semibold transition-all outline-none"
                          />
                        </div>
                      </div>

                      {/* Preferred Showroom dropdown */}
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preferred Lounge</label>
                        <div className="relative">
                          <MapPinned className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4" />
                          <select
                            value={bookingForm.showroom}
                            onChange={(e) => setBookingForm({ ...bookingForm, showroom: e.target.value })}
                            className="w-full bg-background/50 border border-border/60 focus:border-primary rounded-xl py-3 pl-11 pr-4 text-sm font-semibold transition-all outline-none appearance-none"
                          >
                            <option value="Mumbai Showroom">Shaikh & Sons Lounge — Mumbai</option>
                            <option value="Delhi Showroom">Shaikh & Sons Lounge — Delhi</option>
                            <option value="Pune Showroom">Shaikh & Sons Lounge — Pune</option>
                          </select>
                        </div>
                      </div>

                      {/* Booking Date */}
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preferred Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4" />
                          <input
                            type="date"
                            required
                            value={bookingForm.date}
                            onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                            className="w-full bg-background/50 border border-border/60 focus:border-primary rounded-xl py-3 pl-11 pr-4 text-sm font-semibold transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isBookingLoading}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-12 rounded-full shadow-lg shadow-primary/20 transition-all duration-300"
                    >
                      {isBookingLoading ? "Processing Booking..." : "Submit Reservation Request"}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="booking-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} className="animate-bounce" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xl font-black uppercase tracking-tight text-emerald-500">Reservation Confirmed</h4>
                      <p className="text-sm font-bold text-foreground">Thank you, {bookingForm.name}!</p>
                      <p className="text-xs text-muted-foreground leading-relaxed px-2">
                        Your VIP viewing session has been requested for <strong className="text-foreground">{bookingForm.date}</strong> at the <strong className="text-foreground">{bookingForm.showroom}</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-left text-xs space-y-2">
                      <p className="text-muted-foreground font-semibold uppercase tracking-widest text-[9px]">What's Next?</p>
                      <p className="text-muted-foreground">A Private Relationship Officer will call you within 1 hour to finalize credentials and verify slot availability.</p>
                    </div>

                    <Button
                      onClick={() => setIsBooked(false)}
                      variant="outline"
                      className="rounded-full px-6 h-10 text-xs font-bold"
                    >
                      Reserve Another Session
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xl transition-all"
            >
              ×
            </button>

            {/* Previous Button (<) */}
            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 md:left-8 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            )}

            {/* Active Image container */}
            <div className="max-w-[90vw] max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={getImageUrl(images[lightboxIndex])}
                alt={`${vehicle.make} ${vehicle.model} - Large View`}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/5 shadow-2xl"
              />

              {/* Image index indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 border border-white/10 backdrop-blur-md text-white/80 text-xs font-bold py-1.5 px-4 rounded-full">
                {lightboxIndex + 1} / {images.length}
              </div>
            </div>

            {/* Next Button (>) */}
            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 md:right-8 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center transition-all z-10"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function SpecRowItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-border/20 group hover:bg-muted/10 px-3 rounded-lg transition-colors">
      <div className="flex items-center gap-2.5">
        {icon ? (
          <span className="text-primary">{icon}</span>
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-all shrink-0" />
        )}
        <span className="text-sm text-muted-foreground font-medium font-sans">{label}</span>
      </div>
      <span className="text-sm font-black text-foreground">{value}</span>
    </div>
  );
}
