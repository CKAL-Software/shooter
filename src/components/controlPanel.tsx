import { useState } from "react";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { CANVAS_HEIGHT, experienceThresholdsNormal, experienceThresholdsPlayer } from "../lib/definitions";
import { player } from "../Shooter";
import { Magazine } from "./controlPanelElements/magazine";
import { ProgressBar } from "./controlPanelElements/progressBar";
import { GunIcon } from "./gunIcon";
import { LevelNumber } from "./levelNumber";

interface ControlPanelProps {
  hp: number;
  maxHp: number;
  magSize: number;
  magAmmo: number;
  ammo: number;
  playerExp: number;
  playerLevel: number;
  critChance: number;
  weaponExp: number;
  weaponLevel: number;
  fireRate: number;
  velocity: number;
  weaponVelocity: number;
  weaponName: string;
  reloadProgress: number;
  reloadSpeed: number;
  money: number;
  damage: number;
  recoil: number;
  range: number;
  projectiles: number;
}

export function ControlPanel(props: ControlPanelProps) {
  const [n, setN] = useState(1);
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
        <div style={{ fontSize: 24, marginBottom: 8 }}>Player</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ fontSize: 22, marginTop: -2 }}>{player.getMoney()}</div>
          <RiMoneyDollarCircleFill style={{ fontSize: 30, alignSelf: "center", marginLeft: 4 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Health</div>
          <ProgressBar
            percentage={props.hp / props.maxHp}
            text={props.hp + "/" + props.maxHp}
            barColor={
              props.hp / props.maxHp <= 0.25 ? "#d50000" : props.hp / props.maxHp <= 0.5 ? "#d5c800" : "#32d500"
            }
            backgroundColor={"rgba(0,0,0,0.15)"}
            height={30}
            width={260}
          />
        </div>
        <div>
          <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Experience</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <ProgressBar
              percentage={props.playerExp / experienceThresholdsPlayer[props.playerLevel - 1]}
              text={props.playerExp + "/" + experienceThresholdsPlayer[props.playerLevel - 1]}
              barColor="#90caf9"
              backgroundColor={"rgba(0,0,0,0.15)"}
              height={30}
              width={216}
            />
            <LevelNumber level={props.weaponLevel} />
          </div>
        </div>
        <div style={{ fontSize: 24, marginBottom: 8, marginTop: 32 }}>Weapons</div>
        <div style={{ display: "flex", columnGap: 12, marginBottom: 20 }}>
          {player.getWeapons().map((gun, i) => (
            <GunIcon
              key={gun.getName()}
              entityName={gun.getName()}
              selectionKey={i + 1}
              selected={player.getCurrentWeapon().getName() === gun.getName()}
            />
          ))}
        </div>
        <div style={{ fontSize: 20, marginBottom: 8, fontWeight: "bold" }}>{props.weaponName}</div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ marginBottom: 4, fontSize: 20 }}>{props.magAmmo + "/" + (props.ammo - props.magAmmo)}</div>
          <Magazine
            magSize={props.magSize}
            reloadProgress={props.reloadProgress}
            magAmmo={props.magAmmo}
            reloadSpeed={props.reloadSpeed}
          />
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center" }} onClick={() => setN(n + 1)}>
          <ProgressBar
            percentage={props.weaponExp / experienceThresholdsNormal[props.weaponLevel - 1]}
            text={props.weaponExp + "/" + experienceThresholdsNormal[props.weaponLevel - 1]}
            barColor="#90caf9"
            backgroundColor="rgba(0,0,0,0.15)"
            height={20}
            width={216}
          />
          <LevelNumber level={props.weaponLevel} />
        </div>
      </div>
    </div>
  );
}
