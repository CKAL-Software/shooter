import { MapInfo, Point } from "../lib/definitions";
import { n, posToKey } from "../lib/functions";

interface MinimapProps {
  maps: Map<string, MapInfo>;
  currentMapPosition: Point;
  vision: number;
}

export function Minimap(props: MinimapProps) {
  const elements = 1 + 2 * props.vision;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${elements},min-content)`,
        gridTemplateRows: `repeat(${elements},min-content)`,
      }}
    >
      {n(elements).map((row) =>
        n(elements).map((col) => {
          const mapOfInterest = props.maps.get(
            posToKey({
              x: props.currentMapPosition.x - props.vision + col,
              y: props.currentMapPosition.y - props.vision + row,
            })
          );

          if (!mapOfInterest) {
            return <div key={row + "," + col} />;
          }

          return (
            <div
              key={row + "," + col}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,min-content)",
                gridTemplateRows: "repeat(3,min-content)",
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              <div />
              {mapOfInterest.teleporters["up"] ? <div style={{ height: 4, borderRight: "1px solid gray" }} /> : <div />}
              <div />
              {mapOfInterest.teleporters["left"] ? (
                <div style={{ width: 4, borderBottom: "1px solid gray" }} />
              ) : (
                <div />
              )}
              {mapOfInterest ? (
                <div
                  style={{
                    height: 16,
                    width: 16,
                    background: row === props.vision && col === props.vision ? "red" : "gray",
                  }}
                />
              ) : (
                <div />
              )}
              {mapOfInterest.teleporters["right"] ? (
                <div style={{ width: 4, borderBottom: "1px solid gray" }} />
              ) : (
                <div />
              )}
              <div />
              {mapOfInterest.teleporters["down"] ? (
                <div style={{ height: 4, borderRight: "1px solid gray" }} />
              ) : (
                <div />
              )}
              <div />
            </div>
          );
        })
      )}
    </div>
  );
}
