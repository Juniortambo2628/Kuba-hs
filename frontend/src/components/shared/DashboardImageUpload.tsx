"use client";

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, X } from 'lucide-react';

// Register plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

interface DashboardImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  type: 'avatar' | 'logo' | 'cms';
  label?: string;
  className?: string;
}

export function DashboardImageUpload({ 
  value, 
  onChange, 
  type, 
  label = "Upload Image",
  className 
}: DashboardImageUploadProps) {
  const [files, setFiles] = useState<any[]>([]);

  // Sync initial value if it exists but files is empty
  useEffect(() => {
    if (value && files.length === 0) {
      // In a real app, we might want to show the current file in FilePond
      // But for simplicity, we'll show a preview separately if value exists
    }
  }, [value]);

  const handleProcessFile = (error: any, file: any) => {
    if (!error && file.serverId) {
      onChange(file.serverId);
    }
  };

  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          {label}
        </label>
        {value && (
          <button 
            type="button"
            onClick={() => onChange('')}
            className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1 hover:underline"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {/* Preview Area */}
        <div className="md:col-span-1">
          <div className={cn(
            "relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-border/40 bg-muted/30 flex items-center justify-center group transition-all",
            value ? "border-primary/20 bg-primary/5" : "hover:border-primary/20"
          )}>
            {value ? (
              <img 
                src={getFullUrl(value)} 
                alt="Upload Preview" 
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
              />
            ) : (
              <div className="text-center p-4">
                <ImageIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground/40 leading-tight">
                  No Image<br/>Selected
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Area */}
        <div className="md:col-span-3">
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={false}
            maxFiles={1}
            server={{
              process: {
                url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/media/upload`,
                withCredentials: true,
                ondata: (formData) => {
                  formData.append('type', type);
                  return formData;
                },
                onload: (response) => response.toString(),
              },
              revert: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/media/revert`,
            }}
            onprocessfile={handleProcessFile}
            name="file"
            labelIdle='Drag & Drop or <span class="filepond--label-action">Browse</span>'
            acceptedFileTypes={['image/*']}
            imagePreviewHeight={100}
            className="filepond-premium-custom"
          />
        </div>
      </div>

      <style jsx global>{`
        .filepond-premium-custom .filepond--panel-root {
          background-color: transparent;
          border-radius: 1.25rem;
          border: 1px dashed rgba(0,0,0,0.1);
        }
        .filepond-premium-custom .filepond--drop-label {
          color: #64748b;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .filepond-premium-custom .filepond--label-action {
          text-decoration: none;
          color: #2563eb;
        }
        .dark .filepond-premium-custom .filepond--panel-root {
          border-color: rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
