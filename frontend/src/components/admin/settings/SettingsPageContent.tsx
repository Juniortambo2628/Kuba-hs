import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { dashboardUi } from '@/lib/dashboard-ui';
import { uiPrimitives } from '@/lib/ui-primitives';
import { ImageSettingCard } from './ImageSettingCard';
import { resolveMediaUrl } from '@/lib/utils';
import { RichTextEditor } from '@/components/shared/ui/RichTextEditor';
import type { Setting } from './types';
import { LivePreviewModal } from '@/app/admin/settings/components/LivePreviewModal';

interface SettingsPageContentProps {
  pageInfo: { id: string; label: string };
  pageSettings: Setting[];
  allPlatformSettings: Setting[];
  files: Record<string, File>;
  onValueChange: (group: string, id: string, value: string) => void;
  onRemoveImage: (group: string, id: string) => void;
  onSetFile: (id: string, file: File) => void;
}

export function SettingsPageContent({
  pageInfo,
  pageSettings,
  allPlatformSettings,
  files,
  onValueChange,
  onRemoveImage,
  onSetFile,
}: SettingsPageContentProps) {
  return (
    <AccordionItem value={pageInfo.id} className="border border-border/40 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm px-2">
      <AccordionTrigger className="px-6 py-5 hover:no-underline group h-auto min-h-[5.5rem]">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">{pageInfo.label}</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {pageSettings.length} configurations mapped
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-8 pt-2">
        <div className="mb-8 flex items-center justify-between border-b border-border/10 pb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Manage Configuration</span>
          <LivePreviewModal sectionId={pageInfo.id} currentSettings={allPlatformSettings} />
        </div>
        {pageSettings.length === 0 ? (
          <div className="py-12 text-center bg-muted/10 rounded-2xl border border-dashed border-border/40">
            <p className="text-muted-foreground text-sm font-medium">No configurations currently mapped for this section.</p>
          </div>
        ) : (
          <div className={uiPrimitives.layout.grid3}>
            {pageSettings.map((setting) => (
              <div key={setting.id}>
                {setting.type === 'image' ? (
                  <ImageSettingCard
                    setting={setting}
                    pendingFile={files[setting.id]}
                    onSetFile={(file: File) => onSetFile(setting.id, file)}
                    onRemove={() => onRemoveImage(setting.group, setting.id)}
                    getMediaUrl={resolveMediaUrl}
                  />
                ) : (
                  <Card className={cn(dashboardUi.card.padding, 'border border-border/40 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm space-y-3 hover:border-primary/20 transition-all h-full')}>
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground truncate" title={setting.label || setting.key.replace(/_/g, ' ')}>
                        {setting.label || setting.key.replace(/_/g, ' ')}
                      </label>
                      <div className="p-1 px-2.5 bg-primary/5 rounded-lg text-[10px] font-bold text-primary/60 border border-primary/10 shrink-0">
                        {setting.key}
                      </div>
                    </div>
                    {setting.type === 'textarea' ? (
                      <RichTextEditor
                        value={setting.value || ''}
                        onChange={(value) => onValueChange(setting.group, setting.id, value)}
                        placeholder={`Enter ${setting.label || setting.key.replace(/_/g, ' ')}...`}
                      />
                    ) : (
                      <Input
                        className="h-12 bg-muted/5 border-border/40 px-4 font-bold text-foreground focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all rounded-xl"
                        value={setting.value || ''}
                        onChange={(e) => onValueChange(setting.group, setting.id, e.target.value)}
                      />
                    )}
                    {setting.description && (
                      <p className="text-[10px] font-medium text-muted-foreground/60 italic px-1 pt-1">
                        {setting.description}
                      </p>
                    )}
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
