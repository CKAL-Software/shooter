import React from "react";
import { GiHeavyBullets } from "react-icons/gi";
import { player } from "../../Shooter";
import { GunIcon } from "../gunIcon";

export function BuyAmmoSection() {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: "bold", marginBottom: 12 }}>Ammo</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "min-content min-content min-content",
          rowGap: 20,
          columnGap: 20,
          alignItems: "center",
        }}
      >
        {player.getWeapons().map((weapon) => (
          <React.Fragment key={weapon.getName()}>
            <GunIcon entityName={weapon.getName()} level={weapon.getLevel()} />
            <div style={{ marginLeft: 10, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <div>{weapon.getAmmo()}</div>
              <GiHeavyBullets style={{ marginLeft: 6, fontSize: 20 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "max-content min-content", rowGap: 4, columnGap: 12 }}>
              <button style={{ whiteSpace: "nowrap" }}>Buy 1</button>
              <div style={{ textAlign: "end" }}>$2</div>
              <button style={{ whiteSpace: "nowrap" }}>Buy 10</button>
              <div style={{ textAlign: "end" }}>$15</div>
              <button style={{ whiteSpace: "nowrap" }}>Buy 100</button>
              <div style={{ textAlign: "end" }}>$150</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
