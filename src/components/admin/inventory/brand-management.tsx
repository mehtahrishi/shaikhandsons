"use client"

import React from 'react';
import { Plus, Pencil, Check, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newBrandName, setNewBrandName] = React.useState('');
  const [newBrandFile, setNewBrandFile] = React.useState<File | null>(null);
  const [editingBrand, setEditingBrand] = React.useState<BrandData | null>(null);
  const [isBrandActionLoading, setIsBrandActionLoading] = React.useState(false);

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-card/40 backdrop-blur-xl border border-border/50 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold font-headline">Brand Management</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Manage your vehicle brands.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) {
            setNewBrandName('');
            setNewBrandFile(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="h-10 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg">
              <Plus className="h-4 w-4 mr-2" /> Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-xl font-bold">Add New Brand</DialogTitle>
              <DialogDescription className="text-[10px] uppercase tracking-widest">Create a new manufacturer brand.</DialogDescription>
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
                {newBrandFile && (
                  <p className="text-[8px] text-primary uppercase font-bold">File selected: {newBrandFile.name}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewBrandName('');
                  setNewBrandFile(null);
                }}
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
                      <div className="flex items-center gap-3">
                        {brand.imageUrl ? (
                          <div className="h-8 w-8 rounded-md overflow-hidden relative bg-muted flex-shrink-0">
                            <Image src={brand.imageUrl} alt={brand.name} fill className="object-cover" sizes="32px" unoptimized />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-md bg-muted/50 flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                          </div>
                        )}
                        <span className="text-xs font-bold uppercase tracking-widest">{brand.name}</span>
                      </div>
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
  );
}
