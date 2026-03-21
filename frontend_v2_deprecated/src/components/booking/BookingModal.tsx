import * as React from "react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import Uppy from "@uppy/core";
// @ts-ignore
import DashboardModal from "@uppy/react/dashboard-modal";
// @ts-ignore
import XHRUpload from "@uppy/xhr-upload";
// @ts-ignore
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
  MapPin
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
  'Home Essentials': {
    typeLabel: "Service Type",
    typeOptions: [
      { id: 'residential', label: 'Residential', icon: <Home className="w-4 h-4" /> },
      { id: 'commercial', label: 'Commercial', icon: <Building2 className="w-4 h-4" /> },
      { id: 'large_scale', label: 'Large-scale', icon: <Factory className="w-4 h-4" /> },
    ],
    quantityLabel: "Scope / Quantity",
    quantityHint: "e.g. Offices, Rooms, Units",
    getQuantityBadge: (type: string) => type === 'residential' ? 'Rooms' : type === 'commercial' ? 'Offices' : 'Units',
    descriptionLabel: "Description of Issue",
    descriptionPlaceholder: "Please describe the issue in detail so the professional can assess the scope..."
  },
  'Automotive Care': {
    typeLabel: "Service Location",
    typeOptions: [
      { id: 'at_home', label: 'Mobile/Roadside', icon: <Home className="w-4 h-4" /> },
      { id: 'at_workshop', label: 'At Workshop', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Number of Vehicles",
    quantityHint: "How many vehicles need service?",
    getQuantityBadge: () => 'Vehicles',
    descriptionLabel: "Vehicle Details",
    descriptionPlaceholder: "Please provide the make, model, and year of the vehicle(s)..."
  },
  'Personal & Wellness': {
    typeLabel: "Appointment Type",
    typeOptions: [
      { id: 'at_home', label: 'Home Service', icon: <Home className="w-4 h-4" /> },
      { id: 'in_studio', label: 'In-Studio', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Number of People",
    quantityHint: "How many people for the service?",
    getQuantityBadge: () => 'People',
    descriptionLabel: "Special Requests / Details",
    descriptionPlaceholder: "Please share any specific preferences, skin types, or requirements..."
  },
  'Professional & Digital': {
    typeLabel: "Consultation Mode",
    typeOptions: [
      { id: 'remote', label: 'Remote/Online', icon: <Home className="w-4 h-4" /> },
      { id: 'in_person', label: 'In-Person', icon: <Building2 className="w-4 h-4" /> },
    ],
    quantityLabel: "Estimated Scope",
    quantityHint: "Estimated hours or number of projects?",
    getQuantityBadge: () => 'Units',
    descriptionLabel: "Project Requirements",
    descriptionPlaceholder: "Describe your project goals and any specific deliverables needed..."
  },
  'Event & Commercial': {
    typeLabel: "Event Type",
    typeOptions: [
      { id: 'private', label: 'Private Event', icon: <Home className="w-4 h-4" /> },
      { id: 'corporate', label: 'Corporate', icon: <Building2 className="w-4 h-4" /> },
      { id: 'public', label: 'Public Venue', icon: <Factory className="w-4 h-4" /> },
    ],
    quantityLabel: "Area Size / Scope",
    quantityHint: "e.g. Sqft, Number of Guests",
    getQuantityBadge: () => 'Scope',
    descriptionLabel: "Event Details",
    descriptionPlaceholder: "Describe the event type, venue size, and specific needs..."
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
    },
  });

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
      files.forEach((file: any, i: number) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        // @ts-ignore
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        // @ts-ignore
        className="relative w-full max-w-2xl bg-white dark:bg-[#0B0F19] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
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
          {isSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Requested!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Your request has been sent to {provider.business_name}. You'll receive a notification once they confirm.
              </p>
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 font-bold">
                Awesome, thanks!
              </Button>
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
                                <Link href={"/dashboard/client/profile" as any} className="text-[10px] text-sky-600 uppercase font-black">Add New Address</Link>
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
