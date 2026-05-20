import { Suspense } from 'react';
import { VehicleCatalog } from '@/components/shop/VehicleCatalog';

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehicleCatalog />
    </Suspense>
  );
}
