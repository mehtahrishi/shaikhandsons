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
import { useToast } from "@/hooks/use-toast";
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
import { uploadVehicleImages } from '@/lib/appwrite/storage';
import { createVehicle, updateVehicle, deleteVehicle } from '@/lib/appwrite/inventory';
import { fetchBrands, createBrand, updateBrand, deleteBrand, BrandData } from '@/lib/appwrite/brands';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  batteryRangeKm: number;
  horsepower: number;
  zeroToSixtySeconds: number;
  images: string[];
  designPhilosophy: string;
  createdAt: string;
};

type BulkVehicleForm = {
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  batteryRangeKm: number;
  horsepower: number;
  zeroToSixtySeconds: number;
  designPhilosophy: string;
  selectedFiles: File[];
  isExpanded: boolean;
};

const createEmptyBulkVehicle = (): BulkVehicleForm => ({
  make: '',
  model: '',
  year: 2026,
  trim: '',
  price: 0,
  batteryRangeKm: 0,
  horsepower: 0,
  zeroToSixtySeconds: 0,
  designPhilosophy: '',
  selectedFiles: [],
  isExpanded: true,
});

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
      await updateBrand(editingBrand.id, editingBrand.name);
      setEditingBrand(null);
      fetchAllBrands();
      toast({ title: "Success", description: "Brand updated successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsBrandActionLoading(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      setIsBrandActionLoading(true);
      await deleteBrand(id);
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
    make: '',
    model: '',
    year: 2026,
    trim: '',
    price: 0,
    batteryRangeKm: 0,
    horsepower: 0,
    zeroToSixtySeconds: 0,
    designPhilosophy: '',
  });

  const handleRegisterUnit = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Missing Images",
        description: "Please select at least one image file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Upload Images to Storage
      const imageUrls = await uploadVehicleImages(selectedFiles);
      
      // 2. Save Data to Database
      await createVehicle({
        ...formData,
        images: imageUrls,
      });

      toast({
        title: "Success",
        description: "Vehicle successfully registered.",
      });
      setIsAddModalOpen(false);
      setSelectedFiles([]);
      setFormData({
        make: '',
        model: '',
        year: 2026,
        trim: '',
        price: 0,
        batteryRangeKm: 0,
        horsepower: 0,
        zeroToSixtySeconds: 0,
        designPhilosophy: '',
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
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      trim: vehicle.trim,
      price: vehicle.price,
      batteryRangeKm: vehicle.batteryRangeKm,
      horsepower: vehicle.horsepower,
      zeroToSixtySeconds: vehicle.zeroToSixtySeconds,
      designPhilosophy: vehicle.designPhilosophy,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUnit = async () => {
    if (!editingVehicle) return;

    try {
      setIsUploading(true);
      
      let imageUrls = editingVehicle.images;
      if (selectedFiles.length > 0) {
        // Upload new images if selected
        imageUrls = await uploadVehicleImages(selectedFiles);
      }
      
      await updateVehicle(editingVehicle.id, {
        ...formData,
        images: imageUrls,
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
      await deleteVehicle(vehicleToDelete);
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

    const firstWithoutImages = bulkVehicles.findIndex((entry) => entry.selectedFiles.length === 0);
    if (firstWithoutImages !== -1) {
      toast({
        title: 'Missing Images',
        description: `Please select at least one image in row ${firstWithoutImages + 1}.`,
        variant: 'destructive',
      });
      return;
    }

    const firstInvalidIndex = bulkVehicles.findIndex(
      (entry) =>
        !entry.make.trim() ||
        !entry.model.trim() ||
        !entry.trim.trim() ||
        !entry.designPhilosophy.trim()
    );

    if (firstInvalidIndex !== -1) {
      toast({
        title: 'Incomplete Entry',
        description: `Please complete required fields in row ${firstInvalidIndex + 1}.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);

      for (const entry of bulkVehicles) {
        const imageUrls = await uploadVehicleImages(entry.selectedFiles);

        await createVehicle({
          make: entry.make,
          model: entry.model,
          year: entry.year,
          trim: entry.trim,
          price: entry.price,
          batteryRangeKm: entry.batteryRangeKm,
          horsepower: entry.horsepower,
          zeroToSixtySeconds: entry.zeroToSixtySeconds,
          designPhilosophy: entry.designPhilosophy,
          images: imageUrls,
        });
      }

      toast({
        title: 'Bulk Import Complete',
        description: `${bulkVehicles.length} vehicle${bulkVehicles.length > 1 ? 's' : ''} added successfully.`,
      });

      setIsBulkModalOpen(false);
      resetBulkForm();
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: 'Bulk Import Failed',
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
                          className="grid grid-cols-1 md:grid-cols-3 gap-3 px-0.5"
                        >
                          <Select
                            value={entry.make}
                            onValueChange={(val) => updateBulkVehicle(idx, 'make', val)}
                          >
                            <SelectTrigger className="h-9 text-xs bg-muted/20">
                              <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {brands.map((b) => (
                                <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Model"
                            className="h-9 text-xs bg-muted/20"
                            value={entry.model}
                            onChange={(e) => updateBulkVehicle(idx, 'model', e.target.value)}
                          />
                          <Input
                            placeholder="Trim"
                            className="h-9 text-xs bg-muted/20"
                            value={entry.trim}
                            onChange={(e) => updateBulkVehicle(idx, 'trim', e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Year"
                            className="h-9 text-xs bg-muted/20"
                            value={entry.year}
                            onChange={(e) => updateBulkVehicle(idx, 'year', Number(e.target.value) || 0)}
                          />
                          <Input
                            type="number"
                            placeholder="Price"
                            className="h-9 text-xs bg-muted/20"
                            value={entry.price}
                            onChange={(e) => updateBulkVehicle(idx, 'price', Number(e.target.value) || 0)}
                          />
                          <Input
                            type="number"
                            placeholder="Range (km)"
                            className="h-9 text-xs bg-muted/20"
                            value={entry.batteryRangeKm}
                            onChange={(e) => updateBulkVehicle(idx, 'batteryRangeKm', Number(e.target.value) || 0)}
                          />
                          <Input
                            type="number"
                            placeholder="Horsepower"
                            className="h-9 text-xs bg-muted/20"
                            value={entry.horsepower}
                            onChange={(e) => updateBulkVehicle(idx, 'horsepower', Number(e.target.value) || 0)}
                          />
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="0-60 mph (s)"
                            className="h-9 text-xs bg-muted/20"
                            value={entry.zeroToSixtySeconds}
                            onChange={(e) => updateBulkVehicle(idx, 'zeroToSixtySeconds', Number(e.target.value) || 0)}
                          />
                          <Textarea
                            placeholder="Design philosophy"
                            className="min-h-[36px] h-9 md:col-span-3 text-xs bg-muted/20"
                            value={entry.designPhilosophy}
                            onChange={(e) => updateBulkVehicle(idx, 'designPhilosophy', e.target.value)}
                          />

                          <div className="md:col-span-3 space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest">Images For This Row</Label>
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
                            <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">
                              {entry.selectedFiles.length > 0
                                ? `${entry.selectedFiles.length} image${entry.selectedFiles.length > 1 ? 's' : ''} selected`
                                : 'No images selected'}
                            </p>
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

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 flex-1 sm:flex-none px-4 sm:px-8 font-black uppercase tracking-[0.16em] text-[10px] rounded-xl shadow-[0_10px_24px_-12px_hsl(var(--primary))] hover:shadow-[0_14px_30px_-14px_hsl(var(--primary))] transition-all">
                <Plus className="h-4 w-4 mr-2" /> Add New Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl font-black">Register New Asset</DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest">
                  Configure technical specifications for the new unit.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6 py-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Make (Brand)</Label>
                  <Select
                    value={formData.make}
                    onValueChange={(val) => setFormData(prev => ({...prev, make: val}))}
                  >
                    <SelectTrigger className="bg-muted/20 h-10 text-xs">
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
                  <Label className="text-[10px] font-black uppercase tracking-widest">Model</Label>
                  <Input 
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({...prev, model: e.target.value}))}
                    placeholder="Aether" className="bg-muted/20 h-10 text-xs" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Year</Label>
                  <Input 
                    type="number" 
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({...prev, year: parseInt(e.target.value)}))}
                    placeholder="2026" className="bg-muted/20 h-10 text-xs" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Trim</Label>
                  <Input 
                    value={formData.trim}
                    onChange={(e) => setFormData(prev => ({...prev, trim: e.target.value}))}
                    placeholder="Grand Touring" className="bg-muted/20 h-10 text-xs" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({...prev, price: parseInt(e.target.value)}))}
                    placeholder="125000" className="bg-muted/20 h-10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Range (km)</Label>
                  <Input 
                    type="number" 
                    value={formData.batteryRangeKm}
                    onChange={(e) => setFormData(prev => ({...prev, batteryRangeKm: parseInt(e.target.value)}))}
                    placeholder="840" className="bg-muted/20 h-10 text-xs" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Horsepower</Label>
                  <Input 
                    type="number" 
                    value={formData.horsepower}
                    onChange={(e) => setFormData(prev => ({...prev, horsepower: parseInt(e.target.value)}))}
                    placeholder="950" className="bg-muted/20 h-10 text-xs" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">0-60 mph (s)</Label>
                  <Input 
                    type="number" step="0.1" 
                    value={formData.zeroToSixtySeconds}
                    onChange={(e) => setFormData(prev => ({...prev, zeroToSixtySeconds: parseFloat(e.target.value)}))}
                    placeholder="2.1" className="bg-muted/20 h-10 text-xs" 
                  />
                </div>
                <div className="col-span-2 space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Image Assets (Multiple)</Label>
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
                <div className="col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Design Philosophy</Label>
                  <Textarea 
                    value={formData.designPhilosophy}
                    onChange={(e) => setFormData(prev => ({...prev, designPhilosophy: e.target.value}))}
                    placeholder="Describe the aesthetic..." className="bg-muted/20 h-20 text-xs" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedFiles([]);
                }} className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg">Discard</Button>
                <Button 
                  onClick={handleRegisterUnit} 
                  disabled={isUploading || selectedFiles.length === 0}
                  className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg min-w-[120px]"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {isUploading ? 'Uploading...' : 'Register Unit'}
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
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Image</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Model</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Trim</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Range</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest">Power</TableHead>
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
                          <div className="h-10 w-16 rounded-md bg-muted/20 overflow-hidden border border-border/50">
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
                        </TableCell>
                        <TableCell className="py-4">
                          <p className="text-xs font-bold leading-none mb-1">{item.make} {item.model}</p>
                          <p className="text-[8px] text-muted-foreground font-mono uppercase tracking-widest">{item.id}</p>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest py-0.5 px-2">
                            {item.trim}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-[10px] font-medium opacity-70">
                          {item.batteryRangeKm} km
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-[10px] font-black text-foreground">
                            {item.horsepower} HP
                          </span>
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

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl font-black">Edit Asset Configuration</DialogTitle>
            <DialogDescription className="text-[10px] uppercase tracking-widest">
              Modify technical specifications for unit: {editingVehicle?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Make (Brand)</Label>
              <Select
                value={formData.make}
                onValueChange={(val) => setFormData(prev => ({...prev, make: val}))}
              >
                <SelectTrigger className="bg-muted/20 h-10 text-xs">
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
              <Label className="text-[10px] font-black uppercase tracking-widest">Model</Label>
              <Input 
                value={formData.model}
                onChange={(e) => setFormData(prev => ({...prev, model: e.target.value}))}
                className="bg-muted/20 h-10 text-xs" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Year</Label>
              <Input 
                type="number" 
                value={formData.year}
                onChange={(e) => setFormData(prev => ({...prev, year: parseInt(e.target.value)}))}
                className="bg-muted/20 h-10 text-xs" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Trim</Label>
              <Input 
                value={formData.trim}
                onChange={(e) => setFormData(prev => ({...prev, trim: e.target.value}))}
                className="bg-muted/20 h-10 text-xs" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Price (₹)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({...prev, price: parseInt(e.target.value)}))}
                className="bg-muted/20 h-10 text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Range (km)</Label>
              <Input 
                type="number" 
                value={formData.batteryRangeKm}
                onChange={(e) => setFormData(prev => ({...prev, batteryRangeKm: parseInt(e.target.value)}))}
                className="bg-muted/20 h-10 text-xs" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Horsepower</Label>
              <Input 
                type="number" 
                value={formData.horsepower}
                onChange={(e) => setFormData(prev => ({...prev, horsepower: parseInt(e.target.value)}))}
                className="bg-muted/20 h-10 text-xs" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">0-60 mph (s)</Label>
              <Input 
                type="number" step="0.1" 
                value={formData.zeroToSixtySeconds}
                onChange={(e) => setFormData(prev => ({...prev, zeroToSixtySeconds: parseFloat(e.target.value)}))}
                className="bg-muted/20 h-10 text-xs" 
              />
            </div>
            <div className="col-span-2 space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest">Update Images (Optional)</Label>
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
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Design Philosophy</Label>
              <Textarea 
                value={formData.designPhilosophy}
                onChange={(e) => setFormData(prev => ({...prev, designPhilosophy: e.target.value}))}
                className="bg-muted/20 h-20 text-xs" 
              />
            </div>
          </div>
          <DialogFooter>
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