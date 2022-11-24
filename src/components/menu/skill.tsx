import { Tooltip } from "@mui/material";
import { COLOR_MENU_BACKGROUND, COLOR_STAT_BONUS_BLUE_RGBA } from "../../lib/definitions";

interface SkillProps {
  text: string;
  inactive: boolean;
  state: "unavailable" | "available" | "picked";
  children: React.ReactNode;
  currentLevel: number;
  disableCursor: boolean;
  special: boolean;
  onClick(): void;
}

export function Skill(props: SkillProps) {
  const opacity = props.inactive ? 0.5 : 1;
  const color =
    props.state === "unavailable"
      ? `rgb(191,191,191,${opacity})`
      : props.state === "available"
      ? `rgba(128,128,128,${opacity})`
      : COLOR_STAT_BONUS_BLUE_RGBA(opacity);
  const iconColor = props.state === "unavailable" ? `rgba(128,128,128,${opacity})` : `rgba(73,71,71,${opacity})`;

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
        <div style={{ color: iconColor }}>{props.children}</div>
        {!props.special && (
          <div
            style={{
              position: "absolute",
              background: COLOR_MENU_BACKGROUND,
              border: `2px solid ${color}`,
              borderRadius: 4,
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
                color: iconColor,
              }}
            >
              {props.currentLevel}/{props.special ? 1 : 3}
            </div>
          </div>
        )}
      </div>
    </Tooltip>
  );
}
