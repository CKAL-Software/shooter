import { Tooltip } from "@mui/material";
import { COLOR_MENU_BACKGROUND, COLOR_STAT_BONUS_BLUE } from "../../lib/definitions";

interface SkillProps {
  text: string;
  state: "unavailable" | "available" | "picked" | "maxed" | "bonus";
  children: React.ReactNode;
  currentLevel: number;
  disableCursor: boolean;
  special: boolean;
  onClick(): void;
}

export function Skill(props: SkillProps) {
  const color =
    props.state === "unavailable" ? "#bfbfbf" : props.state === "available" ? "gray" : COLOR_STAT_BONUS_BLUE;

  return (
    <Tooltip title={props.text} placement="top" followCursor style={{ fontSize: 40 }}>
      <div
        onClick={() => {
          if (props.disableCursor) {
            return;
          }
          props.onClick();
        }}
        style={{
          border: `2px solid ${color}`,
          borderRadius: props.special ? "50%" : 4,
          height: 50,
          width: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: props.disableCursor ? undefined : "pointer",
          position: "relative",
          color: color,
        }}
      >
        <div style={{ color: props.state === "unavailable" ? "gray" : "#494747" }}>{props.children}</div>
        {
          <div
            style={{
              position: "absolute",
              background: COLOR_MENU_BACKGROUND,
              border: `2px solid ${color}`,
              borderRadius: 4,
              // padding: "1px 3px",
              fontWeight: "bold",
              fontSize: 12,
              right: -12,
              bottom: -10,
              width: 26,
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginTop: -1,
                padding: "1px 3px",
                color: props.state === "unavailable" ? "gray" : "#494747",
              }}
            >
              {props.currentLevel}/{props.special ? 1 : 3}
            </div>
          </div>
        }
      </div>
    </Tooltip>
  );
}
