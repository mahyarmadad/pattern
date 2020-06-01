/** @jsx jsx */
import {
  useEffect,
  useRef,
  useMemo,
  useGlobal,
  useState,
  setGlobal,
  getGlobal,
} from 'reactn';
import * as d3 from 'd3';
import {jsx, css} from '@emotion/core';
import {
  findBound,
  drawEntities,
  groupBy,
  layeringObjectTypes,
  syncSelected,
} from '../constants/entities';
import {ContextContainer} from '../components/contextmenu';

const Viewer = () => {
  const viewport = useRef(null);
  const [viewportSize, setViewportSize] = useState([0, 0]);
  const [ctrl, setCtrl] = useState(false);
  const file = useGlobal('file')[0];
  const [dxf, setDXF] = useGlobal('dxf');
  const fill = useGlobal('drawFill')[0];
  const axis = useGlobal('axis')[0];

  const fitToSize = useMemo(
    () => (file) => {
      const padding = 20;
      if (file && viewport.current) {
        const zoom = d3.zoom();
        let width = viewportSize[0];
        let height = viewportSize[1];

        const entities = file.entities;
        let minX = 0,
          minY = 0,
          maxX = 0,
          maxY = 0;
        let start = true;
        for (let entity of entities.filter(
          (item) => item.layer === 'base' && item.type !== 'MTEXT'
        )) {
          const {minX: minx, minY: miny, maxX: maxx, maxY: maxy} = findBound(
            entity,
            true
          );
          if (start) {
            minX = minx;
            maxX = maxx;
            maxY = maxy;
            minY = miny;
            start = false;
          }
          if (minx !== 0 && minx < minX) minX = minx;
          if (miny !== 0 && miny < minY) minY = miny;
          if (maxx !== 0 && maxx > maxX) maxX = maxx;
          if (maxy !== 0 && maxy > maxY) maxY = maxy;
        }
        let scale = Math.min(
          maxX - minX ? (width - padding) / (maxX - minX) : 1,
          maxY - minY ? (height - padding) / (maxY - minY) : 1
        );
        let translate = [
          -minX * scale + padding / 2,
          -minY * scale + padding / 2,
        ];

        let svg = d3.select(viewport.current).select('svg');
        let pallet = svg.call(zoom).select('.zoomLayer');
        zoom.on('zoom', () => {
          pallet.attr('transform', d3.event.transform);
        });

        svg
          .transition()
          .duration(750)
          // .call(zoom.scaleTo, scale)
          // .call(zoom.translateTo, translate[0], translate[1])
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
          );
      }
    },
    [viewportSize, viewport]
  );
  window.fit = fitToSize;

  useEffect(() => {
    const global = getGlobal();
    if (viewport.current) fitToSize(global.dxf || file);
    // setDXF(file);
    syncSelected(null, file);
  }, [file, viewport, fitToSize]);

  const unSelect = useMemo(
    () => (e) => {
      if (
        e.target &&
        e.target.tagName &&
        e.target.tagName.toLowerCase() === 'svg'
      ) {
        let dxf2 = JSON.parse(JSON.stringify(dxf));
        dxf2.entities = dxf2.entities.map((item) => ({
          ...item,
          selected: false,
        }));
        setDXF(dxf2);
      }
    },
    [dxf, setDXF]
  );

  const hideContext = useMemo(
    () => () => {
      setGlobal({
        showContext: false,
        contextPosition: [0, 0],
        contextObjects: [],
      });
    },
    []
  );

  const clickHandler = useMemo(
    () => (d, i, e) => {
      let dxf2 = JSON.parse(JSON.stringify(dxf));
      if (ctrl) {
        dxf2.entities = dxf2.entities.map((item) =>
          item.id === d.id ? {...item, selected: !item.selected} : item
        );
      } else {
        dxf2.entities = dxf2.entities.map((item) => ({
          ...item,
          selected: item.id === d.id,
        }));
      }
      setDXF(dxf2);
      window.dxfFile = dxf2;
    },
    [dxf, ctrl, setDXF]
  );

  const hoverHandler = useMemo(
    () => (d, i, e) => {
      for (let key in dxf.entities)
        dxf.entities[key].hover = dxf.entities[key].id === d.id;
      let dxf2 = {...dxf};
      setDXF(dxf2);
      window.dxfFile = dxf2;
    },
    [dxf, setDXF]
  );

  const hoverHandlerOut = useMemo(
    () => (d, i, e) => {
      let key = dxf.entities.findIndex((k) => k.id === d.id);
      if (dxf.entities[key]) dxf.entities[key].hover = false;
      let dxf2 = {...dxf};
      setDXF(dxf2);
      window.dxfFile = dxf2;
    },
    [dxf, setDXF]
  );

  const contextHandler = useMemo(
    () => (d, i, e) => {
      clickHandler(d, i, e);
      setGlobal({
        showContext: true,
        contextPosition: [e.pageX, e.pageY - 30],
        contextObjects: [
          {
            text: 'text1',
            onClick: () => {
              hideContext();
            },
          },
          {
            text: 'text2',
            onClick: () => {
              hideContext();
            },
          },
          {
            text: 'text3',
            onClick: () => {
              hideContext();
            },
          },
        ],
      });
      e.preventDefault();
    },
    [clickHandler, hideContext]
  );

  useEffect(() => {
    if (viewport.current && dxf) {
      let svg = d3
        .select(viewport.current)
        .select('svg')
        .attr('width', '100%')
        .attr('height', '100%');
      svg.on('click', () => unSelect(d3.event));

      let pallet = svg.select('.zoomLayer');

      let layeredData = groupBy(dxf.entities, 'layer');
      // console.log('layered data: ', layeredData);

      // console.log(
      //   Object.entries(layeredData).filter((item) => item[0] !== 'undefined')
      // );

      let layer = pallet.selectAll('.layers').data(
        Object.entries(layeredData).filter((item) => item[0] !== 'undefined'),
        (d) => d[0]
      );

      let layerObj = layer
        .enter()
        .append('g')
        .attr('class', 'layers')
        .attr('layer-name', (d) => d[0])
        .merge(layer);
      layer.exit().remove();

      let objectTypes = layerObj
        .join('.elevation')
        .selectAll('.objectTypes')
        .data(layeringObjectTypes);
      let objectTypesObj = objectTypes
        .enter()
        .append('g')
        .attr('class', 'objectTypes')
        .attr('object-type', (d) => d[0])
        .merge(objectTypes);
      objectTypes.exit().remove();

      drawEntities(
        objectTypesObj.join('.objectTypes'),
        clickHandler,
        contextHandler,
        dxf.layers,
        axis,
        hoverHandler,
        hoverHandlerOut
      );
    }
  }, [
    dxf,
    clickHandler,
    contextHandler,
    unSelect,
    axis,
    hoverHandler,
    hoverHandlerOut,
  ]);

  useEffect(() => {
    if (viewport.current) {
      let resize = () => {
        let compStyles = window.getComputedStyle(viewport.current);
        setViewportSize([
          parseInt(compStyles.getPropertyValue('width')),
          parseInt(compStyles.getPropertyValue('height')),
        ]);
      };
      let keyDown = (e) => {
        if (e.which === 17) setCtrl(true);
      };
      let keyUp = (e) => {
        if (e.which === 17) setCtrl(false);
      };
      resize();
      // window.addEventListener('resize', resize);
      document.addEventListener('keydown', keyDown);
      document.addEventListener('keyup', keyUp);
      return () => {
        // window.removeEventListener('resize', resize);
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
      };
    }
  }, [viewport]);

  const onclick = useMemo(
    () => (e) => {
      if (e.target && e.target.getAttribute('class') !== 'context-child')
        hideContext();
    },
    [hideContext]
  );

  return (
    <div
      ref={viewport}
      css={css`
        width: calc(100% - 300px);
        height: 100%;
        position: relative;
        left: 0;
        right: 300px;
        z-index: 5;
      `}
      onClick={onclick}
      onContextMenu={(e) => e.preventDefault()}>
      <svg
        css={css`
          position: relative;
          z-index: 5;
          * {
            /* shape-rendering: crispEdges; */
            shape-rendering: optimizeQuality;
            /* fill: ${fill ? 'rgba(255, 255, 255, 0.2)' : 'none'}; */
            vector-effect: non-scaling-stroke;
          }
        `}>
        <g className="zoomLayer" />
      </svg>
      <ContextContainer />
    </div>
  );
};

export default Viewer;
