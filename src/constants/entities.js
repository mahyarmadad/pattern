import * as d3 from 'd3';
import polygonClipping from 'polygon-clipping';
import { color, text, colorHover } from './colors';
import { getGlobal, setGlobal } from 'reactn';
// import {intersect} from 'mathjs';
export const baseLayers = [
  'aGrid',
  'aCourt',
  'playerPositionBeforeHitting',
  'ballHittingPosition',
  'ballPlacementBoundry',
  'shotServe',
  'shotGroundStrokes',
  'condition',
  'opponentPositionBeforeHitting',
  'shotWithoutDrop',
  'opponentPositionAfterHitting',
  'shotGroundStrokesTopSpin',
  'shotForehandTopSpin',
  'shotForehand',
  'shotVolley',
  'shotLobBackhandUnderSpin',
  'ballPlacementTarget',
  'patternServe',
  'patternReturn',
  'patternGroundStroke',
  'shotGroundStrokesFlat',
  'shotGroundStrokesUnderSpin',
  'shotDrop',
  'patternMidCourt',
  'shotVolleySmash',
  'patternNet',
  'aBase',
  'shotBackhand',
  'shotLob',
  'patternDefensive',
  'aHitter',
];

// const boundLayers = str => {
//   for (let item of baseLayers)
//     if (str.search(item) > -1 && item !== 'grid') return true;
//   return false;
// };

export const ignoreLayers = [];
const sortLayers = {
  aGrid: 1,
  aCourt: 1,
  playerPositionBeforeHitting: 1,
  ballHittingPosition: 1,
  ballPlacementBoundry: 1,
  shotServe: 1,
  shotGroundStrokes: 1,
  condition: 1,
  opponentPositionBeforeHitting: 1,
  shotWithoutDrop: 1,
  opponentPositionAfterHitting: 1,
  shotGroundStrokesTopSpin: 1,
  shotForehandTopSpin: 1,
  shotForehand: 1,
  shotVolley: 1,
  shotLobBackhandUnderSpin: 1,
  ballPlacementTarget: 1,
  patternServe: 1,
  patternReturn: 1,
  patternGroundStroke: 1,
  shotGroundStrokesFlat: 1,
  shotGroundStrokesUnderSpin: 1,
  shotDrop: 1,
  patternMidCourt: 1,
  shotVolleySmash: 1,
  patternNet: 1,
  aBase: 1,
  shotBackhand: 1,
  shotLob: 1,
  patternDefensive: 1,
  aHitter: 1,
};

export const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const findBound = (entity, local = false) => {
  let minX, minY, maxX, maxY;
  let start = true;
  if (entity.type === 'LWPOLYLINE' || entity.type === 'LINE') {
    for (let { x, y } of local ? entity.localVertices : entity.vertices) {
      if (start) {
        minX = x;
        maxX = x;
        minY = -y;
        maxY = -y;
        start = false;
      }
      if (minX > x) minX = x;
      if (minY > -y) minY = -y;
      if (maxX < x) maxX = x;
      if (maxY < -y) maxY = -y;
    }
  }
  if (entity.type === 'ARC' || entity.type === 'CIRCLE') {
    let center = local ? entity.localCenter : entity.center;
    let minx = center.x - entity.radius;
    let miny = -center.y - entity.radius;
    let maxx = center.x + entity.radius;
    let maxy = -center.y + entity.radius;
    if (start) {
      minX = minx;
      maxX = maxx;
      minY = miny;
      maxY = maxy;
      start = false;
    }
    if (minX > minx) minX = minx;
    if (minY > miny) minY = miny;
    if (maxX < maxx) maxX = maxx;
    if (maxY < maxy) maxY = maxy;
  }
  return { minX, minY, maxX, maxY };
};

let layerCustomColors = { axis: 'red' };
let layerCustomWidth = { axis: '1' };
let clickableWidth = 20;

