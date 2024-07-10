import type { DataMap, SessionData } from "../types/storage.types";

export const sortBySessionStart = (data: DataMap): SessionData[] => {
  if (!data) return [];
  const entries = Object.entries(data);

  entries.sort(([, sessionA], [, sessionB]) => {
    const dateA = new Date(sessionA.sessionStart);
    const dateB = new Date(sessionB.sessionStart);
    return dateA.getTime() - dateB.getTime();
  });

  return entries.map(([, sessionData]) => sessionData);
};
