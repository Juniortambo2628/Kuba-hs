import { createElement } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import axiosInstance from "@/lib/axios";
import { useCategories } from "../useCategories";

jest.mock("@/lib/axios", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockedGet = axiosInstance.get as jest.Mock;

const wrapper = ({ children }: { children?: React.ReactNode }) =>
  createElement(SWRConfig, { value: { provider: () => new Map() } }, children);

describe("useCategories", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedGet.mockResolvedValue({
      data: { data: [{ id: 1, name: "Cleaning" }, { id: 2, name: "Plumbing" }] },
    });
  });

  it("unwraps the Laravel envelope into a plain array", async () => {
    const { result } = renderHook(() => useCategories(), { wrapper });

    await waitFor(() => expect(result.current.categories).toHaveLength(2));
    expect(result.current.isLoading).toBe(false);
    expect(mockedGet).toHaveBeenCalledWith("/api/categories");
  });

  it("serves two mounted consumers from one request", async () => {
    const { result } = renderHook(() => [useCategories(), useCategories()], {
      wrapper,
    });

    await waitFor(() => expect(result.current[0].categories).toHaveLength(2));
    expect(result.current[1].categories).toHaveLength(2);
    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it("does not fetch while disabled", async () => {
    const { result } = renderHook(() => useCategories({ enabled: false }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.categories).toEqual([]);
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it("hands out one array per render while loading, not a new one each time", () => {
    mockedGet.mockReturnValue(new Promise(() => {})); // never resolves

    const { result, rerender } = renderHook(() => useCategories(), { wrapper });
    const whileLoading = result.current.categories;

    rerender();
    rerender();

    // GlobalSearch's debounced effect depends on this array: a fresh []
    // per render re-runs it after every render until React throws
    // "Maximum update depth exceeded".
    expect(result.current.categories).toBe(whileLoading);
  });

  it("keeps the loaded array stable across renders", async () => {
    const { result, rerender } = renderHook(() => useCategories(), { wrapper });
    await waitFor(() => expect(result.current.categories).toHaveLength(2));

    const loaded = result.current.categories;
    rerender();

    expect(result.current.categories).toBe(loaded);
  });
});
