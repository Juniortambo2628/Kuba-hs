"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function BaseServicesPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/categories");
    }, [router]);

    return (
        <div className="flex h-[400px] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-muted-foreground font-bold">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm tracking-widest uppercase bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent">
                  Synchronizing Service Categories...
                </p>
            </div>
        </div>
    );
}
