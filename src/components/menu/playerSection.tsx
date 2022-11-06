import {
  COLOR_HP_BAR_GREEN,
  COLOR_HP_BAR_RED,
  COLOR_PLAYER,
  COLOR_SKILLPOINT,
  experienceThresholdsPlayer,
  TICK_DURATION_S,
} from "../../lib/definitions";
import { player } from "../../Shooter";
import { ProgressBar } from "../controlPanelElements/progressBar";

export function PlayerSection() {
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
          {player.getUnusedSkillPoints() && (
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
          gridTemplateColumns: "auto min-content",
          columnGap: 16,
          rowGap: 2,
          fontSize: 18,
          marginBottom: 8,
          marginTop: 24,
        }}
      >
        <div>Level</div>
        <div style={{ textAlign: "end" }}>{player.getLevel()}</div>
        <div style={{ whiteSpace: "nowrap" }}>Move speed</div>
        <div style={{ textAlign: "end" }}>{player.getVelocity() / TICK_DURATION_S}</div>
        <div style={{ whiteSpace: "nowrap" }}>Money</div>
        <div style={{ textAlign: "end" }}>{"$" + (215 + player.getMoney())}</div>
      </div>
    </div>
  );
}