export const drawEntities = (
  parent,
  clickHandler,
  contextHandler,
  layers,
  axis = 'XY',
  hoverHandler,
  hoverHandlerOut
) => {
  let line = d3
    .line()
    .x((d) => d.x)
    .y((d) => -d.y);
  let textOffset = (s) => s.attr('x', (d) => d.x).attr('y', (d) => -d.y);
  let transFormFunc = (d) =>
    `translate(${d.localCenter.x},${-d.localCenter.y})`;
  if (axis === 'XZ') {
    line = d3
      .line()
      .x((d) => d.x)
      .y((d) => -d.z || 0);
    textOffset = (s) => s.attr('x', (d) => d.x).attr('y', (d) => -d.z || 0);
    transFormFunc = (d) =>
      `translate(${d.localCenter.x},${
      d.objectTypes.toLowerCase().includes('gen')
        ? -d.localCenter.z
        : -d.localCenter.z || 0
      })`;
  }
  if (axis === 'YZ') {
    line = d3
      .line()
      .x((d) => d.y)
      .y((d) => -d.z || 0);
    textOffset = (s) => s.attr('x', (d) => d.y).attr('y', (d) => -d.z || 0);
    transFormFunc = (d) =>
      `translate(${d.localCenter.y},${
      d.objectTypes.toLowerCase().includes('gen')
        ? -d.localCenter.z
        : -d.localCenter.z || 0
      })`;
  }

  const arc = d3
    .arc()
    // .startAngle(d => 0)
    // .endAngle(d => Math.PI * 1.5)
    .startAngle((d) => Math.PI / 2 - d.startAngle || 0)
    .endAngle(
      (d) =>
        Math.PI / 2 -
        (d.endAngle > d.startAngle ? d.endAngle : d.endAngle + 2 * Math.PI) ||
        Math.PI * 2
    )
    .innerRadius((d) => d.radius)
    .outerRadius(0);

  const globalDraw = (s) => {
    s.attr('opacity', (d) => d.opacity || 1)
      .attr('stroke', (d) =>
        d.hover
          ? colorHover
          : d.selected
            ? color
            : layerCustomColors[d.objectTypes]
              ? layerCustomColors[d.objectTypes]
              : d.stroke
                ? d.stroke
                : layers[d.layer] && layers[d.layer].color
                  ? layers[d.layer].color
                  : text
      )
      .attr('stroke-dasharray', (d) =>
        d.objectTypes === 'axis' ? '22 6 4 6' : 'none'
      )
      .attr('data-layer', (d) => d.layer)
      .attr('stroke-width', (d) =>
        d.strokeWidth
          ? d.strokeWidth
          : layerCustomWidth[d.objectTypes]
            ? layerCustomWidth[d.objectTypes]
            : d.layer === 'grid'
              ? 1
              : d.selected
                ? 3
                : 1
      )
      .attr('marker-end', (d) => (d.markerEnd ? 'url(#triangle)' : null))
      .attr('marker-start', (d) => (d.markerStart ? 'url(#triangle)' : null))
      .attr('marker-mid', (d) => (d.markerMid ? 'url(#triangle)' : null))
      .attr('vector-effect', (d) =>
        d.dynamicStroke === false ? 'none' : 'non-scaling-stroke'
      )
      .attr('fill', (d) => (d.fill ? d.fill : 'none'));
  };

  const globalClickDraw = (s) => {
    s.attr('opacity', (d) => 0)
      .attr('stroke', (d) => 'blue')
      .attr('data-layer', (d) => d.layer)
      .attr('stroke-dasharray', (d) => 'none')
      .attr('stroke-width', (d) => clickableWidth)
      .attr('vector-effect', (d) =>
        d.dynamicStroke === false ? 'none' : 'non-scaling-stroke'
      );
  };

  const poly = parent.selectAll('.poly').data(
    (d) =>
      d[1].filter(
        (item) =>
          item.viewSelected &&
          (item.type === 'LWPOLYLINE' ||
            item.type === 'LINE' ||
            item.type === 'POLYLINE')
      ),
    (d) => d.id
  );
  let svgPoly = poly
    .enter()
    .append('svg:path')
    .attr('class', 'poly')
    .merge(poly);
  svgPoly
    .attr('d', (d) =>
      line(
        // d.type === 'LWPOLYLINE' ? [...d.vertices, d.vertices[0]] : d.vertices
        d.type === 'LWPOLYLINE' ? [...d.vertices, d.vertices[0]] : d.vertices
      )
    )
    .call(globalDraw);

  const poly2 = parent.selectAll('.click-poly').data(
    (d) =>
      d[1].filter(
        (item) =>
          item.viewSelected &&
          (item.type === 'LWPOLYLINE' ||
            item.type === 'LINE' ||
            item.type === 'POLYLINE')
      ),
    (d) => d.id
  );
  let clickSvgPoly = poly2
    .enter()
    .append('svg:path')
    .attr('class', 'click-poly')
    .merge(poly2);
  clickSvgPoly
    .attr('d', (d) =>
      line(
        d.type === 'LWPOLYLINE' ? [...d.vertices, d.vertices[0]] : d.vertices
      )
    )
    .call(globalDraw);
  clickSvgPoly
    .attr('d', (d) =>
      line(
        d.type === 'LWPOLYLINE' ? [...d.vertices, d.vertices[0]] : d.vertices
      )
    )
    .attr('data-fuck', (d) => (d.selected ? 'yup' : 'no'))
    .call(globalClickDraw);
  clickSvgPoly.on('click', (d, i) => clickHandler(d, i, d3.event));
  clickSvgPoly.on('mouseover', hoverHandler);
  clickSvgPoly.on('mouseout', hoverHandlerOut);
  clickSvgPoly.on('contextmenu', (d, i) => contextHandler(d, i, d3.event));

  poly.exit().remove();
  poly2.exit().remove();

  const arcs = parent.selectAll('.arc').data(
    (d) =>
      d[1].filter(
        (item) =>
          item.viewSelected && (item.type === 'ARC' || item.type === 'CIRCLE')
      ),
    (d) => d.id
  );
  let svgArc = arcs.enter().append('svg:path').attr('class', 'arc').merge(arcs);
  svgArc.attr('d', arc).attr('transform', transFormFunc).call(globalDraw);
  arcs.exit().remove();

  const arcs2 = parent.selectAll('.click-arc').data(
    (d) =>
      d[1].filter(
        (item) =>
          item.viewSelected && (item.type === 'ARC' || item.type === 'CIRCLE')
      ),
    (d) => d.id
  );
  let svgArcClick = arcs2
    .enter()
    .append('svg:path')
    .attr('class', 'click-arc')
    .merge(arcs2);
  svgArcClick
    .attr('d', arc)
    .attr('transform', transFormFunc)
    .call(globalClickDraw);
  svgArcClick.on('click', (d, i) => clickHandler(d, i, d3.event));
  svgArcClick.on('contextmenu', (d, i) => contextHandler(d, i, d3.event));
  arcs2.exit().remove();

  const texts = parent.selectAll('.texts').data(
    (d) => d[1].filter((item) => item.viewSelected && item.type === 'TEXT'),
    (d) => d.id
  );
  let svgTexts = texts
    .enter()
    .append('svg:text')
    .attr('class', 'texts')
    .merge(texts);
  svgTexts
    .text((d) => d.text)
    .attr('font-size', (d) => d['font-size'])
    // .attr('dy', '.35em')
    .call(textOffset)
    .attr('stroke', 'none')
    .attr('text-anchor', (d) => d.textAnchor || 'middle')
    .attr('fill', (d) =>
      d.selected
        ? color
        : d.stroke
          ? d.stroke
          : layers[d.layer] && layers[d.layer].color
            ? layers[d.layer].color
            : text
    );
  svgTexts.on('click', (d, i) => clickHandler(d, i, d3.event));
  svgTexts.on('contextmenu', (d, i) => contextHandler(d, i, d3.event));
  texts.exit().remove();
};

