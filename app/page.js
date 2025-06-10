"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "@/lib/debounce";

import TodoCardSkeleton, { TodoCard } from "@/components/todo-card";
import { useTodos } from "@/hooks/use-todos";
import { Button } from "@/components/ui/button";
import { useRepoModal } from "@/hooks/use-modal";

const ITEMS_PER_PAGE = 10;

export default function TodosPage() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [status, setStatus] = useQueryState("status", { defaultValue: "all" });
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: Number,
    serialize: String,
  });

  const debouncedSearch = useDebounce(search, 300);
  const { openModal } = useRepoModal();

  const { data: { todos = [], meta = {} } = {}, isLoading } = useTodos({
    search: debouncedSearch,
    status,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const totalPages = meta.total ? Math.ceil(meta.total / ITEMS_PER_PAGE) : 1;

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <div className="min-h-screen flex flex-col gap-y-6 w-full items-center bg-gray-100 p-6">
      {/* Filters */}
      <div className="fixed top-0 left-0 z-50 w-full bg-gray-100 px-4 py-3 shadow-xs">
        <div className="flex flex-col gap-y-3 md:flex-row gap-2 max-w-2xl w-full mx-auto py-1">
          <Input
            value={search || ""}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title"
          />
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-fit">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
            onClick={() => openModal("create")}
          >
            Create Todo
            <span className="ml-2">+</span>
          </Button>
        </div>
      </div>

      {/* Todo List */}
      {isLoading ? (
        <div className="grid gap-4 max-w-2xl w-full pt-[60px]">
          <TodoCardSkeleton />
        </div>
      ) : (
        <>
          <div className="grid gap-4 max-w-2xl w-full pt-[60px]">
            {todos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(page - 1);
                    }}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* Show max 10 pages window */}
                {Array.from({ length: Math.min(10, totalPages) }).map(
                  (_, i) => {
                    let start = Math.max(1, page - 5);
                    let end = Math.min(totalPages, start + 9);

                    if (end - start < 9) start = Math.max(1, end - 9);
                    const pageNum = start + i;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          isActive={pageNum === page}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(pageNum);
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(page + 1);
                    }}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
