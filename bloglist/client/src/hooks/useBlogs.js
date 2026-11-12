import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";

export const useBlogs = () => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    select: (blogs) => blogs.toSorted((a, b) => b.likes - a.likes),
    refetchOnWindowFocus: false,
  });

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.setQueryData(["blogs"], (oldBlogs) =>
        oldBlogs.concat(newBlog),
      );
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["blogs"], (oldBlogs) =>
        oldBlogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)),
      );
    },
  });

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["blogs"], (oldBlogs) =>
        oldBlogs.filter((b) => b.id !== id),
      );
    },
  });

  return {
    blogs: result.data,
    isPending: result.isPending,
    createBlog: createBlogMutation.mutate,
    updateBlog: updateBlogMutation.mutate,
    removeBlog: removeBlogMutation.mutate,
  };
};
