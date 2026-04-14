import { useQuery } from "@tanstack/react-query";
import { fetchExtensions } from "../api/lists";

export const useFileExtensions = () => {
  return useQuery({
    queryKey: ["file-extensions"],
    queryFn: fetchExtensions,
    staleTime: Infinity, // never refetch unless you want to
  });
};