"use client"
import { User } from "@/types"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "provider", "customer"]),
  is_active: z.boolean().default(true),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
})

type UserFormValues = z.infer<typeof userSchema>

interface UserDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: UserFormValues) => Promise<void>
  user?: User | null
}

export function UserDialog({ isOpen, onClose, onSave, user }: UserDialogProps) {
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      role: "customer",
      is_active: true,
      password: "",
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "customer",
        is_active: user.is_active ?? true,
        password: "",
      })
    } else {
      reset({
        name: "",
        email: "",
        role: "customer",
        is_active: true,
        password: "",
      })
    }
  }, [user, reset, isOpen])

  const onSubmit = async (data: UserFormValues) => {
    setIsSaving(true)
    try {
      await onSave(data)
      onClose()
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setIsSaving(false)
    }
  }

  const role = watch("role")
  const isActive = watch("is_active")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase text-slate-800 tracking-tight">
            {user ? "Modify User" : "Provision New Account"}
          </DialogTitle>
          <DialogDescription className="font-bold text-gray-400 italic text-xs">
            {user ? "Update account credentials and system access." : "Create a new marketplace participant with specific roles."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6 font-geist">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</Label>
              <Input
                {...register("name")}
                className="h-12 rounded-xl border-none shadow-sm focus-visible:ring-sky-100 font-bold"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Identity</Label>
              <Input
                {...register("email")}
                className="h-12 rounded-xl border-none shadow-sm focus-visible:ring-sky-100 font-bold"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Role</Label>
                <Select
                  value={role}
                  onValueChange={(val: any) => setValue("role", val)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-none shadow-sm focus:ring-sky-100 font-bold">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-premium">
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Access Status</Label>
                <div className="h-12 flex items-center justify-between px-4 bg-white rounded-xl shadow-sm">
                  <span className="text-xs font-bold text-gray-400">Active</span>
                  <Switch
                    checked={isActive}
                    onCheckedChange={(val) => setValue("is_active", val)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {user ? "New Password (Optional)" : "Account Password"}
              </Label>
              <Input
                {...register("password")}
                type="password"
                className="h-12 rounded-xl border-none shadow-sm focus-visible:ring-sky-100 font-bold"
                placeholder="********"
              />
              {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full h-14 bg-slate-800 hover:bg-sky-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : user ? "Update Account" : "Provision Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
