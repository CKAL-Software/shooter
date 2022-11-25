import { useState } from "react";
import { player } from "../../Shooter";
import { GunIcon } from "../gunIcon";
import { SkillTreeSection } from "./skillTreeSection";
import { WeaponStats } from "./weaponStats";

export function WeaponsSection() {
  const [selectedWeapon, setSelectedWeapon] = useState(player.getCurrentWeapon());

  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>Weapons</div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: 40, marginTop: 24 }}>
          <div style={{ display: "flex", columnGap: 20, marginBottom: 24 }}>
            {player.getWeapons().map((gun) => (
              <GunIcon
                key={gun.getName()}
                entityName={gun.getName()}
                selected={selectedWeapon.getName() === gun.getName()}
                level={gun.getLevel()}
                unusedSkillPoints={gun.getUnusedSkillPoints()}
                onClick={() => setSelectedWeapon(gun)}
              />
            ))}
          </div>
          <WeaponStats key={selectedWeapon.getName()} weapon={selectedWeapon} />
        </div>
        <SkillTreeSection selectedWeapon={selectedWeapon} />
      </div>
    </div>
  );
}
