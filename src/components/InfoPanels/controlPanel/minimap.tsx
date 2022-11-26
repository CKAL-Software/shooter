import { calculateDistance } from "../../../lib/canvasFunctions";
import { COLOR_MAP_BACKGROUND, MapInfo, Point } from "../../../lib/definitions";
import { n, posToKey, round } from "../../../lib/functions";

interface MinimapProps {
  maps: Map<string, MapInfo>;
  currentMapPosition: Point;
  vision: number;
}

const tileMapSize = 16;
const pathLength = 4;
const tileSize = tileMapSize + 2 * pathLength;

export function Minimap(props: MinimapProps) {
  const elements = 1 + 2 * props.vision;

  const minimapSize = tileSize * (2 * props.vision + 1);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${elements},min-content)`,
            gridTemplateRows: `repeat(${elements},min-content)`,
            border: "1px solid gray",
            width: minimapSize,
            height: minimapSize,
            background: COLOR_MAP_BACKGROUND,
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
                return <div key={row + "," + col} style={{ height: tileSize, width: tileSize }} />;
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
                  {mapOfInterest.teleporters["up"] ? (
                    <div style={{ height: pathLength, borderRight: "2px solid gray" }} />
                  ) : (
                    <div />
                  )}
                  <div />
                  {mapOfInterest.teleporters["left"] ? (
                    <div style={{ width: pathLength, borderBottom: "2px solid gray" }} />
                  ) : (
                    <div />
                  )}
                  {mapOfInterest ? (
                    <div
                      style={{
                        height: tileMapSize,
                        width: tileMapSize,
                        background: row === props.vision && col === props.vision ? "red" : "gray",
                      }}
                    />
                  ) : (
                    <div style={{ height: tileSize, width: tileSize }} />
                  )}
                  {mapOfInterest.teleporters["right"] ? (
                    <div style={{ width: pathLength, borderBottom: "2px solid gray" }} />
                  ) : (
                    <div />
                  )}
                  <div />
                  {mapOfInterest.teleporters["down"] ? (
                    <div style={{ height: pathLength, borderRight: "2px solid gray" }} />
                  ) : (
                    <div />
                  )}
                  <div />
                </div>
              );
            })
          )}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            marginTop: 8,
            display: "grid",
            gridTemplateColumns: "min-content min-content",
            columnGap: 8,
            fontSize: 18,
          }}
        >
          <div>Position:</div>
          <div style={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
            {" " +
              (props.currentMapPosition.y === 0 && props.currentMapPosition.x === 0
                ? "Home"
                : (props.currentMapPosition.y === 0
                    ? ""
                    : Math.abs(props.currentMapPosition.y) + (props.currentMapPosition.y < 0 ? "N" : "S")) +
                  " " +
                  (props.currentMapPosition.x === 0
                    ? ""
                    : Math.abs(props.currentMapPosition.x) + (props.currentMapPosition.x < 0 ? "W" : "E")))}
          </div>
          <div>Stray:</div>
          <div style={{ textAlign: "end", fontWeight: "bold" }}>
            {round(calculateDistance({ x: 0, y: 0 }, props.currentMapPosition))}
          </div>
        </div>
      </div>
    </div>
  );
}
