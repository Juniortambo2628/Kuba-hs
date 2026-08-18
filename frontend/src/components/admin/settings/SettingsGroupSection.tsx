import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { dashboardUi } from '@/lib/dashboard-ui';
import { uiPrimitives } from '@/lib/ui-primitives';
import { ImageSettingCard } from './ImageSettingCard';
import { resolveMediaUrl } from '@/lib/utils';
import { RichTextEditor } from '@/components/shared/ui/RichTextEditor';
import type { ComponentType } from 'react';
import type { Setting } from './types';

interface SettingsGroupSectionProps {
  group: {
    id: string;
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    settings: Setting[];
  };
  files: Record<string, File>;
  onValueChange: (group: string, id: string, value: string) => void;
  onRemoveImage: (group: string, id: string) => void;
  onSetFile: (id: string, file: File) => void;
}

export function SettingsGroupSection({
  group,
  files,
  onValueChange,
  onRemoveImage,
  onSetFile,
}: SettingsGroupSectionProps) {
  const GroupIcon = group.icon;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-border/40 shadow-sm text-primary">
          <GroupIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">{group.label}</h3>
          <p className="text-xs font-medium text-muted-foreground">{group.description}</p>
        </div>
      </div>

      <div className={uiPrimitives.layout.grid3}>
        {group.settings.map((setting) => (
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
              <Card className={cn(dashboardUi.card.padding, 'border border-border/40 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm space-y-3 hover:border-primary/20 transition-all')}>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground truncate">
                    {setting.label || setting.key.replace(/_/g, ' ')}
                  </label>
                  <div className="p-1 px-2.5 bg-primary/5 rounded-lg text-[10px] font-bold text-primary/60 border border-primary/10">
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
                  <p className="text-[10px] font-medium text-muted-foreground/60 italic px-1">
                    {setting.description}
                  </p>
                )}
              </Card>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
