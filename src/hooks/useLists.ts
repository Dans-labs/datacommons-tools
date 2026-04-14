import { useQuery } from "@tanstack/react-query";
import { fetchExtensions, fetchLicenses } from "../api/lists";

export const useFileExtensions = () => {
  return useQuery({
    queryKey: ["file-extensions"],
    queryFn: fetchExtensions,
    staleTime: Infinity, // never refetch unless you want to
  });
};

export const useLicenses = () => {
  return useQuery({
    queryKey: ["licenses"],
    queryFn: fetchLicenses,
    staleTime: Infinity, // never refetch unless you want to
  });
}