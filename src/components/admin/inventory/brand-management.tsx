"use client"

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Pencil, 
  Check, 
  X, 
  Loader2, 
  Image as ImageIcon, 
  Search, 
  Trash2, 
  MoreVertical
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

import { createBrand, updateBrand, deleteBrand, uploadBrandImage } from '@/lib/inventory-client';

export type BrandData = {
  id: number;
  name: string;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

interface BrandManagementProps {
  brands: BrandData[];
  isBrandsLoading: boolean;
  fetchAllBrands: () => Promise<void>;
}

export function BrandManagement({ brands, isBrandsLoading, fetchAllBrands }: BrandManagementProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandFile, setNewBrandFile] = useState<File | null>(null);
  const [editingBrand, setEditingBrand] = useState<BrandData | null>(null);
  const [editingBrandFile, setEditingBrandFile] = useState<File | null>(null);
  const [isBrandActionLoading, setIsBrandActionLoading] = useState(false);

  // Filtered brands
  const filteredBrands = useMemo(() => {
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [brands, search]);

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    try {
      setIsBrandActionLoading(true);
      let imageUrl: string | undefined = undefined;
      
      if (newBrandFile) {
        const uploadedUrl = await uploadBrandImage(newBrandFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      await createBrand(newBrandName, imageUrl);
      setNewBrandName('');
      setNewBrandFile(null);
      setIsAddModalOpen(false);
      fetchAllBrands();
      toast({ title: "Success", description: "Brand added to the list." });
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
      let imageUrl: string | undefined = undefined;
      
      if (editingBrandFile) {
        const uploadedUrl = await uploadBrandImage(editingBrandFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      await updateBrand(String(editingBrand.id), editingBrand.name, imageUrl);
      setEditingBrand(null);
      setEditingBrandFile(null);
      fetchAllBrands();
      toast({ title: "Success", description: "Brand details updated." });
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
      toast({ title: "Success", description: "Brand successfully deleted." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsBrandActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl font-bold">Brand Directory</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest">Manage your vehicle brands</CardDescription>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input 
                placeholder="Search brands..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs w-48 lg:w-64 bg-muted/20"
              />
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={(open) => {
              setIsAddModalOpen(open);
              if (!open) {
                setNewBrandName('');
                setNewBrandFile(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg shadow-sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Brand
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="font-headline text-xl font-bold">Add New Brand</DialogTitle>
                  <DialogDescription className="text-[10px] uppercase tracking-widest">Create a new brand entry</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest">Brand Name</Label>
                    <Input 
                      placeholder="Enter brand name..." 
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      className="bg-muted/20 h-10 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest">Brand Logo (Optional)</Label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setNewBrandFile(e.target.files[0]);
                        } else {
                          setNewBrandFile(null);
                        }
                      }}
                      className="bg-muted/20 h-10 text-xs py-2 px-3 border-dashed border-primary/20"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="h-10 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddBrand}
                    disabled={isBrandActionLoading || !newBrandName.trim()}
                    className="h-10 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg"
                  >
                    {isBrandActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                    Save Brand
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-[9px] font-black uppercase tracking-widest w-[80px]">Logo</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Brand Name</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Created On</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isBrandsLoading ? (
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableCell colSpan={4} className="py-8">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading brands...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBrands.length === 0 ? (
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableCell colSpan={4} className="py-8 text-center text-xs text-muted-foreground">
                    No brands found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => (
                  <TableRow key={brand.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                    <TableCell className="py-4">
                      <div className="h-10 w-10 rounded-lg overflow-hidden relative bg-muted/20 border border-border/50">
                        {brand.imageUrl ? (
                          <Image src={brand.imageUrl} alt={brand.name} fill className="object-cover" sizes="40px" unoptimized />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-bold uppercase tracking-widest">{brand.name}</span>
                    </TableCell>
                    <TableCell className="py-4 font-black text-[10px] opacity-70">
                      {brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50 p-2 rounded-xl w-40">
                          <DropdownMenuItem 
                            onClick={() => setEditingBrand(brand)}
                            className="flex items-center gap-2 px-3 h-9 rounded-lg cursor-pointer hover:bg-primary/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-border/50 my-1" />
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <div className="flex items-center gap-2 px-3 h-9 rounded-lg cursor-pointer hover:bg-red-500/10 text-red-500 transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50 rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-headline text-xl font-black">Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-xs uppercase tracking-widest leading-relaxed">
                                  This will delete the brand <span className="text-primary font-black underline">{brand.name}</span>. This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6">
                                <AlertDialogCancel className="h-10 px-4 font-black uppercase text-[10px] rounded-lg">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteBrand(brand.id)}
                                  className="h-10 px-6 font-black uppercase text-[10px] rounded-lg bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Edit Modal */}
      <Dialog open={!!editingBrand} onOpenChange={(open) => {
        if (!open) {
          setEditingBrand(null);
          setEditingBrandFile(null);
        }
      }}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl font-bold">Edit Brand</DialogTitle>
            <DialogDescription className="text-[10px] uppercase tracking-widest">Update brand name and logo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Brand Name</Label>
              <Input 
                value={editingBrand?.name || ''}
                onChange={(e) => editingBrand && setEditingBrand({...editingBrand, name: e.target.value})}
                className="bg-muted/20 h-10 text-xs font-bold rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Brand Logo (Optional)</Label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setEditingBrandFile(e.target.files[0]);
                  } else {
                    setEditingBrandFile(null);
                  }
                }}
                className="bg-muted/20 h-10 text-xs py-2 px-3 border-dashed border-primary/20"
              />
              {editingBrand?.imageUrl && !editingBrandFile && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[8px] text-muted-foreground uppercase font-bold">Current logo:</span>
                  <div className="h-6 w-6 rounded overflow-hidden relative border border-border/50 bg-muted/20">
                    <Image src={editingBrand.imageUrl} alt="Current logo" fill className="object-cover" sizes="24px" unoptimized />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setEditingBrand(null)}
              className="h-10 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateBrand}
              disabled={isBrandActionLoading}
              className="h-10 px-6 font-black uppercase tracking-widest text-[10px] rounded-lg"
            >
              {isBrandActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
