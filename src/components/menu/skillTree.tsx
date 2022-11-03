import { player } from "../../Shooter";
import { WeaponSkillTree } from "./weaponSkillTree";

export function SkillTree() {
  return (
    <div style={{ userSelect: "none" }}>
      <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>Skill tree</div>

      <WeaponSkillTree gun={player.getCurrentWeapon()} />
    </div>
  );
}
