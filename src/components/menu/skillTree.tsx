import { useState } from "react";
import { player } from "../../Shooter";
import { GunIcon } from "../gunIcon";
import { WeaponSkillTree } from "./weaponSkillTree";

export function SkillTree() {
  const [selectedGun, setSelectedGun] = useState(player.getCurrentWeapon());

  return (
    <div style={{ userSelect: "none" }}>
      <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>Skill tree</div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: 30, display: "grid", rowGap: 20, height: "min-content" }}>
          {player.getWeapons().map((gun) => (
            <div key={gun.getName()} style={{ cursor: "pointer" }} onClick={() => setSelectedGun(gun)}>
              <GunIcon
                gunName={gun.getName()}
                selected={selectedGun.getName() === gun.getName()}
                level={gun.getLevel()}
                unusedSkillPoints={gun.getUnusedSkillPoints()}
              />
            </div>
          ))}
        </div>
        <WeaponSkillTree gun={selectedGun} />
      </div>
    </div>
  );
}
