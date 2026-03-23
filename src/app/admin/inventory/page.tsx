"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Zap, 
  Plus,
  BarChart3,
  Search,
  MoreVertical
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

const products = [
  { id: "P-001", name: "Veridian Aether", category: "Sedan", stock: 12, price: "$125,000", battery: "840km" },
  { id: "P-002", name: "Veridian Lumina", category: "SUV", stock: 8, price: "$98,000", battery: "650km" },
  { id: "P-003", name: "Noir Spectre", category: "Hypercar", stock: 3, price: "$210,000", battery: "720km" },
  { id: "P-004", name: "Veridian Dawn", category: "Motorbike", stock: 24, price: "$45,000", battery: "350km" },
  { id: "P-005", name: "Swift Scooty", category: "Scooty", stock: 56, price: "$12,000", battery: "120km" },
];

export default function AdminInventoryPage() {
  return (
    <div className="space-y-10">
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
        <Button className="h-12 px-8 font-black uppercase tracking-widest text-[10px] rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Add New Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Assets', value: '103', icon: Package, trend: '+4 New' },
          { label: 'Active Listings', value: '5 Models', icon: Zap, trend: 'Global' },
          { label: 'Asset Value', value: '$8.4M', icon: BarChart3, trend: '+12%' },
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

      <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl font-bold">Fleet Catalogue</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest">Manage specifications and stock.</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search inventory..." className="pl-9 h-9 text-xs w-64 bg-muted/20" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Model</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Category</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Range</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Stock</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Price</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item) => (
                <TableRow key={item.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                  <TableCell className="py-4">
                    <p className="text-xs font-bold leading-none mb-1">{item.name}</p>
                    <p className="text-[8px] text-muted-foreground font-mono uppercase tracking-widest">{item.id}</p>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest py-0.5 px-2">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-[10px] font-medium opacity-70">
                    {item.battery}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`text-[10px] font-black ${item.stock < 10 ? 'text-primary' : 'text-foreground'}`}>
                      {item.stock} Units
                    </span>
                  </TableCell>
                  <TableCell className="py-4 font-headline font-bold text-sm">
                    {item.price}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}