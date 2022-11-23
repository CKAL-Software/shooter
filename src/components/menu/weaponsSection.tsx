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
      <div style={{ display: "flex", columnGap: 24 }}>
        <div style={{ marginRight: 30, display: "grid", rowGap: 20, height: "min-content", marginTop: 24 }}>
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto repeat(8, min-content)",
            columnGap: 8,
            rowGap: 2,
            width: 350,
            marginRight: 24,
            height: "min-content",
          }}
        >
          <WeaponStats key={selectedWeapon.getName()} weapon={selectedWeapon} />
        </div>
        <SkillTreeSection selectedWeapon={selectedWeapon} />
      </div>
    </div>
  );
}
