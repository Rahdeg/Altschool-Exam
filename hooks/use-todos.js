import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "https://jsonplaceholder.typicode.com/todos";

export function useTodos({ search, status }) {
  const queryClient = useQueryClient();

  // Fetch filtered todos
  const query = useQuery({
    queryKey: ["todos", search, status],
    queryFn: async () => {
      const res = await fetch(BASE_URL);
      const todos = await res.json();

      return todos
        .filter((todo) =>
          todo.title.toLowerCase().includes(search?.toLowerCase() || "")
        )
        .filter((todo) =>
          status === "all"
            ? true
            : status === "completed"
            ? todo.completed
            : !todo.completed
        );
    },
  });

  // Create
  const create = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userId: 1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // Update
  const update = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // Delete
  const remove = useMutation({
    mutationFn: async (id) => {
      await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return {
    ...query,
    create,
    update,
    remove,
  };
}
