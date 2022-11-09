import { useState } from "react";
import { Player } from "../../GameObjects/Player";
import { player } from "../../Shooter";
import { Gun } from "../../Weapons/Gun";
import { GunIcon } from "../gunIcon";
import { SkillTree } from "./skillTree";

export function SkillTreeSection() {
  const [selectedEntity, setSelectedEntity] = useState<Gun | Player>(player.getCurrentWeapon());

  return (
    <div style={{ userSelect: "none" }}>
      <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>Skill tree</div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: 30, display: "grid", rowGap: 20, height: "min-content" }}>
          {player.getWeapons().map((gun) => (
            <GunIcon
              key={gun.getName()}
              entityName={gun.getName()}
              selected={selectedEntity.getName() === gun.getName()}
              level={gun.getLevel()}
              unusedSkillPoints={gun.getUnusedSkillPoints()}
              onClick={() => setSelectedEntity(gun)}
            />
          ))}
        </div>

        <SkillTree entity={selectedEntity} />
      </div>
    </div>
  );
}
