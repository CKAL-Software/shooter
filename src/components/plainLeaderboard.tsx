import { GrClose } from "react-icons/gr";
import { LeaderboardSegment } from "./leaderboardSegment";

interface PlainLeaderProps {
  closeLeaderboard(): void;
}

export function PlainLeaderboard(props: PlainLeaderProps) {
  return (
    <div
      style={{
        background: "lightgray",
        marginTop: "48px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        padding: "24px",
        position: "relative",
      }}
    >
      <GrClose
        style={{ cursor: "pointer", position: "absolute", left: "16px", top: "16px" }}
        onClick={props.closeLeaderboard}
      />
      <LeaderboardSegment height={590} />
    </div>
  );
}
