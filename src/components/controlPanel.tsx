import { CANVAS_HEIGHT, experienceThresholdsNormal, experienceThresholdsPlayer } from "../lib/definitions";
import { player } from "../Shooter";
import { Magazine } from "./controlPanelElements/magazine";
import { ProgressBar } from "./controlPanelElements/progressBar";
import { GunIcon } from "./gunIcon";

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
  reloadTime: number;
  money: number;
  damage: number;
  recoil: number;
  range: number;
  numBullets: number;
}

export function ControlPanel(props: ControlPanelProps) {
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
          <div style={{ whiteSpace: "nowrap" }}>Money</div>
          <div style={{ textAlign: "end" }}>{props.money}</div>
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
          <ProgressBar
            percentage={props.playerExp / experienceThresholdsPlayer[props.playerLevel - 1]}
            text={props.playerExp + "/" + experienceThresholdsPlayer[props.playerLevel - 1]}
            barColor="#90caf9"
            backgroundColor={"rgba(0,0,0,0.15)"}
            height={30}
            width={260}
          />
        </div>
        <div style={{ fontSize: 24, marginBottom: 8, marginTop: 32 }}>Weapons</div>
        <div style={{ display: "flex", columnGap: 12, marginBottom: 12 }}>
          {player.getWeapons().map((gun, i) => (
            <GunIcon
              key={gun.getName()}
              entityName={gun.getName()}
              selectionKey={i + 1}
              selected={player.getCurrentWeapon().getName() === gun.getName()}
            />
          ))}
        </div>
        <div style={{ fontSize: 20, marginBottom: 8 }}>{props.weaponName}</div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Ammo</div>
          <div style={{ marginBottom: 4, fontSize: 20 }}>{props.magAmmo + "/" + (props.ammo - props.magAmmo)}</div>
          <Magazine
            magSize={props.magSize}
            reloadProgress={props.reloadProgress}
            magAmmo={props.magAmmo}
            reloadTime={props.reloadTime}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Experience</div>
          <ProgressBar
            percentage={props.weaponExp / experienceThresholdsNormal[props.weaponLevel - 1]}
            text={props.weaponExp + "/" + experienceThresholdsNormal[props.weaponLevel - 1]}
            barColor="#90caf9"
            backgroundColor={"rgba(0,0,0,0.15)"}
            height={20}
            width={260}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto min-content",
            columnGap: 16,
            rowGap: 2,
            marginBottom: 8,
          }}
        >
          <div>Level</div>
          <div style={{ textAlign: "end" }}>{props.weaponLevel}</div>
          <div style={{ gridColumn: "span 2" }} />
          <div>Damage</div>
          <div style={{ textAlign: "end" }}>{props.damage}</div>
          <div>Magazine size</div>
          <div style={{ textAlign: "end" }}>{props.magSize}</div>
          <div>Reload time</div>
          <div style={{ textAlign: "end" }}>{props.reloadTime}</div>
          <div style={{ whiteSpace: "nowrap" }}>Fire rate</div>
          <div style={{ textAlign: "end" }}>{props.fireRate}</div>
          <div>Velocity</div>
          <div style={{ textAlign: "end" }}>{props.velocity}</div>
          <div>Recoil</div>
          <div style={{ textAlign: "end" }}>{props.recoil}</div>
          <div>Range</div>
          <div style={{ textAlign: "end" }}>{props.range}</div>
          <div>Projectiles</div>
          <div style={{ textAlign: "end" }}>{props.numBullets}</div>
        </div>
      </div>
    </div>
  );
}
