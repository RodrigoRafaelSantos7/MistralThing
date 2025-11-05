import { useMutation, useQuery } from "convex/react";
import { useContext } from "react";
import { DatabaseContext } from "@/context/database";
import { api } from "@/convex/_generated/api";

export function useDatabase() {
  const database = useContext(DatabaseContext);

  if (!database) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }

  return database;
}

export function useSettings() {
  const settings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);

  return {
    updateSettings,
    settings,
  };
}