const polyStandards = (input) =>
  input.reduce(
    (a, b) => {
      for (let it of b) {
        if (!isClockwise(it)) a['solid'].push(it.map(([x, y]) => ({ x, y })));
        else a['void'].push(it.map(([x, y]) => ({ x, y })));
      }
      return a;
    },
    { solid: [], void: [], all: input }
  );

const doPolyBool = (entities, func, attr) => {
  const getVertices = (it) => (attr === 'none' ? it : it[attr]);
  if (entities.length > 1) {
    let arrs = entities.map((it) => {
      if (it[0] && it[0][0] && it[0][0][0] !== undefined) return it;
      else
        return [
          getVertices(it).map((item) => {
            return item.x !== undefined ? [item.x, item.y] : item;
          }),
        ];
    });
    let uni = polygonClipping[func](...arrs);
    return polyStandards(uni);
  } else if (entities.length === 1) {
    let v = getVertices(entities[0]);
    return {
      solid: !isClockwise(v) ? [v] : [],
      void: isClockwise(v) ? [v] : [],
      all: [v],
    };
  } else {
    return { solid: [], void: [], all: [] };
  }
};

export const unionEntities = (entities = [], attr = 'localVertices') =>
  doPolyBool(entities, 'union', attr);

export const intersectEntities = (entities = [], attr = 'localVertices') =>
  doPolyBool(entities, 'intersection', attr);

