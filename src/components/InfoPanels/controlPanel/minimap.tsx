import { calculateDistance } from "../../../lib/util.canvas";
import { MapInfo, Point } from "../../../lib/definitions";
import { COLOR_MAP_BACKGROUND, COLOR_SHOP } from "../../../lib/definitions.colors";
import { n, round } from "../../../lib/functions";
import { posToKey } from "../../../lib/MapGenerator";

interface MinimapProps {
  maps: Map<string, MapInfo>;
  currentMapPosition: Point;
  vision: number;
}

const tileMapSize = 20;
const borderSize = 1;
const pathLength = 4;
const cellSize = tileMapSize + 2 * borderSize + 2 * pathLength;

export function Minimap(props: MinimapProps) {
  const elements = 1 + 2 * props.vision;

  const minimapSize = cellSize * (2 * props.vision + 1);

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
                return <div key={row + "," + col} style={{ height: cellSize, width: cellSize }} />;
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
                  <div
                    style={{
                      height: pathLength,
                      borderRight: mapOfInterest.teleporters["up"] ? "2px solid gray" : undefined,
                    }}
                  />
                  <div />
                  <div
                    style={{
                      width: pathLength,
                      borderBottom: mapOfInterest.teleporters["left"] ? "2px solid gray" : undefined,
                    }}
                  />
                  {mapOfInterest ? (
                    <div
                      style={{
                        height: tileMapSize,
                        width: tileMapSize,
                        background: row === props.vision && col === props.vision ? "red" : "white",
                        border: `${borderSize}px solid gray`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {mapOfInterest.hasShop && (
                        <div style={{ background: COLOR_SHOP, height: tileMapSize - 8, width: tileMapSize - 8 }} />
                      )}
                    </div>
                  ) : (
                    <div style={{ height: tileMapSize, width: tileMapSize }} />
                  )}
                  <div
                    style={{
                      width: pathLength,
                      borderBottom: mapOfInterest.teleporters["right"] ? "2px solid gray" : undefined,
                    }}
                  />
                  <div />
                  <div
                    style={{
                      height: pathLength,
                      borderRight: mapOfInterest.teleporters["down"] ? "2px solid gray" : undefined,
                    }}
                  />
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
