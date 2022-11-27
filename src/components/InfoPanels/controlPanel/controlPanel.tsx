import { CANVAS_HEIGHT, Point } from "../../../lib/definitions";
import { Minimap } from "./minimap";
import { CPPlayer } from "./cpPlayer";
import { CPWeapons } from "./cpWeapon";
import { COLOR_MENU_BACKGROUND } from "../../../lib/definitions.colors";
import { RandomMap } from "../../../lib/MapGenerator";

interface ControlPanelProps {
  maps: Map<string, RandomMap>;
  currentMapPosition: Point;
  vision: number;
}

export function ControlPanel(props: ControlPanelProps) {
  return (
    <div
      style={{
        // background: "#eeeeee",
        background: COLOR_MENU_BACKGROUND,
        height: CANVAS_HEIGHT,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <div style={{ padding: 20 }}>
        <Minimap maps={props.maps} currentMapPosition={props.currentMapPosition} vision={props.vision} />
        <div style={{ height: 24 }} />
        <CPPlayer />
        <div style={{ height: 36 }} />
        <CPWeapons />
      </div>
    </div>
  );
}
