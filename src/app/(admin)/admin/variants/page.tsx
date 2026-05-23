"use client"

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sliders,
  Plus,
  Search,
  Trash2,
  Pencil,
  Check,
  X,
  Loader2,
  Zap,
  ArrowLeft,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Star
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import {
  fetchAdminVehicles,
  fetchVariants,
  fetchGlobalVariantsAPI,
  createVariantAPI,
  updateVariantAPI,
  deleteVariantAPI,
  createGlobalVariantAPI,
  updateGlobalVariantAPI,
  deleteGlobalVariantAPI
} from '@/lib/inventory-client';

interface Vehicle {
  id: string | number;
  make: string;
  model: string;
  year: number;
  price: string | number;
  imageUrls: string[];
}

interface VariantMapping {
  id: number;
  vehicleId: number;
  globalVariantId: number;
  price: number | string;
  isDefault: boolean;
  isAvailable: boolean;
  name: string;
  variantType: string;
  chargingTime?: string | null;
}

interface GlobalPreset {
  id: number;
  name: string;
  variantType: string;
  price: number | string;
  chargingTime?: string | null;
}

// Simple helper to clean up type labels for display
const formatTypeLabel = (type: string) => {
  const t = type.toLowerCase();
  if (t === 'battery' || t === 'ev') return '🔋 EV';
  if (t === 'engine' || t === 'petrol') return '⚙️ Petrol';
  if (t === 'trim' || t === 'gas') return '💨 Gas';
  return type;
};

// Helper to sanitize variant type for sending to backend
const sanitizeType = (type: string): 'ev' | 'petrol' | 'gas' => {
  const t = type.toLowerCase();
  if (t === 'battery' || t === 'ev') return 'ev';
  if (t === 'engine' || t === 'petrol') return 'petrol';
  return 'gas';
};

function VariantsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const vehicleIdParam = searchParams.get('vehicleId');

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<'assignments' | 'presets'>('assignments');

  // Core Data
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [globalPresets, setGlobalPresets] = React.useState<GlobalPreset[]>([]);
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null);
  const [activeVariants, setActiveVariants] = React.useState<VariantMapping[]>([]);

  // Loading states
  const [isVehiclesLoading, setIsVehiclesLoading] = React.useState(true);
  const [isPresetsLoading, setIsPresetsLoading] = React.useState(true);
  const [isVariantsLoading, setIsVariantsLoading] = React.useState(false);
  const [isSavingPreset, setIsSavingPreset] = React.useState(false);
  const [togglingPresetId, setTogglingPresetId] = React.useState<number | null>(null);

  // Search Filters
  const [vehicleSearch, setVehicleSearch] = React.useState('');
  const [presetSearch, setPresetSearch] = React.useState('');
  const [presetTypeFilter, setPresetTypeFilter] = React.useState<string>('all');

  // Preset Form State
  const [editingPreset, setEditingPreset] = React.useState<GlobalPreset | null>(null);
  const [presetForm, setPresetForm] = React.useState({
    name: '',
    variantType: 'ev',
    price: '',
    chargingTime: '',
  });

  // Load all initial inventory & presets
  const loadInitialData = React.useCallback(async () => {
    try {
      setIsVehiclesLoading(true);
      setIsPresetsLoading(true);

      const [vehiclesList, presetsList] = await Promise.all([
        fetchAdminVehicles(),
        fetchGlobalVariantsAPI()
      ]);

      setVehicles(vehiclesList);
      setGlobalPresets(presetsList);

      // Handle auto-selected vehicle from query params
      if (vehicleIdParam && vehiclesList.length > 0) {
        const found = vehiclesList.find((v: Vehicle) => String(v.id) === String(vehicleIdParam));
        if (found) {
          setSelectedVehicle(found);
          loadVehicleVariants(Number(found.id));
        }
      } else if (vehiclesList.length > 0 && !selectedVehicle) {
        // Default to first vehicle if none selected
        setSelectedVehicle(vehiclesList[0]);
        loadVehicleVariants(Number(vehiclesList[0].id));
      }
    } catch (err: any) {
      toast({
        title: 'Error loading variants',
        description: err.message || 'Check network connection.',
        variant: 'destructive',
      });
    } finally {
      setIsVehiclesLoading(false);
      setIsPresetsLoading(false);
    }
  }, [vehicleIdParam, toast]);

  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load Variants mapped to active vehicle
  const loadVehicleVariants = async (id: number) => {
    try {
      setIsVariantsLoading(true);
      const list = await fetchVariants(id);
      setActiveVariants(list);
    } catch (err: any) {
      toast({
        title: 'Error syncing mappings',
        description: err.message || 'Failed to fetch active vehicle variants.',
        variant: 'destructive',
      });
    } finally {
      setIsVariantsLoading(false);
    }
  };

  // Trigger when a vehicle is changed manually
  const handleVehicleChange = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    loadVehicleVariants(Number(vehicle.id));
    router.replace(`/admin/variants?vehicleId=${vehicle.id}`);
  };

  const resetPresetForm = () => {
    setPresetForm({
      name: '',
      variantType: 'ev',
      price: '',
      chargingTime: '',
    });
  };

  // ─── DIRECT ASSIGNMENT TOGGLE (CHECKBOX / SWITCH) ───────────────────────

  const handleToggleAssignment = async (preset: GlobalPreset) => {
    if (!selectedVehicle) return;

    const activeMapping = activeVariants.find(v => v.globalVariantId === preset.id);

    try {
      setTogglingPresetId(preset.id);

      if (activeMapping) {
        // Unassign: delete the variant mapping
        await deleteVariantAPI(activeMapping.id);
        toast({
          title: 'Variant removed',
          description: `"${preset.name}" is no longer assigned to this vehicle.`,
        });
      } else {
        // Assign: create a new variant mapping using the preset values
        await createVariantAPI({
          vehicleId: Number(selectedVehicle.id),
          name: preset.name,
          variantType: sanitizeType(preset.variantType),
          price: Number(preset.price || 0),
          chargingTime: preset.chargingTime ?? undefined,
          globalVariantId: preset.id,
          isDefault: false,
          isAvailable: true,
        });
        toast({
          title: 'Variant assigned',
          description: `"${preset.name}" is now active for this vehicle.`,
        });
      }

      // Reload vehicle configurations
      await loadVehicleVariants(Number(selectedVehicle.id));
    } catch (err: any) {
      toast({
        title: 'Operation failed',
        description: err.message || 'Failed to toggle variant assignment.',
        variant: 'destructive',
      });
    } finally {
      setTogglingPresetId(null);
    }
  };

  const handleSetDefault = async (mapping: VariantMapping) => {
    if (!selectedVehicle) return;
    try {
      setIsVariantsLoading(true);
      await updateVariantAPI({
        id: mapping.id,
        isDefault: true,
        price: Number(mapping.price || 0)
      });
      toast({
        title: 'Default Selection Updated',
        description: `"${mapping.name}" is now the default option for this vehicle.`,
      });
      await loadVehicleVariants(Number(selectedVehicle.id));
    } catch (err: any) {
      toast({
        title: 'Error setting default',
        description: err.message || 'Failed to update configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsVariantsLoading(false);
    }
  };

  // ─── GLOBAL PRESET FORM HANDLERS ───────────────────────────────────────────

  const handleEditPreset = (preset: GlobalPreset) => {
    setEditingPreset(preset);
    setPresetForm({
      name: preset.name,
      variantType: sanitizeType(preset.variantType),
      price: String(preset.price || '0'),
      chargingTime: preset.chargingTime || '',
    });
  };

  const handleSavePreset = async () => {
    if (!presetForm.name) {
      toast({ title: 'Validation error', description: 'Preset name is required.', variant: 'destructive' });
      return;
    }

    try {
      setIsSavingPreset(true);
      const payload = {
        name: presetForm.name,
        variantType: sanitizeType(presetForm.variantType),
        price: Number(presetForm.price || 0),
        chargingTime: presetForm.chargingTime || null,
      };

      if (editingPreset) {
        await updateGlobalVariantAPI({
          id: editingPreset.id,
          ...payload
        });
        toast({ title: 'Preset updated', description: 'Variant details saved to central directory.' });
      } else {
        await createGlobalVariantAPI(payload);
        toast({ title: 'Preset created', description: 'New option stored in directory.' });
      }

      setEditingPreset(null);
      resetPresetForm();

      // Refresh presets list
      const presets = await fetchGlobalVariantsAPI();
      setGlobalPresets(presets);

      // If we had a vehicle selected, refresh its options mapping
      if (selectedVehicle) {
        loadVehicleVariants(Number(selectedVehicle.id));
      }
    } catch (err: any) {
      toast({
        title: 'Error updating preset',
        description: err.message || 'Make sure parameters are valid and unique.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingPreset(false);
    }
  };

  const handleDeletePreset = async (presetId: number) => {
    try {
      setIsPresetsLoading(true);
      await deleteGlobalVariantAPI(presetId);
      toast({ title: 'Preset deleted', description: 'Successfully deleted from database.' });

      const presets = await fetchGlobalVariantsAPI();
      setGlobalPresets(presets);
      if (selectedVehicle) {
        loadVehicleVariants(Number(selectedVehicle.id));
      }
    } catch (err: any) {
      toast({
        title: 'Error deleting preset',
        description: err.message || 'Action rejected.',
        variant: 'destructive',
      });
    } finally {
      setIsPresetsLoading(false);
    }
  };

  // Filters and searches lists
  const filteredVehicles = vehicles.filter(v =>
    `${v.make} ${v.model}`.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  const filteredPresets = globalPresets.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(presetSearch.toLowerCase());
    const matchesType = presetTypeFilter === 'all' ||
      sanitizeType(p.variantType) === sanitizeType(presetTypeFilter);
    return matchesSearch && matchesType;
  });

  // Group presets for vehicle assignment rendering
  const evPresets = globalPresets.filter(p => sanitizeType(p.variantType) === 'ev');
  const petrolPresets = globalPresets.filter(p => sanitizeType(p.variantType) === 'petrol');
  const gasPresets = globalPresets.filter(p => sanitizeType(p.variantType) === 'gas');

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-black mb-2 text-primary flex items-center gap-3">
            <Sliders className="h-8 w-8 md:h-10 md:w-10 text-primary" /> Variant Management
          </h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
            Create variants once as global presets and instantly assign them to any vehicle.
          </p>
        </div>

        <div className="flex items-center gap-2">
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-6 py-3 font-body text-sm font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'assignments'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          Vehicle Assignments
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-6 py-3 font-body text-sm font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'presets'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          Global Presets Directory
        </button>
      </div>

      {/* ─── TAB 1: VEHICLE ASSIGNMENTS ───────────────────────────────────────── */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Vehicle Selection Card */}
          <Card className="bg-card/45 border-border/50 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black uppercase tracking-wider text-primary">Select Active Vehicle</CardTitle>
              <CardDescription className="text-xs">Select a vehicle model to assign options and configure pre-selected options.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search fleet by make, model..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="bg-muted/10 pl-9 border-border/50 text-xs font-medium h-10 rounded-lg"
                  />
                </div>

                <Select
                  value={selectedVehicle ? String(selectedVehicle.id) : undefined}
                  onValueChange={(val) => {
                    const matched = vehicles.find(v => String(v.id) === val);
                    if (matched) handleVehicleChange(matched);
                  }}
                >
                  <SelectTrigger className="bg-muted/10 h-10 border-border/50 text-xs font-black uppercase tracking-wider sm:w-[320px] rounded-lg">
                    <SelectValue placeholder="Select Vehicle" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    {filteredVehicles.map(v => (
                      <SelectItem key={v.id} value={String(v.id)} className="text-xs font-bold uppercase tracking-wider">
                        {v.year} {v.make} {v.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quick-Toggle Assignments View */}
          {selectedVehicle ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/30 pb-3">
                <h2 className="text-xl font-black uppercase tracking-wider text-foreground">
                  Variant Options for: <span className="text-primary">{selectedVehicle.make} {selectedVehicle.model}</span>
                </h2>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest h-7 bg-primary/10 border-primary/20 text-primary">
                  Base Price: ₹{Number(selectedVehicle.price).toLocaleString('en-IN')}
                </Badge>
              </div>

              {globalPresets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/30 rounded-2xl p-6 text-muted-foreground">
                  <AlertCircle className="h-10 w-10 text-muted-foreground opacity-30 mb-3" />
                  <p className="text-sm font-black uppercase tracking-widest">No presets available</p>
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
                    Please go to the "Global Presets Directory" tab to create your battery/engine variants first.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* EV Batteries Column */}
                  <Card className="bg-card/30 border-border/40 overflow-hidden">
                    <CardHeader className="bg-muted/5 border-b border-border/20 py-3.5">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        🔋 EV Batteries ({evPresets.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {evPresets.length === 0 ? (
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 py-4 text-center">No EV Presets Defined</p>
                      ) : (
                        evPresets.map(preset => {
                          const mapping = activeVariants.find(v => v.globalVariantId === preset.id);
                          const isAssigned = !!mapping;
                          const isToggling = togglingPresetId === preset.id;

                          return (
                            <div
                              key={preset.id}
                              className={`p-3 rounded-xl border transition-all duration-200 flex flex-col gap-2.5 ${isAssigned
                                ? 'bg-primary/5 border-primary/40'
                                : 'bg-background/20 border-border/30 opacity-70 hover:opacity-100'
                                }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wide text-foreground">{preset.name}</h4>
                                  {preset.chargingTime && (
                                    <p className="text-[9px] text-muted-foreground mt-0.5">⚡ {preset.chargingTime}</p>
                                  )}
                                  <p className="text-[11px] font-bold text-emerald-500 mt-0.5">
                                    {Number(preset.price) === 0 ? 'Included (₹0)' : `+ ₹${Number(preset.price).toLocaleString('en-IN')}`}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleAssignment(preset)}
                                  disabled={isToggling || isVariantsLoading}
                                  className={`h-7 px-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${isAssigned
                                    ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'
                                    : 'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary'
                                    }`}
                                >
                                  {isToggling ? <Loader2 className="h-3 w-3 animate-spin" /> : isAssigned ? 'Remove' : 'Assign'}
                                </Button>
                              </div>

                              {isAssigned && mapping && (
                                <div className="border-t border-border/10 pt-2 flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Default selection?</span>
                                  {mapping.isDefault ? (
                                    <Badge className="h-5 px-2 bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                      <Star className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" /> Default Selected
                                    </Badge>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      onClick={() => handleSetDefault(mapping)}
                                      disabled={isVariantsLoading}
                                      className="h-5 px-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
                                    >
                                      Make Default
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>

                  {/* Petrol Engines Column */}
                  <Card className="bg-card/30 border-border/40 overflow-hidden">
                    <CardHeader className="bg-muted/5 border-b border-border/20 py-3.5">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        ⚙️ Petrol Engines ({petrolPresets.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {petrolPresets.length === 0 ? (
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 py-4 text-center">No Petrol Presets Defined</p>
                      ) : (
                        petrolPresets.map(preset => {
                          const mapping = activeVariants.find(v => v.globalVariantId === preset.id);
                          const isAssigned = !!mapping;
                          const isToggling = togglingPresetId === preset.id;

                          return (
                            <div
                              key={preset.id}
                              className={`p-3 rounded-xl border transition-all duration-200 flex flex-col gap-2.5 ${isAssigned
                                ? 'bg-primary/5 border-primary/40'
                                : 'bg-background/20 border-border/30 opacity-70 hover:opacity-100'
                                }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wide text-foreground">{preset.name}</h4>
                                  {preset.chargingTime && (
                                    <p className="text-[9px] text-muted-foreground mt-0.5">⚡ {preset.chargingTime}</p>
                                  )}
                                  <p className="text-[11px] font-bold text-emerald-500 mt-0.5">
                                    {Number(preset.price) === 0 ? 'Included (₹0)' : `+ ₹${Number(preset.price).toLocaleString('en-IN')}`}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleAssignment(preset)}
                                  disabled={isToggling || isVariantsLoading}
                                  className={`h-7 px-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${isAssigned
                                    ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'
                                    : 'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary'
                                    }`}
                                >
                                  {isToggling ? <Loader2 className="h-3 w-3 animate-spin" /> : isAssigned ? 'Remove' : 'Assign'}
                                </Button>
                              </div>

                              {isAssigned && mapping && (
                                <div className="border-t border-border/10 pt-2 flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Default selection?</span>
                                  {mapping.isDefault ? (
                                    <Badge className="h-5 px-2 bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                      <Star className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" /> Default Selected
                                    </Badge>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      onClick={() => handleSetDefault(mapping)}
                                      disabled={isVariantsLoading}
                                      className="h-5 px-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
                                    >
                                      Make Default
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>

                  {/* Gas / Trims Column */}
                  <Card className="bg-card/30 border-border/40 overflow-hidden">
                    <CardHeader className="bg-muted/5 border-b border-border/20 py-3.5">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        💨 Gas Options ({gasPresets.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {gasPresets.length === 0 ? (
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 py-4 text-center">No Gas Presets Defined</p>
                      ) : (
                        gasPresets.map(preset => {
                          const mapping = activeVariants.find(v => v.globalVariantId === preset.id);
                          const isAssigned = !!mapping;
                          const isToggling = togglingPresetId === preset.id;

                          return (
                            <div
                              key={preset.id}
                              className={`p-3 rounded-xl border transition-all duration-200 flex flex-col gap-2.5 ${isAssigned
                                ? 'bg-primary/5 border-primary/40'
                                : 'bg-background/20 border-border/30 opacity-70 hover:opacity-100'
                                }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wide text-foreground">{preset.name}</h4>
                                  {preset.chargingTime && (
                                    <p className="text-[9px] text-muted-foreground mt-0.5">⚡ {preset.chargingTime}</p>
                                  )}
                                  <p className="text-[11px] font-bold text-emerald-500 mt-0.5">
                                    {Number(preset.price) === 0 ? 'Included (₹0)' : `+ ₹${Number(preset.price).toLocaleString('en-IN')}`}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleAssignment(preset)}
                                  disabled={isToggling || isVariantsLoading}
                                  className={`h-7 px-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${isAssigned
                                    ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'
                                    : 'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary'
                                    }`}
                                >
                                  {isToggling ? <Loader2 className="h-3 w-3 animate-spin" /> : isAssigned ? 'Remove' : 'Assign'}
                                </Button>
                              </div>

                              {isAssigned && mapping && (
                                <div className="border-t border-border/10 pt-2 flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Default selection?</span>
                                  {mapping.isDefault ? (
                                    <Badge className="h-5 px-2 bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                      <Star className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" /> Default Selected
                                    </Badge>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      onClick={() => handleSetDefault(mapping)}
                                      disabled={isVariantsLoading}
                                      className="h-5 px-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
                                    >
                                      Make Default
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>

                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-xs uppercase font-black tracking-widest gap-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground opacity-40" /> Select a vehicle catalog option to manage assignments.
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: GLOBAL PRESET DIRECTORY ────────────────────────────────────── */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left panel: List of all presets */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-card/40 border-border/50 backdrop-blur-xl">
              <CardHeader className="pb-4 border-b border-border/25">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-wider text-primary">Global Variant Presets ({filteredPresets.length})</CardTitle>
                    <CardDescription className="text-xs">
                      Master central configurations easily applied across the entire catalog.
                    </CardDescription>
                  </div>

                  {/* Preset categories quick filters */}
                  <div className="flex gap-1.5 overflow-x-auto shrink-0 py-1">
                    {['all', 'ev', 'petrol', 'gas'].map((filterType) => (
                      <Button
                        key={filterType}
                        variant="outline"
                        size="sm"
                        onClick={() => setPresetTypeFilter(filterType)}
                        className={`h-7 px-3 text-[8px] font-black uppercase tracking-widest rounded-full transition-all border-border/50 ${presetTypeFilter === filterType
                          ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                          : 'hover:bg-primary/10'
                          }`}
                      >
                        {filterType === 'all' ? 'All' : filterType === 'ev' ? 'EV' : filterType === 'petrol' ? 'Petrol' : 'Gas'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">

                {/* Preset list search bar */}
                <div className="p-4 border-b border-border/10 bg-muted/5">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search presets by configuration name..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className="bg-background/40 pl-9 border-border/50 text-xs font-bold h-10 rounded-lg"
                    />
                  </div>
                </div>

                {isPresetsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-xs uppercase font-black tracking-widest gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" /> Synchronizing presets directory...
                  </div>
                ) : filteredPresets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center p-6 text-muted-foreground">
                    <Zap className="h-12 w-12 opacity-20 mb-3 text-primary animate-pulse" />
                    <p className="text-sm font-black uppercase tracking-widest">No presets found</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5 uppercase max-w-sm">
                      Create your first preset using the form on the right.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border/20 bg-muted/5 hover:bg-transparent">
                          <TableHead className="text-[9px] font-black uppercase tracking-widest py-3">Preset Name</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest py-3">Type</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest py-3">Charging Time</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest py-3">Price (₹)</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest py-3 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPresets.map((p) => (
                          <TableRow key={p.id} className="border-b border-border/10 hover:bg-muted/10 transition-colors">
                            <TableCell className="py-4 font-bold text-xs">
                              {p.name}
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider py-0.5 border-border/80">
                                {formatTypeLabel(p.variantType)}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 font-medium text-xs text-muted-foreground">
                              {p.chargingTime || '—'}
                            </TableCell>
                            <TableCell className="py-4 font-headline text-xs font-bold text-emerald-500">
                              ₹{Number(p.price || 0).toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditPreset(p)}
                                  className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeletePreset(p.id)}
                                  className="h-8 w-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all"
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
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right panel: Add/Edit Preset Form */}
          <div className="lg:col-span-4">
            <Card className="bg-card/40 border-border/50 backdrop-blur-xl sticky top-6">
              <CardHeader className="pb-4 border-b border-border/20">
                <CardTitle className="text-lg font-black uppercase tracking-wider text-primary">
                  {editingPreset ? 'Edit Preset' : 'Create Preset'}
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure variant presets stored globally in the database.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">

                {/* 1. Name */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preset Name *</Label>
                  <Input
                    placeholder="e.g. 48 Volt 28 AH"
                    value={presetForm.name}
                    onChange={(e) => setPresetForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-muted/10 h-10 text-xs border-border/50 font-bold rounded-lg"
                  />
                </div>

                {/* 2. Type */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preset Category Type *</Label>
                  <Select
                    value={presetForm.variantType}
                    onValueChange={(val: any) => setPresetForm(prev => ({ ...prev, variantType: val }))}
                  >
                    <SelectTrigger className="bg-muted/10 h-10 text-xs border-border/50 font-bold rounded-lg">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      <SelectItem value="ev" className="text-xs font-bold">EV</SelectItem>
                      <SelectItem value="petrol" className="text-xs font-bold">Petrol</SelectItem>
                      <SelectItem value="gas" className="text-xs font-bold">Gas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Price */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price (₹) *</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 20000"
                    value={presetForm.price}
                    onChange={(e) => setPresetForm(prev => ({ ...prev, price: e.target.value }))}
                    className="bg-muted/10 h-10 text-xs border-border/50 font-bold rounded-lg"
                  />
                </div>

                {/* 4. Charging Time */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charging Time</Label>
                  <Input
                    placeholder="e.g. 4.5 Hours"
                    value={presetForm.chargingTime}
                    onChange={(e) => setPresetForm(prev => ({ ...prev, chargingTime: e.target.value }))}
                    className="bg-muted/10 h-10 text-xs border-border/50 font-bold rounded-lg"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2 border-t border-border/20">
                  {editingPreset && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setEditingPreset(null);
                        resetPresetForm();
                      }}
                      className="flex-1 h-10 text-[10px] font-black uppercase tracking-widest rounded-lg border-border/80"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={handleSavePreset}
                    disabled={isSavingPreset}
                    className="flex-1 h-10 text-[10px] font-black uppercase tracking-widest rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all"
                  >
                    {isSavingPreset ? <Loader2 className="h-4 w-4 animate-spin" /> : editingPreset ? 'Save Preset' : 'Create Preset'}
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      )}

    </div>
  );
}

export default function AdminVariantsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground uppercase font-black tracking-widest text-xs gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        Syncing Variant Directory...
      </div>
    }>
      <VariantsPageContent />
    </Suspense>
  );
}
