import React from "react";
import { COLOR_LEVEL } from "../../../lib/definitions.colors";
import { logs } from "../../../lib/GameLog";

export function GameLog() {
  return (
    <div style={{ border: "1px solid gray", background: "white", overflow: "hidden" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "min-content auto",
          margin: "0 8px",
          columnGap: 8,
          rowGap: 2,
        }}
      >
        {logs.map((l) => (
          <React.Fragment key={l.id}>
            <div
              style={{
                fontSize: 12,
                color: "gray",
                alignSelf: "center",
                marginBottom: -1,
              }}
            >
              {l.timestamp}
            </div>
            <div style={{ color: l.type === "level up" ? COLOR_LEVEL : undefined }}>{l.text}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
