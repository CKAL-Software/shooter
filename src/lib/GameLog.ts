import { GameLog, GameLogType } from "./definitions";

export const logs: GameLog[] = [];

let idCounter = 0;

export function addLog(text: string, type: GameLogType = "normal") {
  logs.unshift({ id: idCounter++, text, type, timestamp: new Date().toLocaleTimeString() });
}
