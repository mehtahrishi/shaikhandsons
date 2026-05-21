"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Heart,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { VehicleCard } from '@/components/shop/VehicleCard';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/auth/favorites');
        const data = await res.json();
        if (res.ok) {
          setFavorites(data.favorites);
        }
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user, loading, router]);

  if (loading || (isLoading && !favorites.length)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-6 pt-10 md:pt-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Header: Left (Title) | Right (Total) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 md:mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="font-headline text-4xl md:text-6xl font-black text-foreground uppercase tracking-tight">
                My <span className="text-primary">Favorites</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground mt-2">
                Your private elite collection
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border/50 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center min-w-[140px] md:min-w-[180px]"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Items</span>
              <span className="text-3xl md:text-4xl font-headline font-black text-primary">
                {favorites.length.toString().padStart(2, '0')}
              </span>
            </motion.div>
          </div>

          {/* Grid Content */}
          <AnimatePresence mode="wait">
            {favorites.length > 0 ? (
              <motion.div
                key="favorites-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {favorites.map((vehicle, idx) => (
                  <div key={vehicle.id} className="h-[450px] sm:h-[500px]">
                    <VehicleCard vehicle={vehicle} />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-favorites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border/50 rounded-3xl bg-muted/5"
              >
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary/30">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-headline font-black uppercase tracking-tight mb-2">Your collection is empty</h3>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-8 opacity-70">
                  Explore our fleet to add vehicles
                </p>
                <Button 
                  onClick={() => router.push('/vehicles')}
                  className="rounded-full bg-primary hover:bg-primary/90 px-8 h-12 text-white font-bold uppercase tracking-widest text-[10px]"
                >
                  Explore Inventory
                  <ChevronRight size={14} className="ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
