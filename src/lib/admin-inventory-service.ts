/**
 * Admin Inventory Service
 * Provides client-side functions to interact with admin inventory endpoints
 */

// Brands
export async function fetchBrands() {
  const res = await fetch('/api/admin/brands');
  if (!res.ok) {
    throw new Error('Failed to fetch brands');
  }
  const data = await res.json();
  return data.brands || [];
}

export async function createBrand(name: string) {
  const res = await fetch('/api/admin/brands', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create brand');
  }
  return await res.json();
}

export async function updateBrand(id: string, name: string) {
  const res = await fetch(`/api/admin/brands?id=${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update brand');
  }
  return await res.json();
}

export async function deleteBrand(id: string) {
  const res = await fetch(`/api/admin/brands?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete brand');
  }
  return await res.json();
}

// Vehicles
export async function createVehicle(data: {
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number;
  designPhilosophy: string;
  images: string[];
  brandId: number;
  
  modelCode?: string;
  category?: string;
  shortDescription?: string;
  topSpeed?: string;
  certifiedRange?: string;
  realWorldRange?: string;
  ridingModes?: string[];
  climbingDegree?: string;
  loadCapacity?: string;
  batteryType?: string;
  batteryCapacity?: string;
  chargingTime?: string;
  fastCharging?: boolean;
  chargerIncluded?: string;
  batteryWarranty?: string;
  motorPower?: string;
  brakingSystem?: string;
  tyreType?: string;
  wheelType?: string;
  wheelSize?: string;
  groundClearance?: string;
  displayType?: string;
  colors?: string[];
  keyFeatures?: string[];
  bootSpace?: string;
}) {
  const res = await fetch('/api/admin/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      imageUrls: data.images || [],
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create vehicle');
  }

  return await res.json();
}

// File Upload
export async function uploadVehicleImages(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const res = await fetch('/api/admin/storage/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload images');
  }

  const data = await res.json();
  return data.urls || [];
}

// Update Vehicle
export async function updateVehicleAPI(
  id: string,
  data: {
    brandId?: number;
    make?: string;
    model?: string;
    year?: number;
    trim?: string;
    price?: number;
    designPhilosophy?: string;
    imageUrls?: string[];
    
    modelCode?: string;
    category?: string;
    shortDescription?: string;
    topSpeed?: string;
    certifiedRange?: string;
    realWorldRange?: string;
    ridingModes?: string[];
    climbingDegree?: string;
    loadCapacity?: string;
    batteryType?: string;
    batteryCapacity?: string;
    chargingTime?: string;
    fastCharging?: boolean;
    chargerIncluded?: string;
    batteryWarranty?: string;
    motorPower?: string;
    brakingSystem?: string;
    tyreType?: string;
    wheelType?: string;
    wheelSize?: string;
    groundClearance?: string;
    displayType?: string;
    colors?: string[];
    keyFeatures?: string[];
    bootSpace?: string;
  }
) {
  const res = await fetch('/api/admin/inventory', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update vehicle');
  }

  return await res.json();
}

// Delete Vehicle
export async function deleteVehicleAPI(id: string) {
  const res = await fetch('/api/admin/inventory', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete vehicle');
  }

  return await res.json();
}
