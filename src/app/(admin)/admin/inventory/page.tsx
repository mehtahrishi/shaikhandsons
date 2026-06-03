"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Package, 
  Zap, 
  Plus,
  BarChart3,
  Search,
  MoreVertical,
  Upload,
  Pencil,
  Loader2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { 
  fetchBrands, 
  createBrand, 
  updateBrand, 
  deleteBrand, 
  createVehicle, 
  uploadVehicleImages, 
  uploadBrandImage,
  updateVehicleAPI, 
  deleteVehicleAPI,
  bulkUpdateVehicles,
  generatePlaceholderImages
} from '@/lib/inventory-client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, FileText, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ADMIN_VEHICLE_CATEGORIES } from '@/lib/vehicle-categories';
import { getImageUrl } from '@/lib/utils';
import { generateVehicleSlug } from '@/lib/slug';

type Vehicle = {
  id: string;
  brandId: number;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  slug?: string;
  images: string[];
  imageUrls?: string[];
  designPhilosophy: string;
  createdAt: string;
  variants?: any[];
  parentId?: number | null;
  colorVariants?: any[];
  
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
};

type EditGalleryItem = {
  id: string;
  type: 'existing' | 'file';
  previewUrl: string;
  file?: File;
};

type BrandData = {
  id: number;
  name: string;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type BulkVehicleForm = {
  brandId: number;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  slug?: string;
  designPhilosophy: string;
  selectedFiles: File[];
  isExpanded: boolean;
  
  modelCode: string;
  category: string;
  shortDescription: string;
  topSpeed: string;
  certifiedRange: string;
  realWorldRange: string;
  ridingModes: string[];
  climbingDegree: string;
  loadCapacity: string;
  batteryType: string;
  batteryCapacity: string;
  chargingTime: string;
  fastCharging: boolean;
  chargerIncluded: string;
  batteryWarranty: string;
  motorPower: string;
  brakingSystem: string;
  tyreType: string;
  wheelType: string;
  wheelSize: string;
  groundClearance: string;
  displayType: string;
  colors: string[];
  keyFeatures: string[];
  bootSpace: string;
};

const getVehicleImages = (vehicle: Pick<Vehicle, 'images' | 'imageUrls'>) => {
  if (Array.isArray(vehicle.imageUrls) && vehicle.imageUrls.length > 0) {
    return vehicle.imageUrls;
  }

  if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
    return vehicle.images;
  }

  return [];
};

const revokeEditGalleryPreviews = (items: EditGalleryItem[]) => {
  items.forEach((item) => {
    if (item.type === 'file') {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
};

const createEmptyBulkVehicle = (): BulkVehicleForm => ({
  brandId: 0,
  make: '',
  model: '',
  year: 2026,
  trim: '',
  price: 0,
  slug: '',
  designPhilosophy: '',
  selectedFiles: [],
  isExpanded: true,
  
  modelCode: '',
  category: '',
  shortDescription: '',
  topSpeed: '',
  certifiedRange: '',
  realWorldRange: '',
  ridingModes: [],
  climbingDegree: '',
  loadCapacity: '',
  batteryType: '',
  batteryCapacity: '',
  chargingTime: '',
  fastCharging: false,
  chargerIncluded: '',
  batteryWarranty: '',
  motorPower: '',
  brakingSystem: '',
  tyreType: '',
  wheelType: '',
  wheelSize: '',
  groundClearance: '',
  displayType: '',
  colors: [],
  keyFeatures: [],
  bootSpace: '',
});

// Predefined dropdown options
const YEARS = ['2024', '2025', '2026'];
const TOP_SPEEDS = ['25 km/h', '30 km/h', '35 km/h', '40 km/h', '45 km/h', '50 km/h', '60 km/h', '70 km/h', '80 km/h', '90 km/h', '100+ km/h'];
const RANGES = ['50 km', '75 km', '100 km', '120 km', '150 km', '180 km', '200 km', '250 km', '300 km', '350 km', '400+ km'];
const CLIMBING_DEGREES = ['5 Degrees', '7-10 Degrees', '10-15 Degrees', '15-20 Degrees', '20+ Degrees'];
const LOAD_CAPACITIES = ['100 kg', '150 kg', '180 kg', '200 kg', '250 kg', '300+ kg'];
const BATTERY_CAPACITIES = ['1.5 kWh', '2.5 kWh', '3 kWh', '5 kWh', '6 kWh', '8 kWh', '10 kWh', '15 kWh'];
const CHARGING_TIMES = ['2-3 Hours', '3-4 Hours', '4-5 Hours', '5-6 Hours', '6-8 Hours', '8+ Hours'];
const BATTERY_WARRANTIES = ['1 Year', '2 Years', '3 Years', '5 Years', '8 Years'];
const MOTOR_POWERS = ['250W', '500W', '750W', '1000W', '1500W', '2000W', '2500W', '3000W'];
const WHEEL_SIZES = ['8 inch', '10 inch', '12 inch', '13 inch', '14 inch', '16 inch', '17 inch', '18 inch'];
const GROUND_CLEARANCES = ['150 mm', '160 mm', '165 mm', '170 mm', '180 mm', '190 mm', '200 mm'];
const BOOT_SPACES = ['10 L', '15 L', '20 L', '25 L', '30 L', '40 L', '50 L'];
const CHARGER_OPTIONS = ['None', '5A Standard Charger', '10A Standard Charger', '15A Fast Charger', '20A Fast Charger', 'Portable Charger Included'];

// Helper function to ensure array fields are always arrays
const ensureArray = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((item: string) => item.trim()).filter(Boolean);
  }
  return [];
};

const moveArrayItem = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  if (toIndex < 0 || toIndex >= items.length) return items;

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
};

const extractNumber = (val: string | number | undefined | null): string => {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  if (!str) return '';
  const match = str.match(/^[-+]?[0-9]*\.?[0-9]+/);
  return match ? match[0] : '';
};

const isPredefinedDisplay = (type: string | undefined | null): boolean => {
  if (!type) return true;
  return ["LED Digital", "TFT", "Touchscreen", ""].includes(type);
};


