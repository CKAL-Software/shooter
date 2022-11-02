import { player } from "../../Shooter";
import { WeaponStats } from "./weaponStats";

export function WeaponsSection() {
  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>Weapons</div>
      <div style={{ display: "grid", gridTemplateColumns: "auto min-content" }}>
        {player.getWeapons().map((gun) => (
          <WeaponStats key={gun.getName()} weapon={gun} />
        ))}
      </div>
    </div>
  );
}
