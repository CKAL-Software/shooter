import { useState } from "react";
import { player } from "../../Shooter";
import { GunIcon } from "../gunIcon";
import { SkillTree } from "./skillTree";

export function SkillTreeSection() {
  const [selectedWeapon, setSelectedWeapon] = useState(player.getCurrentWeapon());

  return (
    <div style={{ userSelect: "none" }}>
      <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>Skill tree</div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: 30, display: "grid", rowGap: 20, height: "min-content" }}>
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

        <SkillTree gun={selectedWeapon} />
      </div>
    </div>
  );
}
