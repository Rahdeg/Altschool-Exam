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
import { useTodos } from "@/hooks/use-todos";
import TodoCardSkeleton, { TodoCard } from "@/components/todo-card";

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
      <div className="flex flex-col gap-y-3 md:flex-row gap-2 max-w-2xl w-full">
        <Input
          value={search || ""}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page on search change
          }}
          placeholder="Search by title"
        />
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val);
            setPage(1); // reset page on filter change
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
      </div>

      {/* Todo List */}
      {isLoading ? (
        <div className="grid gap-4 max-w-2xl w-full">
          <TodoCardSkeleton />
        </div>
      ) : (
        <>
          <div className="grid gap-4 max-w-2xl w-full">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                status={todo.status}
                title={todo.name}
                time={new Date(todo.createdAt).toLocaleDateString()}
                priority={todo.priority || "Normal"} // Default to "Normal" if not set
                tags={todo.tags} // Join tags or show default
              />
              // <div key={todo.id} className="p-4 border rounded">
              //   <h3 className="font-bold">{todo.name}</h3>
              //   <p>
              //     Status:{" "}
              //     {todo.status === "completed"
              //       ? "✅ Completed"
              //       : "❌ Incomplete"}
              //   </p>
              // </div>
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

// "use client";

// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useQueryState } from "nuqs";

// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { useDebounce } from "@/lib/debounce";
// import { useTodos } from "@/hooks/use-todos";

// const ITEMS_PER_PAGE = 10;

// export default function TodosPage() {
//   const [search, setSearch] = useQueryState("search", { defaultValue: "" });
//   const [status, setStatus] = useQueryState("status", { defaultValue: "all" });
//   const [page, setPage] = useQueryState("page", {
//     defaultValue: 1,
//     parse: Number,
//     serialize: String,
//   });

//   const debouncedSearch = useDebounce(search, 300);

//   const { data: todos = [], isLoading } = useTodos({
//     search: debouncedSearch,
//     status,
//   });

//   const totalPages = Math.ceil(todos.length / ITEMS_PER_PAGE);
//   const paginatedTodos = todos.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   );

//   const goToPage = (p) => {
//     if (p < 1 || p > totalPages) return;
//     setPage(p);
//   };

//   return (
//     <div className="p-4 space-y-6">
//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-2">
//         <Input
//           value={search || ""}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1); // reset page on search change
//           }}
//           placeholder="Search by title"
//         />
//         <Select
//           value={status}
//           onValueChange={(val) => {
//             setStatus(val);
//             setPage(1); // reset page on filter change
//           }}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All</SelectItem>
//             <SelectItem value="completed">Completed</SelectItem>
//             <SelectItem value="incomplete">Incomplete</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Todo List */}
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <div className="grid gap-4">
//             {paginatedTodos.map((todo) => (
//               <div key={todo.id} className="p-4 border rounded">
//                 <h3 className="font-bold">{todo.title}</h3>
//                 <p>
//                   Status: {todo.completed ? "✅ Completed" : "❌ Incomplete"}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <Pagination className="mt-6">
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       goToPage(page - 1);
//                     }}
//                     className={
//                       page === 1 ? "pointer-events-none opacity-50" : ""
//                     }
//                   />
//                 </PaginationItem>

//                 {/* LIMIT NUMBER OF PAGES SHOWN TO MAX 10 */}
//                 {Array.from({ length: Math.min(10, totalPages) }).map(
//                   (_, i) => {
//                     // Calculate a "window" of pages around the current page
//                     let start = Math.max(1, page - 5);
//                     let end = Math.min(totalPages, start + 9);

//                     // Adjust start again in case we're at the end
//                     if (end - start < 9) start = Math.max(1, end - 9);

//                     const pageNum = start + i;

//                     return (
//                       <PaginationItem key={pageNum}>
//                         <PaginationLink
//                           href="#"
//                           isActive={pageNum === page}
//                           onClick={(e) => {
//                             e.preventDefault();
//                             goToPage(pageNum);
//                           }}
//                         >
//                           {pageNum}
//                         </PaginationLink>
//                       </PaginationItem>
//                     );
//                   }
//                 )}

//                 <PaginationItem>
//                   <PaginationNext
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       goToPage(page + 1);
//                     }}
//                     className={
//                       page === totalPages
//                         ? "pointer-events-none opacity-50"
//                         : ""
//                     }
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
