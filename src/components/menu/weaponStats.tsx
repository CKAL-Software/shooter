import { experienceThresholdsNormal, TICK_DURATION_S } from "../../lib/definitions";
import { player } from "../../Shooter";
import { Gun } from "../../Weapons/Gun";
import { ProgressBar } from "../controlPanelElements/progressBar";

interface WeaponStatsProps {
  weapon: Gun;
}

export function WeaponStats(props: WeaponStatsProps) {
  return (
    <>
      <div style={{ fontSize: 20, fontWeight: "bold", gridColumn: "span 2", margin: "18px 0 4px" }}>
        {props.weapon.getName() + (player.getCurrentWeapon().getName() === props.weapon.getName() ? " (current)" : "")}
      </div>
      <div style={{ gridColumn: "span 2", margin: "4px 0" }}>
        <ProgressBar
          percentage={props.weapon.getExperience() / experienceThresholdsNormal[props.weapon.getLevel() - 1]}
          text={props.weapon.getExperience() + "/" + experienceThresholdsNormal[props.weapon.getLevel() - 1]}
          barColor="#90caf9"
          backgroundColor="darkgray"
          height={20}
          width={260}
        />
      </div>
      <div>Level</div>
      <div style={{ textAlign: "end" }}>{props.weapon.getLevel()}</div>
      <div>Ammo</div>
      <div style={{ textAlign: "end" }}>
        {props.weapon.getMagazineAmmo() + "/" + (props.weapon.getAmmo() - props.weapon.getMagazineAmmo())}
      </div>
      <div style={{ whiteSpace: "nowrap" }}>Fire rate</div>
      <div style={{ textAlign: "end" }}>{props.weapon.getFireRate() + " RPM"}</div>
      <div>Velocity</div>
      <div style={{ textAlign: "end" }}>{props.weapon.getVelocity() / TICK_DURATION_S}</div>
    </>
  );
}
