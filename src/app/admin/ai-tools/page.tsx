
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
    <div className="container mx-auto px-6 py-32">
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-black mb-4">Admin AI Tools</h1>
        <p className="text-muted-foreground text-lg">Harness artificial intelligence to curate the Veridian Noir brand experience.</p>
      </div>

      <Tabs defaultValue="description" className="space-y-8">
        <TabsList className="bg-card border w-full justify-start p-1 h-auto">
          <TabsTrigger value="description" className="px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Description Generator
          </TabsTrigger>
          <TabsTrigger value="config" className="px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Package Suggester
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Specifications</CardTitle>
                <CardDescription>Enter the hardware specs to generate marketing copy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input value={descInput.model} onChange={e => setDescInput({...descInput, model: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input type="number" value={descInput.year} onChange={e => setDescInput({...descInput, year: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>HP</Label>
                    <Input type="number" value={descInput.horsepower} onChange={e => setDescInput({...descInput, horsepower: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Range (km)</Label>
                    <Input type="number" value={descInput.batteryRangeKm} onChange={e => setDescInput({...descInput, batteryRangeKm: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>0-60 (s)</Label>
                    <Input type="number" value={descInput.zeroToSixtySeconds} onChange={e => setDescInput({...descInput, zeroToSixtySeconds: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Design Philosophy</Label>
                  <Textarea value={descInput.designPhilosophy} onChange={e => setDescInput({...descInput, designPhilosophy: e.target.value})} />
                </div>
                <Button onClick={handleGenerateDescription} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                  Generate Luxury Copy
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>AI Output</CardTitle>
                <CardDescription>Editorial description for the website showroom.</CardDescription>
              </CardHeader>
              <CardContent>
                {descOutput ? (
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{descOutput}</p>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                    <Wand2 className="h-12 w-12 mb-4 opacity-20" />
                    <p>Generated description will appear here...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Available Components</CardTitle>
                <CardDescription>Input available options to create smart bundles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input value={configInput.targetAudience} onChange={e => setConfigInput({...configInput, targetAudience: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Available Options (Comma separated)</Label>
                  <Textarea 
                    value={configInput.availableOptions?.join(', ')} 
                    onChange={e => setConfigInput({...configInput, availableOptions: e.target.value.split(',').map(s => s.trim())})} 
                  />
                </div>
                <Button onClick={handleSuggestConfig} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                  Suggest Packages
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>Suggested Configuration</CardTitle>
                <CardDescription>Optimized packages for your target audience.</CardDescription>
              </CardHeader>
              <CardContent>
                {configOutput ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-primary uppercase text-xs mb-3">Suggested Packages</h4>
                      {configOutput.suggestedPackages.map((pkg: any, idx: number) => (
                        <div key={idx} className="bg-card p-4 rounded-lg border mb-3">
                          <p className="font-headline text-lg font-bold">{pkg.name}</p>
                          <p className="text-xs text-muted-foreground mb-2">{pkg.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {pkg.includedOptions.map((opt: string) => <span key={opt} className="bg-muted px-2 py-1 rounded text-[10px]">{opt}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary uppercase text-xs mb-3">AI Rationale</h4>
                      <p className="text-sm italic text-muted-foreground">{configOutput.rationale}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                    <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                    <p>AI suggestions will appear here...</p>
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