export const differenceEntities = (entities = [], attr = 'localVertices') =>
  doPolyBool(entities, 'difference', attr);

export const unionPoly = (poly1, poly2) =>
  doPolyBool([poly1, poly2], 'union', 'none');
export const intersectPoly = (poly1, poly2) =>
  doPolyBool([poly1, poly2], 'intersection', 'none');
export const differencePoly = (poly1, poly2) =>
  doPolyBool([poly1, poly2], 'difference', 'none');

export const isClockwise = (p) => {
  var sum = 0;
  for (var i = 1; i < p.length; i++)
    sum += (p[i][0] - p[i - 1][0]) * (p[i][1] + p[i - 1][1]);
  return sum > 0;
};

export const areaPolygon = (points) => {
  let l = points.length;
  let det = 0;

  if (points[0] !== points[points.length - 1])
    points = points.concat(points[0]);

  for (let i = 0; i < l; i++)
    det += points[i].x * points[i + 1].y - points[i].y * points[i + 1].x;

  return Math.abs(det) / 2;
};

export const layeringObjectTypes = (d) => {
  let baseSet = [];
  let rest = [];
  for (let item of d[1]) {
    if (ignoreLayers.includes(item.layer)) {
      if (
        baseSet.filter((i) => i.layer === item.layer).length === 0 &&
        item.objectTypes !== 'axis'
      )
        baseSet.push(item);
    } else rest.push(item);
  }
  baseSet = [['base', baseSet]];
  rest = Object.entries(groupBy(rest, 'objectTypes'));
  rest.sort((a, b) => sortLayers[a[0]] - sortLayers[b[0]]);
  return baseSet.concat(rest);
};

const isInObject = (arr, obj) => {
  let ret = arr.findIndex(
    (i) => obj.layer && obj.layer.toLowerCase() === i.toLowerCase()
  );
  return ret > -1;
};

const isInObject2 = (arr, obj) => {
  let ret = arr.findIndex(
    (i) => obj.objectTypes && obj.objectTypes.toLowerCase() === i.toLowerCase()
  );
  return ret > -1;
};

