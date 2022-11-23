import { player } from "../../Shooter";
import { WeaponStats } from "./weaponStats";

export function WeaponsSection() {
  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>Weapons</div>
      <div style={{ overflow: "auto", height: "80%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto repeat(8, min-content)", columnGap: 8, rowGap: 2 }}>
          {player.getWeapons().map((gun) => (
            <WeaponStats key={gun.getName()} weapon={gun} />
          ))}
        </div>
      </div>
    </div>
  );
}
