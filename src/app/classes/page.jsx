"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, ArrowRight, ChevronDown } from "lucide-react";
import { Button, TextField, InputGroup, Select, ListBox, Pagination } from "@heroui/react";
import Link from "next/link";
import { serverFetch } from "@/lib/core/server";

export default function AllClassesPage({ searchParams }) {
  const router = useRouter();

  const resolvedSearchParams = use(searchParams);
  const initialSearch = resolvedSearchParams?.search || "";
  const initialCategory = resolvedSearchParams?.category || "All";
  const initialPage = parseInt(resolvedSearchParams?.page, 10) || 1;

  const [classes, setClasses] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage);

  const categories = ["All", "CrossFit", "Yoga", "Strength", "Cardio", "Pilates"];
  const itemsPerPage = 12;
  const totalPages = Math.ceil(total / itemsPerPage);

  const startItem = total === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, total);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (category !== "All") sp.set("category", category);
    if (page) sp.set("page", page.toString());

    const path = `?${sp.toString()}`;
    router.push(path);

    let isCancelled = false;

    const fetchClassesData = async () => {
      try {
        const queryPath = `/all-classes?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&page=${page}&perPage=${itemsPerPage}`;
        const data = await serverFetch(queryPath);

        if (isCancelled) return;

        if (data && data.classes) {
          setClasses(data.classes);
          setTotal(data.total || 0);
        } else if (Array.isArray(data)) {
          setClasses(data);
          setTotal(data.length);
        }
      } catch (error) {
        if (isCancelled) return;
        console.error("Error connecting via serverFetch:", error);
        setClasses([]);
        setTotal(0);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchClassesData();
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(delayDebounceFn);
    };
  }, [router, search, category, page]);

  const handleCategorySelection = (keys) => {
    let selectedValue;

    if (typeof keys === "string") {
      selectedValue = keys;
    } else if (keys instanceof Set || Array.isArray(keys)) {
      selectedValue = Array.from(keys);
    } else {
      selectedValue = "All";
    }

    setCategory(selectedValue || "All");
    setPage(1);
  };

  const getPageNumbers = (current, totalP) => {
    const delta = 1;
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(totalP - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) range.unshift("ellipsis-start");
    if (current + delta < totalP - 1) range.push("ellipsis-end");

    range.unshift(1);
    if (totalP > 1) range.push(totalP);

    return range;
  };

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase sm:text-4xl">
            All Available Classes
          </h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm">
            Browse through our verified professional health workouts to match your structural goals.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-end justify-between mb-10 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">

          <div className="w-full md:max-w-md">
            <TextField
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              className="w-full"
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Search Program</span>
              <InputGroup className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-within:border-blue-500 rounded-xl transition-all">
                <InputGroup.Prefix className="pl-3 text-slate-400">
                  <Search className="w-4 h-4" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="Search fitness classes by name..."
                  className="bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm py-2.5 px-3 outline-none w-full"
                />
              </InputGroup>
            </TextField>
          </div>

          <div className="w-full md:w-64 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filter Category
            </span>
            <Select
              selectedKeys={new Set([category])}
              onSelectionChange={handleCategorySelection}
              disallowEmptySelection
            >
              <Select.Trigger className="w-full flex items-center justify-between bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl py-2.5 px-4 text-sm font-normal transition-all shadow-sm">
                <Select.Value>
                  {category === "All" ? "All Categories" : category}
                </Select.Value>
                <Select.Indicator>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </Select.Indicator>
              </Select.Trigger>

              <Select.Popover className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl mt-1 overflow-hidden z-50">
                <ListBox className="p-1">
                  {categories.map((cat) => (
                    <ListBox.Item
                      key={cat}
                      id={cat}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer capitalize ${
                        category === cat
                          ? "bg-blue-600 text-white font-bold"
                          : "text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span>{cat}</span>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-6 text-sm text-slate-500">
          Showing {classes.length} fitness program{classes.length !== 1 && "s"}
        </div>

        {classes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 text-sm">No approved fitness programs found matching criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {classes.map((cls) => (
                <article
                  key={cls._id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {cls.image && (
                      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={cls.image}
                          alt={cls.name || cls.className}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow">
                          {cls.bookingCount || 0} Bookings
                        </span>
                      </div>
                    )}

                    <div className="p-5">
                      <span className="text-[10px] font-extrabold tracking-wider text-blue-600 uppercase bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md">
                        {cls.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-3 line-clamp-1">
                        {cls.name || cls.className}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">
                        Trainer: <span className="text-slate-600 dark:text-slate-300">{cls.trainerName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-50 dark:border-slate-800/40 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="text-blue-600 dark:text-blue-400 text-sm">${cls?.price || "Free"}</span>
                      <div className="flex items-center gap-1 text-slate-400 font-normal text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{cls.duration || '60 mins'}</span>
                      </div>
                    </div>

                    <Link href={`/classes/${cls._id}`}>
                      <Button
                        size="sm"
                        radius="xl"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs h-9 px-4 shadow-md shadow-blue-200 dark:shadow-none"
                      >
                        View Details
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="w-full flex flex-col items-center justify-center gap-2 mt-8">
                <Pagination>
                  <Pagination.Summary className="text-xs text-slate-500">
                    Showing {startItem}-{endItem} of {total} results
                  </Pagination.Summary>

                  <Pagination.Content>
                    <Pagination.Item>
                      <Pagination.Previous
                        isDisabled={page === 1}
                        onPress={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        <Pagination.PreviousIcon />
                        <span>Previous</span>
                      </Pagination.Previous>
                    </Pagination.Item>

                    {getPageNumbers(page, totalPages).map((p, idx) =>
                      p === "ellipsis-start" || p === "ellipsis-end" ? (
                        <Pagination.Item key={`${p}-${idx}`}>
                          <Pagination.Ellipsis />
                        </Pagination.Item>
                      ) : (
                        <Pagination.Item key={p}>
                          <Pagination.Link
                            isActive={p === page}
                            onPress={() => setPage(p)}
                          >
                            {p}
                          </Pagination.Link>
                        </Pagination.Item>
                      )
                    )}

                    <Pagination.Item>
                      <Pagination.Next
                        isDisabled={page === totalPages}
                        onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
                        <span>Next</span>
                        <Pagination.NextIcon />
                      </Pagination.Next>
                    </Pagination.Item>
                  </Pagination.Content>
                </Pagination>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}