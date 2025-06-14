import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BASE_URL = "https://api.oluwasetemi.dev/tasks";

export function useTodos({ search, status, priority, page = 1, limit = 10 }) {
  const queryClient = useQueryClient();

  //  GET Todos (server-side filtering & pagination)
  const query = useQuery({
    queryKey: ["todos", search, status, priority, page],
    queryFn: async () => {
      const params = {
        page,
        limit,
      };

      if (search) params.search = search;
      if (status && status !== "all") params.status = status;
      if (priority && priority !== "all") params.priority = priority;

      const res = await axios.get(BASE_URL, { params });
      const data = res.data || {};

      return {
        todos: data.data || [],
        meta: {
          total: data.meta?.total || 0,
          page: data.meta?.page || page,
          limit: data.meta?.limit || limit,
        },
      };
    },
  });

  //  CREATE
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

  //  UPDATE
  const update = useMutation({
    mutationFn: async ({ id, data }) => {
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

  // DELETE
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

  // GET ONE
  const getOne = (id) =>
    useQuery({
      queryKey: ["todo", id],
      queryFn: async () => {
        const res = await axios.get(`${BASE_URL}/${id}`);
        return res.data;
      },
      enabled: !!id,
    });

  return {
    ...query,
    create,
    update,
    remove,
    getOne,
  };
}
