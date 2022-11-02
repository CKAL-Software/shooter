import { PlayerSection } from "./playerSection";
import { SkillTree } from "./skillTree";
import { WeaponsSection } from "./weaponsSection";

export function MenuContainer() {
  return (
    <div
      style={{ position: "absolute", top: 48, width: "100vw", zIndex: 999, display: "flex", justifyContent: "center" }}
    >
      <div
        style={{
          background: "#ded4b2",
          height: 600,
          border: "2px solid gray",
          borderRadius: 4,
          display: "flex",
          columnGap: 48,
          padding: 20,
        }}
      >
        <PlayerSection />
        <WeaponsSection />
        <SkillTree />
      </div>
    </div>
  );
}