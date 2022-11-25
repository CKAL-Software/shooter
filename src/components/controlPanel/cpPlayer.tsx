import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { experienceThresholdsPlayer } from "../../lib/definitions";
import { Stat } from "../../lib/skillDefinitions";
import { player } from "../../Shooter";
import { LevelNumber } from "../levelNumber";
import { ProgressBar } from "../progressBar";

export function CPPlayer() {
  const healthRatio = player.getHealth() / player.getStat(Stat.MaxHealth);

  return (
    <div>
      <div style={{ fontSize: 24, marginBottom: 8 }}>Player</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ fontSize: 22, marginTop: -2 }}>{player.getMoney()}</div>
        <RiMoneyDollarCircleFill style={{ fontSize: 30, alignSelf: "center", marginLeft: 4 }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ marginBottom: 4, fontSize: 16, marginLeft: 2 }}>Health</div>
        <ProgressBar
          percentage={healthRatio}
          text={player.getHealth() + "/" + player.getStat(Stat.MaxHealth)}
          barColor={healthRatio <= 0.25 ? "#d50000" : healthRatio <= 0.5 ? "#d5c800" : "#32d500"}
          backgroundColor={"rgba(0,0,0,0.15)"}
          height={30}
          width={260}
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
            width={216}
          />
          <LevelNumber level={player.getLevel()} />
        </div>
      </div>
    </div>
  );
}
