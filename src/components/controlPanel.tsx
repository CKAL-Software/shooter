import { CANVAS_HEIGHT, experienceThresholdsPlayer } from "../lib/definitions";

interface ControlPanelProps {
  hp: number;
  magSize: number;
  magAmmo: number;
  ammo: number;
  playerExp: number;
  playerLevel: number;
}

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
    >
      <div>{props.hp}</div>
      <div>{props.playerLevel}</div>
      <div>
        Exp: {props.playerExp}/{experienceThresholdsPlayer[props.playerLevel - 1]}
      </div>
      <div>{props.magAmmo}</div>
      <div>{props.ammo - props.magAmmo}</div>
    </div>
  );
}
