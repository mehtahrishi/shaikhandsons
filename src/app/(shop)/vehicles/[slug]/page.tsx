"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Battery, Zap, Gauge, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
  motorPower?: string;
  brakingSystem?: string;
  tyreType?: string;
  wheelSize?: string;
  groundClearance?: string;
  displayType?: string;
  bootSpace?: string;
  colors?: string[];
  keyFeatures?: string[];
  batteryCapacity?: string;
  chargingTime?: string;
  fastCharging?: boolean;
  imageUrls?: string[];
  images?: string[];
};

export default function VehicleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string>('');

  React.useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch by slug/ID from API
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !vehicle) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div>
            <h1 className="text-3xl font-black text-red-500 mb-2">Vehicle Not Found</h1>
            <p className="text-lg text-muted-foreground">{error || 'The vehicle you are looking for does not exist or the slug/ID is invalid.'}</p>
          </div>
          <Link href="/vehicles">
            <Button variant="outline">Back to Vehicles</Button>
          </Link>
        </div>
      </main>
    );
  }

  const images = vehicle.imageUrls || vehicle.images || [];
  const priceNumber = typeof vehicle.price === 'string' ? parseFloat(vehicle.price) : vehicle.price;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceNumber);

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Back Button */}
        <Link href="/vehicles" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Vehicles
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden bg-muted/20 aspect-square flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground">No image available</div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      selectedImage === img
                        ? 'border-primary'
                        : 'border-border/40 hover:border-border'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${vehicle.make} ${vehicle.model} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {vehicle.make}
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                {vehicle.model}
              </h1>
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-black text-primary">{formattedPrice}</p>
                <span className="text-xs font-semibold text-muted-foreground">Starting From</span>
              </div>
            </div>

            {/* Short Description */}
            {vehicle.shortDescription && (
              <p className="text-sm leading-relaxed text-foreground/80">
                {vehicle.shortDescription}
              </p>
            )}

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-3">
              {vehicle.certifiedRange && (
                <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Range
                  </p>
                  <p className="text-lg font-black">{vehicle.certifiedRange}</p>
                </div>
              )}
              {vehicle.motorPower && (
                <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Power
                  </p>
                  <p className="text-lg font-black">{vehicle.motorPower}</p>
                </div>
              )}
              {vehicle.topSpeed && (
                <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Gauge className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Max Speed
                  </p>
                  <p className="text-lg font-black">{vehicle.topSpeed}</p>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h2 className="text-lg font-black tracking-tight">Specifications</h2>
              <div className="space-y-3">
                {vehicle.batteryCapacity && (
                  <SpecRow label="Battery Capacity" value={vehicle.batteryCapacity} />
                )}
                {vehicle.chargingTime && (
                  <SpecRow label="Charging Time" value={vehicle.chargingTime} />
                )}
                {vehicle.brakingSystem && (
                  <SpecRow label="Braking System" value={vehicle.brakingSystem} />
                )}
                {vehicle.tyreType && (
                  <SpecRow label="Tyre Type" value={vehicle.tyreType} />
                )}
                {vehicle.wheelSize && (
                  <SpecRow label="Wheel Size" value={vehicle.wheelSize} />
                )}
                {vehicle.groundClearance && (
                  <SpecRow label="Ground Clearance" value={vehicle.groundClearance} />
                )}
                {vehicle.displayType && (
                  <SpecRow label="Display" value={vehicle.displayType} />
                )}
              </div>
            </div>

            {/* Key Features */}
            {vehicle.keyFeatures && vehicle.keyFeatures.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-black tracking-tight">Key Features</h2>
                <ul className="space-y-2">
                  {vehicle.keyFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-bold">
                Schedule Test Drive
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-full border border-primary text-primary hover:bg-primary/5 font-bold"
              >
                Contact Dealer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/40">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
