"use client"

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Lock,
  UserCheck,
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
  Sun,
  Heart,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getImageUrl } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchLikeStatus, toggleLikeAPI, submitOrderAPI, fetchPublicVariants } from '@/lib/inventory-client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const COLOR_MAP: Record<string, string> = {
  'red': '#ef4444',
  'blue': '#3b82f6',
  'black': '#171717',
  'white': '#fafafa',
  'grey': '#737373',
  'gray': '#737373',
  'silver': '#a3a3a3',
  'gold': '#fbbf24',
  'yellow': '#eab308',
  'green': '#22c55e',
  'orange': '#f97316',
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
  colorVariants?: Vehicle[];
  parentId?: number | null;
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
  const router = useRouter();
  const slug = params.slug as string;
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const [selectedColorVariant, setSelectedColorVariant] = React.useState<Vehicle | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState<'specs' | 'features'>('specs');
  const [isLiked, setIsLiked] = React.useState(false);
  const [isDownloadingBrochure, setIsDownloadingBrochure] = React.useState(false);
  // Variants
  const [variants, setVariants] = React.useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = React.useState<number | null>(null);
  const { user, loading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  const images = selectedColorVariant?.imageUrls?.length 
    ? selectedColorVariant.imageUrls 
    : (vehicle ? (vehicle.imageUrls || vehicle.images || []) : []);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  // Sync lightbox state with document for global UI controls (like hiding ActionDock)
  React.useEffect(() => {
    if (lightboxOpen) {
      document.documentElement.setAttribute('data-lightbox-open', 'true');
    } else {
      document.documentElement.removeAttribute('data-lightbox-open');
    }
    return () => {
      document.documentElement.removeAttribute('data-lightbox-open');
    };
  }, [lightboxOpen]);

  // Build a unified list of colors, placing parent-level colors first, then child-only colors
  const colorItems = React.useMemo(() => {
    if (!vehicle) return [];
    
    const items: { colorName: string; variant: Vehicle | null }[] = [];
    const seenColors = new Set<string>();
    const cvs = vehicle.colorVariants || [];
    const pcs = vehicle.colors || [];

    // 1. First, process all parent-level colors, linking them to matching child variants if they exist
    pcs.forEach((cName: string) => {
      const lowerName = cName.toLowerCase().trim();
      if (!seenColors.has(lowerName)) {
        seenColors.add(lowerName);
        // Find if there is a child variant matching this color
        const matchingCv = cvs.find((cv: any) => cv.colors?.[0]?.toLowerCase().trim() === lowerName);
        items.push({ colorName: cName, variant: matchingCv || null });
      }
    });

    // 2. Then, append any remaining child variants whose colors are not in the parent list
    cvs.forEach((cv: any) => {
      const cName = cv.colors?.[0];
      if (cName) {
        const lowerName = cName.toLowerCase().trim();
        if (!seenColors.has(lowerName)) {
          seenColors.add(lowerName);
          items.push({ colorName: cName, variant: cv });
        }
      }
    });

    return items;
  }, [vehicle]);

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
        
        // Build a unified list of colors to find the best default selection (parent colors first, then child-only colors)
        const cvs = data.vehicle.colorVariants || [];
        const pcs = data.vehicle.colors || [];
        const items: { colorName: string; variant: any }[] = [];
        const seen = new Set<string>();
        
        pcs.forEach((cn: string) => {
          const low = cn.toLowerCase().trim();
          if (!seen.has(low)) {
            seen.add(low);
            const matchingCv = cvs.find((cv: any) => cv.colors?.[0]?.toLowerCase().trim() === low);
            items.push({ colorName: cn, variant: matchingCv || null });
          }
        });
        
        cvs.forEach((cv: any) => {
          const cn = cv.colors?.[0];
          if (cn) {
            const low = cn.toLowerCase().trim();
            if (!seen.has(low)) {
              seen.add(low);
              items.push({ colorName: cn, variant: cv });
            }
          }
        });

        if (items.length > 0) {
          const initialId = data.initialColorVariantId;
          const matchedItem = initialId 
            ? items.find(item => item.variant && String(item.variant.id) === String(initialId))
            : null;
          
          // Default selection: matchedItem (if deep linked), or the first parent-level color (variant is null), or the first item
          const defaultItem = matchedItem || items.find(item => item.variant === null) || items[0];
          
          if (defaultItem) {
            setSelectedColorVariant(defaultItem.variant);
            setSelectedColor(defaultItem.colorName);
            const targetImages = defaultItem.variant 
              ? (defaultItem.variant.imageUrls || []) 
              : (data.vehicle.imageUrls || data.vehicle.images || []);
            if (targetImages.length > 0) {
              setSelectedImage(targetImages[0]);
            }
          }
        } else {
          setSelectedColorVariant(null);
          const images = data.vehicle.imageUrls || data.vehicle.images || [];
          if (images.length > 0) {
            setSelectedImage(images[0]);
          }
          setSelectedColor('');
        }

        // Fetch likes
        try {
          const likeData = await fetchLikeStatus(slug);
          setIsLiked(likeData.isLiked);
        } catch (lerr) {
          console.error('Failed to fetch likes:', lerr);
        }

        // Fetch variants (optional — no variants = single price)
        try {
          const variantList = await fetchPublicVariants(slug);
          setVariants(variantList);
          const defaultVar = variantList.find((v: any) => v.isDefault);
          if (defaultVar) {
            setSelectedVariantId(defaultVar.id);
          } else {
            setSelectedVariantId(null);
          }
        } catch {
          // Variants optional — ignore silently
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

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like vehicles.",
        variant: "destructive",
      });
      return;
    }

    // Optimistic Update
    const previousIsLiked = isLiked;
    
    setIsLiked(!isLiked);

    try {
      const data = await toggleLikeAPI(slug);
      setIsLiked(data.liked);
    } catch (error) {
      // Revert on error
      setIsLiked(previousIsLiked);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) return;

    setIsBookingLoading(true);
    const targetSlug = selectedColorVariant?.slug || slug;
    try {
      await submitOrderAPI(targetSlug, {
        variantId: selectedVariantId ?? null,
        customerName: bookingForm.name,
        customerPhone: bookingForm.phone,
        customerEmail: bookingForm.email || undefined,
        preferredShowroom: bookingForm.showroom,
        preferredDate: bookingForm.date,
        orderType: 'test_drive',
      });
      setIsBooked(true);
    } catch (err: any) {
      toast({
        title: 'Booking Failed',
        description: err.message || 'Could not submit booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBookingLoading(false);
    }
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

  const activePriceStr = (selectedColorVariant && selectedColorVariant.price !== undefined && selectedColorVariant.price !== null)
    ? selectedColorVariant.price 
    : vehicle.price;
  const priceNumber = typeof activePriceStr === 'string' ? parseFloat(activePriceStr) : activePriceStr;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceNumber);

  const specsList = [
    { label: "Battery Capacity", value: vehicle.batteryCapacity, icon: <BatteryFull size={15} /> },
    { label: "Battery Type", value: vehicle.batteryType, icon: <Package size={15} /> },
    { label: "Charging Time", value: vehicle.chargingTime, icon: <Hourglass size={15} /> },
    { label: "Fast Charging", value: vehicle.fastCharging !== undefined ? (vehicle.fastCharging ? "Yes" : "No") : null, icon: <BatteryCharging size={15} /> },
    { label: "Real World Range", value: vehicle.realWorldRange, icon: <MapPinned size={15} /> },
    { label: "Riding Modes", value: vehicle.ridingModes?.join(', '), icon: <SlidersVertical size={15} /> },
    { label: "Motor Power", value: vehicle.motorPower, icon: <Zap size={15} /> },
    { label: "Climbing Degree", value: vehicle.climbingDegree, icon: <TrendingUp size={15} /> },
    { label: "Braking System", value: vehicle.brakingSystem, icon: <Gauge size={15} /> },
    { label: "Tyre Type", value: vehicle.tyreType, icon: <CircleDashed size={15} /> },
    { label: "Wheel Type", value: vehicle.wheelType, icon: <CircleDot size={15} /> },
    { label: "Wheel Size", value: vehicle.wheelSize, icon: <Diameter size={15} /> },
    { label: "Ground Clearance", value: vehicle.groundClearance, icon: <ArrowDownFromLine size={15} /> },
    { label: "Load Capacity", value: vehicle.loadCapacity, icon: <Weight size={15} /> },
    { label: "Display", value: vehicle.displayType, icon: <Smartphone size={15} /> },
    { label: "Boot Space", value: vehicle.bootSpace, icon: <ShoppingBag size={15} /> },
    { label: "Charger", value: vehicle.chargerIncluded, icon: <Plug size={15} /> },
    { label: "Battery Warranty", value: vehicle.batteryWarranty, icon: <ShieldCheck size={15} /> }
  ].filter(spec => spec.value);
  
  const selectedVariant = variants.find(v => v.id === selectedVariantId);
  const addOnPrice = selectedVariant ? Number(selectedVariant.price) : 0;
  const totalBookingPrice = priceNumber + addOnPrice;
  const formattedTotalPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalBookingPrice);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24 relative [overflow-x:clip]">
      {/* Visual Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. Sticky Sub-Navbar */}
      <section className="sticky top-[92px] md:top-[100px] z-30 border-b border-border/50 bg-background/95 backdrop-blur-md shadow-sm overflow-hidden">
        <div className="w-full px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            {/* Back: icon-only arrow button */}
            <button
              onClick={() => router.back()}
              className="h-10 w-10 shrink-0 flex items-center justify-center transition-all group"
            >
              <ArrowLeft className="h-5 w-5 transition-all group-hover:text-primary group-active:text-primary group-hover:-translate-x-1" />
            </button>

            {/* Product name — right side, no border */}
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-foreground truncate text-right">
                {vehicle.make} <span className="text-primary">{vehicle.model}</span> {vehicle.trim && <span className="text-xs text-muted-foreground ml-1">({vehicle.trim})</span>}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Detail Content */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-4">

        {/* Hero Section: Media & Primary Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 pt-0">

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
                  className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[430px] pb-1 md:pb-2 pr-0.5
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

          {/* Right Column: Title, Specs & Primary Details */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.4em] font-black text-primary">
                  {vehicle.make}
                </span>
                {vehicle.trim && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-l border-border/50 pl-3">
                    {vehicle.trim}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-none text-foreground uppercase">
                {vehicle.model}
              </h1>

              <div className="flex flex-col gap-3 pt-2">
                <div className="relative group overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm hover:shadow-md transition-all duration-500">
                  {/* Subtle Glow Effect */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                  
                  <div className="flex flex-col gap-1 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-[8px] font-black uppercase tracking-widest text-white">
                        Special Offer
                      </span>
                    </div>
                    
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl sm:text-5xl font-black text-primary tracking-tighter">
                        {formattedPrice}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Starts At
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/10">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Booking Amount</span>
                        <span className="text-base font-black text-foreground">₹ 5,999/-</span>
                      </div>
                      <div className="h-8 w-px bg-border/20" />
                      <div className="flex flex-col flex-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Est. Delivery</span>
                        <span className="text-base font-black text-foreground">15 Days</span>
                      </div>
                      
                      {/* Simplified Heart Button inside Price Card for cleaner look */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleLike}
                        className={`p-3 rounded-2xl border transition-all duration-300 ${
                          isLiked 
                            ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                            : 'bg-background/50 border-border/50 text-muted-foreground hover:text-foreground hover:bg-background'
                        }`}
                        title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Short Description */}
            {vehicle.shortDescription && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm leading-relaxed text-muted-foreground font-light"
              >
                {vehicle.shortDescription}
              </motion.p>
            )}

            {/* Color Selection */}
            {((vehicle.colorVariants && vehicle.colorVariants.length > 0) || (vehicle.colors && vehicle.colors.length > 0)) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 pt-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Available Finishes</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colorItems.map((item, idx) => {
                    const isSelected = selectedColor === item.colorName;
                    const hex = getColorHex(item.colorName);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedColor(item.colorName);
                          setSelectedColorVariant(item.variant);
                          if (item.variant) {
                            const varImages = item.variant.imageUrls || [];
                            if (varImages.length > 0) {
                              setSelectedImage(varImages[0]);
                            }
                          } else {
                            const parentImages = vehicle.imageUrls || vehicle.images || [];
                            if (parentImages.length > 0) {
                              setSelectedImage(parentImages[0]);
                            }
                          }
                          // Dynamically update URL slug in browser address bar without reload
                          const targetSlug = item.variant?.slug || vehicle.slug;
                          if (targetSlug && typeof window !== 'undefined') {
                            window.history.replaceState(null, '', `/vehicles/${targetSlug}`);
                          }
                        }}
                        className={`group relative w-10 h-10 rounded-full border-0 transition-all duration-300 flex items-center justify-center ${
                          isSelected ? 'scale-110 shadow-lg shadow-primary/20' : 'hover:scale-105'
                        }`}
                        title={item.colorName}
                      >
                        <div
                          className="w-10 h-10 rounded-full shadow-inner transition-transform duration-300 group-hover:scale-90"
                          style={{ backgroundColor: hex }}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Check size={14} strokeWidth={4} className={hex.toLowerCase() === '#fafafa' || hex.toLowerCase() === '#ffffff' || hex.toLowerCase() === 'white' ? 'text-black' : 'text-white'} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
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

        {/* Section: Overview (Long Description) */}
        {vehicle.designPhilosophy && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Overview</span>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground font-light text-center whitespace-pre-line">
                {vehicle.designPhilosophy}
              </p>
            </div>
          </motion.section>
        )}

        {/* Section 2: Responsive Technical Details & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Details Block */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ─── DESKTOP TABS ────────────────────────────────────────────────── */}
            <div className="hidden md:block">
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
                      key="specs-desktop"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-x-8 gap-y-1"
                    >
                      {specsList.map((spec, idx) => (
                        <SpecRowItem key={idx} label={spec.label} value={spec.value as string} icon={spec.icon} />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="features-desktop"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      {vehicle.keyFeatures?.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm group hover:border-primary/20 transition-all">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                            {getFeatureIcon(feature)}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm">{feature}</h4>
                            <p className="text-xs text-muted-foreground leading-normal">Intelligent luxury technology integrated perfectly.</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ─── MOBILE: ADMIN-STYLE GROUPED SECTIONS WITH SWIPABLE STRIPS ─── */}
            <div className="md:hidden space-y-10">
              {/* Section 1: Technical Specifications */}
              {(() => {
                const items = [
                  vehicle.topSpeed && { label: 'Top Speed', value: vehicle.topSpeed, icon: <Gauge size={18} /> },
                  vehicle.certifiedRange && { label: 'Certified Range (ARAI)', value: vehicle.certifiedRange, icon: <BatteryFull size={18} /> },
                  vehicle.realWorldRange && { label: 'Real-World Range', value: vehicle.realWorldRange, icon: <MapPinned size={18} /> },
                  vehicle.climbingDegree && { label: 'Climbing Degree', value: vehicle.climbingDegree, icon: <TrendingUp size={18} /> },
                  vehicle.loadCapacity && { label: 'Load Capacity', value: vehicle.loadCapacity, icon: <Weight size={18} /> },
                  vehicle.ridingModes && vehicle.ridingModes.length > 0 && { label: 'Riding Modes', value: vehicle.ridingModes.join(', '), icon: <SlidersVertical size={18} /> },
                ].filter(Boolean) as { label: string; value: string; icon: React.ReactNode }[];
                if (items.length === 0) return null;
                return (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 1. Technical Specifications
                    </h3>
                    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 [&::-webkit-scrollbar]:hidden">
                      {items.map((it, i) => (
                        <div key={i} className="snap-start shrink-0 w-48 p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm flex flex-col gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{it.icon}</div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{it.label}</p>
                            <p className="text-sm font-black text-foreground mt-1 leading-tight">{it.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Section 2: Battery & Charging */}
              {(() => {
                const items = [
                  vehicle.batteryType && { label: 'Battery Type', value: vehicle.batteryType, icon: <Package size={18} /> },
                  vehicle.batteryCapacity && { label: 'Battery Capacity', value: vehicle.batteryCapacity, icon: <Zap size={18} /> },
                  vehicle.chargingTime && { label: 'Charging Time (0-100%)', value: vehicle.chargingTime, icon: <Hourglass size={18} /> },
                  vehicle.batteryWarranty && { label: 'Battery Warranty', value: vehicle.batteryWarranty, icon: <ShieldCheck size={18} /> },
                  vehicle.chargerIncluded && { label: 'Charger Details', value: vehicle.chargerIncluded, icon: <Plug size={18} /> },
                  vehicle.fastCharging !== undefined && { label: 'Fast Charging Support', value: vehicle.fastCharging ? 'Yes' : 'No', icon: <BatteryCharging size={18} /> },
                ].filter(Boolean) as { label: string; value: string; icon: React.ReactNode }[];
                if (items.length === 0) return null;
                return (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 2. Battery & Charging
                    </h3>
                    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 [&::-webkit-scrollbar]:hidden">
                      {items.map((it, i) => (
                        <div key={i} className="snap-start shrink-0 w-48 p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm flex flex-col gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{it.icon}</div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{it.label}</p>
                            <p className="text-sm font-black text-foreground mt-1 leading-tight">{it.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Section 3: Hardware & Mechanicals */}
              {(() => {
                const items = [
                  vehicle.motorPower && { label: 'Motor Power', value: vehicle.motorPower, icon: <Zap size={18} /> },
                  vehicle.brakingSystem && { label: 'Braking System', value: vehicle.brakingSystem, icon: <Gauge size={18} /> },
                  vehicle.tyreType && { label: 'Tyre Type', value: vehicle.tyreType, icon: <CircleDashed size={18} /> },
                  vehicle.wheelType && { label: 'Wheel Type', value: vehicle.wheelType, icon: <CircleDot size={18} /> },
                  vehicle.wheelSize && { label: 'Wheel Size', value: vehicle.wheelSize, icon: <Diameter size={18} /> },
                  vehicle.groundClearance && { label: 'Ground Clearance', value: vehicle.groundClearance, icon: <ArrowDownFromLine size={18} /> },
                ].filter(Boolean) as { label: string; value: string; icon: React.ReactNode }[];
                if (items.length === 0) return null;
                return (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 3. Hardware & Mechanicals
                    </h3>
                    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 [&::-webkit-scrollbar]:hidden">
                      {items.map((it, i) => (
                        <div key={i} className="snap-start shrink-0 w-48 p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm flex flex-col gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{it.icon}</div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{it.label}</p>
                            <p className="text-sm font-black text-foreground mt-1 leading-tight">{it.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Section 4: Smart Features & Aesthetics */}
              {(() => {
                const items = [
                  vehicle.displayType && { label: 'Display Type', value: vehicle.displayType, icon: <Smartphone size={18} /> },
                  vehicle.bootSpace && { label: 'Boot Space', value: vehicle.bootSpace, icon: <ShoppingBag size={18} /> },
                ].filter(Boolean) as { label: string; value: string; icon: React.ReactNode }[];
                if (items.length === 0) return null;
                return (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 4. Smart Features & Aesthetics
                    </h3>
                    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 [&::-webkit-scrollbar]:hidden">
                      {items.map((it, i) => (
                        <div key={i} className="snap-start shrink-0 w-48 p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm flex flex-col gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{it.icon}</div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{it.label}</p>
                            <p className="text-sm font-black text-foreground mt-1 leading-tight">{it.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Section 5: Signature Innovations (Key Features) */}
              {vehicle.keyFeatures && vehicle.keyFeatures.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary rounded-full" /> 5. Signature Innovations
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {vehicle.keyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {getFeatureIcon(feature)}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm">{feature}</h4>
                          <p className="text-xs text-muted-foreground leading-normal">Intelligent luxury technology integrated perfectly.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                {isAuthLoading ? (
                  <div key="auth-loading" className="space-y-6 py-6">
                    <Skeleton className="h-6 w-1/2 bg-muted/30" />
                    <Skeleton className="h-4 w-full bg-muted/30" />
                    <Skeleton className="h-12 w-full bg-muted/30 rounded-xl" />
                    <Skeleton className="h-12 w-full bg-muted/30 rounded-xl" />
                    <Skeleton className="h-12 w-full bg-muted/30 rounded-full" />
                  </div>
                ) : !user ? (
                  <motion.div
                    key="auth-required"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 text-center py-6"
                  >
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
                      <Lock size={32} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase tracking-tight">Authentication Required</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed px-4">
                        Please sign in or create an account to reserve a private viewing session, customize your specifications, or place an order with Shaikh & Sons.
                      </p>
                    </div>

                    <Button
                      onClick={() => router.push(`/login?redirect=/vehicles/${slug}`)}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-12 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <UserCheck size={16} /> Sign In to Proceed
                    </Button>
                  </motion.div>
                ) : !isBooked ? (
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

                    {/* Dynamic Price Summary Box */}
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Price</span>
                        <span className="text-xl font-black text-primary">{formattedTotalPrice}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">Chassis Base</span>
                        <span className="text-xs font-bold text-foreground">{formattedPrice}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Variant Selector — shown only when variants exist */}
                      {variants.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                            <span>Select Variant (Optional)</span>
                            <span className="text-[9px] lowercase italic text-muted-foreground/60 font-semibold">click to select/deselect</span>
                          </label>
                          <div className="flex flex-col gap-2">
                            {variants.map((v: any) => {
                              const isSelected = selectedVariantId === v.id;
                              const variantPriceAddon = Number(v.price) === 0 
                                ? 'Included' 
                                : `+ ₹${Number(v.price).toLocaleString('en-IN')}`;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => setSelectedVariantId(selectedVariantId === v.id ? null : v.id)}
                                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                                    isSelected
                                      ? 'border-primary bg-primary/10 text-foreground'
                                      : 'border-border/40 bg-background/40 text-muted-foreground hover:border-border hover:bg-muted/20'
                                  }`}
                                >
                                  <div className="flex flex-col">
                                    <span className={`text-xs font-black uppercase tracking-wide ${
                                      isSelected ? 'text-primary' : ''
                                    }`}>{v.name}</span>
                                    <span className="text-[9px] font-bold text-muted-foreground/85 uppercase tracking-wider mt-0.5">
                                      {v.variantType === 'battery' || v.variantType === 'ev' 
                                        ? '⚡ EV Variant' 
                                        : v.variantType === 'engine' || v.variantType === 'petrol' 
                                          ? '⚙️ Petrol Variant' 
                                          : '💨 Gas Variant'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-sm font-black ${
                                      isSelected ? 'text-primary' : 'text-foreground'
                                    }`}>{variantPriceAddon}</span>
                                    {isSelected && (
                                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                        <Check size={10} strokeWidth={3} className="text-white" />
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

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

            {/* Floating Download Brochure Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              disabled={isDownloadingBrochure}
              onClick={async () => {
                setIsDownloadingBrochure(true);
                try {
                  const res = await fetch(`/api/brochure/${slug}`);
                  if (!res.ok) throw new Error("PDF generation failed");
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `ShaikhAndSons_${vehicle.make}_${vehicle.model}.pdf`.replace(/\s+/g, "_");
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                } catch {
                  window.open(`/brochure/${slug}`, "_blank");
                } finally {
                  setIsDownloadingBrochure(false);
                }
              }}
              className="fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px))] md:bottom-8 left-4 md:left-8 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full border border-border/50 bg-background/80 hover:bg-background/95 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isDownloadingBrochure ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:translate-y-0.5 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              )}
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Brochure</span>
            </motion.button>
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

            {/* Previous Button (<) — removed from absolute sides */}

            {/* Active Image container */}
            <div className="max-w-[90vw] max-h-[80vh] relative flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={getImageUrl(images[lightboxIndex])}
                alt={`${vehicle.make} ${vehicle.model} - Large View`}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/5 shadow-2xl"
              />

              {/* Bottom centre: < index > controls */}
              {images.length > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevImage}
                    className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="bg-black/60 border border-white/10 backdrop-blur-md text-white/80 text-xs font-bold py-1.5 px-4 rounded-full">
                    {lightboxIndex + 1} / {images.length}
                  </span>

                  <button
                    onClick={handleNextImage}
                    className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
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
