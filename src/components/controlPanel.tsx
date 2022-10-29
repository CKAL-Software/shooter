import { ReactElement, useMemo } from "react";
import { CANVAS_HEIGHT, experienceThresholdsNormal, experienceThresholdsPlayer } from "../lib/definitions";
import { ProgressBar } from "./controlPanelElements/progressBar";

interface ControlPanelProps {
  hp: number;
  maxHp: number;
  magSize: number;
  magAmmo: number;
  ammo: number;
  playerExp: number;
  playerLevel: number;
  weaponExp: number;
  weaponLevel: number;
  fireRate: number;
  velocity: number;
  weaponVelocity: number;
  weaponName: string;
  reloadProgress: number;
}

export function ControlPanel(props: ControlPanelProps) {
  const magazine = useMemo(() => {
    const bullets: ReactElement[] = [];

    for (let i = 0; i < props.magSize; i++) {
      bullets.push(
        <div
          key={i}
          style={{
            height: 14,
            width: "100%",
            borderRadius: 4,
            backgroundColor: props.magAmmo >= i + 1 ? "#333333" : "darkgray",
            maxWidth: 20,
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
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>Player</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "min-content min-content",
            columnGap: 16,
            rowGap: 2,
            fontSize: 18,
            marginBottom: 8,
          }}
        >
          <div>Level</div>
          <div style={{ textAlign: "end" }}>{props.playerLevel}</div>
          <div style={{ whiteSpace: "nowrap" }}>Move speed</div>
          <div style={{ textAlign: "end" }}>{props.velocity}</div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Health</div>
          <ProgressBar
            percentage={props.hp / props.maxHp}
            text={props.hp + "/" + props.maxHp}
            barColor={
              props.hp / props.maxHp <= 0.25 ? "#d50000" : props.hp / props.maxHp <= 0.5 ? "#d5c800" : "#32d500"
            }
            backgroundColor="darkgray"
            height={30}
            width={260}
          />
        </div>

        <div>
          <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Experience</div>
          <ProgressBar
            percentage={props.playerExp / experienceThresholdsPlayer[props.playerLevel - 1]}
            text={props.playerExp + "/" + experienceThresholdsPlayer[props.playerLevel - 1]}
            barColor="#90caf9"
            backgroundColor="darkgray"
            height={30}
            width={260}
          />
        </div>
        <div style={{ fontSize: 24, marginBottom: 8, marginTop: 32 }}>Weapon</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "min-content min-content",
            columnGap: 16,
            rowGap: 2,
            fontSize: 18,
            marginBottom: 8,
          }}
        >
          <div style={{ gridColumn: "span 2" }}>{props.weaponName}</div>
          <div>Level</div>
          <div style={{ textAlign: "end" }}>{props.weaponLevel}</div>
          <div style={{ whiteSpace: "nowrap" }}>Fire rate</div>
          <div style={{ textAlign: "end" }}>{props.fireRate}</div>
          <div>Velocity</div>
          <div style={{ textAlign: "end" }}>{props.weaponVelocity}</div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Ammo</div>
          <div style={{ marginBottom: 4, fontSize: 20 }}>{props.magAmmo + "/" + (props.ammo - props.magAmmo)}</div>
          {props.reloadProgress > 0 ? (
            <ProgressBar
              percentage={props.reloadProgress}
              barColor="#333333"
              backgroundColor="darkgray"
              height={30}
              width={props.magSize * 22 - 2 >= 260 ? 260 : props.magSize * 22 - 2}
              notSmooth
            />
          ) : (
            <div>
              <div style={{ display: "flex", columnGap: 2, marginBottom: 2 }}>{magazine}</div>
              <div style={{ display: "flex", columnGap: 2 }}>{magazine}</div>
            </div>
          )}
        </div>
        <div>
          <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Experience</div>
          <ProgressBar
            percentage={props.weaponExp / experienceThresholdsNormal[props.weaponLevel - 1]}
            text={props.weaponExp + "/" + experienceThresholdsNormal[props.weaponLevel - 1]}
            barColor="#333333"
            backgroundColor="darkgray"
            height={20}
            width={260}
          />
        </div>
      </div>
    </div>
  );
}
