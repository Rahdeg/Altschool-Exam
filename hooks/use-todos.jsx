import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BASE_URL = "https://api.oluwasetemi.dev/tasks";

export function useTodos({ search, status, priority, page = 2, limit = 10 }) {
  const queryClient = useQueryClient();

  // GET Todos (server-side pagination + client-side search/filter)
  const query = useQuery({
    queryKey: ["todos", search, status, page, priority],
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
        .filter((todo) => {
          if (status === "all") return true;
          if (status === "complete") return todo.status === "DONE";
          if (status === "incomplete") return todo.status !== "DONE";
          return todo.status === status;
        })
        .filter((todo) => {
          if (priority === "all") return true;
          return todo.priority === priority;
        });

      return { todos, meta: { total } };
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
      toast.success("Todo created successfully", {
        description: "Your new todo has been added to the list.",
      });
    },
  });

  // PATCH (Update Todo)
  const update = useMutation({
    mutationFn: async ({ id, data }) => {
      console.log(id, data);
      const res = await axios.patch(`${BASE_URL}/${id}`, data);
      return res.data;
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", id] });
      toast.success("Todo updated successfully", {
        description: "The todo has been updated in your list.",
      });
    },
  });

  // DELETE (Remove Todo)
  const remove = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo deleted successfully", {
        description: "The todo has been removed from your list.",
      });
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
