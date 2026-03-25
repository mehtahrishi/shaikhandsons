export interface BrandData {
  id: string;
  name: string;
}

export async function fetchBrands() {
  try {
    const response = await fetch('/api/admin/brands');
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch brands.');
    }
    return data.brands || [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
}

export async function createBrand(name: string) {
  try {
    const response = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || 'Failed to create brand.');
    }

    return result.document;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
}

export async function updateBrand(id: string, name: string) {
  try {
    const response = await fetch(`/api/admin/brands?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || 'Failed to update brand.');
    }

    return result.document;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
}

export async function deleteBrand(id: string) {
  try {
    const response = await fetch(`/api/admin/brands?id=${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || 'Failed to delete brand.');
    }

    return result.success;
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
}
