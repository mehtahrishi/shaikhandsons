"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2,
  Mail,
  Phone,
  Search,
  AlertCircle,
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AdminAuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  prefs: {
    phone?: string;
    address?: string;
  };
  emailVerification: boolean;
  status: boolean;
  labels: string[];
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<AdminAuthUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/users?limit=1000', {
          method: 'GET',
          cache: 'no-store',
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load users.');
        }

        if (mounted) {
          setUsers(Array.isArray(data.users) ? data.users : []);
        }
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : 'Failed to load users.';
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term) ||
        (user.phone && user.phone.includes(term)) ||
        (user.prefs?.phone && user.prefs.phone.includes(term))
      );
    });
  }, [users, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-headline text-4xl md:text-6xl font-black mb-2 text-primary">
            Customers
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl uppercase tracking-widest font-bold">
            Elite collector database and access management.
          </p>
        </motion.div>
      </div>

      {error ? (
        <Alert variant="destructive" className="border-border/50 bg-card/40">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load Appwrite users</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl font-bold">Users Directory</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest">All Users</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-9 h-9 text-xs w-64 bg-muted/20"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-[9px] font-black uppercase tracking-widest w-[50px]"></TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Member</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Phone</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Joined</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest">Address</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableCell colSpan={7} className="py-8">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading users from Appwrite...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableCell colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                    No users matched your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const phoneNumber = user.phone || user.prefs?.phone;
                  return (
                    <TableRow key={user.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center w-8 h-8">
                          <span className="text-red-600 font-headline font-black text-2xl leading-none select-none">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-xs font-bold leading-none mb-1">{user.name}</p>
                        <p className="text-[8px] text-muted-foreground lowercase tracking-widest">{user.email}</p>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-[10px] font-medium opacity-70">
                          {phoneNumber || 'Not provided'}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${user.status ? 'bg-green-500' : 'bg-amber-500'}`} />
                          <span className="text-[10px] font-medium opacity-70">{user.status ? 'Active' : 'Blocked'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-black text-[10px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-[10px] font-medium opacity-70">
                          {user.prefs?.address || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {phoneNumber && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                              asChild
                            >
                              <a href={`tel:${phoneNumber}`}>
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                            asChild
                          >
                            <a href={`mailto:${user.email}`}>
                              <Mail className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}