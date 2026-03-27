import * as React from "react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Uppy from "@uppy/core";
import DashboardModal from "@uppy/react/dashboard-modal";
import XHRUpload from "@uppy/xhr-upload";
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
  ShieldCheck
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
  'Financial & Legal': {
    typeLabel: "Engagement Type",
    typeOptions: [
      { id: 'advisory', label: 'Advisory', icon: <Info className="w-4 h-4" /> },
      { id: 'compliance', label: 'Compliance/Docs', icon: <ShieldCheck className="w-4 h-4" /> },
    ],
    quantityLabel: "Estimated Scope",
    quantityHint: "e.g. Hours or Document Count",
    getQuantityBadge: () => 'Units',
    descriptionLabel: "Requirement Details",
    descriptionPlaceholder: "Describe the financial or legal assistance needed..."
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
    typeLabel: "Facility Type",
    typeOptions: [
      { id: 'office', label: 'Office/Business', icon: <Building2 className="w-4 h-4" /> },
      { id: 'industrial', label: 'Industrial/Warehouse', icon: <Factory className="w-4 h-4" /> },
    ],
    quantityLabel: "Area Size / Units",
    quantityHint: "e.g. Sqft or Staff Count",
    getQuantityBadge: () => 'Units',
    descriptionLabel: "Operational Needs",
    descriptionPlaceholder: "Describe the tech, facility or staffing support required..."
  },
  'Plumbing': {
    typeLabel: "Service Urgency",
    typeOptions: [
      { id: 'standard', label: 'Standard', icon: <Calendar className="w-4 h-4" /> },
      { id: 'emergency', label: 'Emergency', icon: <AlertCircle className="w-4 h-4" /> },
    ],
    quantityLabel: "Points / Fixtures",
    quantityHint: "How many areas need attention?",
    getQuantityBadge: () => 'Points',
    descriptionLabel: "Issue Details",
    descriptionPlaceholder: "Describe the leak or blockage..."
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
  }
};

const DEFAULT_CONFIG = FORM_CONFIGS['Home Essentials'];

const bookingSchema = z.object({
  service_type: z.string().min(1, "Please select an option"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  address_id: z.string().min(1, "Please select an address"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  scheduled_date: z.string().min(1, "Date is required"),
  scheduled_time: z.string().min(1, "Time is required"),
  promo_code: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

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

  const uppy = useMemo(() => {
    return new Uppy({
      id: 'booking-photos',
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 5,
        allowedFileTypes: ['image/*']
      }
    })
    .use(XHRUpload, {
      endpoint: '/api/media/upload', // Replace with actual endpoint
      formData: true,
      fieldName: 'file'
    })
    .use(ImageEditor);
  }, []);

  const config = useMemo(() => {
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
    defaultValues: {
      service_type: config.typeOptions[0].id,
      quantity: 1,
      address_id: "",
      description: "",
      scheduled_date: "",
      scheduled_time: "",
      promo_code: "",
    },
  });

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
    form.setValue('service_type', config.typeOptions[0].id);
  }, [config, form]);

  const onSubmit = async (data: BookingValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      formData.append('provider_id', provider.id);
      formData.append('service_id', service.service_id || service.id);
      formData.append('quantity_label', config.getQuantityBadge(data.service_type));

      // Add Uppy files
      const files = uppy.getFiles();
      files.forEach((file, i) => {
        if (file.data) {
          formData.append(`images[${i}]`, file.data as Blob);
        }
      });

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
                            {addresses.length === 0 && (
                                <Link href="/dashboard/client/profile" className="text-[10px] text-sky-600 uppercase font-black">Add New Address</Link>
                            )}
                          </FormLabel>
                          <FormControl>
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
                    onClick={() => step === 1 && setStep(2)}
                    disabled={form.formState.isSubmitting}
                    className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20"
                  >
                    {form.formState.isSubmitting ? "Processing..." : step === 1 ? "Next Step" : "Confirm Booking"}
                    {step === 1 && <ChevronRight className="ml-2 w-5 h-5" />}
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
