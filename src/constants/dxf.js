// import {pointInPolygon} from './pointInPolygon';
import pointInPolygon from 'robust-point-in-polygon';
import {isClockwise, baseLayers} from './entities';

export const filterDXF = (dxf, properties) => {
  if (dxf.tables.layer && dxf.tables.layer.layers) {
    let layers = Object.values(dxf.tables.layer.layers).map((item) => ({
      ...item,
      color: item.color && '#' + item.color.toString(16),
    }));
    layers = layers
      .filter((item) => item.name !== '0')
      .reduce((a, b) => {
        a[b.name] = b;
        return a;
      }, {});
    dxf.layers = layers;
  }
  if (properties && properties['scale'] !== 'Meter') {
    dxf.entities = fixScale(
      dxf.entities,
      properties['scale'],
      Number(properties['Round scale (meter)'])
    );
  } else {
    dxf.entities = fixScale(dxf.entities, 'Meter', 0.001);
  }
  const base = getBaseLayers(dxf.entities);
  dxf.entities = addElementZone(dxf.entities, base);
  dxf.entities = addElementLocals(
    dxf.entities,
    dxf.entities.filter((item) => baseLayers.includes(item.layer))
  );
  dxf.entities = fixClockWise(dxf.entities);
  dxf.baseLayers = base;
  return dxf;
};

const scales = {
  Meter: 1,
  Centimeter: 0.01,
  Millimeter: 0.001,
};

const fixScale = (entities, scale, round) => {
  let newR = 1 / round;
  return entities.map((entity) => {
    if (entity.center) {
      entity.center = {
        x: Math.round(scales[scale] * entity.center.x * newR) / newR,
        y: Math.round(scales[scale] * entity.center.y * newR) / newR,
        z: Math.round(scales[scale] * entity.center.z * newR) / newR,
      };
      entity.radius = Math.round(scales[scale] * entity.radius * newR) / newR;
    } else if (entity.vertices)
      entity.vertices = entity.vertices.map((k) => {
        for (let key in k)
          k[key] = Math.round(scales[scale] * k[key] * newR) / newR;
        return k;
      });
    return entity;
  });
};

const fixClockWise = (entities) => {
  return entities.map((entity) => {
    if (entity.type && entity.layer && entity.vertices && entity.localVertices)
      if (
        entity.type === 'LWPOLYLINE' &&
        entity.layer.search('voids') > -1 &&
        !isClockwise(entity.localVertices)
      ) {
        entity.localVertices = JSON.parse(
          JSON.stringify(entity.localVertices)
        ).reverse();
        entity.vertices = JSON.parse(JSON.stringify(entity.vertices)).reverse();
      } else if (
        entity.type === 'LWPOLYLINE' &&
        entity.layer.search('voids') < 0 &&
        isClockwise(entity.localVertices)
      ) {
        entity.localVertices = JSON.parse(
          JSON.stringify(entity.localVertices)
        ).reverse();
        entity.vertices = JSON.parse(JSON.stringify(entity.vertices)).reverse();
      }
    return entity;
  });
};

const getBaseLayers = (entities) =>
  entities.reduce((a, b) => {
    for (let item of baseLayers)
      if (b.layer && b.layer.search(item) > -1)
        (a[item] = a[item] || []).push(b);
    return a;
  }, {});

export const roundThree = (num) =>
  parseFloat((+(Math.round(num + 'e+3') + 'e-3')).toFixed(3));

const addElementZone = (entities, base) =>
  entities.map((entity) => {
    if (baseLayers.findIndex((item) => entity.layer.search(item) > -1) > -1)
      return entity;
    if (entity.vertices || entity.center) {
      let x, y;
      if (entity.vertices && entity.vertices[0]) {
        x = entity.vertices[0].x;
        y = entity.vertices[0].y;
      } else if (entity.center) {
        x = entity.center.x;
        y = entity.center.y;
      } else {
        return entity;
      }

      for (let [key, bs1] of Object.entries(base)) {
        for (let bsObj of bs1) {
          if (
            pointInPolygon(
              bsObj.vertices.map((item) => [
                roundThree(item.x),
                roundThree(item.y),
              ]),
              [roundThree(x), roundThree(y)]
            ) < 1
          ) {
            entity.objectTypes = key;
          }
        }
      }
    }
    return entity;
  });

const addElementLocals = (entities, base) => {
  return entities.map((entity) => {
    if (baseLayers.findIndex((item) => entity.layer.search(item) > -1) > -1)
      return entity;
    if (entity.type === 'MTEXT') return entity;
    let baseLayer = base.filter((item) => item.layer === entity.objectTypes);
    if (baseLayer[0]) {
      baseLayer = baseLayer[0];
      let minx = Math.min(...baseLayer.vertices.map((item) => item.x));
      let miny = Math.min(...baseLayer.vertices.map((item) => item.y));
      if (entity.vertices && entity.vertices[0]) {
        entity.localVertices = entity.vertices.map((item) => ({
          x: item.x - minx,
          y: item.y - miny,
          z: item.z,
        }));
      } else if (entity.center) {
        entity.localCenter = {
          x: entity.center.x - minx,
          y: entity.center.y - miny,
          z: entity.center.z,
        };
      }
    }
    return entity;
  });
};
