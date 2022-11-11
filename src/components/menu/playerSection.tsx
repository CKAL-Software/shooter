import { useContext } from "react";
import { TriggerRenderContext } from "../../lib/contexts";
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
  const rerender = useContext(TriggerRenderContext);

  function getStatText(stat: PlayerStat, num: number, formatter?: (value: number) => any) {
    const roundedNum = Math.round(num * 1000) / 1000;
    const formattedNum = formatter ? formatter(roundedNum) : roundedNum;

    const bonusNum = player.getEffect(stat, player.getSkillPointsForStat(stat));
    const roundedBonusNum = Math.round(bonusNum * 1000) / 1000;
    const formattedBonusNum = formatter ? formatter(roundedBonusNum) : roundedBonusNum;
    return (
      <>
        <div style={{ textAlign: "end" }}>{formattedNum}</div>
        <button
          disabled={player.getUnusedSkillPoints() === 0}
          onClick={() => {
            player.upgrade(stat);
            rerender();
          }}
        >
          {bonusNum > 0 ? "+" + formattedBonusNum : formattedBonusNum}
        </button>
        <div style={{ textAlign: "end" }}>{player.getSkillPointsForStat(stat)}</div>
      </>
    );
  }

  function percentFormatter(num: number) {
    return (num * 100).toFixed(1).replace(".0", "") + "%";
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
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
              width={300}
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
              width={300}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 55px 60px min-content",
          columnGap: 16,
          rowGap: 2,
          marginBottom: 8,
          marginTop: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, gridColumn: "span 4" }}>
          <div>Level</div>
          <div>{player.getLevel()}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, gridColumn: "span 4" }}>
          <div>Money</div>
          <div>${player.getMoney()}</div>
        </div>
        <div style={{ gridColumn: "span 4", marginBottom: 8 }} />
        <div style={{ whiteSpace: "nowrap" }}>Max health</div>
        {getStatText("maxHealth", player.getMaxHealth())}
        <div style={{ whiteSpace: "nowrap" }}>Move speed</div>
        {getStatText("moveSpeed", player.getVelocity())}
        <div style={{ whiteSpace: "nowrap" }}>Damage bonus</div>
        {getStatText("damageMultiplier", player.getDamageMultiplier(), percentFormatter)}
        <div style={{ whiteSpace: "nowrap" }}>Reload bonus</div>
        {getStatText("reloadTimeMultiplier", player.getReloadSpeedMultiplier(), percentFormatter)}
        <div style={{ whiteSpace: "nowrap" }}>Range bonus</div>
        {getStatText("rangeMultiplier", player.getRangeMultiplier(), percentFormatter)}
        <div style={{ whiteSpace: "nowrap" }}>Recoil bonus</div>
        {getStatText("recoilMultiplier", player.getRecoilMultiplier(), percentFormatter)}
        <div style={{ whiteSpace: "nowrap" }}>Bullet velocity bonus</div>
        {getStatText("velocityMultiplier", player.getProjectileSpeedMultiplier(), percentFormatter)}
        <div style={{ whiteSpace: "nowrap" }}>Crit chance bonus</div>
        {getStatText("critChanceMultiplier", player.getCritChanceMultiplier(), percentFormatter)}
        <div style={{ whiteSpace: "nowrap" }}>Drop chance bonus</div>
        {getStatText("dropChanceMultiplier", player.getDropChanceMultiplier(), percentFormatter)}
      </div>
    </div>
  );
}
