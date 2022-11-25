import { CANVAS_HEIGHT } from "../../lib/definitions";
import { CPPlayer } from "./cpPlayer";
import { CPWeapons } from "./cpWeapon";
import { CPEnemies } from "./cpEnemies";

export function ControlPanel() {
  return (
    <div
      style={{
        marginLeft: "24px",
        background: "#eeeeee",
        height: CANVAS_HEIGHT,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <div style={{ padding: 20 }}>
        <CPPlayer />
        <CPWeapons />
        <CPEnemies />
      </div>
    </div>
  );
}
