import { CANVAS_HEIGHT, COLOR_MENU_BACKGROUND } from "../../../lib/definitions";
import { EnemiesOverview } from "./enemiesOverview";
import { GameLog } from "./gameLog";

export function GameInfo() {
  return (
    <div
      style={{
        background: COLOR_MENU_BACKGROUND,
        height: CANVAS_HEIGHT,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <div
        style={{
          padding: 20,
          display: "grid",
          gridTemplateRows: "min-content 1fr",
          height: "calc(100% - 40px)",
        }}
      >
        <EnemiesOverview />
        <GameLog />
      </div>
    </div>
  );
}