export default function AdminInventoryPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);
  const [bulkVehicles, setBulkVehicles] = React.useState<BulkVehicleForm[]>([createEmptyBulkVehicle()]);
  const [editingVehicle, setEditingVehicle] = React.useState<Vehicle | null>(null);
  const [editGalleryItems, setEditGalleryItems] = React.useState<EditGalleryItem[]>([]);
  const [vehicleToDelete, setVehicleToDelete] = React.useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = React.useState<string>('all');
  const [variantFilter, setVariantFilter] = React.useState<string>('all'); // 'all', 'with', 'without'

  // Brands State
  const [brands, setBrands] = React.useState<BrandData[]>([]);
  const [isBrandsLoading, setIsBrandsLoading] = React.useState(false);

  const handleManageVariantsClick = (vehicle: Vehicle) => {
    router.push(`/admin/variants?vehicleId=${vehicle.id}`);
  };

  // Manage Colors (Parent-Child) State
  const [isColorsModalOpen, setIsColorsModalOpen] = React.useState(false);
  const [selectedParentForColors, setSelectedParentForColors] = React.useState<Vehicle | null>(null);
  const [colorVariantForm, setColorVariantForm] = React.useState({
    colorName: '',
    price: '',
    slug: '',
  });
  const [colorVariantFiles, setColorVariantFiles] = React.useState<File[]>([]);
  const [isAddingColorVariant, setIsAddingColorVariant] = React.useState(false);
  const [expandedParentIds, setExpandedParentIds] = React.useState<Record<string, boolean>>({});

  const handleManageColorsClick = (vehicle: Vehicle) => {
    setSelectedParentForColors(vehicle);
    setColorVariantForm({
      colorName: '',
      price: String(vehicle.price || ''),
      slug: `${vehicle.slug || generateVehicleSlug(vehicle.make, vehicle.model)}-`,
    });
    setColorVariantFiles([]);
    setIsColorsModalOpen(true);
  };

  const handleAddColorVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentForColors) return;
    if (!colorVariantForm.colorName.trim()) {
      toast({
        title: "Missing Color Name",
        description: "Please specify the color name for this variant.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAddingColorVariant(true);

      // 1. Upload images
      let imageUrls: string[] = [];
      if (colorVariantFiles.length > 0) {
        imageUrls = await uploadVehicleImages(colorVariantFiles);
      }

      // 2. Create vehicle child record
      const parent = selectedParentForColors;
      const cleanColor = colorVariantForm.colorName.trim();
      const fallbackSlug = `${parent.slug}-${cleanColor.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const targetSlug = colorVariantForm.slug.trim() || fallbackSlug;

      await createVehicle({
        parentId: Number(parent.id),
        brandId: parent.brandId,
        make: parent.make,
        model: parent.model,
        year: parent.year,
        trim: parent.trim || '',
        price: Number(colorVariantForm.price) || Number(parent.price),
        slug: targetSlug,
        designPhilosophy: parent.designPhilosophy || '',
        images: imageUrls,
        
        modelCode: parent.modelCode || '',
        category: parent.category || '',
        shortDescription: parent.shortDescription || '',
        topSpeed: parent.topSpeed || '',
        certifiedRange: parent.certifiedRange || '',
        realWorldRange: parent.realWorldRange || '',
        ridingModes: ensureArray(parent.ridingModes),
        climbingDegree: parent.climbingDegree || '',
        loadCapacity: parent.loadCapacity || '',
        batteryType: parent.batteryType || '',
        batteryCapacity: parent.batteryCapacity || '',
        chargingTime: parent.chargingTime || '',
        fastCharging: !!parent.fastCharging,
        chargerIncluded: parent.chargerIncluded || '',
        batteryWarranty: parent.batteryWarranty || '',
        motorPower: parent.motorPower || '',
        brakingSystem: parent.brakingSystem || '',
        tyreType: parent.tyreType || '',
        wheelType: parent.wheelType || '',
        wheelSize: parent.wheelSize || '',
        groundClearance: parent.groundClearance || '',
        displayType: parent.displayType || '',
        colors: [cleanColor],
        keyFeatures: ensureArray(parent.keyFeatures),
        bootSpace: parent.bootSpace || '',
      });

      toast({
        title: "Success",
        description: `Color variant "${cleanColor}" successfully created.`,
      });

      // Reset form
      setColorVariantForm({
        colorName: '',
        price: String(parent.price || ''),
        slug: `${parent.slug || generateVehicleSlug(parent.make, parent.model)}-`,
      });
      setColorVariantFiles([]);
      
      // Refresh listing
      await fetchVehicles();

      // Refetch current parent to show newly added variant in the list
      const response = await fetch('/api/admin/inventory');
      const data = await response.json();
      if (response.ok && data.vehicles) {
        const found = (data.vehicles || []).find((v: any) => String(v.id) === String(parent.id));
        if (found) {
          const normalizedFound = {
            ...found,
            price: Number(found.price) || 0,
            images: getVehicleImages(found),
            colorVariants: Array.isArray(found.colorVariants)
              ? found.colorVariants.map((cv: any) => ({
                  ...cv,
                  price: Number(cv.price) || 0,
                  images: getVehicleImages(cv),
                }))
              : [],
          };
          setSelectedParentForColors(normalizedFound);
        }
      }

    } catch (err: any) {
      toast({
        title: "Failed to Add Variant",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsAddingColorVariant(false);
    }
  };

  const handleDeleteColorVariant = async (childId: string) => {
    if (!confirm("Are you sure you want to delete this color variant? This will permanently remove its image files and database record.")) return;
    try {
      await deleteVehicleAPI(childId);
      toast({
        title: "Deleted",
        description: "Color variant deleted successfully.",
      });
      // Refresh lists
      await fetchVehicles();
      if (selectedParentForColors) {
        const response = await fetch('/api/admin/inventory');
        const data = await response.json();
        if (response.ok && data.vehicles) {
          const found = (data.vehicles || []).find((v: any) => String(v.id) === String(selectedParentForColors.id));
          if (found) {
            const normalizedFound = {
              ...found,
              price: Number(found.price) || 0,
              images: getVehicleImages(found),
              colorVariants: Array.isArray(found.colorVariants)
                ? found.colorVariants.map((cv: any) => ({
                    ...cv,
                    price: Number(cv.price) || 0,
                    images: getVehicleImages(cv),
                  }))
                : [],
            };
            setSelectedParentForColors(normalizedFound);
          } else {
            setIsColorsModalOpen(false);
          }
        }
      }
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message || "Failed to delete variant.",
        variant: "destructive",
      });
    }
  };
  const fetchAllBrands = React.useCallback(async () => {
    try {
      setIsBrandsLoading(true);
      const data = await fetchBrands();
      setBrands(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsBrandsLoading(false);
    }
  }, []);



  const fetchVehicles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/inventory');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch vehicles.');
      }
      const normalizedVehicles = (data.vehicles || []).map((vehicle: Vehicle) => ({
        ...vehicle,
        price: Number(vehicle.price) || 0,
        images: getVehicleImages(vehicle),
        colorVariants: Array.isArray(vehicle.colorVariants)
          ? vehicle.colorVariants.map((cv: any) => ({
              ...cv,
              price: Number(cv.price) || 0,
              images: getVehicleImages(cv),
            }))
          : [],
      }));
      setVehicles(normalizedVehicles);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchVehicles();
    fetchAllBrands();
  }, [fetchVehicles, fetchAllBrands]);

  const filteredVehicles = React.useMemo(() => {
    // Only display parent vehicles in the main inventory table
    let result = vehicles.filter(v => v.parentId === null || v.parentId === undefined);
    
    // Brand filter
    if (selectedBrandId && selectedBrandId !== 'all') {
      result = result.filter(v => String(v.brandId) === selectedBrandId);
    }

    // Variant filter
    if (variantFilter === 'with') {
      result = result.filter(v => Array.isArray(v.variants) && v.variants.length > 0);
    } else if (variantFilter === 'without') {
      result = result.filter(v => !Array.isArray(v.variants) || v.variants.length === 0);
    }
    
    // Search filter
    const term = search.trim().toLowerCase();
    if (term) {
      result = result.filter(v => 
        v.make.toLowerCase().includes(term) || 
        v.model.toLowerCase().includes(term) ||
        (v.trim && v.trim.toLowerCase().includes(term)) ||
        String(v.id).includes(term) ||
        (v.colors && v.colors.some((c: any) => c.toLowerCase().includes(term))) ||
        (v.colorVariants && v.colorVariants.some((cv: any) => 
          cv.colors && cv.colors.some((c: any) => c.toLowerCase().includes(term))
        ))
      );
    }
    
    return result;
  }, [search, vehicles, selectedBrandId, variantFilter]);

  const totalAssets = filteredVehicles.length;
  const totalValue = filteredVehicles.reduce((sum, v) => sum + (Number(v.price) || 0), 0);
  const formattedTotalValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(totalValue);

  // Form State
  const [formData, setFormData] = React.useState({
    brandId: 0,
    make: '',
    model: '',
    year: 2026,
    trim: '',
    price: 0,
    slug: '',
    designPhilosophy: '',
    
    modelCode: '',
    category: '',
    shortDescription: '',
    topSpeed: '',
    certifiedRange: '',
    realWorldRange: '',
    ridingModes: [] as string[],
    climbingDegree: '',
    loadCapacity: '',
    batteryType: '',
    batteryCapacity: '',
    chargingTime: '',
    fastCharging: false,
    chargerIncluded: '',
    batteryWarranty: '',
    motorPower: '',
    brakingSystem: '',
    tyreType: '',
    wheelType: '',
    wheelSize: '',
    groundClearance: '',
    displayType: '',
    colors: [] as string[],
    keyFeatures: [] as string[],
    bootSpace: '',
  });
  const [colorsInput, setColorsInput] = React.useState('');
  const [ridingModesInput, setRidingModesInput] = React.useState('');
  const [keyFeaturesInput, setKeyFeaturesInput] = React.useState('');

  // Auto-generate slug for single form
  React.useEffect(() => {
    if (!isSlugManuallyEdited && formData.make && formData.model) {
      const generatedSlug = generateVehicleSlug(formData.make, formData.model);
      if (formData.slug !== generatedSlug) {
        setFormData(prev => ({ ...prev, slug: generatedSlug }));
      }
    }
  }, [formData.make, formData.model, isSlugManuallyEdited, formData.slug]);

  const handleRegisterUnit = async () => {
    const errors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.brandId || !formData.make) errors.brandId = '⚠️ Brand is required';
    if (!formData.model || formData.model.trim() === '') errors.model = '⚠️ Model name is required';
    if (!formData.price || formData.price === 0) errors.price = '⚠️ Price is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Validation Errors",
        description: "Please fill in all required fields marked with ⚠️",
        variant: "destructive",
      });
      return;
    }
    
    setFormErrors({});

    try {
      setIsUploading(true);
      
      // 1. Upload Images to Storage
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadVehicleImages(selectedFiles);
      }
      
      // 2. Save Data to Database
      await createVehicle({
        brandId: formData.brandId,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        trim: formData.trim,
        price: formData.price,
        slug: formData.slug,
        designPhilosophy: formData.designPhilosophy,
        images: imageUrls,
        
        modelCode: formData.modelCode,
        category: formData.category,
        shortDescription: formData.shortDescription,
        topSpeed: formData.topSpeed,
        certifiedRange: formData.certifiedRange,
        realWorldRange: formData.realWorldRange,
        ridingModes: formData.ridingModes,
        climbingDegree: formData.climbingDegree,
        loadCapacity: formData.loadCapacity,
        batteryType: formData.batteryType,
        batteryCapacity: formData.batteryCapacity,
        chargingTime: formData.chargingTime,
        fastCharging: formData.fastCharging,
        chargerIncluded: formData.chargerIncluded,
        batteryWarranty: formData.batteryWarranty,
        motorPower: formData.motorPower,
        brakingSystem: formData.brakingSystem,
        tyreType: formData.tyreType,
        wheelType: formData.wheelType,
        wheelSize: formData.wheelSize,
        groundClearance: formData.groundClearance,
        displayType: formData.displayType,
        colors: formData.colors,
        keyFeatures: formData.keyFeatures,
        bootSpace: formData.bootSpace,
      });

      toast({
        title: "Success",
        description: "Vehicle successfully registered.",
      });
      setIsAddModalOpen(false);
      setSelectedFiles([]);
      setColorsInput('');
      setRidingModesInput('');
      setKeyFeaturesInput('');
      setFormData({
        brandId: 0,
        make: '',
        model: '',
        year: 2026,
        trim: '',
        price: 0,
        slug: '',
        designPhilosophy: '',
        modelCode: '',
        category: '',
        shortDescription: '',
        topSpeed: '',
        certifiedRange: '',
        realWorldRange: '',
        ridingModes: [],
        climbingDegree: '',
        loadCapacity: '',
        batteryType: '',
        batteryCapacity: '',
        chargingTime: '',
        fastCharging: false,
        chargerIncluded: '',
        batteryWarranty: '',
        motorPower: '',
        brakingSystem: '',
        tyreType: '',
        wheelType: '',
        wheelSize: '',
        groundClearance: '',
        displayType: '',
        colors: [],
        keyFeatures: [],
        bootSpace: '',
      });
      // 3. Refresh List
      fetchVehicles();
    } catch (error: any) {
      const message = error.message || 'Registration failed.';
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsSlugManuallyEdited(true);
    revokeEditGalleryPreviews(editGalleryItems);
    setSelectedFiles([]);
    setEditGalleryItems(getVehicleImages(vehicle).map((url, index) => ({
      id: `existing-${index}-${url}`,
      type: 'existing',
      previewUrl: url,
    })));
    setFormData({
      brandId: vehicle.brandId || 0,
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || 2026,
      trim: vehicle.trim || '',
      price: vehicle.price || 0,
      slug: vehicle.slug || '',
      designPhilosophy: vehicle.designPhilosophy || '',
      
      modelCode: vehicle.modelCode || '',
      category: vehicle.category || '',
      shortDescription: vehicle.shortDescription || '',
      topSpeed: vehicle.topSpeed || '',
      certifiedRange: vehicle.certifiedRange || '',
      realWorldRange: vehicle.realWorldRange || '',
      ridingModes: ensureArray(vehicle.ridingModes),
      climbingDegree: vehicle.climbingDegree || '',
      loadCapacity: vehicle.loadCapacity || '',
      batteryType: vehicle.batteryType || '',
      batteryCapacity: vehicle.batteryCapacity || '',
      chargingTime: vehicle.chargingTime || '',
      fastCharging: !!vehicle.fastCharging,
      chargerIncluded: vehicle.chargerIncluded || '',
      batteryWarranty: vehicle.batteryWarranty || '',
      motorPower: vehicle.motorPower || '',
      brakingSystem: vehicle.brakingSystem || '',
      tyreType: vehicle.tyreType || '',
      wheelType: vehicle.wheelType || '',
      wheelSize: vehicle.wheelSize || '',
      groundClearance: vehicle.groundClearance || '',
      displayType: vehicle.displayType || '',
      colors: ensureArray(vehicle.colors),
      keyFeatures: ensureArray(vehicle.keyFeatures),
      bootSpace: vehicle.bootSpace || '',
    });
    setColorsInput(ensureArray(vehicle.colors).join(', '));
    setRidingModesInput(ensureArray(vehicle.ridingModes).join(', '));
    setKeyFeaturesInput(ensureArray(vehicle.keyFeatures).join(', '));
    setIsEditModalOpen(true);
  };

  const addEditGalleryFiles = (files: File[]) => {
    if (files.length === 0) return;

    const newItems = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}-${file.name}`,
      type: 'file' as const,
      previewUrl: URL.createObjectURL(file),
      file,
    }));

    setEditGalleryItems((prev) => [...prev, ...newItems]);
  };

  const removeEditGalleryItem = (id: string) => {
    setEditGalleryItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove?.type === 'file') {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  const makeEditGalleryFaceImage = (id: string) => {
    setEditGalleryItems((prev) => {
      const selected = prev.find((item) => item.id === id);
      if (!selected) return prev;

      return [selected, ...prev.filter((item) => item.id !== id)];
    });
  };

  const moveEditGalleryItem = (fromIndex: number, toIndex: number) => {
    setEditGalleryItems((prev) => moveArrayItem(prev, fromIndex, toIndex));
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVehicle(null);
    setSelectedFiles([]);
    revokeEditGalleryPreviews(editGalleryItems);
    setEditGalleryItems([]);
    // Reset form data to prevent it from carrying over to add modal
    setFormData({
      brandId: 0,
      make: '',
      model: '',
      year: 2026,
      trim: '',
      price: 0,
      slug: '',
      designPhilosophy: '',
      modelCode: '',
      category: '',
      shortDescription: '',
      topSpeed: '',
      certifiedRange: '',
      realWorldRange: '',
      ridingModes: [],
      climbingDegree: '',
      loadCapacity: '',
      batteryType: '',
      batteryCapacity: '',
      chargingTime: '',
      fastCharging: false,
      chargerIncluded: '',
      batteryWarranty: '',
      motorPower: '',
      brakingSystem: '',
      tyreType: '',
      wheelType: '',
      wheelSize: '',
      groundClearance: '',
      displayType: '',
      colors: [],
      keyFeatures: [],
      bootSpace: '',
    });
    setColorsInput('');
    setRidingModesInput('');
    setKeyFeaturesInput('');
  };

  const handleUpdateUnit = async () => {
    if (!editingVehicle) return;

    if (!formData.brandId || !formData.make) {
      toast({
        title: "Missing Brand",
        description: "Please select a brand.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const fileItems = editGalleryItems.filter((item) => item.type === 'file' && item.file);
      const uploadedUrls = fileItems.length > 0
        ? await uploadVehicleImages(fileItems.map((item) => item.file as File))
        : [];
      let uploadedIndex = 0;
      const imageUrls = editGalleryItems
        .map((item) => {
          if (item.type === 'existing') return item.previewUrl;
          const uploadedUrl = uploadedUrls[uploadedIndex];
          uploadedIndex += 1;
          return uploadedUrl;
        })
        .filter(Boolean);
      
      await updateVehicleAPI(editingVehicle.id, {
        brandId: formData.brandId,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        trim: formData.trim,
        price: formData.price,
        slug: formData.slug,
        designPhilosophy: formData.designPhilosophy,
        imageUrls: imageUrls,
        
        modelCode: formData.modelCode,
        category: formData.category,
        shortDescription: formData.shortDescription,
        topSpeed: formData.topSpeed,
        certifiedRange: formData.certifiedRange,
        realWorldRange: formData.realWorldRange,
        ridingModes: formData.ridingModes,
        climbingDegree: formData.climbingDegree,
        loadCapacity: formData.loadCapacity,
        batteryType: formData.batteryType,
        batteryCapacity: formData.batteryCapacity,
        chargingTime: formData.chargingTime,
        fastCharging: formData.fastCharging,
        chargerIncluded: formData.chargerIncluded,
        batteryWarranty: formData.batteryWarranty,
        motorPower: formData.motorPower,
        brakingSystem: formData.brakingSystem,
        tyreType: formData.tyreType,
        wheelType: formData.wheelType,
        wheelSize: formData.wheelSize,
        groundClearance: formData.groundClearance,
        displayType: formData.displayType,
        colors: formData.colors,
        keyFeatures: formData.keyFeatures,
        bootSpace: formData.bootSpace,
      });

      toast({
        title: "Success",
        description: "Vehicle updated successfully.",
      });
      setIsEditModalOpen(false);
      setEditingVehicle(null);
      setSelectedFiles([]);
      revokeEditGalleryPreviews(editGalleryItems);
      setEditGalleryItems([]);
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    setVehicleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;

    try {
      setIsUploading(true);
      await deleteVehicleAPI(vehicleToDelete);
      toast({
        title: "Success",
        description: "Asset removed from fleet.",
      });
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsUploading(false);
      setIsDeleteModalOpen(false);
      setVehicleToDelete(null);
    }
  };

  const updateBulkVehicle = <K extends keyof BulkVehicleForm>(
    index: number,
    field: K,
    value: BulkVehicleForm[K]
  ) => {
    setBulkVehicles((prev) =>
      prev.map((entry, idx) => {
        if (idx === index) {
          const updatedEntry = { ...entry, [field]: value };
          
          // Auto-generate slug for bulk entries if make or model changes
          if (field === 'make' || field === 'model') {
            if (updatedEntry.make && updatedEntry.model) {
              updatedEntry.slug = generateVehicleSlug(updatedEntry.make, updatedEntry.model);
            }
          }
          
          return updatedEntry;
        }
        return entry;
      })
    );
  };

  const moveSelectedFile = (fromIndex: number, toIndex: number) => {
    setSelectedFiles((prev) => moveArrayItem(prev, fromIndex, toIndex));
  };

  const moveBulkSelectedFile = (vehicleIndex: number, fromIndex: number, toIndex: number) => {
    setBulkVehicles((prev) => prev.map((entry, idx) => (
      idx === vehicleIndex
        ? { ...entry, selectedFiles: moveArrayItem(entry.selectedFiles, fromIndex, toIndex) }
        : entry
    )));
  };

  const removeBulkSelectedFile = (vehicleIndex: number, fileIndex: number) => {
    setBulkVehicles((prev) => prev.map((entry, idx) => (
      idx === vehicleIndex
        ? { ...entry, selectedFiles: entry.selectedFiles.filter((_, selectedIndex) => selectedIndex !== fileIndex) }
        : entry
    )));
  };

  const addBulkVehicleRow = () => {
    setBulkVehicles((prev) => [...prev, createEmptyBulkVehicle()]);
  };

  const removeBulkVehicleRow = (index: number) => {
    setBulkVehicles((prev) => {
      if (prev.length === 1) {
        return prev;
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const resetBulkForm = () => {
    setBulkVehicles([createEmptyBulkVehicle()]);
  };

  const toggleAllBulkRows = (expanded: boolean) => {
    setBulkVehicles((prev) => prev.map((v) => ({ ...v, isExpanded: expanded })));
  };

  const handleBulkImport = async () => {
    if (bulkVehicles.length === 0) {
      toast({
        title: 'No Entries',
        description: 'Add at least one vehicle to import.',
        variant: 'destructive',
      });
      return;
    }

    // Validate only required fields: brandId, make, model, price
    const firstInvalidIndex = bulkVehicles.findIndex(
      (entry) => !entry.brandId || !entry.make.trim() || !entry.model.trim() || entry.price === 0
    );

    if (firstInvalidIndex !== -1) {
      toast({
        title: 'Incomplete Entry',
        description: `Please complete required fields (Brand, Model, Price) in row ${firstInvalidIndex + 1}.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      let successCount = 0;

      for (const entry of bulkVehicles) {
        try {
          let imageUrls: string[] = [];
          
          // Use uploaded images if provided, otherwise generate placeholders
          if (entry.selectedFiles.length > 0) {
            imageUrls = await uploadVehicleImages(entry.selectedFiles);
          } else {
            imageUrls = generatePlaceholderImages(entry.make, entry.model);
          }

          await createVehicle({
            brandId: entry.brandId,
            make: entry.make,
            model: entry.model,
            year: entry.year || 2026,
            trim: entry.trim || '',
            price: entry.price,
            slug: entry.slug || '',
            designPhilosophy: entry.designPhilosophy || '',
            images: imageUrls,
            
            modelCode: entry.modelCode,
            category: entry.category,
            shortDescription: entry.shortDescription,
            topSpeed: entry.topSpeed,
            certifiedRange: entry.certifiedRange,
            realWorldRange: entry.realWorldRange,
            ridingModes: entry.ridingModes,
            climbingDegree: entry.climbingDegree,
            loadCapacity: entry.loadCapacity,
            batteryType: entry.batteryType,
            batteryCapacity: entry.batteryCapacity,
            chargingTime: entry.chargingTime,
            fastCharging: entry.fastCharging,
            chargerIncluded: entry.chargerIncluded,
            batteryWarranty: entry.batteryWarranty,
            motorPower: entry.motorPower,
            brakingSystem: entry.brakingSystem,
            tyreType: entry.tyreType,
            wheelType: entry.wheelType,
            wheelSize: entry.wheelSize,
            groundClearance: entry.groundClearance,
            displayType: entry.displayType,
            colors: entry.colors,
            keyFeatures: entry.keyFeatures,
            bootSpace: entry.bootSpace,
          });
          
          successCount++;
        } catch (error: any) {
          console.error(`Failed to add ${entry.make} ${entry.model}:`, error);
          // Continue with next entry instead of stopping
        }
      }

      toast({
        title: 'Bulk Import Complete',
        description: `Successfully added ${successCount} of ${bulkVehicles.length} vehicle${bulkVehicles.length > 1 ? 's' : ''}.`,
      });

      setIsBulkModalOpen(false);
      resetBulkForm();
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: 'Bulk Import Error',
        description: error.message || 'Failed to import vehicles.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-2 text-primary">
            Fleet Catalogue
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl uppercase tracking-widest font-bold">
            Hardware management and fleet distribution.
          </p>
        </motion.div>
        
        <div className="flex w-full sm:w-auto items-center gap-2 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-2">
          <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-12 flex-1 sm:flex-none px-4 sm:px-6 font-black uppercase tracking-[0.16em] text-[10px] rounded-xl border-border/60 bg-background/60 hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Upload className="h-4 w-4 mr-2" /> Bulk Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[920px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl font-black">Bulk Asset Import</DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest">
                  Import multiple vehicles using structured form rows.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-4 px-1">
                <div className="space-y-4">
                  {bulkVehicles.map((entry, idx) => (
                    <div key={idx} className="border border-border/50 rounded-xl p-4 bg-muted/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => updateBulkVehicle(idx, 'isExpanded', !entry.isExpanded)}
                            className="h-7 w-7 p-0 hover:bg-primary/10"
                          >
                            {entry.isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-primary" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-primary" />
                            )}
                          </Button>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                            Vehicle Row {idx + 1} {(!entry.isExpanded && (entry.make || entry.model)) && `- ${entry.make} ${entry.model}`}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBulkVehicleRow(idx)}
                          disabled={bulkVehicles.length === 1}
                          className="h-7 px-2 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500"
                        >
                          Remove
                        </Button>
                      </div>

                      {entry.isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3 px-0.5"
                        >
                          {/* Section 1: Basic Information */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                              <div className="h-1 w-4 bg-primary rounded-full" /> 1. Basic Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Manufacturer</Label>
                                <Select
                                  value={entry.make}
                                  onValueChange={(brandName) => {
                                    const selectedBrand = brands.find(b => b.name === brandName);
                                    if (selectedBrand) {
                                      updateBulkVehicle(idx, 'make', selectedBrand.name);
                                      updateBulkVehicle(idx, 'brandId', selectedBrand.id);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Brand" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {brands.map((b) => (
                                      <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Model Name</Label>
                                <Input placeholder="Model" className="h-8 text-[9px] bg-muted/20" value={entry.model} onChange={(e) => updateBulkVehicle(idx, 'model', e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Trim/Variant</Label>
                                <Input placeholder="Standard/Pro/Max" className="h-8 text-[9px] bg-muted/20" value={entry.trim} onChange={(e) => updateBulkVehicle(idx, 'trim', e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Model Code</Label>
                                <Input placeholder="Code" className="h-8 text-[9px] bg-muted/20" value={entry.modelCode} onChange={(e) => updateBulkVehicle(idx, 'modelCode', e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Category</Label>
                                <Select value={entry.category} onValueChange={(val) => updateBulkVehicle(idx, 'category', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ADMIN_VEHICLE_CATEGORIES.map((category) => (
                                      <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">URL Slug</Label>
                                <Input placeholder="auto-generated" className="h-8 text-[9px] bg-muted/20" value={entry.slug} onChange={(e) => updateBulkVehicle(idx, 'slug', e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Price (₹)</Label>
                                <Input type="number" placeholder="Price" className="h-8 text-[9px] bg-muted/20" value={entry.price} onChange={(e) => updateBulkVehicle(idx, 'price', Number(e.target.value) || 0)} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Year</Label>
                                <Input type="number" placeholder="Year" className="h-8 text-[9px] bg-muted/20" value={entry.year} onChange={(e) => updateBulkVehicle(idx, 'year', Number(e.target.value) || 0)} />
                              </div>
                              <div className="md:col-span-2 space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Short Description</Label>
                                <Input placeholder="Brief description..." className="h-8 text-[9px] bg-muted/20" value={entry.shortDescription} onChange={(e) => updateBulkVehicle(idx, 'shortDescription', e.target.value)} />
                              </div>
                            </div>
                          </div>

                          <Separator className="bg-border/30" />

                          {/* Section 2: Technical Specifications */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                              <div className="h-1 w-4 bg-primary rounded-full" /> 2. Technical Specifications
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Top Speed</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Speed"
                                    value={extractNumber(entry.topSpeed)}
                                    onChange={(e) => updateBulkVehicle(idx, 'topSpeed', e.target.value.trim() !== '' ? `${e.target.value.trim()} km/h` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    km/h
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Certified Range</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Range"
                                    value={extractNumber(entry.certifiedRange)}
                                    onChange={(e) => updateBulkVehicle(idx, 'certifiedRange', e.target.value.trim() !== '' ? `${e.target.value.trim()} km` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    km
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Real-World Range</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Range"
                                    value={extractNumber(entry.realWorldRange)}
                                    onChange={(e) => updateBulkVehicle(idx, 'realWorldRange', e.target.value.trim() !== '' ? `${e.target.value.trim()} km` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    km
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Climbing Degree</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Degree"
                                    value={extractNumber(entry.climbingDegree)}
                                    onChange={(e) => updateBulkVehicle(idx, 'climbingDegree', e.target.value.trim() !== '' ? `${e.target.value.trim()} Degrees` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    Deg
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Load Capacity</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Capacity"
                                    value={extractNumber(entry.loadCapacity)}
                                    onChange={(e) => updateBulkVehicle(idx, 'loadCapacity', e.target.value.trim() !== '' ? `${e.target.value.trim()} kg` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    kg
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-3 space-y-1">
                              <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Riding Modes (Comma separated)</Label>
                              <Input 
                                placeholder="Eco, City, Sport, Reverse" 
                                className="h-8 text-[9px] bg-muted/20" 
                                value={entry.ridingModes.join(', ')} 
                                onChange={(e) => updateBulkVehicle(idx, 'ridingModes', e.target.value.split(',').map(m => m.trim()).filter(Boolean))} 
                              />
                            </div>
                          </div>

                          <Separator className="bg-border/30" />

                          {/* Section 3: Battery & Charging */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                              <div className="h-1 w-4 bg-primary rounded-full" /> 3. Battery & Charging
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Battery Type</Label>
                                <Select value={entry.batteryType} onValueChange={(val) => updateBulkVehicle(idx, 'batteryType', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Lithium-ion (NMC)">Lithium-ion (NMC)</SelectItem>
                                    <SelectItem value="LFP">LFP</SelectItem>
                                    <SelectItem value="Lead Graphene">Lead Graphene</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Battery Capacity</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Capacity"
                                    value={extractNumber(entry.batteryCapacity)}
                                    onChange={(e) => updateBulkVehicle(idx, 'batteryCapacity', e.target.value.trim() !== '' ? `${e.target.value.trim()} kWh` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    kWh
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Charging Time</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Time"
                                    value={extractNumber(entry.chargingTime)}
                                    onChange={(e) => updateBulkVehicle(idx, 'chargingTime', e.target.value.trim() !== '' ? `${e.target.value.trim()} Hours` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    Hrs
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Battery Warranty</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Warranty"
                                    value={extractNumber(entry.batteryWarranty)}
                                    onChange={(e) => updateBulkVehicle(idx, 'batteryWarranty', e.target.value.trim() !== '' ? `${e.target.value.trim()} Years` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    Yrs
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Charger Details</Label>
                                <Input 
                                  placeholder="e.g. 5A Standard Charger (or 'None')" 
                                  className="h-8 text-[9px] bg-muted/20" 
                                  value={entry.chargerIncluded} 
                                  onChange={(e) => updateBulkVehicle(idx, 'chargerIncluded', e.target.value)} 
                                />
                              </div>
                              <div className="flex items-center space-x-2 pt-2">
                                <Checkbox id={`bulk-fast-${idx}`} checked={entry.fastCharging} onCheckedChange={(checked) => updateBulkVehicle(idx, 'fastCharging', !!checked)} />
                                <Label htmlFor={`bulk-fast-${idx}`} className="text-[8px] font-black uppercase cursor-pointer">Fast Charging</Label>
                              </div>
                            </div>
                          </div>

                          <Separator className="bg-border/30" />

                          {/* Section 4: Hardware & Mechanicals */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                              <div className="h-1 w-4 bg-primary rounded-full" /> 4. Hardware & Mechanicals
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Motor Power</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Power"
                                    value={extractNumber(entry.motorPower)}
                                    onChange={(e) => updateBulkVehicle(idx, 'motorPower', e.target.value.trim() !== '' ? `${e.target.value.trim()}W` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    W
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Braking System</Label>
                                <Select value={entry.brakingSystem} onValueChange={(val) => updateBulkVehicle(idx, 'brakingSystem', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Braking" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Dual Disc">Dual Disc</SelectItem>
                                    <SelectItem value="Front Disc/Rear Drum">Front Disc/Rear Drum</SelectItem>
                                    <SelectItem value="Regenerative Braking">Regenerative Braking</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Tyre Type</Label>
                                <Select value={entry.tyreType} onValueChange={(val) => updateBulkVehicle(idx, 'tyreType', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Tyre" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Tubeless">Tubeless</SelectItem>
                                    <SelectItem value="Tube">Tube</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Wheel Type</Label>
                                <Select value={entry.wheelType} onValueChange={(val) => updateBulkVehicle(idx, 'wheelType', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Wheel" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Alloy">Alloy</SelectItem>
                                    <SelectItem value="Spoke">Spoke</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Wheel Size</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Size"
                                    value={extractNumber(entry.wheelSize)}
                                    onChange={(e) => updateBulkVehicle(idx, 'wheelSize', e.target.value.trim() !== '' ? `${e.target.value.trim()} inch` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    inch
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Ground Clearance</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Clearance"
                                    value={extractNumber(entry.groundClearance)}
                                    onChange={(e) => updateBulkVehicle(idx, 'groundClearance', e.target.value.trim() !== '' ? `${e.target.value.trim()} mm` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    mm
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator className="bg-border/30" />

                          {/* Section 5: Smart Features & Aesthetics */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                              <div className="h-1 w-4 bg-primary rounded-full" /> 5. Smart Features & Aesthetics
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Display Type</Label>
                                <Select 
                                  value={isPredefinedDisplay(entry.displayType) ? entry.displayType : "Other"}
                                  onValueChange={(val) => updateBulkVehicle(idx, 'displayType', val === "Other" ? "Other" : val)}
                                >
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Display" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="LED Digital">LED Digital</SelectItem>
                                    <SelectItem value="TFT">TFT</SelectItem>
                                    <SelectItem value="Touchscreen">Touchscreen</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                {(!isPredefinedDisplay(entry.displayType) || entry.displayType === "Other") && (
                                  <Input
                                    value={entry.displayType === "Other" ? "" : entry.displayType}
                                    onChange={(e) => updateBulkVehicle(idx, 'displayType', e.target.value)}
                                    placeholder="Specify Display..."
                                    className="h-8 text-[9px] bg-muted/20 mt-1"
                                  />
                                )}
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Boot Space</Label>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="Boot"
                                    value={extractNumber(entry.bootSpace)}
                                    onChange={(e) => updateBulkVehicle(idx, 'bootSpace', e.target.value.trim() !== '' ? `${e.target.value.trim()} L` : '')}
                                    className="h-8 text-[9px] bg-muted/20 flex-1"
                                  />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-2 rounded border border-border/50 h-8 flex items-center justify-center min-w-[50px] whitespace-nowrap">
                                    L
                                  </span>
                                </div>
                              </div>
                              <div className="md:col-span-2 space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Available Colors</Label>
                                <Input placeholder="Red, Blue, Grey" className="h-8 text-[9px] bg-muted/20" value={entry.colors.join(', ')} onChange={(e) => updateBulkVehicle(idx, 'colors', e.target.value.split(',').map(c => c.trim()).filter(Boolean))} />
                              </div>
                            </div>
                            <div className="md:col-span-2 space-y-1 pt-2">
                              <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Key Features (Comma separated)</Label>
                              <Input 
                                placeholder="Anti-theft Alarm, USB Charging Port, DRL" 
                                className="h-8 text-[9px] bg-muted/20" 
                                value={entry.keyFeatures.join(', ')} 
                                onChange={(e) => updateBulkVehicle(idx, 'keyFeatures', e.target.value.split(',').map(f => f.trim()).filter(Boolean))} 
                              />
                            </div>
                          </div>

                          <Separator className="bg-border/30" />

                          {/* Section 6: Media & Assets */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                              <div className="h-1 w-4 bg-primary rounded-full" /> 6. Media & Assets
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Design Philosophy</Label>
                                <Input placeholder="Design philosophy..." className="h-8 text-[9px] bg-muted/20" value={entry.designPhilosophy} onChange={(e) => updateBulkVehicle(idx, 'designPhilosophy', e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[9px] font-black uppercase tracking-widest">Images (Optional)</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => {
                                    const files = e.target.files ? Array.from(e.target.files) : [];
                                    updateBulkVehicle(idx, 'selectedFiles', files);
                                  }}
                                  className="h-9 text-xs bg-muted/20 border-dashed border-primary/20"
                                />
                                {entry.selectedFiles.length > 0 && (
                                  <div className="space-y-1 rounded-lg border border-primary/10 bg-primary/5 p-2">
                                    {entry.selectedFiles.map((file, fileIndex) => (
                                      <div key={`${file.name}-${fileIndex}`} className="flex items-center gap-2 rounded border border-border/50 bg-background/50 px-2 py-1">
                                        <Badge variant={fileIndex === 0 ? "default" : "secondary"} className="h-5 px-2 text-[8px] font-black uppercase tracking-widest">
                                          {fileIndex === 0 ? 'Face' : `#${fileIndex + 1}`}
                                        </Badge>
                                        <span className="min-w-0 flex-1 truncate text-[9px] font-bold">{file.name}</span>
                                        <Button type="button" variant="ghost" size="icon" disabled={fileIndex === 0} onClick={() => moveBulkSelectedFile(idx, fileIndex, fileIndex - 1)} className="h-6 w-6">
                                          <ChevronLeft className="h-3 w-3" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon" disabled={fileIndex === entry.selectedFiles.length - 1} onClick={() => moveBulkSelectedFile(idx, fileIndex, fileIndex + 1)} className="h-6 w-6">
                                          <ChevronRight className="h-3 w-3" />
                                        </Button>
                                        <Button type="button" variant="ghost" onClick={() => moveBulkSelectedFile(idx, fileIndex, 0)} disabled={fileIndex === 0} className="h-6 px-2 text-[8px] font-black uppercase tracking-widest">
                                          Face
                                        </Button>
                                        <button
                                          type="button"
                                          onClick={() => removeBulkSelectedFile(idx, fileIndex)}
                                          className="flex h-6 w-6 items-center justify-center rounded-full text-red-500 hover:bg-red-500 hover:text-white"
                                          aria-label="Remove image"
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBulkVehicleRow}
                    className="h-9 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg border-primary/20 hover:bg-primary/5"
                  >
                    <Plus className="h-3.5 w-3.5 mr-2" /> Add Row
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => toggleAllBulkRows(true)}
                    className="h-9 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-primary/5"
                  >
                    Expand All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => toggleAllBulkRows(false)}
                    className="h-9 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-primary/5"
                  >
                    Collapse All
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsBulkModalOpen(false);
                    resetBulkForm();
                  }}
                  className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkImport}
                  disabled={isUploading}
                  className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg min-w-[140px]"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {isUploading ? 'Importing...' : `Import ${bulkVehicles.length} ${bulkVehicles.length > 1 ? 'Units' : 'Unit'}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

            <Dialog open={isAddModalOpen} onOpenChange={(open) => {
            setIsAddModalOpen(open);
            if (open) setIsSlugManuallyEdited(false);
            if (!open) setColorsInput('');
          }}>
            <DialogTrigger asChild>
              <Button className="h-12 flex-1 sm:flex-none px-4 sm:px-8 font-black uppercase tracking-[0.16em] text-[10px] rounded-xl transition-all">
                <Plus className="h-4 w-4 mr-2" /> Add New Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[850px] p-0 overflow-hidden">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="font-headline text-2xl font-black">Register New Asset</DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest">
                  Configure technical specifications for the new unit.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[75vh]">
                <div className="space-y-8 py-6 px-6">
                  {/* Form Hints */}
                  <div className="p-3 bg-blue-500/10 border border-blue-200/50 rounded-lg space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">✏️ Form Tips</p>
                    <ul className="text-[9px] text-muted-foreground space-y-1">
                      <li>• <span className="text-red-500 font-bold">RED ASTERISK (*)</span> = Required field</li>
                      <li>• All other fields are optional with pre-set dropdown values</li>
                      <li>• Only 3 fields needed minimum: Brand, Model Name, Price</li>
                      <li>• Most fields use dropdowns - less typing, more clicking!</li>
                    </ul>
                  </div>

                  {/* Section 1: Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 1. Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manufacturer (Brand) <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.make}
                          onValueChange={(brandName) => {
                            const selectedBrand = brands.find(b => b.name === brandName);
                            if (selectedBrand) {
                              setFormData(prev => ({ ...prev, make: selectedBrand.name, brandId: selectedBrand.id }));
                              setFormErrors(prev => {const new_errors = {...prev}; delete new_errors.brandId; return new_errors;});
                            }
                          }}
                        >
                          <SelectTrigger className={`bg-muted/20 h-10 text-xs border-border/50 ${formErrors.brandId ? 'border-red-500 border-2' : ''}`}>
                            <SelectValue placeholder="Select Brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((b) => (
                              <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.brandId && <p className="text-[9px] text-red-500 font-bold">{formErrors.brandId}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Model Name <span className="text-red-500">*</span></Label>
                        <Input 
                          value={formData.model}
                          onChange={(e) => {
                            setFormData(prev => ({...prev, model: e.target.value}));
                            if (e.target.value.trim()) {
                              setFormErrors(prev => {const new_errors = {...prev}; delete new_errors.model; return new_errors;});
                            }
                          }}
                          placeholder="e.g., Dynamo LIMA" 
                          className={`bg-muted/20 h-10 text-xs border-border/50 ${formErrors.model ? 'border-red-500 border-2' : ''}`} 
                        />
                        {formErrors.model && <p className="text-[9px] text-red-500 font-bold">{formErrors.model}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Model Number/Code</Label>
                        <Input 
                          value={formData.modelCode}
                          onChange={(e) => setFormData(prev => ({...prev, modelCode: e.target.value}))}
                          placeholder="e.g., LIMA-2026" className="bg-muted/20 h-10 text-xs border-border/50" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(val) => setFormData(prev => ({...prev, category: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {ADMIN_VEHICLE_CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ex-Showroom Price (₹) <span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setFormData(prev => ({...prev, price: val}));
                            if (val > 0) {
                              setFormErrors(prev => {const new_errors = {...prev}; delete new_errors.price; return new_errors;});
                            }
                          }}
                          placeholder="0" 
                          className={`bg-muted/20 h-10 text-xs border-border/50 ${formErrors.price ? 'border-red-500 border-2' : ''}`}
                        />
                        {formErrors.price && <p className="text-[9px] text-red-500 font-bold">{formErrors.price}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL Slug (e.g., ather-450x)</Label>
                        <Input
                          value={formData.slug || ''}
                          onChange={(e) => {
                            setFormData(prev => ({...prev, slug: e.target.value}));
                            setIsSlugManuallyEdited(true);
                          }}
                          placeholder="auto-generated from make + model" 
                          className="bg-muted/20 h-10 text-xs border-border/50"
                        />
                        <p className="text-[8px] text-muted-foreground">Leave empty to auto-generate from brand + model</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Year</Label>
                        <Select
                          value={String(formData.year)}
                          onValueChange={(val) => setFormData(prev => ({...prev, year: parseInt(val)}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEARS.map((year) => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Variant/Trim</Label>
                        <Input 
                          value={formData.trim}
                          onChange={(e) => setFormData(prev => ({...prev, trim: e.target.value}))}
                          placeholder="e.g., Grand Touring, Standard" className="bg-muted/20 h-10 text-xs border-border/50" 
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Short Description</Label>
                        <Input 
                          value={formData.shortDescription}
                          onChange={(e) => setFormData(prev => ({...prev, shortDescription: e.target.value}))}
                          placeholder="1-2 sentence hook for the listing page" className="bg-muted/20 h-10 text-xs border-border/50" 
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/30" />

                  {/* Section 2: Technical Specifications (Performance) */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 2. Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Top Speed</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Speed"
                            value={extractNumber(formData.topSpeed)}
                            onChange={(e) => setFormData(prev => ({...prev, topSpeed: e.target.value.trim() !== '' ? `${e.target.value.trim()} km/h` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            km/h
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified Range (ARAI)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Range"
                            value={extractNumber(formData.certifiedRange)}
                            onChange={(e) => setFormData(prev => ({...prev, certifiedRange: e.target.value.trim() !== '' ? `${e.target.value.trim()} km` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            km
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Real-World Range</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Range"
                            value={extractNumber(formData.realWorldRange)}
                            onChange={(e) => setFormData(prev => ({...prev, realWorldRange: e.target.value.trim() !== '' ? `${e.target.value.trim()} km` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            km
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Climbing Degree</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Degree"
                            value={extractNumber(formData.climbingDegree)}
                            onChange={(e) => setFormData(prev => ({...prev, climbingDegree: e.target.value.trim() !== '' ? `${e.target.value.trim()} Degrees` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            Deg
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Load Capacity</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Capacity"
                            value={extractNumber(formData.loadCapacity)}
                            onChange={(e) => setFormData(prev => ({...prev, loadCapacity: e.target.value.trim() !== '' ? `${e.target.value.trim()} kg` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            kg
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Riding Modes (Comma separated)</Label>
                        <Input 
                          value={ridingModesInput}
                          onChange={(e) => setRidingModesInput(e.target.value)}
                          onBlur={() => setFormData(prev => ({...prev, ridingModes: ridingModesInput.split(',').map(m => m.trim()).filter(Boolean)}))}
                          placeholder="Eco, City, Sport, Reverse" className="bg-muted/20 h-10 text-xs border-border/50" 
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/30" />

                  {/* Section 3: Battery & Charging */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 3. Battery & Charging
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Battery Type</Label>
                        <Select
                          value={formData.batteryType}
                          onValueChange={(val) => setFormData(prev => ({...prev, batteryType: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Battery Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lithium-ion (NMC)">Lithium-ion (NMC)</SelectItem>
                            <SelectItem value="LFP">LFP</SelectItem>
                            <SelectItem value="Lead Graphene">Lead Graphene</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Battery Capacity</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Capacity"
                            value={extractNumber(formData.batteryCapacity)}
                            onChange={(e) => setFormData(prev => ({...prev, batteryCapacity: e.target.value.trim() !== '' ? `${e.target.value.trim()} kWh` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            kWh
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charging Time (0-100%)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Time"
                            value={extractNumber(formData.chargingTime)}
                            onChange={(e) => setFormData(prev => ({...prev, chargingTime: e.target.value.trim() !== '' ? `${e.target.value.trim()} Hours` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            Hrs
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Battery Warranty</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Warranty"
                            value={extractNumber(formData.batteryWarranty)}
                            onChange={(e) => setFormData(prev => ({...prev, batteryWarranty: e.target.value.trim() !== '' ? `${e.target.value.trim()} Years` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            Yrs
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charger Details</Label>
                        <Input 
                          value={formData.chargerIncluded}
                          onChange={(e) => setFormData(prev => ({...prev, chargerIncluded: e.target.value}))}
                          placeholder="e.g. 5A Standard Charger (or type 'None')" 
                          className="bg-muted/20 h-10 text-xs border-border/50"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <Checkbox 
                          id="fast-charging" 
                          checked={formData.fastCharging}
                          onCheckedChange={(checked) => setFormData(prev => ({...prev, fastCharging: !!checked}))}
                        />
                        <Label htmlFor="fast-charging" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Fast Charging Support</Label>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/30" />

                  {/* Section 4: Hardware & Mechanicals */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 4. Hardware & Mechanicals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Motor Power</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Power"
                            value={extractNumber(formData.motorPower)}
                            onChange={(e) => setFormData(prev => ({...prev, motorPower: e.target.value.trim() !== '' ? `${e.target.value.trim()}W` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            W
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Braking System</Label>
                        <Select
                          value={formData.brakingSystem}
                          onValueChange={(val) => setFormData(prev => ({...prev, brakingSystem: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select System" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dual Disc">Dual Disc</SelectItem>
                            <SelectItem value="Front Disc/Rear Drum">Front Disc/Rear Drum</SelectItem>
                            <SelectItem value="Regenerative Braking">Regenerative Braking</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tyre Type</Label>
                        <Select
                          value={formData.tyreType}
                          onValueChange={(val) => setFormData(prev => ({...prev, tyreType: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Tyre Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tubeless">Tubeless</SelectItem>
                            <SelectItem value="Tube">Tube</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Wheel Type</Label>
                        <Select
                          value={formData.wheelType}
                          onValueChange={(val) => setFormData(prev => ({...prev, wheelType: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Wheel Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Alloy">Alloy</SelectItem>
                            <SelectItem value="Spoke">Spoke</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Wheel Size</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Size"
                            value={extractNumber(formData.wheelSize)}
                            onChange={(e) => setFormData(prev => ({...prev, wheelSize: e.target.value.trim() !== '' ? `${e.target.value.trim()} inch` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            inch
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ground Clearance</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Clearance"
                            value={extractNumber(formData.groundClearance)}
                            onChange={(e) => setFormData(prev => ({...prev, groundClearance: e.target.value.trim() !== '' ? `${e.target.value.trim()} mm` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            mm
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/30" />

                  {/* Section 5: Smart Features & Aesthetics */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 5. Smart Features & Aesthetics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Display Type</Label>
                        <Select
                          value={isPredefinedDisplay(formData.displayType) ? formData.displayType : "Other"}
                          onValueChange={(val) => setFormData(prev => ({...prev, displayType: val === "Other" ? "Other" : val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Display" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LED Digital">LED Digital</SelectItem>
                            <SelectItem value="TFT">TFT</SelectItem>
                            <SelectItem value="Touchscreen">Touchscreen</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {(!isPredefinedDisplay(formData.displayType) || formData.displayType === "Other") && (
                          <Input
                            value={formData.displayType === "Other" ? "" : formData.displayType}
                            onChange={(e) => setFormData(prev => ({...prev, displayType: e.target.value}))}
                            placeholder="Specify display type..."
                            className="bg-muted/20 h-10 text-xs border-border/50 mt-2"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Boot Space</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Boot"
                            value={extractNumber(formData.bootSpace)}
                            onChange={(e) => setFormData(prev => ({...prev, bootSpace: e.target.value.trim() !== '' ? `${e.target.value.trim()} L` : ''}))}
                            className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                            L
                          </span>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Colors (Comma separated)</Label>
                        <Input 
                          value={colorsInput}
                          onChange={(e) => setColorsInput(e.target.value)}
                          onBlur={() => setFormData(prev => ({...prev, colors: colorsInput.split(',').map(c => c.trim()).filter(Boolean)}))}
                          placeholder="Red, Blue, Grey" className="bg-muted/20 h-10 text-xs border-border/50" 
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Key Features (Comma separated)</Label>
                        <Input 
                          value={keyFeaturesInput}
                          onChange={(e) => setKeyFeaturesInput(e.target.value)}
                          onBlur={() => setFormData(prev => ({...prev, keyFeatures: keyFeaturesInput.split(',').map(f => f.trim()).filter(Boolean)}))}
                          placeholder="Anti-theft Alarm, USB Charging Port, DRL" className="bg-muted/20 h-10 text-xs border-border/50" 
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/30" />

                  {/* Section 6: Media & Assets */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" /> 6. Media & Assets
                    </h3>
                    <div className="space-y-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-[9px] text-muted-foreground italic">📸 <span className="font-semibold">Image Upload is Optional</span> - Leave empty to use high-quality placeholder images automatically</p>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gallery Images (Multiple) <span className="text-[8px] font-normal text-muted-foreground ml-2">Optional</span></Label>
                      <div className="flex flex-col gap-3">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              setSelectedFiles(Array.from(e.target.files));
                            }
                          }}
                          className="bg-muted/20 h-10 text-xs py-2 px-3 border-dashed border-primary/20" 
                        />
                        {selectedFiles.length > 0 && (
                          <div className="flex flex-col gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                            {selectedFiles.map((file, i) => (
                              <div key={`${file.name}-${i}`} className="flex items-center gap-2 bg-background/50 px-2 py-1 rounded border border-border/50">
                                <Badge variant={i === 0 ? "default" : "secondary"} className="h-5 px-2 text-[8px] font-black uppercase tracking-widest">
                                  {i === 0 ? 'Face' : `#${i + 1}`}
                                </Badge>
                                <span className="min-w-0 flex-1 text-[9px] font-bold truncate">{file.name}</span>
                                <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => moveSelectedFile(i, i - 1)} className="h-6 w-6">
                                  <ChevronLeft className="h-3 w-3" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" disabled={i === selectedFiles.length - 1} onClick={() => moveSelectedFile(i, i + 1)} className="h-6 w-6">
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => moveSelectedFile(i, 0)} disabled={i === 0} className="h-6 px-2 text-[8px] font-black uppercase tracking-widest">
                                  Face
                                </Button>
                                <button 
                                  type="button"
                                  onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-red-500 hover:bg-red-500 hover:text-white"
                                  aria-label="Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button 
                              type="button"
                              onClick={() => setSelectedFiles([])}
                              className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors ml-auto"
                            >
                              Clear All
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Technical Design Philosophy (Detailed)</Label>
                      <Textarea 
                        value={formData.designPhilosophy}
                        onChange={(e) => setFormData(prev => ({...prev, designPhilosophy: e.target.value}))}
                        placeholder="Describe the aesthetic and engineering philosophy..." className="bg-muted/20 h-32 text-xs border-border/50 resize-none" 
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="p-6 border-t border-border/30 bg-background/40 backdrop-blur-md">
                <Button variant="outline" onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedFiles([]);
                }} className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg">Discard</Button>
                <Button 
                  onClick={handleRegisterUnit} 
                  disabled={isUploading}
                  className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg min-w-[120px]"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {isUploading ? 'Saving...' : (selectedFiles.length > 0 ? 'Upload & Register' : 'Register')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="w-full space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Assets', value: isLoading ? '...' : String(totalAssets), icon: Package, trend: 'In Fleet' },
              { label: 'Active Models', value: isLoading ? '...' : `${new Set(vehicles.map(v => v.model)).size} Models`, icon: Zap, trend: 'Global' },
              { label: 'Total Value', value: isLoading ? '...' : formattedTotalValue, icon: BarChart3, trend: 'Estimated' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-card/40 backdrop-blur-xl border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-3.5 w-3.5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-headline font-black mb-1">{stat.value}</div>
                    <div className="text-[9px] font-bold text-primary">{stat.trend}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-xl font-bold">Fleet Catalogue</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">Manage specifications and fleet units.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                  <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                    <SelectTrigger className="h-9 text-[10px] font-black uppercase tracking-widest w-full sm:w-32 lg:w-40 bg-muted/20 border-border/50">
                      <SelectValue placeholder="Filter by Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={String(brand.id)} className="text-[10px] font-black uppercase tracking-widest">
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={variantFilter} onValueChange={setVariantFilter}>
                    <SelectTrigger className="h-9 text-[10px] font-black uppercase tracking-widest w-full sm:w-32 lg:w-40 bg-muted/20 border-border/50">
                      <SelectValue placeholder="Filter by Variants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Units</SelectItem>
                      <SelectItem value="with" className="text-[10px] font-black uppercase tracking-widest">With Variants</SelectItem>
                      <SelectItem value="without" className="text-[10px] font-black uppercase tracking-widest">No Variants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative flex-1 md:flex-none w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input 
                    placeholder="Search catalogue..." 
                    className="pl-9 h-9 text-xs w-full bg-muted/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Unit</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Category</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Performance</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Battery</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Price</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">View</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                          <Loader2 className="h-4 w-4 animate-spin" /> Synchronizing Fleet...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                        No units found in database.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((item) => (
                      <React.Fragment key={item.id}>
                        <TableRow className="border-border/50 hover:bg-primary/5 transition-colors">
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              {item.colorVariants && item.colorVariants.length > 0 ? (
                                <button 
                                  onClick={() => setExpandedParentIds(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                  className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors shrink-0"
                                >
                                  {expandedParentIds[item.id] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                              ) : (
                                <div className="w-6 h-6 shrink-0" />
                              )}
                              <div className="h-10 w-16 rounded-md bg-muted/20 overflow-hidden border border-border/50 shrink-0">
                                {getVehicleImages(item)[0] ? (
                                  <img 
                                    src={getImageUrl(getVehicleImages(item)[0])} 
                                    alt={item.model} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-bold leading-none mb-1">{item.make} {item.model}</p>
                                <p className="text-[8px] text-muted-foreground font-mono uppercase tracking-widest">{item.modelCode || item.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest py-0.5 px-2">
                              {item.category || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold">{item.topSpeed || 'N/A'}</p>
                              <p className="text-[8px] text-muted-foreground uppercase font-black">{item.certifiedRange || 'Range N/A'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-medium opacity-70">{item.batteryType || 'N/A'}</p>
                              <p className="text-[8px] text-muted-foreground font-bold">{item.batteryCapacity || 'N/A'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 font-headline font-bold text-sm">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)}
                          </TableCell>
                          <TableCell className="py-4">
                            <Link 
                              href={`/vehicles/${item.slug}`} 
                              target="_blank"
                              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-primary/10 text-primary transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-card/95 backdrop-blur-xl border-border/50" align="end">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest">Management</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/50" />
                                <DropdownMenuItem onClick={() => handleManageColorsClick(item)} className="text-[10px] font-black uppercase tracking-widest text-primary focus:bg-primary/10 focus:text-primary cursor-pointer font-bold">
                                  Manage Colors
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleManageVariantsClick(item)} className="text-[10px] font-black uppercase tracking-widest text-primary focus:bg-primary/10 focus:text-primary cursor-pointer font-bold">
                                  Manage Variants
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditClick(item)} className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/10 focus:text-primary cursor-pointer">
                                  Edit Asset
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteVehicle(item.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                                  Delete Asset
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        {expandedParentIds[item.id] && item.colorVariants && item.colorVariants.length > 0 && (
                          <TableRow className="bg-muted/10 border-b border-border/30 hover:bg-muted/10">
                            <TableCell colSpan={7} className="p-0 pl-16 pr-4 pb-4">
                              <div className="rounded-lg border border-border/30 bg-card/50 overflow-hidden my-2 shadow-inner">
                                <Table>
                                  <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-b border-border/20">
                                      <TableHead className="h-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground pl-4">Color Variant</TableHead>
                                      <TableHead className="h-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Slug</TableHead>
                                      <TableHead className="h-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Price Override</TableHead>
                                      <TableHead className="h-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Link</TableHead>
                                      <TableHead className="h-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right pr-4">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {item.colorVariants.map((child: any) => (
                                      <TableRow key={child.id} className="hover:bg-primary/5 border-b border-border/20 last:border-0">
                                        <TableCell className="py-2 pl-4">
                                          <div className="flex items-center gap-2">
                                            <div className="h-8 w-12 rounded bg-muted/20 overflow-hidden border border-border/50 shrink-0">
                                              {child.images?.[0] ? (
                                                <img 
                                                  src={getImageUrl(child.images[0])} 
                                                  alt={child.colors?.[0]} 
                                                  className="h-full w-full object-cover"
                                                />
                                              ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                  <ImageIcon className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                              )}
                                            </div>
                                            <div>
                                              <p className="text-[11px] font-bold">{child.colors?.[0] || 'Unnamed Color'}</p>
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-2 text-[10px] font-mono text-muted-foreground">
                                          {child.slug}
                                        </TableCell>
                                        <TableCell className="py-2 font-headline font-bold text-xs">
                                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(child.price)}
                                        </TableCell>
                                        <TableCell className="py-2">
                                          <Link 
                                            href={`/vehicles/${item.slug}?color=${encodeURIComponent(child.colors?.[0] || '')}`} 
                                            target="_blank"
                                            className="h-6 w-6 flex items-center justify-center rounded hover:bg-primary/10 text-primary transition-colors"
                                          >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                          </Link>
                                        </TableCell>
                                        <TableCell className="py-2 text-right pr-4">
                                          <div className="flex justify-end gap-1">
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                                              onClick={() => handleEditClick(child)}
                                              title="Edit Variant"
                                            >
                                              <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                              onClick={() => handleDeleteColorVariant(child.id)}
                                              title="Delete Variant"
                                            >
                                              <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </div>

      {/* Manage Colors Modal */}
      <Dialog open={isColorsModalOpen} onOpenChange={setIsColorsModalOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[900px] p-0 overflow-hidden text-foreground">
          <DialogHeader className="p-6 pb-2 border-b border-border/30">
            <DialogTitle className="font-headline text-2xl font-black">Manage Color Variants</DialogTitle>
            <DialogDescription className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Configure color-specific pricing, slugs, and image galleries for {selectedParentForColors?.make} {selectedParentForColors?.model}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/30 max-h-[70vh] overflow-y-auto">
            {/* Left: Current Color Variants List */}
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Active Variants ({selectedParentForColors?.colorVariants?.length || 0})
              </h3>
              
              {(!selectedParentForColors?.colorVariants || selectedParentForColors.colorVariants.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border/50 rounded-xl bg-muted/5">
                  <Package className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-xs font-bold text-muted-foreground">No color variants created yet.</p>
                  <p className="text-[10px] text-muted-foreground/70 max-w-[250px] mt-1">This vehicle will only display its base configuration until variants are added.</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {selectedParentForColors.colorVariants.map((child: any) => (
                      <div key={child.id} className="flex items-center gap-3 p-3 bg-muted/10 hover:bg-muted/20 border border-border/30 rounded-xl transition-all">
                        <div className="h-12 w-16 bg-muted/30 rounded-lg overflow-hidden border border-border/50 shrink-0">
                          {child.images?.[0] ? (
                            <img 
                              src={getImageUrl(child.images[0])} 
                              alt={child.colors?.[0]} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold leading-none mb-1">{child.colors?.[0] || 'Unnamed Color'}</p>
                          <p className="text-[9px] text-muted-foreground font-mono truncate">{child.slug}</p>
                          <p className="text-[11px] font-black text-primary font-headline mt-1">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(child.price)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => {
                              setIsColorsModalOpen(false);
                              handleEditClick(child);
                            }}
                            title="Edit Variant Specs"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteColorVariant(child.id)}
                            title="Delete Variant"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Right: Add Color Variant Form */}
            <form onSubmit={handleAddColorVariant} className="p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Add New Color Variant
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Color Name</Label>
                  <Input 
                    value={colorVariantForm.colorName}
                    onChange={(e) => {
                      const color = e.target.value;
                      const cleanSlug = color.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                      const parentSlug = selectedParentForColors?.slug || '';
                      setColorVariantForm(prev => ({
                        ...prev,
                        colorName: color,
                        slug: color ? `${parentSlug}-${cleanSlug}` : `${parentSlug}-`
                      }));
                    }}
                    placeholder="e.g. True Blue, Matte Black" 
                    className="bg-muted/20 h-9 text-xs border-border/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price Override (₹)</Label>
                  <Input 
                    type="number"
                    value={colorVariantForm.price}
                    onChange={(e) => setColorVariantForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder={selectedParentForColors ? `Inherited: ₹${selectedParentForColors.price}` : ''} 
                    className="bg-muted/20 h-9 text-xs border-border/50"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Variant URL Slug</Label>
                  <Input 
                    value={colorVariantForm.slug}
                    onChange={(e) => setColorVariantForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. model-slug-color-name" 
                    className="bg-muted/20 h-9 text-xs border-border/50 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Color-Specific Images (Multiple)</Label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setColorVariantFiles(Array.from(e.target.files));
                      }
                    }}
                    className="bg-muted/20 h-9 text-xs py-1.5 px-3 border-dashed border-primary/20" 
                  />
                  {colorVariantFiles.length > 0 && (
                    <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/10 space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground">
                        <span>Selected ({colorVariantFiles.length})</span>
                        <button type="button" onClick={() => setColorVariantFiles([])} className="hover:text-primary transition-colors">Clear</button>
                      </div>
                      <div className="max-h-[100px] overflow-y-auto space-y-1">
                        {colorVariantFiles.map((file, idx) => (
                          <div key={idx} className="text-[9px] font-bold truncate bg-background/50 px-2 py-1 rounded border border-border/30">
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full text-xs font-black uppercase tracking-widest h-9 mt-4 bg-primary hover:bg-primary/95 text-primary-foreground"
                disabled={isAddingColorVariant}
              >
                {isAddingColorVariant ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Creating Variant...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Add Variant
                  </>
                )}
              </Button>
            </form>
          </div>

          <DialogFooter className="p-4 border-t border-border/30 bg-muted/5">
            <Button 
              type="button" 
              variant="outline" 
              className="text-xs font-black uppercase tracking-widest h-9"
              onClick={() => setIsColorsModalOpen(false)}
            >
              Close Panel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        if (open) {
          setIsEditModalOpen(true);
        } else {
          closeEditModal();
          setColorsInput('');
        }
      }}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[850px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-headline text-2xl font-black">Edit Asset Configuration</DialogTitle>
            <DialogDescription className="text-[10px] uppercase tracking-widest">
              Modify technical specifications for unit: {editingVehicle?.id}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[75vh]">
            <div className="space-y-8 py-6 px-6">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" /> 1. Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manufacturer (Brand)</Label>
                    <Select
                      value={formData.make}
                      onValueChange={(brandName) => {
                        const selectedBrand = brands.find(b => b.name === brandName);
                        if (selectedBrand) {
                          setFormData(prev => ({ ...prev, make: selectedBrand.name, brandId: selectedBrand.id }));
                        }
                      }}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Model Name</Label>
                    <Input 
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({...prev, model: e.target.value}))}
                      placeholder="e.g., Dynamo LIMA" className="bg-muted/20 h-10 text-xs border-border/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Model Number/Code</Label>
                    <Input 
                      value={formData.modelCode}
                      onChange={(e) => setFormData(prev => ({...prev, modelCode: e.target.value}))}
                      placeholder="e.g., LIMA-2026" className="bg-muted/20 h-10 text-xs border-border/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData(prev => ({...prev, category: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ADMIN_VEHICLE_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ex-Showroom Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({...prev, price: parseInt(e.target.value) || 0}))}
                      placeholder="0" className="bg-muted/20 h-10 text-xs border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL Slug</Label>
                    <Input 
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData(prev => ({...prev, slug: e.target.value}));
                        setIsSlugManuallyEdited(true);
                      }}
                      placeholder="e.g., ather-450x" 
                      className="bg-muted/20 h-10 text-xs border-border/50" 
                    />
                    <p className="text-[8px] text-muted-foreground">SEO-friendly URL (auto-generated from brand + model if empty)</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Year</Label>
                    <Input 
                      type="number" 
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({...prev, year: parseInt(e.target.value) || 2026}))}
                      className="bg-muted/20 h-10 text-xs border-border/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Variant/Trim</Label>
                    <Input 
                      value={formData.trim}
                      onChange={(e) => setFormData(prev => ({...prev, trim: e.target.value}))}
                      placeholder="e.g., Grand Touring, Standard" className="bg-muted/20 h-10 text-xs border-border/50" 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Short Description</Label>
                    <Input 
                      value={formData.shortDescription}
                      onChange={(e) => setFormData(prev => ({...prev, shortDescription: e.target.value}))}
                      placeholder="1-2 sentence hook for the listing page" className="bg-muted/20 h-10 text-xs border-border/50" 
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Section 2: Technical Specifications */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" /> 2. Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Top Speed</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Speed"
                        value={extractNumber(formData.topSpeed)}
                        onChange={(e) => setFormData(prev => ({...prev, topSpeed: e.target.value.trim() !== '' ? `${e.target.value.trim()} km/h` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        km/h
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified Range (ARAI)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Range"
                        value={extractNumber(formData.certifiedRange)}
                        onChange={(e) => setFormData(prev => ({...prev, certifiedRange: e.target.value.trim() !== '' ? `${e.target.value.trim()} km` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        km
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Real-World Range</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Range"
                        value={extractNumber(formData.realWorldRange)}
                        onChange={(e) => setFormData(prev => ({...prev, realWorldRange: e.target.value.trim() !== '' ? `${e.target.value.trim()} km` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        km
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Climbing Degree</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Degree"
                        value={extractNumber(formData.climbingDegree)}
                        onChange={(e) => setFormData(prev => ({...prev, climbingDegree: e.target.value.trim() !== '' ? `${e.target.value.trim()} Degrees` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        Deg
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Load Capacity</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Capacity"
                        value={extractNumber(formData.loadCapacity)}
                        onChange={(e) => setFormData(prev => ({...prev, loadCapacity: e.target.value.trim() !== '' ? `${e.target.value.trim()} kg` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        kg
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Riding Modes (Comma separated)</Label>
                    <Input 
                      value={ridingModesInput}
                      onChange={(e) => setRidingModesInput(e.target.value)}
                      onBlur={() => setFormData(prev => ({...prev, ridingModes: ridingModesInput.split(',').map(m => m.trim()).filter(Boolean)}))}
                      placeholder="Eco, City, Sport, Reverse" className="bg-muted/20 h-10 text-xs border-border/50" 
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Section 3: Battery & Charging */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" /> 3. Battery & Charging
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Battery Type</Label>
                    <Select
                      value={formData.batteryType}
                      onValueChange={(val) => setFormData(prev => ({...prev, batteryType: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Battery Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lithium-ion (NMC)">Lithium-ion (NMC)</SelectItem>
                        <SelectItem value="LFP">LFP</SelectItem>
                        <SelectItem value="Lead Graphene">Lead Graphene</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Battery Capacity</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Capacity"
                        value={extractNumber(formData.batteryCapacity)}
                        onChange={(e) => setFormData(prev => ({...prev, batteryCapacity: e.target.value.trim() !== '' ? `${e.target.value.trim()} kWh` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        kWh
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charging Time (0-100%)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Time"
                        value={extractNumber(formData.chargingTime)}
                        onChange={(e) => setFormData(prev => ({...prev, chargingTime: e.target.value.trim() !== '' ? `${e.target.value.trim()} Hours` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        Hrs
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Battery Warranty</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Warranty"
                        value={extractNumber(formData.batteryWarranty)}
                        onChange={(e) => setFormData(prev => ({...prev, batteryWarranty: e.target.value.trim() !== '' ? `${e.target.value.trim()} Years` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        Yrs
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charger Details</Label>
                    <Input 
                      value={formData.chargerIncluded}
                      onChange={(e) => setFormData(prev => ({...prev, chargerIncluded: e.target.value}))}
                      placeholder="e.g. 5A Standard Charger (or type 'None')" 
                      className="bg-muted/20 h-10 text-xs border-border/50"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox 
                      id="edit-fast-charging" 
                      checked={formData.fastCharging}
                      onCheckedChange={(checked) => setFormData(prev => ({...prev, fastCharging: !!checked}))}
                    />
                    <Label htmlFor="edit-fast-charging" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Fast Charging Support</Label>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Section 4: Hardware & Mechanicals */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" /> 4. Hardware & Mechanicals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Motor Power</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Power"
                        value={extractNumber(formData.motorPower)}
                        onChange={(e) => setFormData(prev => ({...prev, motorPower: e.target.value.trim() !== '' ? `${e.target.value.trim()}W` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        W
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Braking System</Label>
                    <Select
                      value={formData.brakingSystem}
                      onValueChange={(val) => setFormData(prev => ({...prev, brakingSystem: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select System" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dual Disc">Dual Disc</SelectItem>
                        <SelectItem value="Front Disc/Rear Drum">Front Disc/Rear Drum</SelectItem>
                        <SelectItem value="Regenerative Braking">Regenerative Braking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tyre Type</Label>
                    <Select
                      value={formData.tyreType}
                      onValueChange={(val) => setFormData(prev => ({...prev, tyreType: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Tyre Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tubeless">Tubeless</SelectItem>
                        <SelectItem value="Tube">Tube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Wheel Type</Label>
                    <Select
                      value={formData.wheelType}
                      onValueChange={(val) => setFormData(prev => ({...prev, wheelType: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Wheel Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alloy">Alloy</SelectItem>
                        <SelectItem value="Spoke">Spoke</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Wheel Size</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Size"
                        value={extractNumber(formData.wheelSize)}
                        onChange={(e) => setFormData(prev => ({...prev, wheelSize: e.target.value.trim() !== '' ? `${e.target.value.trim()} inch` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        inch
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ground Clearance</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Clearance"
                        value={extractNumber(formData.groundClearance)}
                        onChange={(e) => setFormData(prev => ({...prev, groundClearance: e.target.value.trim() !== '' ? `${e.target.value.trim()} mm` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        mm
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Section 5: Smart Features & Aesthetics */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" /> 5. Smart Features & Aesthetics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Display Type</Label>
                    <Select
                      value={isPredefinedDisplay(formData.displayType) ? formData.displayType : "Other"}
                      onValueChange={(val) => setFormData(prev => ({...prev, displayType: val === "Other" ? "Other" : val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Display" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LED Digital">LED Digital</SelectItem>
                        <SelectItem value="TFT">TFT</SelectItem>
                        <SelectItem value="Touchscreen">Touchscreen</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {(!isPredefinedDisplay(formData.displayType) || formData.displayType === "Other") && (
                      <Input
                        value={formData.displayType === "Other" ? "" : formData.displayType}
                        onChange={(e) => setFormData(prev => ({...prev, displayType: e.target.value}))}
                        placeholder="Specify display type..."
                        className="bg-muted/20 h-10 text-xs border-border/50 mt-2"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Boot Space</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Boot"
                        value={extractNumber(formData.bootSpace)}
                        onChange={(e) => setFormData(prev => ({...prev, bootSpace: e.target.value.trim() !== '' ? `${e.target.value.trim()} L` : ''}))}
                        className="bg-muted/20 h-10 text-xs border-border/50 flex-1"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/25 px-3 rounded-md border border-border/50 h-10 flex items-center justify-center min-w-[70px] whitespace-nowrap">
                        L
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Colors (Comma separated)</Label>
                    <Input 
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      onBlur={() => setFormData(prev => ({...prev, colors: colorsInput.split(',').map(c => c.trim()).filter(Boolean)}))}
                      placeholder="Red, Blue, Grey" className="bg-muted/20 h-10 text-xs border-border/50" 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Key Features (Comma separated)</Label>
                    <Input 
                      value={keyFeaturesInput}
                      onChange={(e) => setKeyFeaturesInput(e.target.value)}
                      onBlur={() => setFormData(prev => ({...prev, keyFeatures: keyFeaturesInput.split(',').map(f => f.trim()).filter(Boolean)}))}
                      placeholder="Anti-theft Alarm, USB Charging Port, DRL" className="bg-muted/20 h-10 text-xs border-border/50" 
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Section 6: Media & Assets */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" /> 6. Media & Assets
                </h3>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Update Images (Optional)</Label>
                  <div className="flex flex-col gap-3">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          addEditGalleryFiles(Array.from(e.target.files));
                          e.target.value = '';
                        }
                      }}
                      className="bg-muted/20 h-10 text-xs py-2 px-3 border-dashed border-primary/20" 
                    />
                    {editGalleryItems.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {editGalleryItems.map((item, index) => (
                          <div key={item.id} className="relative overflow-hidden rounded-lg border border-border/50 bg-muted/10">
                            <div className="relative aspect-[4/3] bg-muted/20">
                              <img
                                src={getImageUrl(item.previewUrl)}
                                alt={`${formData.model || 'Vehicle'} image ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                              {index === 0 && (
                                <Badge className="absolute left-2 top-2 h-5 px-2 text-[8px] font-black uppercase tracking-widest">
                                  Face
                                </Badge>
                              )}
                              {item.type === 'file' && (
                                <Badge variant="secondary" className="absolute bottom-2 left-2 h-5 px-2 text-[8px] font-black uppercase tracking-widest">
                                  New
                                </Badge>
                              )}
                              <button
                                type="button"
                                onClick={() => removeEditGalleryItem(item.id)}
                                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-red-500 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
                                aria-label="Remove image"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-1 p-2">
                              <Button type="button" variant="ghost" size="icon" disabled={index === 0} onClick={() => moveEditGalleryItem(index, index - 1)} className="h-7 w-7">
                                <ChevronLeft className="h-3.5 w-3.5" />
                              </Button>
                              <Button type="button" variant="ghost" size="icon" disabled={index === editGalleryItems.length - 1} onClick={() => moveEditGalleryItem(index, index + 1)} className="h-7 w-7">
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant={index === 0 ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => makeEditGalleryFaceImage(item.id)}
                                disabled={index === 0}
                                className="h-7 rounded-md px-2 text-[8px] font-black uppercase tracking-widest"
                              >
                                {index === 0 ? (
                                  <>
                                    <Check className="mr-1 h-3 w-3" /> Face
                                  </>
                                ) : (
                                  'Make Face'
                                )}
                              </Button>
                              <span className="text-[9px] font-black text-muted-foreground">#{index + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">No images selected for this vehicle</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Technical Design Philosophy (Detailed)</Label>
                  <Textarea 
                    value={formData.designPhilosophy}
                    onChange={(e) => setFormData(prev => ({...prev, designPhilosophy: e.target.value}))}
                    placeholder="Describe the aesthetic and engineering philosophy..." className="bg-muted/20 h-32 text-xs border-border/50 resize-none" 
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 border-t border-border/30 bg-background/40 backdrop-blur-md">
            <Button variant="outline" onClick={closeEditModal} className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg">Cancel</Button>
            <Button 
              onClick={handleUpdateUnit} 
              disabled={isUploading}
              className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg min-w-[120px]"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isUploading ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50 max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl font-bold">Delete Asset?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to remove this unit from the fleet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-center gap-4 sm:justify-center pt-4">
            <AlertDialogCancel className="h-12 w-12 rounded-full border-border/50 hover:bg-muted p-0 flex items-center justify-center transition-all hover:scale-105">
              <X className="h-5 w-5 text-muted-foreground" />
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={isUploading}
              className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white border-none p-0 flex items-center justify-center transition-all hover:scale-110"
              >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
