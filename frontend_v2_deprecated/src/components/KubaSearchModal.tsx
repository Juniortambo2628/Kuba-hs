"use client";

import { Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon, MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import React, { FC, Fragment, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { TaxonomyType } from "@/data/types";

interface Category {
  id: number;
  name: string;
}

interface ProviderResult {
  id: number;
  business_name: string;
  location_name: string;
  rating: number;
  review_count: number;
  logo?: string;
}

interface KubaSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KubaSearchModal: FC<KubaSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<ProviderResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setSearchTerm("");
      setResults([]);
      setSelectedCategory(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2 || selectedCategory) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/api/categories');
      setCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category_id', selectedCategory.toString());
      
      const { data } = await axiosInstance.get(`/api/search?${params.toString()}`);
      setResults(data.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 p-8 text-left align-middle shadow-2xl transition-all border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-8">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                    Find <span className="text-primary-6000">Professionals</span>
                  </Dialog.Title>
                  <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-primary-6000 rounded-2xl text-lg font-medium placeholder-neutral-500"
                    placeholder="Search services (e.g. Plumbing, Cleaning)..."
                  />
                </div>

                <div className="mt-8">
                  <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedCategory === cat.id
                            ? "bg-primary-6000 text-white shadow-lg"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">
                    {isSearching ? "Searching..." : results.length > 0 ? "Results" : "Start typing to search"}
                  </h4>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {results.map((result) => (
                      <Link
                        key={result.id}
                        href={`/service-detail/${result.id}` as any}
                        onClick={onClose}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-primary-6000 dark:hover:border-primary-6000 transition-all group"
                      >
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {result.logo ? (
                             <img src={result.logo || "/placeholder-light.png"} alt={result.business_name} className="w-full h-full object-cover" />
                          ) : (
                             <span className="text-xl font-bold text-neutral-400">{result.business_name[0]}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-primary-6000 transition-colors">
                            {result.business_name}
                          </h5>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                              <StarIcon className="w-4 h-4 fill-current" /> {result.rating || "New"}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-neutral-500">
                              <MapPinIcon className="w-4 h-4" /> {result.location_name || "Nairobi"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default KubaSearchModal;
