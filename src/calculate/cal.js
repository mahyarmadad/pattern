import {getGlobal} from 'reactn';
import pointInPolygon from 'robust-point-in-polygon';
import {syncSelected} from '../constants/entities';

const GetCal = () => {
  let dxf = getGlobal().dxf;
  const getposition = dxf.baseLayers;
  const Layers = [
    'aGrid',
    'aCourt',
    'playerPositionBeforeHitting',
    'ballHittingPosition',
    'ballPlacementBoundry',
    'shotServe',
    'shotGroundStrokes',
    'shotForehandTopSpin',
    'shotForehand',
    'shotVolley',
    'shotLobBackhandUnderSpin',
    'ballPlacementTarget',
    'shotGroundStrokesFlat',
    'shotGroundStrokesUnderSpin',
    'shotDrop',
    'shotVolleySmash',
    'shotBackhand',
    'shotLob',
    'opponentPositionBeforeHitting',
    'shotWithoutDrop',
    'opponentPositionAfterHitting',
    'shotGroundStrokesTopSpin',
    'condition',
    'aHitter',
  ];

  // Position

  const patternServe = getposition.patternServe[0].vertices.map((point) => [
    point.x,
    point.y,
  ]);
  const patternReturn = getposition.patternReturn[0].vertices.map((point) => [
    point.x,
    point.y,
  ]);
  const patternDefensive = getposition.patternDefensive[0].vertices.map(
    (point) => [point.x, point.y]
  );
  const patternGroundStroke = getposition.patternGroundStroke[0].vertices.map(
    (point) => [point.x, point.y]
  );
  const patternMidCourt = getposition.patternMidCourt[0].vertices.map(
    (point) => [point.x, point.y]
  );
  const patternNet = getposition.patternNet[0].vertices.map((point) => [
    point.x,
    point.y,
  ]);

  let objectKeys = {
    patternServe,
    patternReturn,
    patternDefensive,
    patternGroundStroke,
    patternMidCourt,
    patternNet,
  };

  dxf.entities = dxf.entities.map((i) => {
    // Find pattern (worked checked)
    if (i.layer === 'aBase') {
      for (let pat in objectKeys) {
        // if (!i.vertices) {continue;}
        if (pointInPolygon(objectKeys[pat],i.position ? [i.position.x, i.position.y] : [i.vertices[0].x, i.vertices[0].y]) <1) {
          i.pattern = pat;
        }
      }
    }
    // find aBase Content (worked Checked)
    Layers.forEach((word) => {
      if (i.layer === word) {
        // for (let j = 0; j < getposition.aBase.length; j++) {
        // if (word === 'aHitter') {
        dxf.entities
          .filter((o) => o.layer === 'aBase')
          .map((c) => {
            if (word === 'aHitter') {
              console.log(
                pointInPolygon(
                  c.vertices.map((p) => [p.x, p.y]),
                  [i.position.x, i.position.y]
                ) < 1
              );
            }
            if (
              pointInPolygon(
                c.vertices.map((p) => [p.x, p.y]),
                i.position
                  ? [i.position.x, i.position.y]
                  : [i.vertices[0].x, i.vertices[0].y]
              ) < 1
            ) {
              i.aBaseId = c.id;
            }
          });

        // }
        // if (
        //   pointInPolygon(
        //     getposition.aBase[j].vertices.map((point) => [point.x, point.y]),
        //     i.position
        //       ? [i.position.x, i.position.y]
        //       : [i.vertices[0].x, i.vertices[0].y]
        //   ) < 1
        // ) {
        //   i.aBaseId = getposition.aBase[j].id;
        // }
        // }
      }
    });

    let p = 1;
    let k = 1;
    // find aBase with same x (worked Check)
    if (i.layer === 'aBase') {
      for (let j = 0; j < dxf.entities.length; j++) {
        if (!dxf.entities[j]) continue;
        if (dxf.entities[j].layer === 'aBase') {
          if (!dxf.entities[j].vertices || !i.vertices) continue;
          if (i.pattern === dxf.entities[j].pattern) {
            if (i.vertices[0].x === dxf.entities[j].vertices[0].x) {
              i.play = 'insameplay' + k + p;
            } else {
              p++;
            }
          } else {
            k = 0;
          }
        }
      }
    }
    return i;
  });
  // Sort aBase by y (worked Check)
  let x = 0;
  dxf.entities = dxf.entities.map((i) => {
    if (i.layer === 'aBase') {
      for (let j = 0; j < dxf.entities.length; j++) {
        if (!dxf.entities[j]) continue;
        if (dxf.entities[j].layer === 'aBase') {
          if (!dxf.entities[j].vertices || !i.vertices) continue;
          if (i.pattern === dxf.entities[j].pattern) {
            if (i.play === dxf.entities[j].play) {
              i.playRow = x;
              if (i.vertices[0].y >= dxf.entities[j].vertices[0].y) {
                x++;
                i.playRow = x;
              }
            } else {
              x = 0;
            }
          } else {
            x = 0;
          }
        }
      }
    }
    return i;
  });

  // Find min x and y for aCourts in aBase (worked Check)
  let minACourt = dxf.entities
    .filter((i) => i.layer === 'aBase')
    .map((c) => {
      let minX = Infinity;
      let minY = Infinity;
      let filtered = dxf.entities
        .filter((q) => q.layer === 'aCourt')
        .filter((e) => e.aBaseId === c.id);
      for (let element of filtered) {
        if (element.vertices[0].x < minX) minX = element.vertices[0].x;
        if (element.vertices[0].y < minY) minY = element.vertices[0].y;
      }
      return {
        id: c.id,
        y: minY,
        x: minX,
      };
    });

  // Find the entities loc form minaCourts in aBase (worked Check)
  dxf.entities = dxf.entities.map((i) => {
    if (i.aBaseId) {
      minACourt.forEach((e) => {
        if (i.aBaseId === e.id) {
          i.localVertices = i.vertices
            ? i.vertices.map((p) => {
                return {x: Math.round(p.x - e.x), y: Math.round(p.y - e.y)};
              })
            : {x: i.position.x - e.x, y: i.position.y - e.y};
        }
      });
    }
    return i;
  });

  syncSelected(null, dxf);
  return dxf.entities;
};
export default GetCal;
