import { ReactElement, useMemo } from "react";
import { CANVAS_HEIGHT, experienceThresholdsPlayer } from "../lib/definitions";
import { ProgressBar } from "./controlPanelElements/progressBar";

interface ControlPanelProps {
  hp: number;
  maxHp: number;
  magSize: number;
  magAmmo: number;
  ammo: number;
  playerExp: number;
  playerLevel: number;
}

export function ControlPanel(props: ControlPanelProps) {
  const magazine = useMemo(() => {
    const bullets: ReactElement[] = [];

    for (let i = 0; i < props.magSize; i++) {
      bullets.push(
        <div
          style={{
            height: 30,
            width: "100%",
            borderRadius: 4,
            backgroundColor: props.magAmmo >= i + 1 ? "#333333" : "darkgray",
          }}
        />
      );
    }

    return bullets;
  }, [props.magSize, props.magAmmo]);

  return (
    <div
      style={{
        marginLeft: "24px",
        background: "lightgray",
        height: CANVAS_HEIGHT,
        fontSize: "24px",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <div style={{ padding: 20 }}>
        <div style={{ display: "grid", rowGap: 8 }}>
          <div>
            <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Health</div>
            <ProgressBar
              percentage={props.hp / props.maxHp}
              text={props.hp + "/" + props.maxHp}
              barColor="#32d500"
              backgroundColor="darkgray"
              height={20}
              width={260}
            />
          </div>

          <div style={{ display: "flex" }}>
            <div>
              <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Experience</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ProgressBar
                  percentage={props.playerExp / experienceThresholdsPlayer[props.playerLevel - 1]}
                  text={props.playerExp + "/" + experienceThresholdsPlayer[props.playerLevel - 1]}
                  barColor="#90caf9"
                  // backgroundColor="rgb(72, 101, 124)"
                  backgroundColor="darkgray"
                  height={20}
                  width={260}
                />
              </div>
            </div>
            <div style={{ width: 60, textAlign: "center", fontWeight: "bold", fontSize: 40 }}>23</div>
          </div>

          <div>
            <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Weapon</div>
            <div style={{ display: "flex", columnGap: 2 }}>{magazine}</div>
          </div>
        </div>
        <div>{props.magAmmo}</div>
        <div>{props.ammo - props.magAmmo}</div>
      </div>
    </div>
  );
}
