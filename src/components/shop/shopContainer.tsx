import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { COLOR_MENU_BACKGROUND } from "../../lib/definitions.colors";
import { player } from "../../Shooter";
import { BuyAmmoSection } from "./buyAmmoSection";
import { BuyItemsSection } from "./buyItemsSection";

export function ShopContainer() {
  return (
    <div
      style={{ position: "absolute", top: 48, width: "100vw", zIndex: 999, display: "flex", justifyContent: "center" }}
    >
      <div
        style={{
          background: COLOR_MENU_BACKGROUND,
          height: 600,
          border: "2px solid gray",
          borderRadius: 4,
          padding: "20px 40px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: 30, textAlign: "center", marginBottom: 12 }}>Shop</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ fontSize: 22, marginTop: -2 }}>{player.getMoney()}</div>
          <RiMoneyDollarCircleFill style={{ fontSize: 30, alignSelf: "center", marginLeft: 4 }} />
        </div>
        <div
          style={{
            display: "flex",
            columnGap: 48,
          }}
        >
          <div style={{ display: "flex", columnGap: 48 }}>
            <BuyAmmoSection />
            <BuyItemsSection />
          </div>
        </div>
      </div>
    </div>
  );
}
