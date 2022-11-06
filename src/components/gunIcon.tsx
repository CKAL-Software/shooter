import { AiOutlineUser } from "react-icons/ai";
import { GiPistolGun, GiSawedOffShotgun } from "react-icons/gi";
import { COLOR_GUN_SELECTED, COLOR_SELECTED, COLOR_SKILLPOINT } from "../lib/definitions";

interface GunIconProps {
  entityName: string;
  selected?: boolean;
  level?: number;
  unusedSkillPoints?: number;
  selectionKey?: number;
  onClick?(): void;
}

export function GunIcon(props: GunIconProps) {
  const icon =
    props.entityName === "Player" ? (
      <AiOutlineUser />
    ) : props.entityName === "Pistol" ? (
      <GiPistolGun />
    ) : (
      <GiSawedOffShotgun />
    );

  return (
    <div
      onClick={props.onClick}
      style={{
        fontSize: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "white",
        height: 40,
        width: 40,
        border: `1px solid ${props.selected ? COLOR_SELECTED : "gray"}`,
        borderRadius: 2,
        color: props.selected ? COLOR_GUN_SELECTED : undefined,
        position: "relative",
        cursor: props.onClick ? "pointer" : undefined,
      }}
    >
      {icon}
      {props.unusedSkillPoints && (
        <div
          style={{
            position: "absolute",
            background: COLOR_SKILLPOINT,
            borderRadius: "50%",
            fontWeight: "bold",
            fontSize: 14,
            right: -10,
            top: -8,
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <div
            style={{
              marginTop: -1,
              whiteSpace: "nowrap",
            }}
          >
            {props.unusedSkillPoints}
          </div>
        </div>
      )}
      {props.selectionKey && (
        <div
          style={{
            position: "absolute",
            background: "white",
            border: `1px solid ${props.selected ? COLOR_SELECTED : "gray"}`,
            borderRadius: 2,
            fontWeight: "bold",
            fontSize: 12,
            left: -8,
            bottom: -8,
            textAlign: "center",
            width: 14,
            height: 14,
          }}
        >
          <div
            style={{
              marginTop: -1,
            }}
          >
            {props.selectionKey}
          </div>
        </div>
      )}
      {props.level && (
        <div
          style={{
            position: "absolute",
            background: "white",
            border: `1px solid ${props.selected ? COLOR_SELECTED : "gray"}`,
            borderRadius: 4,
            fontWeight: "bold",
            fontSize: 12,
            right: -14,
            bottom: -8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              marginTop: -1,
              padding: "1px 3px",
              whiteSpace: "nowrap",
            }}
          >
            LVL {props.level}
          </div>
        </div>
      )}
    </div>
  );
}
