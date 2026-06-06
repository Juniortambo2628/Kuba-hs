import { cache } from "react";
import { getMediaUrl } from "@/lib/utils";

const DEV_TIMEOUT_MS = 20_000;
const PROD_TIMEOUT_MS = 8_000;

function apiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  return (raw || "http://127.0.0.1:8000").replace(/\/$/, "");
}

function settingsTimeoutMs(): number {
  return process.env.NODE_ENV === "development" ? DEV_TIMEOUT_MS : PROD_TIMEOUT_MS;
}

function logSettingsFetchIssue(error: unknown, base: string, timeoutMs: number) {
  if (error instanceof Error && error.name === "AbortError") {
    console.warn(
      `[SSR] Settings request timed out after ${timeoutMs}ms (${base}/api/settings). Ensure Laravel is running (php artisan serve).`
    );
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[SSR] Settings request failed (${base}/api/settings): ${message}`);
}

/** Cached per-request — shared by layout, home page, and metadata. */
export const getSSRSettings = cache(async (): Promise<Record<string, unknown>> => {
  const base = apiBaseUrl();
  const timeoutMs = settingsTimeoutMs();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${base}/api/settings`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[SSR] Settings returned HTTP ${res.status} from ${base}`);
      return {};
    }

    const data = await res.json();
    return (data.settings as Record<string, unknown>) || {};
  } catch (error) {
    logSettingsFetchIssue(error, base, timeoutMs);
    return {};
  } finally {
    clearTimeout(timeoutId);
  }
});

export interface HomeHeroSSR {
  title?: string;
  subtitle?: string;
  bgImage?: string;
  headline?: string;
  eyebrow?: string;
}

export function homeHeroFromSettings(settings: Record<string, unknown>): HomeHeroSSR | null {
  const headline =
    settingValue(settings, "home_hero", "hero_headline") ||
    settingValue(settings, "hero_text", "hero_headline") ||
    settingValue(settings, "home_hero", "hero_title") ||
    settingValue(settings, "hero_text", "hero_title");
  const eyebrow =
    settingValue(settings, "home_hero", "hero_eyebrow") ||
    settingValue(settings, "hero_text", "hero_eyebrow") ||
    settingValue(settings, "home_hero", "hero_subtitle") ||
    settingValue(settings, "hero_text", "hero_subtitle");
  const subtitle = eyebrow;
  const bgGroup = settingGroup(settings, "hero_backgrounds");
  const bgSetting = bgGroup.find((s) => s.key === "hero_bg_image");
  const bgRaw = getMediaUrl(bgSetting?.image_url || bgSetting?.value);
  const bgImage = bgRaw || undefined;

  if (!headline && !subtitle && !bgImage) return null;

  return { title: headline, subtitle, bgImage, headline, eyebrow };
}

type SettingEntry = { key?: string; value?: string; image_url?: string };

function settingGroup(settings: Record<string, unknown>, group: string): SettingEntry[] {
  const raw = settings[group];
  if (Array.isArray(raw)) return raw as SettingEntry[];
  if (raw && typeof raw === "object") {
    return Object.values(raw as Record<string, SettingEntry>);
  }
  return [];
}

function settingValue(settings: Record<string, unknown>, group: string, key: string): string | undefined {
  const groupObj = settings[group] as Record<string, SettingEntry> | undefined;
  if (groupObj && !Array.isArray(groupObj) && groupObj[key]) {
    return groupObj[key]?.value;
  }
  return settingGroup(settings, group).find((s) => s.key === key)?.value;
}

export function brandingFromSettings(settings: Record<string, unknown>) {
  return {
    siteName: settingValue(settings, "branding", "site_name") || settingValue(settings, "identity", "site_name") || "Kuba",
    siteDescription:
      settingValue(settings, "branding", "site_description") ||
      settingValue(settings, "identity", "site_description") ||
      "Professional Home Services Marketplace",
  };
}
