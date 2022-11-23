import { COLOR_MENU_BACKGROUND } from "../../lib/definitions";
import { PlayerSection } from "./playerSection";
import { SkillTreeSection } from "./skillTreeSection";
import { WeaponsSection } from "./weaponsSection";

export function MenuContainer() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 998,
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 48,
          width: "100vw",
          zIndex: 999,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: COLOR_MENU_BACKGROUND,
            height: 600,
            border: "2px solid gray",
            borderRadius: 4,
            display: "flex",
            columnGap: 48,
            padding: "20px 40px",
            overflow: "hidden",
          }}
        >
          <PlayerSection />
          <WeaponsSection />
          <SkillTreeSection />
        </div>
      </div>
    </div>
  );
}
