import { useMutation, useQuery } from "convex/react";
import { useModelsContext } from "@/components/providers/models-provider";
import { useSessionsContext } from "@/components/providers/sessions-provider";
import { useSettingsContext } from "@/components/providers/settings-provider";
import { useThreadsContext } from "@/components/providers/thread-provider";
import { useUserContext } from "@/components/providers/user-provider";
import { api } from "@/convex/_generated/api";
import { useSession } from "@/hooks/use-session";

export function useSettings() {
  const context = useSettingsContext();
  const settingsFromQuery = useQuery(api.settings.get, {});
  const settings = context?.settings ?? settingsFromQuery;

  const updateSettings = useMutation(api.settings.update).withOptimisticUpdate(
    (localStore, args) => {
      const currentSettings = localStore.getQuery(api.settings.get, {});
      if (currentSettings !== undefined && currentSettings !== null) {
        const updatedSettings = {
          ...currentSettings,
          ...(args.mode !== undefined && { mode: args.mode }),
          ...(args.theme !== undefined && { theme: args.theme }),
          ...(args.modelId !== undefined && { modelId: args.modelId }),
          ...(args.pinnedModels !== undefined && {
            pinnedModels: args.pinnedModels,
          }),
          ...(args.nickname !== undefined && { nickname: args.nickname }),
          ...(args.biography !== undefined && { biography: args.biography }),
          ...(args.instructions !== undefined && {
            instructions: args.instructions,
          }),
        };
        localStore.setQuery(api.settings.get, {}, updatedSettings);
      }
    }
  );

  return {
    updateSettings,
    settings,
  };
}

export function useModels() {
  const context = useModelsContext();
  const modelsFromQuery = useQuery(api.models.getAll, {});
  const models = context?.models ?? modelsFromQuery;

  return models;
}

export function useSessions() {
  const context = useSessionsContext();
  const { data: session } = useSession();
  const sessionsFromQuery = useQuery(
    api.users.getAllSessions,
    session ? {} : "skip"
  );
  const sessions = context?.sessions ?? sessionsFromQuery;

  return sessions;
}

export function useUser() {
  const context = useUserContext();
  const userFromQuery = useQuery(api.auth.getCurrentUser);
  const user = context?.user ?? userFromQuery;

  return user;
}

export function useThreads() {
  const context = useThreadsContext();
  const threadsFromQuery = useQuery(api.threads.listThreadsByUserId, {});
  const threads = context?.threads ?? threadsFromQuery;

  const updateThread = useMutation(
    api.threads.updateThread
  ).withOptimisticUpdate((localStore, args) => {
    const currentThreads = localStore.getQuery(
      api.threads.listThreadsByUserId,
      {}
    );
    if (currentThreads !== undefined && currentThreads !== null) {
      const updatedThreads = currentThreads.map((thread) => {
        if (thread._id === args.threadId) {
          return {
            ...thread,
            ...(args.title !== undefined && { title: args.title }),
            ...(args.status !== undefined && { status: args.status }),
            ...(args.streamId !== undefined && { streamId: args.streamId }),
            updatedAt: Date.now(),
          };
        }
        return thread;
      });
      localStore.setQuery(api.threads.listThreadsByUserId, {}, updatedThreads);
    }
  });

  const deleteThread = useMutation(
    api.threads.deleteThread
  ).withOptimisticUpdate((localStore, args) => {
    const currentThreads = localStore.getQuery(
      api.threads.listThreadsByUserId,
      {}
    );
    if (currentThreads !== undefined && currentThreads !== null) {
      const updatedThreads = currentThreads.filter(
        (thread) => thread._id !== args.threadId
      );
      localStore.setQuery(api.threads.listThreadsByUserId, {}, updatedThreads);
    }
  });

  return {
    threads,
    updateThread,
    deleteThread,
  };
}
