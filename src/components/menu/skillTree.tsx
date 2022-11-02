import { SkillColumn } from "./skillColumn";

export function SkillTree() {
  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>Skill tree</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", columnGap: 36 }}>
        <SkillColumn title="Damage" color="#a00707" />
        <SkillColumn title="Ammo" color="#2a7b0b" />
        <SkillColumn title="Utility" color="#0b627b" />
      </div>
    </div>
  );
}
