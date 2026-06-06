"use client";

import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, X, Loader2, Camera } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { compressImageFiles } from "@/lib/image-compression";
import { toast } from "sonner";
import { Booking } from "@/types";

interface WriteReviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking;
    onSuccess: () => void;
}

export function WriteReviewDialog({ isOpen, onClose, booking, onSuccess }: WriteReviewDialogProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);
            
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please provide a star rating");
            return;
        }

        setIsSubmitting(true);
        const optimizedImages = await compressImageFiles(images, { preset: "review" });
        const formData = new FormData();
        formData.append("booking_id", booking.id.toString());
        formData.append("rating", rating.toString());
        formData.append("comment", comment);

        optimizedImages.forEach((image, i) => {
            formData.append(`images[${i}]`, image);
        });

        try {
            await axiosInstance.post("/api/reviews", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Thank you for your feedback!");
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-[#0B0F19]">
                <div className="h-2 w-full bg-primary/20">
                    <div className="h-full bg-primary" style={{ width: `${(rating / 5) * 100}%`, transition: 'width 0.3s ease' }} />
                </div>
                
                <div className="p-8 space-y-8">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                               <Camera className="w-6 h-6" />
                           </div>
                           <div>
                               <DialogTitle className="text-2xl font-bold tracking-tight">Rate your Experience</DialogTitle>
                               <DialogDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-0.5">
                                   Order #{booking.booking_number}
                               </DialogDescription>
                           </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Star Rating Section */}
                        <div className="flex flex-col items-center gap-4 py-4 bg-muted/30 rounded-[2rem] border border-border/50">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                        className="transition-all duration-200 transform hover:scale-125 focus:outline-none"
                                    >
                                        <Star 
                                            className={`w-10 h-10 ${
                                                star <= (hoveredRating || rating) 
                                                ? "fill-primary text-primary" 
                                                : "text-muted-foreground opacity-30"
                                            }`} 
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                {rating > 0 ? ["Terrible", "Poor", "Average", "Good", "Excellent"][rating - 1] : "Select your rating"}
                            </p>
                        </div>

                        {/* Comment Section */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Your Feedback</label>
                            <Textarea 
                                placeholder="What did you like? What can be improved?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[120px] rounded-[1.5rem] border-border bg-card/50 focus:ring-primary/20 resize-none p-4 text-sm"
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Photos (Optional)</label>
                            <div className="flex flex-wrap gap-3">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border group">
                                        <img src={src} className="w-full h-full object-cover" />
                                        <button 
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {previews.length < 5 && (
                                    <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center transition-all bg-muted/20">
                                        <Upload className="w-5 h-5 text-muted-foreground" />
                                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            onClick={onClose}
                            className="flex-1 h-12 rounded-2xl font-bold text-[10px] uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting || rating === 0}
                            className="flex-[2] h-12 bg-foreground text-background hover:bg-muted hover:text-foreground rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-foreground/10"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
