import { useContext } from "react";
import { TriggerRenderContext } from "../../lib/contexts";
import { experienceThresholdsPlayer } from "../../lib/definitions";
import { percentFormatter, round } from "../../lib/functions";
import { PlayerStat, Stat } from "../../lib/skillDefinitions";
import { player } from "../../Shooter";
import { ProgressBar } from "../progressBar";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { LevelNumber } from "../levelNumber";
import {
  COLOR_STAT_BONUS_ORANGE,
  COLOR_HP_BAR_RED,
  COLOR_HP_BAR_GREEN,
  COLOR_PLAYER,
  COLOR_SKILLPOINT,
} from "../../lib/definitions.colors";

export function PlayerSection() {
  const rerender = useContext(TriggerRenderContext);

  function getStatText(description: string, stat: PlayerStat, formatter?: (value: number) => any) {
    const num = player.getStat(stat);
    const roundedNum = round(num);
    const formattedNum = formatter ? formatter(roundedNum) : roundedNum;

    const bonusNum = player.getEffect(stat, player.getSkillPointsForStat(stat) + 1) - player.getStat(stat);
    const roundedBonusNum = round(bonusNum);
    const formattedBonusNum = formatter ? formatter(roundedBonusNum) : roundedBonusNum;

    const skillPointsUsedForStat = player.getSkillPointsForStat(stat);

    const color = skillPointsUsedForStat > 0 ? COLOR_STAT_BONUS_ORANGE : undefined;

    return (
      <>
        <div style={{ whiteSpace: "nowrap", color }}>{description}</div>
        <div style={{ textAlign: "end", color }}>
          {(num > 0 && ![Stat.MaxHealth, Stat.MoveSpeed].includes(stat) ? "+" : "") + formattedNum}
        </div>
        <button
          disabled={player.getUnusedSkillPoints() === 0}
          onClick={() => {
            player.upgrade(stat);
            rerender();
          }}
          style={{ userSelect: "none" }}
        >
          {bonusNum > 0 ? "+" + formattedBonusNum : formattedBonusNum}
        </button>
        <div style={{ textAlign: "end", color }}>{skillPointsUsedForStat}</div>
      </>
    );
  }

  const healthRatio = player.getHealth() / player.getStat(Stat.MaxHealth);

  return (
    <div style={{ width: "min-content" }}>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>Player</div>
      <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: "12px 44px 24px 0" }}>
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
              width: `${Math.min(80, (80 * player.getHealth()) / player.getStat(Stat.MaxHealth))}px`,
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
              percentage={healthRatio}
              text={player.getHealth() + "/" + player.getStat(Stat.MaxHealth)}
              barColor={healthRatio <= 0.25 ? "#d50000" : healthRatio <= 0.5 ? "#d5c800" : "#32d500"}
              backgroundColor={"rgba(0,0,0,0.15)"}
              height={30}
              width={300}
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Experience</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ProgressBar
                percentage={player.getExperience() / experienceThresholdsPlayer[player.getLevel() + 1]}
                text={player.getExperience() + "/" + experienceThresholdsPlayer[player.getLevel() + 1]}
                barColor="#90caf9"
                backgroundColor={"rgba(0,0,0,0.15)"}
                height={30}
                width={300}
              />
              <LevelNumber level={player.getLevel()} />
            </div>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            gridColumn: "span 4",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "min-content min-content",
              gridColumn: "span 9",
              columnGap: 12,
              rowGap: 2,
              margin: "4px 0 8px",
              fontSize: 16,
            }}
          >
            <div style={{ whiteSpace: "nowrap" }}>Damage dealt</div>
            <div style={{ textAlign: "end" }}>{player.getDamageDealt()}</div>
            <div>Takedowns</div>
            <div style={{ textAlign: "end" }}>{player.getTakedowns()}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginTop: -2 }}>{player.getMoney()}</div>
            <RiMoneyDollarCircleFill style={{ fontSize: 30, alignSelf: "center", marginLeft: 4 }} />
          </div>
        </div>
        <div style={{ gridColumn: "span 4", marginBottom: 16 }} />
        {getStatText("Max health", Stat.MaxHealth)}
        {getStatText("Move speed", Stat.MoveSpeed)}
        {getStatText("Ammo cost", Stat.AmmoCost, percentFormatter)}
        {getStatText("Damage bonus", Stat.Damage, percentFormatter)}
        {getStatText("Reload speed bonus", Stat.ReloadSpeed, percentFormatter)}
        {getStatText("Range bonus", Stat.Range, percentFormatter)}
        {getStatText("Recoil bonus", Stat.Recoil, percentFormatter)}
        {getStatText("Bullet velocity bonus", Stat.Velocity, percentFormatter)}
        {getStatText("Crit chance bonus", Stat.CritChance, percentFormatter)}
        {getStatText("Drop chance bonus", Stat.DropChance, percentFormatter)}
      </div>
    </div>
  );
}
