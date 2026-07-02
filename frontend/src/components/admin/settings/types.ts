export interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  type: string;
  group: string;
  description?: string | null;
  image_url?: string | null;
}
