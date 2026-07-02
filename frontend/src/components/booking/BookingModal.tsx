import * as React from "react";
import { compressBlobToFile } from "@/lib/image-compression";
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
import { Form } from "@/components/ui/form";
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
import { providerHref } from "@/lib/provider-urls";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingLocationStep } from "@/components/booking/BookingLocationStep";
import { BookingScheduleStep } from "@/components/booking/BookingScheduleStep";
import { BookingServiceStep } from "@/components/booking/BookingServiceStep";
import type { BookingValues } from "@/components/booking/booking-modal-types";
import {
  resolveBookingCategoryKey,
  resolveServiceCategoryName,
} from "@/lib/booking-form-config";
import {
  TabbedDialogLayout,
  type TabbedDialogTab,
} from "@/components/shared/dialog/TabbedDialogLayout";
import { dialogFormUi } from "@/lib/crud-dialog-ui";
import { crudDialogUi } from "@/lib/crud-dialog-ui";
import { cn } from "@/lib/utils";

export type BookingOffering = {
  id: string;
  service_id: string;
  name: string;
  description?: string | null;
  base_price: number;
  pricing_type?: string;
  category?: string | null;
  service?: { name?: string; category?: { name?: string; slug?: string } };
  service_thumbnail_url?: string | null;
};

type BookingTabId = "service" | "location" | "schedule";

const BOOKING_TABS: TabbedDialogTab[] = [
  { id: "service", label: "Service", icon: Briefcase },
  { id: "location", label: "Location", icon: MapPin },
  { id: "schedule", label: "Schedule", icon: Calendar },
];

const BOOKING_TAB_ORDER: BookingTabId[] = ["service", "location", "schedule"];

const BOOKING_TAB_COPY: Record<BookingTabId, { title: string; description: string }> = {
  service: {
    title: "Service details",
    description: "Choose the type of work and describe what you need.",
  },
  location: {
    title: "Service location",
    description: "Select or add the address where the provider should go.",
  },
  schedule: {
    title: "Schedule & promo",
    description: "Pick your preferred date and time, and apply a voucher if you have one.",
  },
};

const FIELDS_BY_TAB: Record<BookingTabId, (keyof BookingValues)[]> = {
  service: ["service_type", "quantity", "description"],
  location: ["address_id"],
  schedule: ["scheduled_date", "scheduled_time"],
};

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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: { id: string; business_name: string; services?: BookingOffering[] };
  /** Pre-selected provider offering (provider_services row) */
  service?: BookingOffering | null;
  /** All bookable offerings for this provider */
  offerings?: BookingOffering[];
}

function normalizeOffering(raw: BookingOffering | null | undefined): BookingOffering | null {
  if (!raw) return null;
  return {
    ...raw,
    name: raw.name || raw.service?.name || "Service",
    service_id: raw.service_id || raw.id,
  };
}

