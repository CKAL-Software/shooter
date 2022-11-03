import { createContext } from "react";
import { LeaderboardEntry } from "./models";

export const DataContext = createContext<{
  leaderboardEntries: LeaderboardEntry[];
  getPlayerName(email: string | undefined): string;
}>({
  leaderboardEntries: [],
  getPlayerName: () => "",
});

export const TriggerRenderContext = createContext<() => void>(() => {});
