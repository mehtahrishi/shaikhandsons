"use client"

import React from 'react';
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
  ChevronUp
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
import { 
  fetchBrands, 
  createBrand, 
  updateBrand, 
  deleteBrand, 
  createVehicle, 
  uploadVehicleImages, 
  updateVehicleAPI, 
  deleteVehicleAPI,
  bulkUpdateVehicles,
  generatePlaceholderImages 
} from '@/lib/admin-inventory-service';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Mail, FileText } from 'lucide-react';

type Vehicle = {
  id: string;
  brandId: number;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  images: string[];
  designPhilosophy: string;
  createdAt: string;
  
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

type BrandData = {
  id: number;
  name: string;
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

const createEmptyBulkVehicle = (): BulkVehicleForm => ({
  brandId: 0,
  make: '',
  model: '',
  year: 2026,
  trim: '',
  price: 0,
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

export default function AdminInventoryPage() {
  const { toast } = useToast();
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
  const [bulkVehicles, setBulkVehicles] = React.useState<BulkVehicleForm[]>([createEmptyBulkVehicle()]);
  const [editingVehicle, setEditingVehicle] = React.useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = React.useState<string | null>(null);

  // Brands State
  const [brands, setBrands] = React.useState<BrandData[]>([]);
  const [isBrandsLoading, setIsBrandsLoading] = React.useState(false);
  const [newBrandName, setNewBrandName] = React.useState('');
  const [editingBrand, setEditingBrand] = React.useState<BrandData | null>(null);
  const [isBrandActionLoading, setIsBrandActionLoading] = React.useState(false);

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

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    try {
      setIsBrandActionLoading(true);
      await createBrand(newBrandName);
      setNewBrandName('');
      fetchAllBrands();
      toast({ title: "Success", description: "Brand added successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsBrandActionLoading(false);
    }
  };

  const handleUpdateBrand = async () => {
    if (!editingBrand || !editingBrand.name.trim()) return;
    try {
      setIsBrandActionLoading(true);
      await updateBrand(String(editingBrand.id), editingBrand.name);
      setEditingBrand(null);
      fetchAllBrands();
      toast({ title: "Success", description: "Brand updated successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsBrandActionLoading(false);
    }
  };

  const handleDeleteBrand = async (id: number) => {
    try {
      setIsBrandActionLoading(true);
      await deleteBrand(String(id));
      fetchAllBrands();
      toast({ title: "Success", description: "Brand deleted successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsBrandActionLoading(false);
    }
  };

  const fetchVehicles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/inventory');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch vehicles.');
      }
      setVehicles(data.vehicles || []);
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
    const term = search.trim().toLowerCase();
    if (!term) return vehicles;
    return vehicles.filter(v => 
      v.make.toLowerCase().includes(term) || 
      v.model.toLowerCase().includes(term) ||
      v.trim.toLowerCase().includes(term) ||
      v.id.toLowerCase().includes(term)
    );
  }, [search, vehicles]);

  const totalAssets = vehicles.length;
  const totalValue = vehicles.reduce((sum, v) => sum + v.price, 0);
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
      
      // 1. Upload Images to Storage or use placeholders
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadVehicleImages(selectedFiles);
      } else {
        // Generate placeholder images
        const placeholders = [
          `https://picsum.photos/seed/${formData.make}-${formData.model}-1/400/300`,
          `https://picsum.photos/seed/${formData.make}-${formData.model}-2/400/300`,
          `https://picsum.photos/seed/${formData.make}-${formData.model}-3/400/300`,
        ];
        imageUrls = placeholders;
      }
      
      // 2. Save Data to Database
      await createVehicle({
        brandId: formData.brandId,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        trim: formData.trim,
        price: formData.price,
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
      setFormData({
        brandId: 0,
        make: '',
        model: '',
        year: 2026,
        trim: '',
        price: 0,
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
    setFormData({
      brandId: vehicle.brandId || 0,
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || 2026,
      trim: vehicle.trim || '',
      price: vehicle.price || 0,
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
    setIsEditModalOpen(true);
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
      
      let imageUrls = editingVehicle.images;
      if (selectedFiles.length > 0) {
        // Upload new images if selected
        imageUrls = await uploadVehicleImages(selectedFiles);
      }
      
      await updateVehicleAPI(editingVehicle.id, {
        brandId: formData.brandId,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        trim: formData.trim,
        price: formData.price,
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
      prev.map((entry, idx) => (idx === index ? { ...entry, [field]: value } : entry))
    );
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
            Inventory
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl uppercase tracking-widest font-bold">
            Hardware management and fleet distribution.
          </p>
        </motion.div>
        
        <div className="flex w-full sm:w-auto items-center gap-2 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-2 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.7)]">
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
                                    <SelectItem value="Scooter">Scooter</SelectItem>
                                    <SelectItem value="Bike">Bike</SelectItem>
                                    <SelectItem value="Loader">Loader</SelectItem>
                                  </SelectContent>
                                </Select>
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
                                <Select value={entry.topSpeed} onValueChange={(val) => updateBulkVehicle(idx, 'topSpeed', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Speed" />
                                  </SelectTrigger>
                                  <SelectContent>{TOP_SPEEDS.map((speed) => (<SelectItem key={speed} value={speed}>{speed}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Certified Range</Label>
                                <Select value={entry.certifiedRange} onValueChange={(val) => updateBulkVehicle(idx, 'certifiedRange', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Range" />
                                  </SelectTrigger>
                                  <SelectContent>{RANGES.map((range) => (<SelectItem key={range} value={range}>{range}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Real-World Range</Label>
                                <Select value={entry.realWorldRange} onValueChange={(val) => updateBulkVehicle(idx, 'realWorldRange', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Range" />
                                  </SelectTrigger>
                                  <SelectContent>{RANGES.map((range) => (<SelectItem key={range} value={range}>{range}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Climbing Degree</Label>
                                <Select value={entry.climbingDegree} onValueChange={(val) => updateBulkVehicle(idx, 'climbingDegree', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Degree" />
                                  </SelectTrigger>
                                  <SelectContent>{CLIMBING_DEGREES.map((degree) => (<SelectItem key={degree} value={degree}>{degree}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Load Capacity</Label>
                                <Select value={entry.loadCapacity} onValueChange={(val) => updateBulkVehicle(idx, 'loadCapacity', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Capacity" />
                                  </SelectTrigger>
                                  <SelectContent>{LOAD_CAPACITIES.map((capacity) => (<SelectItem key={capacity} value={capacity}>{capacity}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="md:col-span-3 space-y-2">
                              <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Riding Modes</Label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['Eco', 'City', 'Sport', 'Reverse'].map((mode) => (
                                  <div key={mode} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`bulk-mode-${idx}-${mode}`}
                                      checked={entry.ridingModes.includes(mode)}
                                      onCheckedChange={(checked) => {
                                        const updatedModes = checked
                                          ? [...entry.ridingModes, mode]
                                          : entry.ridingModes.filter(m => m !== mode);
                                        updateBulkVehicle(idx, 'ridingModes', updatedModes);
                                      }}
                                    />
                                    <Label htmlFor={`bulk-mode-${idx}-${mode}`} className="text-[8px] font-black uppercase cursor-pointer">{mode}</Label>
                                  </div>
                                ))}
                              </div>
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
                                <Select value={entry.batteryCapacity} onValueChange={(val) => updateBulkVehicle(idx, 'batteryCapacity', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Capacity" />
                                  </SelectTrigger>
                                  <SelectContent>{BATTERY_CAPACITIES.map((capacity) => (<SelectItem key={capacity} value={capacity}>{capacity}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Charging Time</Label>
                                <Select value={entry.chargingTime} onValueChange={(val) => updateBulkVehicle(idx, 'chargingTime', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Time" />
                                  </SelectTrigger>
                                  <SelectContent>{CHARGING_TIMES.map((time) => (<SelectItem key={time} value={time}>{time}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Battery Warranty</Label>
                                <Select value={entry.batteryWarranty} onValueChange={(val) => updateBulkVehicle(idx, 'batteryWarranty', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Warranty" />
                                  </SelectTrigger>
                                  <SelectContent>{BATTERY_WARRANTIES.map((warranty) => (<SelectItem key={warranty} value={warranty}>{warranty}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Charger Details</Label>
                                <Select value={entry.chargerIncluded} onValueChange={(val) => updateBulkVehicle(idx, 'chargerIncluded', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Charger" />
                                  </SelectTrigger>
                                  <SelectContent>{CHARGER_OPTIONS.map((charger) => (<SelectItem key={charger} value={charger}>{charger}</SelectItem>))}</SelectContent>
                                </Select>
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
                                <Select value={entry.motorPower} onValueChange={(val) => updateBulkVehicle(idx, 'motorPower', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Power" />
                                  </SelectTrigger>
                                  <SelectContent>{MOTOR_POWERS.map((power) => (<SelectItem key={power} value={power}>{power}</SelectItem>))}</SelectContent>
                                </Select>
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
                                <Select value={entry.wheelSize} onValueChange={(val) => updateBulkVehicle(idx, 'wheelSize', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Size" />
                                  </SelectTrigger>
                                  <SelectContent>{WHEEL_SIZES.map((size) => (<SelectItem key={size} value={size}>{size}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Ground Clearance</Label>
                                <Select value={entry.groundClearance} onValueChange={(val) => updateBulkVehicle(idx, 'groundClearance', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Clearance" />
                                  </SelectTrigger>
                                  <SelectContent>{GROUND_CLEARANCES.map((clearance) => (<SelectItem key={clearance} value={clearance}>{clearance}</SelectItem>))}</SelectContent>
                                </Select>
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
                                <Select value={entry.displayType} onValueChange={(val) => updateBulkVehicle(idx, 'displayType', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Display" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="LED Digital">LED Digital</SelectItem>
                                    <SelectItem value="TFT">TFT</SelectItem>
                                    <SelectItem value="Touchscreen">Touchscreen</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Boot Space</Label>
                                <Select value={entry.bootSpace} onValueChange={(val) => updateBulkVehicle(idx, 'bootSpace', val)}>
                                  <SelectTrigger className="h-8 text-[9px] bg-muted/20">
                                    <SelectValue placeholder="Boot" />
                                  </SelectTrigger>
                                  <SelectContent>{BOOT_SPACES.map((space) => (<SelectItem key={space} value={space}>{space}</SelectItem>))}</SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-2 space-y-1">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Available Colors</Label>
                                <Input placeholder="Red, Blue, Grey" className="h-8 text-[9px] bg-muted/20" value={entry.colors.join(', ')} onChange={(e) => updateBulkVehicle(idx, 'colors', e.target.value.split(',').map(c => c.trim()).filter(Boolean))} />
                              </div>
                            </div>
                            <div className="md:col-span-2 space-y-2 pt-2">
                              <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Key Features</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {['Anti-theft Alarm', 'USB Charging Port', 'Keyless Entry', 'Find My Scooter', 'Projector Headlight', 'DRL'].map((feature) => (
                                  <div key={feature} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`bulk-feature-${idx}-${feature}`}
                                      checked={entry.keyFeatures.includes(feature)}
                                      onCheckedChange={(checked) => {
                                        const updatedFeatures = checked
                                          ? [...entry.keyFeatures, feature]
                                          : entry.keyFeatures.filter(f => f !== feature);
                                        updateBulkVehicle(idx, 'keyFeatures', updatedFeatures);
                                      }}
                                    />
                                    <Label htmlFor={`bulk-feature-${idx}-${feature}`} className="text-[8px] font-black uppercase cursor-pointer">{feature}</Label>
                                  </div>
                                ))}
                              </div>
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
            if (!open) setColorsInput('');
          }}>
            <DialogTrigger asChild>
              <Button className="h-12 flex-1 sm:flex-none px-4 sm:px-8 font-black uppercase tracking-[0.16em] text-[10px] rounded-xl shadow-[0_10px_24px_-12px_hsl(var(--primary))] hover:shadow-[0_14px_30px_-14px_hsl(var(--primary))] transition-all">
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
                            <SelectItem value="Scooter">Scooter</SelectItem>
                            <SelectItem value="Bike">Bike</SelectItem>
                            <SelectItem value="Loader">Loader</SelectItem>
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
                        <Select
                          value={formData.topSpeed}
                          onValueChange={(val) => setFormData(prev => ({...prev, topSpeed: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Speed" />
                          </SelectTrigger>
                          <SelectContent>
                            {TOP_SPEEDS.map((speed) => (
                              <SelectItem key={speed} value={speed}>{speed}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified Range (ARAI)</Label>
                        <Select
                          value={formData.certifiedRange}
                          onValueChange={(val) => setFormData(prev => ({...prev, certifiedRange: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Range" />
                          </SelectTrigger>
                          <SelectContent>
                            {RANGES.map((range) => (
                              <SelectItem key={range} value={range}>{range}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Real-World Range</Label>
                        <Select
                          value={formData.realWorldRange}
                          onValueChange={(val) => setFormData(prev => ({...prev, realWorldRange: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Range" />
                          </SelectTrigger>
                          <SelectContent>
                            {RANGES.map((range) => (
                              <SelectItem key={range} value={range}>{range}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Climbing Degree</Label>
                        <Select
                          value={formData.climbingDegree}
                          onValueChange={(val) => setFormData(prev => ({...prev, climbingDegree: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Degree" />
                          </SelectTrigger>
                          <SelectContent>
                            {CLIMBING_DEGREES.map((degree) => (
                              <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Load Capacity</Label>
                        <Select
                          value={formData.loadCapacity}
                          onValueChange={(val) => setFormData(prev => ({...prev, loadCapacity: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Capacity" />
                          </SelectTrigger>
                          <SelectContent>
                            {LOAD_CAPACITIES.map((capacity) => (
                              <SelectItem key={capacity} value={capacity}>{capacity}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Riding Modes</Label>
                        <div className="flex flex-wrap gap-4">
                          {['Eco', 'City', 'Sport', 'Reverse'].map((mode) => (
                            <div key={mode} className="flex items-center space-x-2 bg-muted/10 p-2 rounded-lg border border-border/50">
                              <Checkbox 
                                id={`mode-${mode}`} 
                                checked={formData.ridingModes.includes(mode)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData(prev => ({...prev, ridingModes: [...prev.ridingModes, mode]}));
                                  } else {
                                    setFormData(prev => ({...prev, ridingModes: prev.ridingModes.filter(m => m !== mode)}));
                                  }
                                }}
                              />
                              <Label htmlFor={`mode-${mode}`} className="text-[10px] font-bold uppercase cursor-pointer">{mode}</Label>
                            </div>
                          ))}
                        </div>
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
                        <Select
                          value={formData.batteryCapacity}
                          onValueChange={(val) => setFormData(prev => ({...prev, batteryCapacity: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Capacity" />
                          </SelectTrigger>
                          <SelectContent>
                            {BATTERY_CAPACITIES.map((cap) => (
                              <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charging Time (0-100%)</Label>
                        <Select
                          value={formData.chargingTime}
                          onValueChange={(val) => setFormData(prev => ({...prev, chargingTime: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {CHARGING_TIMES.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Battery Warranty</Label>
                        <Select
                          value={formData.batteryWarranty}
                          onValueChange={(val) => setFormData(prev => ({...prev, batteryWarranty: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Warranty" />
                          </SelectTrigger>
                          <SelectContent>
                            {BATTERY_WARRANTIES.map((warranty) => (
                              <SelectItem key={warranty} value={warranty}>{warranty}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charger Details</Label>
                        <Select
                          value={formData.chargerIncluded}
                          onValueChange={(val) => setFormData(prev => ({...prev, chargerIncluded: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Charger" />
                          </SelectTrigger>
                          <SelectContent>
                            {CHARGER_OPTIONS.map((charger) => (
                              <SelectItem key={charger} value={charger}>{charger}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          value={formData.motorPower}
                          onValueChange={(val) => setFormData(prev => ({...prev, motorPower: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Power" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOTOR_POWERS.map((power) => (
                              <SelectItem key={power} value={power}>{power}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          value={formData.wheelSize}
                          onValueChange={(val) => setFormData(prev => ({...prev, wheelSize: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {WHEEL_SIZES.map((size) => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ground Clearance</Label>
                        <Select
                          value={formData.groundClearance}
                          onValueChange={(val) => setFormData(prev => ({...prev, groundClearance: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Clearance" />
                          </SelectTrigger>
                          <SelectContent>
                            {GROUND_CLEARANCES.map((clearance) => (
                              <SelectItem key={clearance} value={clearance}>{clearance}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          value={formData.displayType}
                          onValueChange={(val) => setFormData(prev => ({...prev, displayType: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Display" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LED Digital">LED Digital</SelectItem>
                            <SelectItem value="TFT">TFT</SelectItem>
                            <SelectItem value="Touchscreen">Touchscreen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Boot Space</Label>
                        <Select
                          value={formData.bootSpace}
                          onValueChange={(val) => setFormData(prev => ({...prev, bootSpace: val}))}
                        >
                          <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                            <SelectValue placeholder="Select Boot Space" />
                          </SelectTrigger>
                          <SelectContent>
                            {BOOT_SPACES.map((space) => (
                              <SelectItem key={space} value={space}>{space}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <div className="col-span-1 md:col-span-2 space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Key Features</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['Anti-theft Alarm', 'USB Charging Port', 'Keyless Entry', 'Find My Scooter', 'Projector Headlight', 'DRL'].map((feat) => (
                            <div key={feat} className="flex items-center space-x-2 bg-muted/10 p-2 rounded-lg border border-border/50">
                              <Checkbox 
                                id={`feat-${feat}`} 
                                checked={formData.keyFeatures.includes(feat)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData(prev => ({...prev, keyFeatures: [...prev.keyFeatures, feat]}));
                                  } else {
                                    setFormData(prev => ({...prev, keyFeatures: prev.keyFeatures.filter(f => f !== feat)}));
                                  }
                                }}
                              />
                              <Label htmlFor={`feat-${feat}`} className="text-[10px] font-bold uppercase cursor-pointer">{feat}</Label>
                            </div>
                          ))}
                        </div>
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
                          <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                            {selectedFiles.map((file, i) => (
                              <div key={i} className="flex items-center gap-2 bg-background/50 px-2 py-1 rounded border border-border/50">
                                <span className="text-[9px] font-bold truncate max-w-[100px]">{file.name}</span>
                                <button 
                                  type="button"
                                  onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                  className="text-red-500 hover:text-red-700 font-black text-[10px]"
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
                  {isUploading ? 'Saving...' : (selectedFiles.length > 0 ? 'Upload & Register' : 'Register with Placeholders')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="bg-card/40 backdrop-blur-xl border border-border/50 p-1 mb-6">
          <TabsTrigger value="inventory" className="text-[10px] font-black uppercase tracking-widest px-8">Fleet Inventory</TabsTrigger>
          <TabsTrigger value="brands" className="text-[10px] font-black uppercase tracking-widest px-8">Brand Management</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
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
                <CardDescription className="text-[10px] uppercase tracking-widest">Manage specifications and stock.</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input 
                  placeholder="Search inventory..." 
                  className="pl-9 h-9 text-xs w-64 bg-muted/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
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
                      <TableRow key={item.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 rounded-md bg-muted/20 overflow-hidden border border-border/50 shrink-0">
                              {item.images && item.images[0] ? (
                                <img 
                                  src={item.images[0]} 
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="font-headline text-xl font-bold">Add Brand</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">Create a new manufacturer brand.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Brand Name</Label>
                  <Input 
                    placeholder="Enter brand name..." 
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="bg-muted/20 h-10 text-xs"
                  />
                </div>
                <Button 
                  onClick={handleAddBrand}
                  disabled={isBrandActionLoading || !newBrandName.trim()}
                  className="w-full h-10 font-black uppercase tracking-widest text-[10px] rounded-lg"
                >
                  {isBrandActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Add Brand
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="font-headline text-xl font-bold">Brand List</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">Manage existing brands.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isBrandsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : brands.length === 0 ? (
                    <p className="text-center text-muted-foreground text-[10px] font-bold uppercase py-8">No brands found.</p>
                  ) : (
                    brands.map((brand) => (
                      <div key={brand.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
                        {editingBrand?.id === brand.id ? (
                          <div className="flex items-center gap-2 flex-1 mr-2">
                            <Input 
                              value={editingBrand.name}
                              onChange={(e) => setEditingBrand({...editingBrand, name: e.target.value})}
                              className="h-8 text-xs bg-background"
                            />
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={handleUpdateBrand}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => setEditingBrand(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs font-bold uppercase tracking-widest">{brand.name}</span>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10" onClick={() => setEditingBrand(brand)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500" onClick={() => handleDeleteBrand(brand.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open);
        if (!open) setColorsInput('');
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
                        <SelectItem value="Scooter">Scooter</SelectItem>
                        <SelectItem value="Bike">Bike</SelectItem>
                        <SelectItem value="Loader">Loader</SelectItem>
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Year</Label>
                    <Input 
                      type="number" 
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({...prev, year: parseInt(e.target.value) || 2026}))}
                      className="bg-muted/20 h-10 text-xs border-border/50" 
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
                    <Select
                      value={formData.topSpeed}
                      onValueChange={(val) => setFormData(prev => ({...prev, topSpeed: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Speed" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOP_SPEEDS.map((speed) => (
                          <SelectItem key={speed} value={speed}>{speed}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified Range (ARAI)</Label>
                    <Select
                      value={formData.certifiedRange}
                      onValueChange={(val) => setFormData(prev => ({...prev, certifiedRange: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Range" />
                      </SelectTrigger>
                      <SelectContent>
                        {RANGES.map((range) => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Real-World Range</Label>
                    <Select
                      value={formData.realWorldRange}
                      onValueChange={(val) => setFormData(prev => ({...prev, realWorldRange: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Range" />
                      </SelectTrigger>
                      <SelectContent>
                        {RANGES.map((range) => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Climbing Degree</Label>
                    <Select
                      value={formData.climbingDegree}
                      onValueChange={(val) => setFormData(prev => ({...prev, climbingDegree: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLIMBING_DEGREES.map((degree) => (
                          <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Load Capacity</Label>
                    <Select
                      value={formData.loadCapacity}
                      onValueChange={(val) => setFormData(prev => ({...prev, loadCapacity: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOAD_CAPACITIES.map((capacity) => (
                          <SelectItem key={capacity} value={capacity}>{capacity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Riding Modes</Label>
                    <div className="flex flex-wrap gap-4">
                      {['Eco', 'City', 'Sport', 'Reverse'].map((mode) => (
                        <div key={mode} className="flex items-center space-x-2 bg-muted/10 p-2 rounded-lg border border-border/50">
                          <Checkbox 
                            id={`edit-mode-${mode}`} 
                            checked={formData.ridingModes.includes(mode)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({...prev, ridingModes: [...prev.ridingModes, mode]}));
                              } else {
                                setFormData(prev => ({...prev, ridingModes: prev.ridingModes.filter(m => m !== mode)}));
                              }
                            }}
                          />
                          <Label htmlFor={`edit-mode-${mode}`} className="text-[10px] font-bold uppercase cursor-pointer">{mode}</Label>
                        </div>
                      ))}
                    </div>
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
                    <Select
                      value={formData.batteryCapacity}
                      onValueChange={(val) => setFormData(prev => ({...prev, batteryCapacity: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        {BATTERY_CAPACITIES.map((capacity) => (
                          <SelectItem key={capacity} value={capacity}>{capacity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charging Time (0-100%)</Label>
                    <Select
                      value={formData.chargingTime}
                      onValueChange={(val) => setFormData(prev => ({...prev, chargingTime: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Time" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHARGING_TIMES.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Battery Warranty</Label>
                    <Select
                      value={formData.batteryWarranty}
                      onValueChange={(val) => setFormData(prev => ({...prev, batteryWarranty: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Warranty" />
                      </SelectTrigger>
                      <SelectContent>
                        {BATTERY_WARRANTIES.map((warranty) => (
                          <SelectItem key={warranty} value={warranty}>{warranty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charger Details</Label>
                    <Select
                      value={formData.chargerIncluded}
                      onValueChange={(val) => setFormData(prev => ({...prev, chargerIncluded: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Charger" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHARGER_OPTIONS.map((charger) => (
                          <SelectItem key={charger} value={charger}>{charger}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      value={formData.motorPower}
                      onValueChange={(val) => setFormData(prev => ({...prev, motorPower: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Power" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOTOR_POWERS.map((power) => (
                          <SelectItem key={power} value={power}>{power}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      value={formData.wheelSize}
                      onValueChange={(val) => setFormData(prev => ({...prev, wheelSize: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {WHEEL_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ground Clearance</Label>
                    <Select
                      value={formData.groundClearance}
                      onValueChange={(val) => setFormData(prev => ({...prev, groundClearance: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Clearance" />
                      </SelectTrigger>
                      <SelectContent>
                        {GROUND_CLEARANCES.map((clearance) => (
                          <SelectItem key={clearance} value={clearance}>{clearance}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      value={formData.displayType}
                      onValueChange={(val) => setFormData(prev => ({...prev, displayType: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Display" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LED Digital">LED Digital</SelectItem>
                        <SelectItem value="TFT">TFT</SelectItem>
                        <SelectItem value="Touchscreen">Touchscreen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Boot Space</Label>
                    <Select
                      value={formData.bootSpace}
                      onValueChange={(val) => setFormData(prev => ({...prev, bootSpace: val}))}
                    >
                      <SelectTrigger className="bg-muted/20 h-10 text-xs border-border/50">
                        <SelectValue placeholder="Select Boot Space" />
                      </SelectTrigger>
                      <SelectContent>
                        {BOOT_SPACES.map((space) => (
                          <SelectItem key={space} value={space}>{space}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <div className="col-span-1 md:col-span-2 space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Key Features</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Anti-theft Alarm', 'USB Charging Port', 'Keyless Entry', 'Find My Scooter', 'Projector Headlight', 'DRL'].map((feat) => (
                        <div key={feat} className="flex items-center space-x-2 bg-muted/10 p-2 rounded-lg border border-border/50">
                          <Checkbox 
                            id={`edit-feat-${feat}`} 
                            checked={formData.keyFeatures.includes(feat)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({...prev, keyFeatures: [...prev.keyFeatures, feat]}));
                              } else {
                                setFormData(prev => ({...prev, keyFeatures: prev.keyFeatures.filter(f => f !== feat)}));
                              }
                            }}
                          />
                          <Label htmlFor={`edit-feat-${feat}`} className="text-[10px] font-bold uppercase cursor-pointer">{feat}</Label>
                        </div>
                      ))}
                    </div>
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
                          setSelectedFiles(Array.from(e.target.files));
                        }
                      }}
                      className="bg-muted/20 h-10 text-xs py-2 px-3 border-dashed border-primary/20" 
                    />
                    {selectedFiles.length > 0 ? (
                      <p className="text-[8px] text-primary uppercase font-bold">{selectedFiles.length} new files selected</p>
                    ) : (
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">Current images will be kept if none selected</p>
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
              setIsEditModalOpen(false);
              setEditingVehicle(null);
              setSelectedFiles([]);
            }} className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg">Cancel</Button>
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
              className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white border-none p-0 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-600/20"
            >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}