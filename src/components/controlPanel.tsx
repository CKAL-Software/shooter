import { CANVAS_HEIGHT } from "../lib/definitions";

interface ControlPanelProps {}

export function ControlPanel(props: ControlPanelProps) {
  return (
    <div
      style={{
        marginLeft: "24px",
        background: "lightgray",
        height: CANVAS_HEIGHT,
        fontSize: "24px",
        width: 300,
        overflow: "hidden",
        userSelect: "none",
      }}
    ></div>
  );
}
