"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

import { useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Sparkles, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import { useData } from "@/hooks/useData";
import { uiPrimitives } from "@/lib/ui-primitives";
import { getMediaUrl } from "@/lib/utils";
import { CategoryFormDialog } from "@/components/admin/CategoryFormDialog";
import { ServiceFormDialog } from "@/components/admin/ServiceFormDialog";

interface Service {
    id: string;
    name: string;
    description: string;
    category_id: string;
    thumbnail_url?: string;
}

interface Category {
    id: string;
    name: string;
    description: string;
    icon_url?: string | null;
    image_url: string | null;
    services: Service[];
}

function categoryImagePath(cat: Category): string {
    if (!cat.image_url) return "";
    return cat.image_url.startsWith("/storage/")
        ? cat.image_url
        : `/storage/${cat.image_url.replace(/^\//, "").replace(/^storage\//, "")}`;
}

export default function AdminCategories() {
    const { data: categories, isLoading, refetch: fetchCategories } = useData<Category[]>("/api/admin/categories", { 
        initialData: [],
        extractKey: 'categories'
    });
    
    const [selectedCat, setSelectedCat] = useState<Category | null>(null);
    const [selectedSvc, setSelectedSvc] = useState<Service | null>(null);
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isSvcOpen, setIsSvcOpen] = useState(false);
    const [catInitial, setCatInitial] = useState<{ name: string; description: string; image_url: string }>({
        name: '',
        description: '',
        image_url: '',
    });
    const [svcInitial, setSvcInitial] = useState({ name: '', description: '' });
    const [deleteCatTarget, setDeleteCatTarget] = useState<Category | null>(null);
    const [deleteSvcTarget, setDeleteSvcTarget] = useState<{ svc: Service; cat: Category } | null>(null);

    const handleDeleteCategory = async (id: string) => {
        try { await axiosInstance.delete(`/api/admin/categories/${id}`); toast.success("Category deleted"); fetchCategories(); }
        catch (err: unknown) { toast.error(handleApiError(err)); }
    };

    const handleDeleteService = async (id: string | number) => {
        try { await axiosInstance.delete(`/api/admin/services/${id}`); toast.success("Service deleted"); fetchCategories(); }
        catch (err: unknown) { toast.error(handleApiError(err)); }
    };

    const openAddCat = () => {
        setSelectedCat(null);
        setCatInitial({ name: '', description: '', image_url: '' });
        setIsCatOpen(true);
    };

    const openEditCat = (cat: Category) => {
        setSelectedCat(cat);
        setCatInitial({
            name: cat.name,
            description: cat.description,
            image_url: categoryImagePath(cat),
        });
        setIsCatOpen(true);
    };

    const openAddService = (cat: Category) => {
        setSelectedCat(cat);
        setSelectedSvc(null);
        setSvcInitial({ name: '', description: '' });
        setIsSvcOpen(true);
    };

    const openEditService = (cat: Category, svc: Service) => {
        setSelectedCat(cat);
        setSelectedSvc(svc);
        setSvcInitial({ name: svc.name, description: svc.description });
        setIsSvcOpen(true);
    };

    if (isLoading) {
        return <DashboardPageSkeleton width="narrow" metrics={0} bodyHeight="h-64" />;
    }

    return (
        <DashboardPageContainer width="narrow" className="space-y-10">
            <DashboardPageHeader 
                title="Service Categories" 
                subtitle="Manage platform service taxonomy and professional offerings."
            >
                <Button 
                    onClick={openAddCat}
                    className="h-12 bg-primary hover:bg-black text-white rounded-2xl font-bold px-8 shadow-md transition-all flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Create Category
                </Button>
            </DashboardPageHeader>

            <CategoryFormDialog
                open={isCatOpen}
                onOpenChange={setIsCatOpen}
                categoryId={selectedCat?.id ?? null}
                initial={catInitial}
                onSuccess={fetchCategories}
            />

            {selectedCat && (
                <ServiceFormDialog
                    open={isSvcOpen}
                    onOpenChange={setIsSvcOpen}
                    categoryId={selectedCat.id}
                    categoryName={selectedCat.name}
                    serviceId={selectedSvc?.id ?? null}
                    thumbnailUrl={selectedSvc?.thumbnail_url}
                    initial={svcInitial}
                    onSuccess={fetchCategories}
                />
            )}

            <div className="space-y-4">
                {categories.map((cat) => (
                    <Card key={cat.id} className="border border-border">
                        <CardHeader className="px-6 py-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
                                        {cat.image_url ? (
                                            <img
                                                src={getMediaUrl(cat.image_url, "service")}
                                                alt={cat.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold text-foreground">{cat.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Button variant="ghost" size="icon" onClick={() => openEditCat(cat)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => setDeleteCatTarget(cat)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className={uiPrimitives.label.caps}>Service Registry</h4>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => openAddService(cat)} 
                                    className="text-primary hover:text-black hover:bg-red-50 h-9 font-bold rounded-xl"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Offering
                                </Button>
                            </div>
                            {cat.services?.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {cat.services.map(svc => (
                                        <div key={svc.id} className="bg-muted/30 rounded-2xl p-4 flex justify-between items-start group border border-border/50 hover:border-border hover:bg-muted/50 transition-all flex-1">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white border border-border overflow-hidden shrink-0 shadow-sm">
                                                    {svc.thumbnail_url ? (
                                                        <img src={getMediaUrl(svc.thumbnail_url, "service")} alt={svc.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Sparkles className="w-6 h-6 text-muted-foreground/30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <h5 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{svc.name}</h5>
                                                    <p className="text-[11px] font-medium text-muted-foreground line-clamp-1">{svc.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => openEditService(cat, svc)} className="w-7 h-7 text-muted-foreground hover:text-primary">
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-red-500" onClick={() => setDeleteSvcTarget({ svc, cat })}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-muted/30 rounded-lg border border-border/50">
                                    <p className="text-sm text-muted-foreground">No services added yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <AppConfirmDialog
                open={!!deleteCatTarget}
                onOpenChange={() => setDeleteCatTarget(null)}
                onConfirm={async () => { if (deleteCatTarget) { await handleDeleteCategory(deleteCatTarget.id); setDeleteCatTarget(null); } }}
                title="Purge Category?"
                description={<>Are you sure you want to delete <span className="font-bold text-foreground">&quot;{deleteCatTarget?.name}&quot;</span>? This will also permanently remove all services associated with this category.</>}
            />
            <AppConfirmDialog
                open={!!deleteSvcTarget}
                onOpenChange={() => setDeleteSvcTarget(null)}
                onConfirm={async () => { if (deleteSvcTarget) { await handleDeleteService(deleteSvcTarget.svc.id); setDeleteSvcTarget(null); } }}
                title="Delete Service?"
                description={<>Are you sure you want to remove <span className="font-bold text-foreground">&quot;{deleteSvcTarget?.svc.name}&quot;</span> from the <span className="font-bold text-foreground">{deleteSvcTarget?.cat.name}</span> category? This action cannot be undone.</>}
                confirmLabel="Delete Service"
                cancelLabel="Abort"
            />
        </DashboardPageContainer>
    );
}
