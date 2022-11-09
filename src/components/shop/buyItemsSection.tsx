import React from "react";
import { player, shopItems } from "../../Shooter";
import { GunIcon } from "../gunIcon";

export function BuyItemsSection() {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: "bold", marginBottom: 12 }}>Items</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "min-content auto min-content min-content",
          rowGap: 20,
          columnGap: 12,
          alignItems: "center",
        }}
      >
        {shopItems.map((weapon) => (
          <React.Fragment key={weapon.getName()}>
            <GunIcon entityName={weapon.getName()} />
            <div>{weapon.getName()}</div>
            <button disabled={weapon.getPrice() > player.getMoney()}>Buy</button>
            <div style={{ textAlign: "end" }}>${weapon.getPrice()}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
