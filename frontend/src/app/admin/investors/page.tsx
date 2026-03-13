"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { 
  Briefcase, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  Mail,
  Building2,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface InvestorInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  investment_range: string;
  message: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'rejected';
  created_at: string;
}

export default function AdminInvestorsPage() {
  const [inquiries, setInquiries] = useState<InvestorInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await axiosInstance.get("/api/admin/investors");
      setInquiries(data);
    } catch (error) {
      console.error("Failed to fetch inquiries", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axiosInstance.patch(`/api/admin/investors/${id}/status`, { status });
      fetchInquiries();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredInquiries = inquiries.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 uppercase text-[10px] font-black">Pending</Badge>;
      case 'reviewed': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px] font-black">Reviewed</Badge>;
      case 'contacted': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 uppercase text-[10px] font-black">Contacted</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 uppercase text-[10px] font-black">Rejected</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">Investor Inquiries</h1>
          <p className="text-gray-500 text-sm">Manage potential investment outreach and lead status.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                    placeholder="Search by name, email or company..." 
                    className="pl-10 h-11 w-[300px] bg-white border-gray-200 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button className="h-11 bg-white border-dashed border-2 border-gray-200 text-gray-400 hover:text-sky-600 hover:border-sky-600 rounded-xl px-4 flex gap-2">
                <Filter className="w-4 h-4" />
                <span>FILTER</span>
            </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)
        ) : filteredInquiries.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No investor inquiries found.</p>
          </div>
        ) : filteredInquiries.map((inquiry) => (
          <motion.div 
            key={inquiry.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-50 rounded-full">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-gray-100">
                    <DropdownMenuItem 
                        onClick={() => updateStatus(inquiry.id, 'reviewed')}
                        className="rounded-xl flex gap-2 py-2"
                    >
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Mark as Reviewed</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => updateStatus(inquiry.id, 'contacted')}
                        className="rounded-xl flex gap-2 py-2"
                    >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Mark as Contacted</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => updateStatus(inquiry.id, 'rejected')}
                        className="rounded-xl flex gap-2 py-2 text-red-600"
                    >
                        <XCircle className="w-4 h-4" />
                        <span>Reject Lead</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-[13px] font-black text-[#1E293B] uppercase tracking-tight">{inquiry.name}</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">{inquiry.email}</span>
                   </div>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-500 uppercase">Company</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#1E293B] uppercase">{inquiry.company || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-500 uppercase">Intention</span>
                    </div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-tighter">{inquiry.investment_range || 'General'}</span>
                </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed mb-6 line-clamp-3 italic">
                "{inquiry.message}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                </span>
                {getStatusBadge(inquiry.status)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
