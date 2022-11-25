import { experienceThresholdsNormal } from "../../lib/definitions";
import { Stat } from "../../lib/skillDefinitions";
import { player } from "../../Shooter";
import { GunIcon } from "../gunIcon";
import { LevelNumber } from "../levelNumber";
import { ProgressBar } from "../progressBar";
import { Magazine } from "./controlPanelElements/magazine";

export function CPWeapons() {
  const weapon = player.getCurrentWeapon();

  return (
    <div>
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
      <div style={{ fontSize: 20, marginBottom: 8, fontWeight: "bold" }}>{weapon.getName()}</div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ marginBottom: 4, fontSize: 20 }}>
          {weapon.getMagazineAmmo() + "/" + (weapon.getAmmo() - weapon.getMagazineAmmo())}
        </div>
        <Magazine
          magSize={weapon.getStat(Stat.MagSize)}
          reloadProgress={weapon.getReloadProgress()}
          magAmmo={weapon.getMagazineAmmo()}
          reloadSpeed={weapon.getStat(Stat.ReloadSpeed)}
        />
      </div>
      <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
        <ProgressBar
          percentage={weapon.getExperience() / experienceThresholdsNormal[weapon.getLevel() + 1]}
          text={weapon.getExperience() + "/" + experienceThresholdsNormal[weapon.getLevel() + 1]}
          barColor="#90caf9"
          backgroundColor="rgba(0,0,0,0.15)"
          height={20}
          width={216}
        />
        <LevelNumber level={weapon.getLevel()} />
      </div>
    </div>
  );
}
