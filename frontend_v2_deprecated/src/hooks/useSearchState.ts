import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';

/**
 * Shared hook for managing common dashboard search and filter states
 * persists state in the URL automatically.
 */
export function useSearchState() {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ shallow: false }));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault('').withOptions({ shallow: false }));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ shallow: false }));

  return {
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
  };
}
