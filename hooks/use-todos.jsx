import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "https://api.oluwasetemi.dev/tasks";

export function useTodos({ search, status, page = 1, limit = 10 }) {
  const queryClient = useQueryClient();

  // GET Todos (server-side pagination + client-side search/filter)
  const query = useQuery({
    queryKey: ["todos", search, status, page],
    queryFn: async () => {
      const res = await axios.get(BASE_URL, {
        params: { page, limit },
      });

      let todos = res.data?.data || [];
      const total = res.data?.meta?.total || todos.length;

      // Client-side filters
      todos = todos
        .filter((todo) =>
          todo.name.toLowerCase().includes(search?.toLowerCase() || "")
        )
        .filter((todo) =>
          status === "all"
            ? true
            : status === "completed"
            ? todo.status === "completed"
            : todo.status !== "completed"
        );

      return { todos, total };
    },
  });

  // POST (Create Todo)
  const create = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(BASE_URL, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // PATCH (Update Todo)
  const update = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axios.patch(`${BASE_URL}/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // DELETE (Remove Todo)
  const remove = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const getOne = (id) =>
    useQuery({
      queryKey: ["todo", id],
      queryFn: async () => {
        const res = await axios.get(`${BASE_URL}/${id}`);
        return res.data;
      },
      enabled: !!id, // Only run if ID is provided
    });

  return {
    ...query,
    create,
    update,
    remove,
    getOne,
  };
}

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const BASE_URL = "https://jsonplaceholder.typicode.com/todos";

// export function useTodos({ search, status }) {
//   const queryClient = useQueryClient();

//   // Fetch filtered todos
//   const query = useQuery({
//     queryKey: ["todos", search, status],
//     queryFn: async () => {
//       const res = await fetch(BASE_URL);
//       const todos = await res.json();

//       console.log(todos, "todos");

//       return todos
//         .filter((todo) =>
//           todo.title.toLowerCase().includes(search?.toLowerCase() || "")
//         )
//         .filter((todo) =>
//           status === "all"
//             ? true
//             : status === "completed"
//             ? todo.completed
//             : !todo.completed
//         );
//     },
//   });

//   // Create
//   const create = useMutation({
//     mutationFn: async (data) => {
//       const res = await fetch(BASE_URL, {
//         method: "POST",
//         body: JSON.stringify({
//           ...data,
//           userId: 1,
//         }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       return res.json();
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
//   });

//   // Update
//   const update = useMutation({
//     mutationFn: async ({ id, data }) => {
//       const res = await fetch(`${BASE_URL}/${id}`, {
//         method: "PUT",
//         body: JSON.stringify(data),
//         headers: { "Content-Type": "application/json" },
//       });
//       return res.json();
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
//   });

//   // Delete
//   const remove = useMutation({
//     mutationFn: async (id) => {
//       await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
//   });

//   return {
//     ...query,
//     create,
//     update,
//     remove,
//   };
// }
