import { gameStats } from "../Shooter";
import { towerSpecifications } from "../Definitions/TowerSpecifications";
import { Tower } from "../GameObjects/Towers/Tower";
import { TowerCard } from "./towerCard";

interface TowerListProps {
  selectTower(tower: Tower): void;
  notifyUI: () => void;
}

export function TowerList(props: TowerListProps) {
  return (
    <div
      style={{
        marginTop: "8px",
        display: "grid",
        rowGap: "8px",
      }}
    >
      {towerSpecifications.map((spec) => (
        <TowerCard
          key={spec.name}
          onClick={
            spec.prices[0] <= gameStats.money
              ? () => props.selectTower(new spec.towerConstructor(props.notifyUI))
              : undefined
          }
          spec={spec}
        />
      ))}
      <div style={{ height: "24px" }} />
    </div>
  );
}
