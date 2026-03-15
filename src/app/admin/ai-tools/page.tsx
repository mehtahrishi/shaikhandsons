"use client"

import React, { useState } from 'react';
import { generateVehicleDescription, type GenerateVehicleDescriptionInput } from '@/ai/flows/generate-vehicle-description';
import { suggestVehicleConfiguration, type AdminVehicleConfigurationSuggesterInput } from '@/ai/flows/suggest-vehicle-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function AIToolsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Description State
  const [descInput, setDescInput] = useState<Partial<GenerateVehicleDescriptionInput>>({
    make: 'Veridian',
    model: 'Aether',
    year: 2025,
    batteryRangeKm: 840,
    horsepower: 950,
    zeroToSixtySeconds: 2.1,
    features: ['Lidar', 'Bio-interior'],
    designPhilosophy: 'Ethereal aerodynamics'
  });
  const [descOutput, setDescOutput] = useState("");

  // Config State
  const [configInput, setConfigInput] = useState<Partial<AdminVehicleConfigurationSuggesterInput>>({
    make: 'Veridian',
    model: 'Aether',
    year: 2025,
    baseFeatures: ['AC', 'GPS'],
    availableOptions: ['Gold Trim', 'Racing Seats', 'Solar Roof'],
    targetAudience: 'Tech executives seeking luxury'
  });
  const [configOutput, setConfigOutput] = useState<any>(null);

  const handleGenerateDescription = async () => {
    setLoading(true);
    try {
      const result = await generateVehicleDescription(descInput as GenerateVehicleDescriptionInput);
      setDescOutput(result.description);
      toast({ title: "Description Generated", description: "The AI has crafted a luxury narrative." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to generate description", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestConfig = async () => {
    setLoading(true);
    try {
      const result = await suggestVehicleConfiguration(configInput as AdminVehicleConfigurationSuggesterInput);
      setConfigOutput(result);
      toast({ title: "Configuration Suggested", description: "AI has proposed optimal packages." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to suggest configuration", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-2">
            AI <span className="text-primary italic">Synthesis</span>
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
            Automate luxury content generation for the global fleet.
          </p>
        </motion.div>
      </div>

      <Tabs defaultValue="description" className="space-y-8">
        <TabsList className="bg-card/40 border border-border/50 w-full justify-start p-1 h-auto rounded-xl">
          <TabsTrigger value="description" className="px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            Description Generator
          </TabsTrigger>
          <TabsTrigger value="config" className="px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            Package Suggester
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Specifications</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-wider opacity-60">Enter hardware parameters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-widest opacity-60">Model</Label>
                    <Input className="bg-muted/10 h-10 text-xs" value={descInput.model} onChange={e => setDescInput({...descInput, model: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-widest opacity-60">Year</Label>
                    <Input className="bg-muted/10 h-10 text-xs" type="number" value={descInput.year} onChange={e => setDescInput({...descInput, year: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-widest opacity-60">HP</Label>
                    <Input className="bg-muted/10 h-10 text-xs" type="number" value={descInput.horsepower} onChange={e => setDescInput({...descInput, horsepower: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-widest opacity-60">Range</Label>
                    <Input className="bg-muted/10 h-10 text-xs" type="number" value={descInput.batteryRangeKm} onChange={e => setDescInput({...descInput, batteryRangeKm: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-widest opacity-60">0-60</Label>
                    <Input className="bg-muted/10 h-10 text-xs" type="number" value={descInput.zeroToSixtySeconds} onChange={e => setDescInput({...descInput, zeroToSixtySeconds: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest opacity-60">Design Philosophy</Label>
                  <Textarea className="bg-muted/10 min-h-[80px] text-xs" value={descInput.designPhilosophy} onChange={e => setDescInput({...descInput, designPhilosophy: e.target.value})} />
                </div>
                <Button onClick={handleGenerateDescription} disabled={loading} className="w-full h-11 text-[10px] font-black uppercase tracking-[0.2em]">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Synthesize Copy
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/10 border-border/50 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Synthesis Output</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-wider opacity-60">Editorial copy for the showroom.</CardDescription>
              </CardHeader>
              <CardContent>
                {descOutput ? (
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed text-xs opacity-80">{descOutput}</p>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-30">
                    <Wand2 className="h-10 w-10 mb-4" />
                    <p className="text-[10px] uppercase tracking-widest font-black">Awaiting input...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Configuration Engine</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-wider opacity-60">Input components for intelligent bundles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest opacity-60">Target Audience</Label>
                  <Input className="bg-muted/10 h-10 text-xs" value={configInput.targetAudience} onChange={e => setConfigInput({...configInput, targetAudience: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest opacity-60">Available Options (Comma separated)</Label>
                  <Textarea 
                    className="bg-muted/10 min-h-[100px] text-xs"
                    value={configInput.availableOptions?.join(', ')} 
                    onChange={e => setConfigInput({...configInput, availableOptions: e.target.value.split(',').map(s => s.trim())})} 
                  />
                </div>
                <Button onClick={handleSuggestConfig} disabled={loading} className="w-full h-11 text-[10px] font-black uppercase tracking-[0.2em]">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Suggest Bundles
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/10 border-border/50 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Optimized Packages</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-wider opacity-60">AI-driven configuration suggestions.</CardDescription>
              </CardHeader>
              <CardContent>
                {configOutput ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      {configOutput.suggestedPackages.map((pkg: any, idx: number) => (
                        <div key={idx} className="bg-card/50 p-4 rounded-xl border border-border/50">
                          <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">{pkg.name}</p>
                          <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">{pkg.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {pkg.includedOptions.map((opt: string) => <span key={opt} className="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{opt}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">Rationale</h4>
                      <p className="text-[10px] italic text-muted-foreground leading-relaxed">{configOutput.rationale}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-30">
                    <Sparkles className="h-10 w-10 mb-4" />
                    <p className="text-[10px] uppercase tracking-widest font-black">Awaiting synthesis...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}