export const syncSelected = (selected = null, dxf = null) => {
  const global = getGlobal();
  if (selected === null) selected = global.selectedLayers;
  if (dxf === null) dxf = global.dxf;
  if (dxf && dxf.entities) {
    let dxf2 = JSON.parse(JSON.stringify(dxf));
    dxf2.entities = dxf2.entities.map((item) => ({
      ...item,
      // viewSelected: false,
      viewSelected:
        isInObject(selected, item) ||
        isInObject2(selected, item) ||
        ignoreLayers.includes(item.layer),
    }));
    setGlobal({ dxf: dxf2 });
  }
};

const makeId = (length = 12) => {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const customElevation = (
  elevation,
  objs,
  objectTypes = 'grid',
  stroke = null
) => {
  const global = getGlobal();
  let dxf = JSON.parse(JSON.stringify(global.dxf));
  dxf.entities = [
    ...dxf.entities.filter(
      (item) =>
        item.elevation !== elevation ||
        item.objectTypes !== objectTypes ||
        item.objectTypes === 'gen'
    ),
    ...objs.map((item) => ({
      id: makeId(),
      elevation,
      layer: item.layer,
      objectTypes,
      type: item.center ? 'CIRCLE' : 'LWPOLYLINE',
      viewSelected: true,
      localVertices: item.localVertices,
      vertices: item.localVertices,
      center: item.center,
      localCenter: item.center,
      radius: item.radius,
      stroke,
      properties: item.properties,
    })),
  ];
  setGlobal({ dxf });
};

export const customElevationSingle = (
  elevation,
  item,
  objectTypes = 'grid',
  stroke = null
) => {
  const global = getGlobal();
  let dxf = JSON.parse(JSON.stringify(global.dxf));
  dxf.entities = [
    ...dxf.entities,
    {
      id: makeId(),
      elevation,
      layer: item.layer,
      objectTypes,
      type: item.center ? 'CIRCLE' : 'LWPOLYLINE',
      viewSelected: true,
      localVertices: item.localVertices,
      vertices: item.localVertices,
      center: item.center,
      localCenter: item.center,
      radius: item.radius,
      properties: item.properties,
      stroke,
    },
  ];
  setGlobal({ dxf });
};

// const findEquationOfPlaneFromPoints = (point1, point2, point3) => {
//   // maybe normalize
//   const {x: x1, y: y1, z: z1} = point1;
//   const {x: x2, y: y2, z: z2} = point2;
//   const {x: x3, y: y3, z: z3} = point3;
//   let a1 = x2 - x1;
//   let b1 = y2 - y1;
//   let c1 = z2 - z1;
//   let a2 = x3 - x1;
//   let b2 = y3 - y1;
//   let c2 = z3 - z1;
//   let a = b1 * c2 - b2 * c1;
//   let b = a2 * c1 - a1 * c2;
//   let c = a1 * b2 - b1 * a2;
//   let d = -(-a * x1 - b * y1 - c * z1);
//   return {a, b, c, d}; // a + b + c = d
// };

// const getIntersectPointOfPlaneAndLine = (line, plane) => {
//   const {x: x1, y: y1, z: z1} = line[0];
//   const {x: x2, y: y2, z: z2} = line[1];
//   const {a, b, c, d} = plane;
//   const [x, y, z] = intersect([x1, y1, z1], [x2, y2, z2], [a, b, c, d]);
//   return {x, y, z};
// };

export const getZOfNodes = () => {
  const global = getGlobal();
  const elevationLevels = global.elevationLevels;
  return (x, y, elevation) => elevationLevels[elevation];
};

export const updateElevationEntities = (elevation, entities) => {
  const global = getGlobal();
  let dxf = global.dxf;
  dxf.entities = dxf.entities.filter((i) => i.elevation !== elevation);
  dxf.entities = dxf.entities.concat(entities);
  setGlobal({ dxf });
};

export const getZBounds = (elevation) => {
  const global = getGlobal();
  const elevationLevels = global.elevationLevels;
  return { min: elevationLevels[elevation], max: elevationLevels[elevation] };
};
