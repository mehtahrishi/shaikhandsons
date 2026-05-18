"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { BrandManagement, BrandData } from '@/components/admin/inventory/brand-management';
import { fetchBrands } from '@/lib/inventory-client';
import { ShieldCheck, Factory, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminBrandsPage() {
  const [brands, setBrands] = React.useState<BrandData[]>([]);
  const [isBrandsLoading, setIsBrandsLoading] = React.useState(false);

  const fetchAllBrands = React.useCallback(async () => {
    try {
      setIsBrandsLoading(true);
      const data = await fetchBrands();
      setBrands(data);
    } catch (err: any) {
      console.error('Failed to fetch brands:', err);
    } finally {
      setIsBrandsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAllBrands();
  }, [fetchAllBrands]);

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-headline text-4xl md:text-6xl font-black text-primary mb-2">
          Brands
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl uppercase tracking-widest font-bold">
          Manage your vehicle brand list and their logos.
        </p>
      </motion.div>

      <BrandManagement 
        brands={brands}
        isBrandsLoading={isBrandsLoading}
        fetchAllBrands={fetchAllBrands}
      />
    </div>
  );
}
