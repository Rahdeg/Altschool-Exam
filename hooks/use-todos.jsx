import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BASE_URL = "https://api.oluwasetemi.dev/tasks";

export function useTodos({ search, status, priority, page = 1, limit = 10 }) {
  const queryClient = useQueryClient();

  //  GET Todos
  const query = useQuery({
    queryKey: ["todos", search, status, priority, page],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}?all=true`);
      let todos = res.data || [];

      //  Filter by owner
      todos = todos.filter((todo) => todo.owner === "Rahdeg");

      //  Apply search
      if (search) {
        todos = todos.filter((todo) =>
          todo.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter by status
      if (status !== "all") {
        todos = todos.filter((todo) => {
          if (status === "complete") return todo.status === "DONE";
          if (status === "incomplete") return todo.status !== "DONE";
          return todo.status === status;
        });
      }

      //  Filter by priority
      if (priority !== "all") {
        todos = todos.filter((todo) => todo.priority === priority);
      }

      //  Sort by newest first (based on createdAt)
      todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      //  Paginate
      const total = todos.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginated = todos.slice(startIndex, endIndex);

      return {
        todos: paginated,
        meta: { total },
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

  //  DELETE
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

  //  GET ONE
  const getOne = (id) =>
    useQuery({
      queryKey: ["todo", id],
      queryFn: async () => {
        const res = await axios.get(`${BASE_URL}/${id}`);
        return res.data;
      },
      enabled: !!id,
    });

  //  Return all together
  return {
    ...query,
    create,
    update,
    remove,
    getOne,
  };
}
