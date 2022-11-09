import {
  COLOR_HP_BAR_GREEN,
  COLOR_HP_BAR_RED,
  COLOR_PLAYER,
  COLOR_SKILLPOINT,
  experienceThresholdsPlayer,
} from "../../lib/definitions";
import { PlayerStat } from "../../lib/skillDefinitions";
import { player } from "../../Shooter";
import { ProgressBar } from "../controlPanelElements/progressBar";

export function PlayerSection() {
  function getUpgradeButton(stat: PlayerStat, formatter?: (value: number) => any) {
    const num = player.getEffect(stat, player.getSkillPointsForStat(stat));
    const rounded = Math.round(num * 100) / 100;
    const formatted = formatter ? formatter(rounded) : rounded;
    return <button disabled={player.getUnusedSkillPoints() === 0}>{rounded > 0 ? "+" + formatted : formatted}</button>;
  }

  return (
    <div style={{ width: "min-content" }}>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>Player</div>
      <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: "12px 0 24px" }}>
        <div
          style={{
            width: 80,
            height: 16,
            background: COLOR_HP_BAR_RED,
            position: "relative",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              position: "absolute",
              height: 16,
              width: `${Math.min(80, (80 * player.getHealth()) / player.getMaxHealth())}px`,
              background: COLOR_HP_BAR_GREEN,
            }}
          />
        </div>

        <div
          style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: COLOR_PLAYER, position: "relative" }}
        >
          {player.getUnusedSkillPoints() > 0 && (
            <div
              style={{
                position: "absolute",
                background: COLOR_SKILLPOINT,
                borderRadius: "50%",
                fontWeight: "bold",
                fontSize: 14,
                right: -2,
                top: -2,
                width: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <div
                style={{
                  marginTop: -1,
                  whiteSpace: "nowrap",
                }}
              >
                {player.getUnusedSkillPoints()}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Health</div>
        <ProgressBar
          percentage={player.getHealth() / player.getMaxHealth()}
          text={player.getHealth() + "/" + player.getMaxHealth()}
          barColor={
            player.getHealth() / player.getMaxHealth() <= 0.25
              ? "#d50000"
              : player.getHealth() / player.getMaxHealth() <= 0.5
              ? "#d5c800"
              : "#32d500"
          }
          backgroundColor={"rgba(0,0,0,0.15)"}
          height={30}
          width={260}
        />
      </div>

      <div>
        <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Experience</div>
        <ProgressBar
          percentage={player.getExperience() / experienceThresholdsPlayer[player.getLevel() - 1]}
          text={player.getExperience() + "/" + experienceThresholdsPlayer[player.getLevel() - 1]}
          barColor="#90caf9"
          backgroundColor={"rgba(0,0,0,0.15)"}
          height={30}
          width={260}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto min-content min-content",
          columnGap: 16,
          rowGap: 2,
          marginBottom: 8,
          marginTop: 24,
        }}
      >
        <div style={{ fontSize: 18, gridColumn: "span 2" }}>Level</div>
        <div style={{ textAlign: "end", fontSize: 18 }}>{player.getLevel()}</div>
        <div style={{ whiteSpace: "nowrap", fontSize: 18, gridColumn: "span 2" }}>Money</div>
        <div style={{ textAlign: "end", fontSize: 18 }}>{"$" + (215 + player.getMoney())}</div>
        <div style={{ gridColumn: "span 3", marginBottom: 8 }} />
        <div style={{ whiteSpace: "nowrap" }}>Max health</div>
        <div style={{ textAlign: "end" }}>{player.getMaxHealth()}</div>
        {getUpgradeButton("maxHealth")}
        <div style={{ whiteSpace: "nowrap" }}>Move speed</div>
        <div style={{ textAlign: "end" }}>{player.getVelocity()}</div>
        {getUpgradeButton("moveSpeed")}
        <div style={{ whiteSpace: "nowrap" }}>Damage multiplier</div>
        <div style={{ textAlign: "end" }}>{player.getDamageMultiplier()}%</div>
        {getUpgradeButton("damageMultiplier", (v) => v * 100 + "%")}
        <div style={{ whiteSpace: "nowrap" }}>Reload multiplier</div>
        <div style={{ textAlign: "end" }}>{player.getReloadSpeedMultiplier()}%</div>
        {getUpgradeButton("reloadTimeMultiplier", (v) => v * 100 + "%")}
        <div style={{ whiteSpace: "nowrap" }}>Range multiplier</div>
        <div style={{ textAlign: "end" }}>{player.getRangeMultiplier()}%</div>
        {getUpgradeButton("rangeMultiplier", (v) => v * 100 + "%")}
        <div style={{ whiteSpace: "nowrap" }}>Recoil multiplier</div>
        <div style={{ textAlign: "end" }}>{player.getRecoilMultiplier()}%</div>
        {getUpgradeButton("recoilMultiplier", (v) => v * 100 + "%")}
        <div style={{ whiteSpace: "nowrap" }}>Bullet velocity multiplier</div>
        <div style={{ textAlign: "end" }}>{player.getProjectileSpeedMultiplier()}%</div>
        {getUpgradeButton("velocityMultiplier", (v) => v * 100 + "%")}
        <div style={{ whiteSpace: "nowrap" }}>Crit chance multiplier</div>
        <div style={{ textAlign: "end" }}>{player.getCritChanceMultiplier()}%</div>
        {getUpgradeButton("critChanceMultiplier", (v) => v * 100 + "%")}
        <div style={{ whiteSpace: "nowrap" }}>Drop chance multiplier</div>
        <div style={{ textAlign: "end" }}>{player.getDropChanceMultiplier()}%</div>
        {getUpgradeButton("dropChanceMultiplier", (v) => v * 100 + "%")}
      </div>
    </div>
  );
}
