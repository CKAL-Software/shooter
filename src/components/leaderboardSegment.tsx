import React, { useContext } from "react";
import { BsFillHeartFill } from "react-icons/bs";
import { FaCrown, FaSkullCrossbones } from "react-icons/fa";
import { DataContext } from "../lib/contexts";
import { ticksToPrettyTime, toDateAndTime } from "../lib/functions";

interface LeaderboardSegmentProps {
  height?: number;
}

export function LeaderboardSegment(props: LeaderboardSegmentProps) {
  const { leaderboardEntries } = useContext(DataContext);

  return (
    <div style={{ marginRight: -20 }}>
      <div style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", lineHeight: "24px" }}>Leaderboard</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "min-content auto min-content min-content min-content min-content",
          columnGap: "32px",
          marginTop: "24px",
          fontWeight: "bold",
          fontSize: "24px",
          lineHeight: "24px",
          rowGap: 12,
          maxHeight: props.height || 450,
          paddingRight: 20,
          overflow: "scroll",
        }}
      >
        {leaderboardEntries.map((le, i) => (
          <React.Fragment key={le.player}>
            <div>{i + 1 + "."}</div>
            <div style={{ whiteSpace: "nowrap", textAlign: "end" }}>
              {le.won ? ticksToPrettyTime(le.ticks) : le.score}
            </div>
            <div style={{ whiteSpace: "nowrap", textAlign: "end" }}>
              {le.lives}
              <BsFillHeartFill style={{ marginLeft: "8px", marginBottom: "-1px", color: "red", fontSize: "18px" }} />
            </div>
            <div style={{ whiteSpace: "nowrap", textAlign: "end" }}>
              {le.wave}
              {le.won ? (
                <FaCrown style={{ marginLeft: "8px", fontSize: "18px" }} />
              ) : (
                <FaSkullCrossbones style={{ marginLeft: "8px", fontSize: "18px" }} />
              )}
            </div>
            <div style={{ whiteSpace: "nowrap", textAlign: "end" }}>{toDateAndTime(le.timestamp, true, true)}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
