import { BsFillHeartFill } from "react-icons/bs";
import { FaCrown, FaSkullCrossbones } from "react-icons/fa";
import { ticksToPrettyTime } from "../lib/functions";
import { Button } from "./button";
import { LeaderboardSegment } from "./leaderboardSegment";

interface GameOverPaneProps {
  ticks: number;
  lives: number;
  score: number;
  wave: number;
  won: boolean;
}

export function GameOverPane(props: GameOverPaneProps) {
  return (
    <div
      style={{
        background: "lightgray",
        marginTop: "48px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        padding: "24px",
      }}
    >
      <div
        style={{ fontSize: "48px", textAlign: "center", fontWeight: "bold", lineHeight: "48px", margin: "16px 0 16px" }}
      >
        GAME OVER
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginBottom: 12 }}>
        <div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", lineHeight: "24px", marginTop: "24px" }}
          >
            Your score
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "24px",
              fontWeight: "bold",
              fontSize: "24px",
              lineHeight: "24px",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div style={{ whiteSpace: "nowrap", textAlign: "end", marginRight: "24px" }}>
              {props.won ? ticksToPrettyTime(props.ticks) : props.score}
            </div>
            <div style={{ whiteSpace: "nowrap", textAlign: "end", marginRight: "24px" }}>
              {props.lives}
              <BsFillHeartFill style={{ marginLeft: "8px", marginBottom: "-1px", color: "red", fontSize: "18px" }} />
            </div>
            <div style={{ whiteSpace: "nowrap", textAlign: "end", marginRight: "24px" }}>
              {props.wave + 1}
              {props.won ? (
                <FaCrown style={{ marginLeft: "8px", fontSize: "18px" }} />
              ) : (
                <FaSkullCrossbones style={{ marginLeft: "8px", fontSize: "18px" }} />
              )}
            </div>
            <div>{ticksToPrettyTime(props.ticks)}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => window.location.reload()}>Play again</Button>
        </div>
      </div>
      <LeaderboardSegment />
    </div>
  );
}
