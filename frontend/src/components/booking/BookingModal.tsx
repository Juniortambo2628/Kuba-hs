import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Uppy } from "@uppy/core";
import DashboardModal from "@uppy/react/dashboard-modal";
import ImageEditor from "@uppy/image-editor";
import "@uppy/core/css/style.css";
import "@uppy/dashboard/css/style.css";
import "@uppy/image-editor/css/style.css";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  X, 
  CheckCircle2, 
  Home, 
  Building2, 
  Factory, 
  Info, 
  AlertCircle, 
  Calendar, 
  Clock,
  ChevronRight, 
  Upload,
  MapPin,
  ShieldCheck,
  MessageSquare,
  Briefcase,
  MoreHorizontal,
  Loader2,
  Users
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-2xl" />
});

const FORM_CONFIGS: Record<string, any> = {
  'Cleaning & Maintenance': {
    typeLabel: "Service Type",
    typeOptions: [
      { id: 'residential', label: 'Residential', icon: <Home className="w-4 h-4" /> },
      { id: 'commercial', label: 'Commercial', icon: <Building2 className="w-4 h-4" /> },
      { id: 'large_scale', label: 'Large-scale', icon: <Factory className="w-4 h-4" /> },
    ],
    quantityLabel: "Scope / Quantity",
    quantityHint: "e.g. Offices, Rooms, Units",
    getQuantityBadge: (type: string) => type === 'residential' ? 'Rooms' : type === 'commercial' ? 'Offices' : 'Units',
    descriptionLabel: "Description of Work",
    descriptionPlaceholder: "Please describe what needs cleaning or maintenance..."
  },
  'Health & Wellness': {
    typeLabel: "Consultation Type",
    typeOptions: [
      { id: 'remote', label: 'Remote/Telehealth', icon: <Home className="w-4 h-4" /> },
      { id: 'in_person', label: 'In-Person', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Number of People",
    quantityHint: "How many people for the session?",
    getQuantityBadge: () => 'People',
    descriptionLabel: "Health Concerns / Notes",
    descriptionPlaceholder: "Briefly describe your concerns or specific needs..."
  },
  'Personal & Grooming': {
    typeLabel: "Service Mode",
    typeOptions: [
      { id: 'at_home', label: 'At My Location', icon: <Home className="w-4 h-4" /> },
      { id: 'at_salon', label: 'At Provider Salon', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Number of Persons",
    quantityHint: "How many people need grooming?",
    getQuantityBadge: () => 'Persons',
    descriptionLabel: "Style / Requirement Details",
    descriptionPlaceholder: "Describe your preferred style, hair length, or specific treatment..."
  },
  'Education & Training': {
    typeLabel: "Session Mode",
    typeOptions: [
      { id: 'online', label: 'Online/Zoom', icon: <Home className="w-4 h-4" /> },
      { id: 'in_person', label: 'Physical/On-site', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Number of Students",
    quantityHint: "Group size or individual?",
    getQuantityBadge: () => 'Students',
    descriptionLabel: "Learning Goals",
    descriptionPlaceholder: "Describe what you want to learn or achieve..."
  },
  'Legal Services': {
    typeLabel: "Consultation Type",
    typeOptions: [
      { id: 'legal_advice', label: 'Legal Advice', icon: <Info className="w-4 h-4" /> },
      { id: 'litigation', label: 'Litigation/Court', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'conveyancing', label: 'Conveyancing', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Estimated Hours",
    quantityHint: "Initial engagement estimate",
    getQuantityBadge: () => 'Hours',
    descriptionLabel: "Case / Matter Details",
    descriptionPlaceholder: "Briefly explain the legal assistance or documentation required..."
  },
  'Financial Services': {
    typeLabel: "Engagement Scope",
    typeOptions: [
      { id: 'advisory', label: 'Advisory/Tax', icon: <Info className="w-4 h-4" /> },
      { id: 'audit', label: 'Audit/Compliance', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'sacco', label: 'SACCO Setup', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Transaction Volume / Scope",
    quantityHint: "e.g. Transaction count or staff size",
    getQuantityBadge: () => 'Units',
    descriptionLabel: "Financial Requirements",
    descriptionPlaceholder: "Detail your tax, accounting, or advisory needs..."
  },
  'Commercial Real Estate': {
    typeLabel: "Facility Type",
    typeOptions: [
      { id: 'office', label: 'Office/Business', icon: <Building2 className="w-4 h-4" /> },
      { id: 'retail', label: 'Retail/Mall', icon: <Home className="w-4 h-4" /> },
      { id: 'industrial', label: 'Industrial/Warehouse', icon: <Factory className="w-4 h-4" /> },
    ],
    quantityLabel: "Area Size (Sqft)",
    quantityHint: "Estimated square footage",
    getQuantityBadge: () => 'Sqft',
    descriptionLabel: "Property Needs",
    descriptionPlaceholder: "Describe the property details or management requirements..."
  },
  'Professional Services': {
    typeLabel: "Service Area",
    typeOptions: [
      { id: 'consulting', label: 'Strategy Consulting', icon: <Info className="w-4 h-4" /> },
      { id: 'admin', label: 'Admin Support', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'compliance', label: 'Corporate Compliance', icon: <ShieldCheck className="w-4 h-4" /> },
    ],
    quantityLabel: "Estimated Task Scope",
    quantityHint: "e.g. Hours or projects",
    getQuantityBadge: () => 'Units',
    descriptionLabel: "Project Brief",
    descriptionPlaceholder: "Detail the professional assistance or strategy needed..."
  },
  'Technology & IT Services': {
    typeLabel: "Support Tier",
    typeOptions: [
      { id: 'remote', label: 'Remote Support', icon: <Home className="w-4 h-4" /> },
      { id: 'on_site', label: 'On-site Repair', icon: <Building2 className="w-4 h-4" /> },
      { id: 'project', label: 'Project/Dev', icon: <Factory className="w-4 h-4" /> },
    ],
    quantityLabel: "Devices / Units",
    quantityHint: "Number of systems involved",
    getQuantityBadge: () => 'Units',
    descriptionLabel: "Technical Issue Detail",
    descriptionPlaceholder: "Describe the hardware, network, or software assistance required..."
  },
  'HR Services': {
    typeLabel: "Service Focus",
    typeOptions: [
      { id: 'staffing', label: 'Staffing/Placement', icon: <Users className="w-4 h-4" /> },
      { id: 'payroll', label: 'Payroll Management', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'recruitment', label: 'Executive Search', icon: <MoreHorizontal className="w-4 h-4" /> },
    ],
    quantityLabel: "Employee Count / Roles",
    quantityHint: "Estimated headcount involved",
    getQuantityBadge: () => 'Headcount',
    descriptionLabel: "Human Resource Needs",
    descriptionPlaceholder: "Detail the staffing, payroll, or recruitment assistance required..."
  },
  'Food & Hospitality': {
    typeLabel: "Service Scale",
    typeOptions: [
      { id: 'small_group', label: 'Small Group', icon: <Home className="w-4 h-4" /> },
      { id: 'large_event', label: 'Large Event', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Number of Guests / Pax",
    quantityHint: "Estimated count of people",
    getQuantityBadge: () => 'Pax',
    descriptionLabel: "Menu / Requests",
    descriptionPlaceholder: "Detail any dietary requirements or specific menu items..."
  },
  'Commercial Logistics': {
    typeLabel: "Logistics Type",
    typeOptions: [
      { id: 'delivery', label: 'Delivery/Fleet', icon: <Building2 className="w-4 h-4" /> },
      { id: 'security', label: 'Facility Security', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'operation', label: 'Facility Ops', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Operating Volume",
    quantityHint: "e.g. Shipments or guard count",
    getQuantityBadge: () => 'Units',
    descriptionLabel: "Operational Requirements",
    descriptionPlaceholder: "Describe the logistical, security, or facility support required..."
  },
  'Electrical': {
    typeLabel: "Service Area",
    typeOptions: [
      { id: 'residential', label: 'Residential', icon: <Home className="w-4 h-4" /> },
      { id: 'commercial', label: 'Commercial', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Appliances / Units",
    quantityHint: "Quantity of items to check",
    getQuantityBadge: () => 'Units',
    descriptionLabel: "Technical Details",
    descriptionPlaceholder: "Describe the power issue or installation needs..."
  },
};

const DEFAULT_CONFIG = FORM_CONFIGS['Cleaning & Maintenance'];

const bookingSchema = z.object({
  service_type: z.string().min(1, "Please select an option"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  address_id: z.string().min(1, "Please select an address"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  scheduled_date: z.string().min(1, "Date is required"),
  scheduled_time: z.string().min(1, "Time is required"),
  promo_code: z.string().optional(),
});

interface BookingValues {
  service_type: string;
  quantity: number;
  address_id: string;
  description: string;
  scheduled_date: string;
  scheduled_time: string;
  promo_code?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: any;
  service: any;
}

export function BookingModal({ isOpen, onClose, provider, service }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showUppy, setShowUppy] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [promoDiscount, setPromoDiscount] = useState<{ amount: number; code: string } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_type: "home" as "home" | "work" | "other",
    street_address: "",
    apartment: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Kenya",
    latitude: null as number | null,
    longitude: null as number | null,
    is_default: false
  });
  const { user } = useAuth();

  React.useEffect(() => {
    if (isOpen && user) {
      fetchAddresses();
    }
  }, [isOpen, user]);

  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get("/api/client/addresses");
      setAddresses(res.data.data || res.data.addresses || res.data || []);
    } catch (err: any) {
      console.error("Failed to fetch addresses:", err);
      // Only toast if it's not a 401 (which we expect if user just logged out/session expired)
      if (err.response?.status !== 401) {
        toast.error("Could not load your addresses");
      }
    }
  };

  const handleCreateAddress = async () => {
    setIsSavingAddress(true);
    try {
      const res = await axiosInstance.post("/api/client/addresses", newAddress);
      toast.success("Address added successfully!");
      const createdAddress = res.data.data || res.data.address || res.data;
      
      setIsAddingAddress(false);
      setNewAddress({
        address_type: "home",
        street_address: "",
        apartment: "",
        city: "",
        state: "",
        postal_code: "",
        country: "Kenya",
        latitude: null,
        longitude: null,
        is_default: false
      });
      
      await fetchAddresses();
      
      if (createdAddress && createdAddress.id) {
        form.setValue("address_id", createdAddress.id.toString());
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const uppy = useMemo(() => {
    const u = new Uppy({
      id: 'booking-photos',
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 5,
        allowedFileTypes: ['image/*']
      }
    })
    .use(ImageEditor);

    // Since we don't have an upload plugin, we manually handle the "Upload" intent
    u.on('upload', () => {
      setShowUppy(false);
      toast.info("Images attached! Head to the next step to finish your booking.");
    });

    return u;
  }, []);


  const config = useMemo(() => {
    console.log("Re-calculating config for service:", service?.name, service?.category);
    if (!service) return DEFAULT_CONFIG;
    
    // Specific service name overrides
    if (service.name?.toLowerCase().includes('babysitting')) {
      return {
        ...FORM_CONFIGS['Personal & Wellness'],
        quantityLabel: "Number of Children",
        quantityHint: "How many children need care?",
        getQuantityBadge: () => 'Children',
        typeLabel: "Childcare Type",
        typeOptions: [
          { id: 'one_time', label: 'One-time', icon: <Calendar className="w-4 h-4" /> },
          { id: 'recurring', label: 'Recurring', icon: <Clock className="w-4 h-4" /> },
        ],
        descriptionLabel: "Child Details & Special Needs",
        descriptionPlaceholder: "Please share children's ages, any allergies, or special requirements..."
      };
    }

    if (!service.category) return DEFAULT_CONFIG;
    return FORM_CONFIGS[service.category] || DEFAULT_CONFIG;
  }, [service]);

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    shouldUnregister: false,
    defaultValues: {
      service_type: 'residential',
      quantity: 1,
      address_id: "",
      description: "",
      scheduled_date: "",
      scheduled_time: "",
      promo_code: "",
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("LIVE Form Values (watch):", watchedValues);
      console.log("Form Validation Errors:", form.formState.errors);
      const firstError = Object.values(form.formState.errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [form.formState.errors, watchedValues]);

  // Update default value if config changes (e.g. category changes)
  useEffect(() => {
    console.log("Config Effect Triggered:", config.typeOptions?.[0]?.id);
    if (config?.typeOptions?.[0]?.id) {
      form.setValue('service_type', config.typeOptions[0].id, { shouldValidate: true, shouldDirty: true });
    }
    form.setValue('quantity', 1, { shouldValidate: true, shouldDirty: true });
  }, [config, form]);

  const handleValidatePromo = async () => {
    const code = form.getValues('promo_code');
    if (!code) return;

    setIsValidatingPromo(true);
    setPromoError(null);
    
    // Estimate price for validation
    const quantity = form.getValues('quantity');
    const basePrice = service.base_price || 0;
    const amount = quantity * basePrice;

    try {
      const res = await axiosInstance.post('/api/promo-codes/validate', {
        code,
        amount
      });
      
      setPromoDiscount({
        amount: res.data.discount_amount,
        code: code
      });
      toast.success(`Promo code applied! Saved KES ${res.data.discount_amount.toLocaleString()}`);
    } catch (err: any) {
      setPromoError(err.response?.data?.message || "Invalid promo code");
      setPromoDiscount(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  // Update default value if config changes (e.g. category changes)
  React.useEffect(() => {
    if (config?.typeOptions?.[0]?.id) {
      form.setValue('service_type', config.typeOptions[0].id);
    }
    // Explicitly ensure quantity is a number
    form.setValue('quantity', 1);
  }, [config, form]);

  const compressImage = async (file: Blob): Promise<Blob> => {
    console.log("Compressing image:", file.size);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onerror = () => reject(new Error("Failed to load image"));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            console.log("Compression complete. New size:", blob?.size);
            resolve(blob || file);
          }, 'image/jpeg', 0.8); // 80% quality
        };
      };
    });
  };

  const onSubmit = async (data: BookingValues) => {
    console.log("onSubmit triggered with data:", data);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      formData.append('provider_id', provider.id);
      formData.append('service_id', service.service_id || service.id);
      formData.append('quantity_label', config.getQuantityBadge(data.service_type));

      // Add & Compress Uppy files
      const files = uppy.getFiles();
      for (const file of files) {
        if (file.data) {
          const compressed = await compressImage(file.data as Blob);
          formData.append('images[]', compressed);
        }
      }

      await axiosInstance.post('/api/client/bookings', formData);
      setIsSuccess(true);
      toast.success("Booking request sent!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-50 w-full max-w-2xl bg-white dark:bg-[#0B0F19] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 pointer-events-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book {service.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">with {provider.business_name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto">
          {!user ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                Please sign in to your Kuba account to send messages or book services with {provider.business_name}.
              </p>
              <div className="flex flex-col gap-3 relative z-[60]">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px] cursor-pointer shadow-lg shadow-blue-500/20">
                  <Link href={`/login?redirect=/providers/${provider.id}`}>Sign In to Continue</Link>
                </Button>
                <Link href="/register/client" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-tight py-2 text-center pointer-events-auto">
                  New to Kuba? Create an account
                </Link>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Requested!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Your request has been sent to {provider.business_name}. You'll receive a notification once they confirm.
              </p>
              <div className="flex gap-4">
                <Button asChild variant="outline" className="flex-1 rounded-xl h-12 font-bold border-gray-200 dark:border-white/10 uppercase tracking-tight text-xs">
                    <Link href="/dashboard/client/bookings">View My Bookings</Link>
                </Button>
                <Button onClick={onClose} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold uppercase tracking-tight text-xs">
                    Awesome!
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Always register these fields so they are never lost regardless of step */}
                <div className="hidden">
                  <FormField control={form.control} name="service_type" render={() => <input type="hidden" />} />
                  <FormField control={form.control} name="quantity" render={() => <input type="hidden" />} />
                </div>
                
                {/* Step indicator */}
                <div className="flex items-center gap-4">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-400"}`}>
                        {s}
                      </div>
                      <span className={`text-sm font-semibold ${step >= s ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                        {s === 1 ? "Details" : "Schedule"}
                      </span>
                      {s === 1 && <div className="w-12 h-px bg-gray-200 dark:bg-white/10 mx-2" />}
                    </div>
                  ))}
                </div>

                {step === 1 ? (
                  <div className="space-y-6">
                    {/* Service Type */}
                    <FormField
                      control={form.control}
                      name="service_type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">{config.typeLabel}</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-3 gap-3">
                              {config.typeOptions.map((type: any) => (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => field.onChange(type.id)}
                                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${field.value === type.id ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400" : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-gray-500 hover:border-gray-200 dark:hover:border-white/10"}`}
                                >
                                  {type.icon}
                                  <span className="text-xs font-bold">{type.label}</span>
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">
                              {config.quantityLabel}
                            </FormLabel>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Info className="w-3 h-3" /> {config.quantityHint}
                            </span>
                          </div>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Input 
                                type="number" 
                                min="1"
                                className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500 font-bold"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                              <Badge variant="outline" className="h-12 px-6 rounded-xl border-gray-200 dark:border-white/10 text-gray-500 bg-gray-50 dark:bg-white/5">
                                {config.getQuantityBadge(form.watch('service_type'))}
                              </Badge>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address Selection */}
                    <FormField
                      control={form.control}
                      name="address_id"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
                            Service Address
                            <button
                              type="button"
                              onClick={() => setIsAddingAddress(!isAddingAddress)}
                              className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold tracking-widest hover:underline"
                            >
                              {isAddingAddress ? "Cancel" : addresses.length === 0 ? "Add New Address" : "Add New Address"}
                            </button>
                          </FormLabel>
                          <FormControl>
                            {isAddingAddress ? (
                              <div className="space-y-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Address Type</label>
                                  <div className="flex gap-2">
                                    {[
                                      { id: 'home', label: 'Home', icon: Home },
                                      { id: 'work', label: 'Work', icon: Briefcase },
                                      { id: 'other', label: 'Other', icon: MoreHorizontal }
                                    ].map((type) => (
                                      <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setNewAddress({...newAddress, address_type: type.id as any})}
                                        className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                                          newAddress.address_type === type.id 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                            : 'bg-white dark:bg-[#0B0F19] border-gray-100 dark:border-white/5 text-gray-500 hover:border-blue-200'
                                        }`}
                                      >
                                        <type.icon className="w-3.5 h-3.5" />
                                        {type.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Street Address</label>
                                    <Input 
                                      value={newAddress.street_address} 
                                      onChange={e => setNewAddress({...newAddress, street_address: e.target.value})}
                                      className="bg-white dark:bg-[#0B0F19] h-10 text-xs" 
                                      placeholder="e.g. 123 Main St"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Apt/Suite</label>
                                    <Input 
                                      value={newAddress.apartment} 
                                      onChange={e => setNewAddress({...newAddress, apartment: e.target.value})}
                                      className="bg-white dark:bg-[#0B0F19] h-10 text-xs" 
                                      placeholder="Optional"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">City</label>
                                    <Input 
                                      value={newAddress.city} 
                                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                      className="bg-white dark:bg-[#0B0F19] h-10 text-xs" 
                                      placeholder="e.g. Nairobi"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">State / County</label>
                                    <Input 
                                      value={newAddress.state} 
                                      onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                      className="bg-white dark:bg-[#0B0F19] h-10 text-xs" 
                                      placeholder="e.g. Nairobi County"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Postal Code</label>
                                    <Input 
                                      value={newAddress.postal_code} 
                                      onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})}
                                      className="bg-white dark:bg-[#0B0F19] h-10 text-xs" 
                                      placeholder="e.g. 00100"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center justify-between">
                                    Pin Exact Location
                                    {newAddress.latitude && (
                                      <span className="text-sky-500 lowercase font-medium">Coordinates Set</span>
                                    )}
                                  </label>
                                  <div className="relative">
                                    <LocationPicker 
                                      position={newAddress.latitude && newAddress.longitude ? [newAddress.latitude, newAddress.longitude] : null}
                                      onChange={(lat: number, lng: number) => setNewAddress({...newAddress, latitude: lat, longitude: lng})}
                                    />
                                  </div>
                                </div>

                                <Button 
                                  type="button" 
                                  onClick={handleCreateAddress}
                                  disabled={isSavingAddress || !newAddress.street_address || !newAddress.city || !newAddress.state || !newAddress.postal_code}
                                  className="w-full text-xs font-bold uppercase rounded-xl h-10 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {isSavingAddress ? "Saving..." : "Save Address"}
                                </Button>
                              </div>
                            ) : (
                              <select 
                                className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all appearance-none outline-none"
                                {...field}
                              >
                                <option value="">Select an address</option>
                                {addresses.map((addr) => (
                                  <option key={addr.id} value={addr.id}>
                                    {addr.street_address}, {addr.city}
                                  </option>
                                ))}
                              </select>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">{config.descriptionLabel}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={config.descriptionPlaceholder}
                              className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl min-h-[120px] focus-visible:ring-blue-500 pt-4"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Image Upload Component */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-900 dark:text-white">Upload Photos (Optional)</label>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowUppy(true)}
                        className="w-full h-14 border-dashed border-2 rounded-2xl border-gray-200 dark:border-white/10 flex items-center justify-center gap-2 hover:bg-blue-50/50 dark:hover:bg-blue-600/5 transition-all text-gray-500"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Manage Photos ({uppy.getFiles().length})</span>
                      </Button>
                      <DashboardModal
                        uppy={uppy}
                        open={showUppy}
                        onRequestClose={() => setShowUppy(false)}
                        plugins={['ImageEditor']}
                        proudlyDisplayPoweredByUppy={false}
                        metaFields={[]}
                        closeAfterFinish={true}
                        hideUploadButton={false} // Keep it but we handle it via the 'upload' event above
                        note="Add up to 5 photos. Click 'Upload' to confirm they are ready."
                      />
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-2">
                        <AlertCircle className="w-3 h-3" /> Helps pros assess materials & severity
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="scheduled_date"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">Preferred Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="scheduled_time"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">Preferred Time</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Card className="bg-blue-50 dark:bg-blue-600/5 border-blue-100 dark:border-blue-600/20 rounded-2xl">
                      <CardContent className="p-4 flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                          The professional will confirm if they are available at this time or suggest an alternative slot.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Promo Code Section */}
                    <div className="space-y-4 pt-4 border-t border-border/10">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-primary" /> Promo Code
                        </label>
                        {promoDiscount && (
                           <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold">
                             -{promoDiscount.amount.toLocaleString()} KES Applied
                           </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <FormField
                          control={form.control}
                          name="promo_code"
                          render={({ field }) => (
                            <FormItem className="flex-1 space-y-0">
                              <FormControl>
                                <Input 
                                  placeholder="Enter voucher code"
                                  className={`bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500 font-bold uppercase ${promoDiscount ? 'border-emerald-500 ring-1 ring-emerald-500/20' : ''}`}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={handleValidatePromo}
                          disabled={isValidatingPromo || !form.watch('promo_code')}
                          className="h-12 px-6 rounded-xl border-gray-200 dark:border-white/10 font-bold text-xs uppercase tracking-widest hover:bg-muted"
                        >
                          {isValidatingPromo ? "..." : "Apply"}
                        </Button>
                      </div>
                      {promoError && <p className="text-[10px] text-red-500 font-bold italic">{promoError}</p>}
                      {promoDiscount && (
                        <p className="text-[10px] text-emerald-600 font-bold italic">
                          Successful! You're saving KES {promoDiscount.amount.toLocaleString()} on this booking.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex gap-4 pt-4">
                  {step === 2 && (
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1 h-14 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-2xl font-bold"
                    >
                      Back
                    </Button>
                  )}
                  <Button 
                    type={step === 1 ? "button" : "submit"}
                    onClick={(e) => {
                        if (step === 1) {
                            e.preventDefault();
                            setStep(2);
                        }
                    }}
                    disabled={form.formState.isSubmitting}
                    className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20"
                  >
                    {form.formState.isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Sending...</span>
                        </div>
                    ) : step === 1 ? (
                        <>Next Step <ChevronRight className="ml-2 w-5 h-5" /></>
                    ) : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