export function BookingModal({
  isOpen,
  onClose,
  provider,
  service: serviceProp,
  offerings: offeringsProp,
}: BookingModalProps) {
  const offerings = offeringsProp ?? provider.services ?? [];
  const [selectedOffering, setSelectedOffering] = useState<BookingOffering | null>(null);
  const service = selectedOffering ?? normalizeOffering(serviceProp);
  const [bookingTab, setBookingTab] = useState<BookingTabId>("service");
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
  const { openAuthDialog } = useAuthDialog();

  React.useEffect(() => {
    if (isOpen && user) {
      fetchAddresses();
    }
    if (isOpen) {
      setBookingTab("service");
      const preset = normalizeOffering(serviceProp);
      if (preset) {
        setSelectedOffering(preset);
      } else if (offerings.length === 1) {
        setSelectedOffering(normalizeOffering(offerings[0]));
      } else {
        setSelectedOffering(null);
      }
    }
  }, [isOpen, user, serviceProp, offerings]);

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
      toast.info("Photos attached. Continue to schedule when you're ready.");
    });

    return u;
  }, []);


  const config = useMemo(() => {
    if (!service) return DEFAULT_CONFIG;
    
    // Specific service name overrides
    if (service.name?.toLowerCase().includes('babysitting')) {
      return {
        ...(FORM_CONFIGS['Health & Wellness'] || DEFAULT_CONFIG),
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

    if (service.name?.toLowerCase().includes('nutritionist')) {
      return {
        ...(FORM_CONFIGS['Health & Wellness'] || DEFAULT_CONFIG),
        typeLabel: "Consultation Type",
        typeOptions: [
          { id: 'remote', label: 'Remote/Online', icon: <Home className="w-4 h-4" /> },
          { id: 'in_person', label: 'In-Person', icon: <Building2 className="w-4 h-4" /> },
        ],
        quantityLabel: "Number of Persons",
        quantityHint: "Who needs the dietary plan?",
        getQuantityBadge: () => 'Persons',
        descriptionLabel: "Dietary Goals & Health",
        descriptionPlaceholder: "Please share your goals, allergies, and any specific dietary requirements..."
      };
    }

    if (service.name?.toLowerCase().includes('doula') || service.name?.toLowerCase().includes('pregnancy')) {
      return {
        ...(FORM_CONFIGS['Health & Wellness'] || DEFAULT_CONFIG),
        typeLabel: "Care Type",
        typeOptions: [
          { id: 'prenatal', label: 'Prenatal Care', icon: <Calendar className="w-4 h-4" /> },
          { id: 'postpartum', label: 'Postpartum Support', icon: <Users className="w-4 h-4" /> },
        ],
        quantityLabel: "Number of Sessions",
        quantityHint: "Estimated sessions or weeks",
        getQuantityBadge: () => 'Sessions',
        descriptionLabel: "Pregnancy Stage & Needs",
        descriptionPlaceholder: "Please share your current trimester, specific concerns, or support required..."
      };
    }

    const beautyServices = ['makeup', 'coloring', 'facial', 'skincare', 'threading', 'waxing', 'massage', 'scrub'];
    if (beautyServices.some(s => service.name?.toLowerCase().includes(s))) {
      return {
        ...(FORM_CONFIGS['Personal & Grooming'] || DEFAULT_CONFIG),
        typeLabel: "Service Location",
        typeOptions: [
          { id: 'at_home', label: 'At My Location', icon: <Home className="w-4 h-4" /> },
          { id: 'at_salon', label: 'At Pro Location', icon: <Building2 className="w-4 h-4" /> },
        ],
        quantityLabel: "Number of Persons",
        quantityHint: "How many people?",
        getQuantityBadge: () => 'Persons',
        descriptionLabel: "Style Preferences & Details",
        descriptionPlaceholder: "Please describe your preferred look, any skin sensitivities, or style inspiration..."
      };
    }

    const categoryKey = resolveBookingCategoryKey(resolveServiceCategoryName(service));
    if (!categoryKey) return DEFAULT_CONFIG;
    return FORM_CONFIGS[categoryKey] || DEFAULT_CONFIG;
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

  const tabIndex = BOOKING_TAB_ORDER.indexOf(bookingTab);
  const isFirstTab = tabIndex <= 0;
  const isLastTab = tabIndex >= BOOKING_TAB_ORDER.length - 1;
  const tabCopy = BOOKING_TAB_COPY[bookingTab];

  const goToPrevTab = () => {
    if (!isFirstTab) {
      setBookingTab(BOOKING_TAB_ORDER[tabIndex - 1]);
    }
  };

  const goToNextTab = async () => {
    if (bookingTab === "service" && !service) {
      toast.error("Select which service you want to book");
      return;
    }
    const valid = await form.trigger(FIELDS_BY_TAB[bookingTab]);
    if (!valid) return;
    if (!isLastTab) {
      setBookingTab(BOOKING_TAB_ORDER[tabIndex + 1]);
    }
  };

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      const firstError = Object.values(form.formState.errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [form.formState.errors, watchedValues]);

  // Update default value if config changes (e.g. category changes)
  useEffect(() => {
    if (config?.typeOptions?.[0]?.id) {
      form.setValue('service_type', config.typeOptions[0].id, { shouldValidate: true, shouldDirty: true });
    }
    form.setValue('quantity', 1, { shouldValidate: true, shouldDirty: true });

    // Populate from query parameters (search results) if present
    if (isOpen && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const dateParam = params.get("date");
      const timeParam = params.get("time");
      const guestsParam = params.get("guests");
      if (dateParam) {
        form.setValue("scheduled_date", dateParam, { shouldValidate: true, shouldDirty: true });
      }
      if (timeParam) {
        form.setValue("scheduled_time", timeParam, { shouldValidate: true, shouldDirty: true });
      }
      if (guestsParam) {
        form.setValue("quantity", parseInt(guestsParam) || 1, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [config, form, isOpen]);

  const handleValidatePromo = async () => {
    const code = form.getValues('promo_code');
    if (!code) return;

    setIsValidatingPromo(true);
    setPromoError(null);
    
    // Estimate price for validation
    const quantity = form.getValues('quantity');
    const basePrice = service?.base_price || 0;
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

  const onSubmit = async (data: BookingValues) => {
    if (!service) {
      toast.error("Select a service before confirming");
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      formData.append('provider_id', provider.id);
      formData.append('service_id', service.service_id || service.id);
      formData.append('quantity_label', config.getQuantityBadge(data.service_type));

      const files = uppy.getFiles();
      for (const file of files) {
        if (file.data) {
          const optimized = await compressBlobToFile(
            file.data as Blob,
            file.name || "booking-photo.jpg",
            { preset: "booking" }
          );
          formData.append("images[]", optimized);
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
        className={cn(
          "relative z-50 w-full max-w-4xl pointer-events-auto bg-card",
          crudDialogUi.content,
          "overflow-hidden"
        )}
      >
        <div className="max-h-[min(90dvh,780px)] overflow-hidden">
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
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px] cursor-pointer shadow-lg shadow-blue-500/20"
                  onClick={() =>
                    openAuthDialog({
                      intent: "book",
                      description: `Sign in to book with ${provider.business_name} and manage your appointments on Kuba.`,
                    })
                  }
                >
                  Sign in to continue
                </Button>
                <button
                  type="button"
                  onClick={() =>
                    openAuthDialog({
                      intent: "book",
                      mode: "register",
                      description: `Create a free account to book with ${provider.business_name}.`,
                    })
                  }
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-tight py-2 text-center pointer-events-auto"
                >
                  New to Kuba? Create an account
                </button>
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
            <TabbedDialogLayout
              tabs={BOOKING_TABS}
              activeTab={bookingTab}
              onTabChange={(id) => setBookingTab(id as BookingTabId)}
              title={tabCopy.title}
              description={
                service
                  ? `${service.name} with ${provider.business_name}. ${tabCopy.description}`
                  : `Choose a service from ${provider.business_name}, then complete your request.`
              }
              onClose={onClose}
              footer={
                <>
                  {!isFirstTab && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPrevTab}
                      className={cn(dialogFormUi.footerBtnOutline, "flex-1")}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type={isLastTab ? "submit" : "button"}
                    form={isLastTab ? "booking-modal-form" : undefined}
                    onClick={!isLastTab ? () => void goToNextTab() : undefined}
                    disabled={form.formState.isSubmitting || (bookingTab === "service" && !service)}
                    className={cn(
                      dialogFormUi.footerBtnPrimary,
                      isFirstTab ? "w-full" : "flex-[2]"
                    )}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </span>
                    ) : isLastTab ? (
                      "Confirm booking"
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="ml-1.5 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </>
              }
            >
            <Form {...form}>
              <form
                id="booking-modal-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-0"
              >
                <div className={dialogFormUi.section}>
                {bookingTab === "service" && (
                  <BookingServiceStep
                    form={form}
                    service={service}
                    offerings={offerings}
                    selectedOffering={selectedOffering}
                    onSelectOffering={(offering) => setSelectedOffering(offering)}
                    config={config}
                    uppy={uppy}
                    showUppy={showUppy}
                    onToggleUppy={setShowUppy}
                    onUploadPhotos={() => setShowUppy(true)}
                  />
                )}

                {bookingTab === "location" && (
                  <BookingLocationStep
                    form={form}
                    addresses={addresses}
                    isAddingAddress={isAddingAddress}
                    isSavingAddress={isSavingAddress}
                    newAddress={newAddress}
                    onToggleAddressForm={setIsAddingAddress}
                    onChangeNewAddress={setNewAddress}
                    onSaveAddress={handleCreateAddress}
                  />
                )}

                {bookingTab === "schedule" && (
                  <BookingScheduleStep
                    form={form}
                    promoDiscount={promoDiscount}
                    promoError={promoError}
                    isValidatingPromo={isValidatingPromo}
                    onValidatePromo={handleValidatePromo}
                  />
                )}
                </div>
              </form>
            </Form>
            </TabbedDialogLayout>
          )}
        </div>
      </motion.div>
    </div>
  );
}
