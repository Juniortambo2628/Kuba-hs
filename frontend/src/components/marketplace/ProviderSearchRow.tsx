"use client";

import type { ProviderSearchAvatarData } from "@/components/marketplace/ProviderSearchAvatar";
import { ProviderSearchAvatar } from "@/components/marketplace/ProviderSearchAvatar";
import type { ProviderSearchMetaData } from "@/components/marketplace/ProviderSearchMeta";
import { ProviderSearchMeta } from "@/components/marketplace/ProviderSearchMeta";
import { SearchResultRow } from "@/components/marketplace/SearchResultRow";
import { providerHref } from "@/lib/provider-urls";

export type ProviderSearchRowData = ProviderSearchAvatarData &
  ProviderSearchMetaData & {
    id: string | number;
  };

interface ProviderSearchRowProps {
  provider: ProviderSearchRowData;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
  variant?: "modal" | "command";
  subtitle?: string;
  className?: string;
}

export function ProviderSearchRow({
  provider,
  href,
  onClick,
  selected,
  variant = "modal",
  subtitle,
  className,
}: ProviderSearchRowProps) {
  const resolvedHref = href ?? providerHref(provider);
  const isCommand = variant === "command";

  return (
    <SearchResultRow
      variant={variant}
      href={isCommand ? undefined : resolvedHref}
      onClick={onClick}
      selected={selected}
      title={provider.business_name}
      subtitle={subtitle}
      icon={<ProviderSearchAvatar provider={provider} size={isCommand ? "sm" : "md"} />}
      meta={isCommand ? undefined : <ProviderSearchMeta provider={provider} />}
      className={className}
      showChevron
    />
  );
}
