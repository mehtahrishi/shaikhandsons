export interface NewVehicleData {
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  batteryRangeKm: number;
  horsepower: number;
  zeroToSixtySeconds: number;
  images: string[]; // URLs from storage
  designPhilosophy: string;
}

export async function createVehicle(data: NewVehicleData) {
  try {
    const response = await fetch('/api/admin/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || 'Failed to create vehicle document.');
    }

    return result.document;
  } catch (error) {
    console.error('Error creating vehicle document:', error);
    throw error;
  }
}

export async function updateVehicle(id: string, data: Partial<NewVehicleData>) {
  try {
    const response = await fetch(`/api/admin/inventory?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || 'Failed to update vehicle document.');
    }

    return result.document;
  } catch (error) {
    console.error('Error updating vehicle document:', error);
    throw error;
  }
}

export async function deleteVehicle(id: string) {
  try {
    const response = await fetch(`/api/admin/inventory?id=${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || 'Failed to delete vehicle document.');
    }

    return result.success;
  } catch (error) {
    console.error('Error deleting vehicle document:', error);
    throw error;
  }
}
