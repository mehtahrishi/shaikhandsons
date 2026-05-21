"use client"

import React from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { VEHICLE_CATEGORIES, vehicleMatchesCategory } from '@/lib/vehicle-categories';
import { VehicleCard } from './VehicleCard';

type Vehicle = {
  id: number | string;
  brandId?: number;
  make: string;
  model: string;
  year?: number;
  trim?: string;
  price: number | string;
  category?: string;
  modelCode?: string;
  shortDescription?: string;
  topSpeed?: string;
  certifiedRange?: string;
  motorPower?: string;
  imageUrls?: string[];
  images?: string[];
};

export function VehicleCatalog() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [brand, setBrand] = React.useState('all');

  // Handle URL changes
  React.useEffect(() => {
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const queryParam = searchParams.get('q');

    if (categoryParam) {
      setCategory(categoryParam);
    } else {
      setCategory('all');
    }

    if (brandParam) {
      setBrand(brandParam);
    } else {
      setBrand('all');
    }

    if (queryParam) {
      setSearch(queryParam);
    } else {
      setSearch('');
    }
  }, [searchParams]);

  // Fetch vehicles once on mount
  React.useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/vehicles');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load vehicles.');
        }
        setVehicles(data.vehicles || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const brands = React.useMemo(() => (
    Array.from(new Set(vehicles.map((vehicle) => vehicle.make).filter(Boolean))).sort()
  ), [vehicles]);

  const filteredVehicles = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch = !term || [
        vehicle.make,
        vehicle.model,
        vehicle.category,
        vehicle.modelCode,
        vehicle.shortDescription,
      ].some((value) => value?.toLowerCase().includes(term));
      const matchesCategory = category === 'all' || vehicleMatchesCategory(vehicle.category, category);
      
      // Fix: Support both Brand Name (from dropdown) and Brand ID (from Home Page links)
      const matchesBrand = brand === 'all' || 
        vehicle.make === brand || 
        vehicle.brandId === Number(brand);

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [vehicles, search, category, brand]);

  return (
    <main className="min-h-screen bg-background pt-4">
      <div className="w-full px-4 py-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-black tracking-tight text-foreground">
          Our Catalogue
        </h1>
      </div>
      <section className="sticky top-[92px] md:top-[100px] z-30 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 items-center gap-3 lg:grid-cols-[190px_190px_minmax(220px,1fr)_minmax(280px,420px)]">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 rounded-lg bg-muted/20 text-xs font-black uppercase tracking-widest">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {VEHICLE_CATEGORIES.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="h-11 rounded-lg bg-muted/20 text-xs font-black uppercase tracking-widest">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="hidden md:flex h-11 items-center justify-center rounded-lg border border-border/50 bg-muted/10 px-4">
              <p className="text-center text-[11px] font-black uppercase tracking-[0.24em] text-foreground">
                Available Vehicles
                <span className="ml-2 text-primary">{filteredVehicles.length}</span>
              </p>
            </div>

            <div className="relative col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search vehicles..."
                className="h-11 rounded-lg bg-muted/20 pl-10 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-4 sm:px-6 lg:px-8 border-b border-border/50">
        <p className="text-sm font-semibold text-foreground">
          {(() => {
            const getCategoryLabel = () => {
              const cat = VEHICLE_CATEGORIES.find(c => c.id === category);
              return cat?.label || category;
            };

            if (search) {
              return `Showing Vehicles matching "${search}"`;
            } else if (category !== 'all' && brand !== 'all') {
              return `Showing ${getCategoryLabel()} from ${brand}`;
            } else if (category !== 'all') {
              return `Showing Vehicles from ${getCategoryLabel()} category`;
            } else if (brand !== 'all') {
              return `Showing Vehicles from ${brand}`;
            } else {
              return `Showing All Vehicles`;
            }
          })()}
        </p>
      </section>

      <section className="w-full py-8 px-6 lg:px-8 overflow-hidden">
        {error && <div className="py-10 text-center text-sm font-bold text-red-500">{error}</div>}

        <div className="flex md:grid snap-x snap-mandatory md:snap-none gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`vehicle-skeleton-${index}`} className="w-[calc(100vw-3rem)] md:w-full flex-none snap-center space-y-6 rounded-[1.5rem] border border-border/40 bg-card p-6 h-[420px] sm:h-[520px] sm:rounded-[2.5rem]">
                <Skeleton className="h-1/2 w-full rounded-3xl" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-1/2" />
              </div>
            ))
          ) : (
            filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="w-[calc(100vw-3rem)] md:w-full flex-none snap-center h-[450px] sm:h-[520px]">
                <VehicleCard vehicle={vehicle} />
              </div>
            ))
          )}
        </div>

        {!isLoading && filteredVehicles.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No vehicles matched your filters.</p>
          </div>
        )}
      </section>
    </main>
  );
}
