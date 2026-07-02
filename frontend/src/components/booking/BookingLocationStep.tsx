"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/shared/ui";
import { Briefcase, Home, MoreHorizontal } from "lucide-react";
import dynamic from "next/dynamic";
import type { BookingForm, BookingValues } from "@/components/booking/booking-modal-types";
import { cn } from "@/lib/utils";
import { dialogFormUi } from "@/lib/crud-dialog-ui";

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-[240px] rounded-2xl border border-border/50 bg-muted/30" />,
});

interface BookingLocationStepProps {
  form: BookingForm;
  addresses: any[];
  isAddingAddress: boolean;
  isSavingAddress: boolean;
  newAddress: {
    address_type: "home" | "work" | "other";
    street_address: string;
    apartment: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    is_default: boolean;
  };
  onToggleAddressForm: (value: boolean) => void;
  onChangeNewAddress: (value: any) => void;
  onSaveAddress: () => void;
}

export function BookingLocationStep({
  form,
  addresses,
  isAddingAddress,
  isSavingAddress,
  newAddress,
  onToggleAddressForm,
  onChangeNewAddress,
  onSaveAddress,
}: BookingLocationStepProps) {
  return (
    <FormField
      control={form.control}
      name="address_id"
      render={({ field }) => (
        <FormItem className="space-y-3 py-4 first:pt-0">
          <FormLabel className="text-sm font-semibold flex items-center justify-between">
            Service address
            <button
              type="button"
              onClick={() => onToggleAddressForm(!isAddingAddress)}
              className="text-[10px] text-primary uppercase font-bold tracking-widest hover:underline"
            >
              {isAddingAddress ? "Cancel" : "Add new address"}
            </button>
          </FormLabel>
          <FormControl>
            {isAddingAddress ? (
              <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="space-y-2">
                  <FieldLabel>Address Type</FieldLabel>
                  <div className="flex gap-2">
                    {[
                      { id: "home", label: "Home", icon: Home },
                      { id: "work", label: "Work", icon: Briefcase },
                      { id: "other", label: "Other", icon: MoreHorizontal },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => onChangeNewAddress({ ...newAddress, address_type: type.id as any })}
                        className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                          newAddress.address_type === type.id
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border text-muted-foreground hover:border-primary/30"
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
                    <FieldLabel>Street Address</FieldLabel>
                    <Input value={newAddress.street_address} onChange={(e) => onChangeNewAddress({ ...newAddress, street_address: e.target.value })} className={dialogFormUi.input} placeholder="e.g. 123 Main St" />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel>Apt/Suite</FieldLabel>
                    <Input value={newAddress.apartment} onChange={(e) => onChangeNewAddress({ ...newAddress, apartment: e.target.value })} className={dialogFormUi.input} placeholder="Optional" />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel>City</FieldLabel>
                    <Input value={newAddress.city} onChange={(e) => onChangeNewAddress({ ...newAddress, city: e.target.value })} className={dialogFormUi.input} placeholder="e.g. Nairobi" />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel>State / County</FieldLabel>
                    <Input value={newAddress.state} onChange={(e) => onChangeNewAddress({ ...newAddress, state: e.target.value })} className={dialogFormUi.input} placeholder="e.g. Nairobi County" />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel>Postal Code</FieldLabel>
                    <Input value={newAddress.postal_code} onChange={(e) => onChangeNewAddress({ ...newAddress, postal_code: e.target.value })} className={dialogFormUi.input} placeholder="e.g. 00100" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                    Pin exact location
                    {newAddress.latitude && <span className="text-primary lowercase font-medium">Coordinates set</span>}
                  </label>
                  <div className="relative">
                    <LocationPicker
                      position={newAddress.latitude && newAddress.longitude ? [newAddress.latitude, newAddress.longitude] : null}
                      onChange={(lat: number, lng: number) => onChangeNewAddress({ ...newAddress, latitude: lat, longitude: lng })}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={onSaveAddress}
                  disabled={isSavingAddress || !newAddress.street_address || !newAddress.city || !newAddress.state || !newAddress.postal_code}
                  className="w-full text-xs font-bold uppercase rounded-lg h-10"
                >
                  {isSavingAddress ? "Saving..." : "Save address"}
                </Button>
              </div>
            ) : (
              <select className={cn("w-full", dialogFormUi.input, "px-4 appearance-none outline-none")} {...field}>
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
  );
}
