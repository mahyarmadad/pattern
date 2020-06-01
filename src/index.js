import React, {getGlobal, setGlobal} from 'reactn';
import ReactDOM from 'react-dom';
import './fonts/vazir.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import Parse from 'parse';
import Parse from 'parse';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {
  customElevation,
  groupBy,
  unionEntities,
  intersectEntities,
  differenceEntities,
  areaPolygon,
  customElevationSingle,
} from './constants/entities';
import pointInPolygon from 'robust-point-in-polygon';
import earcut from 'earcut';
import polygonClipping from 'polygon-clipping';
import * as d3 from 'd3';
// import {standardModel} from './constants/optimization/standardMain';

import 'typeface-roboto';

import GetCal from './calculate/cal';
import GetPlay from './calculate/play';
import GetEnt from './calculate/entit';
import GetPlay2 from './calculate/play2';

const APP_ID = '4Eq4nzwWBgYDQTSNsbhTVzd4CsxTdRYTwKT9Ly2X';
const REST_KEY = 'uNGSxAYnJbjs3BH4s3E';
Parse.initialize(APP_ID, REST_KEY);
Parse.serverURL = 'https://www.zegara.net/api/parse';
// Parse.serverURL = 'http://localhost:1397/api/parse';
Parse.LiveQuery.on('error', (error) => {
  console.log('Parse LiveQuery Error', error);
});

library.add(fas);
window.keyDownRecord = true;

window.addEventListener('keydown', (event) => {
  window.keyDownKey = event.key;
});
window.addEventListener('keyup', () => {
  window.keyDownKey = null;
});
window.pointInPolygon = pointInPolygon;
// window.main = main;
window.groupBy = groupBy;

window.customElevation = customElevation;
window.customElevationSingle = customElevationSingle;
window.unionEntities = unionEntities;
window.intersectEntities = intersectEntities;
window.differenceEntities = differenceEntities;
window.areaPolygon = areaPolygon;

window.getGlobal = getGlobal;
window.setGlobal = setGlobal;

window.GetCal = GetCal;
window.GetPlay = GetPlay;
window.GetEnt = GetEnt;
window.GetPlay2 = GetPlay2;

window.earcut = earcut;
window.polygonClipping = polygonClipping;
window.localSave = () => {
  let temp1 = getGlobal().selectedFile;
  localStorage.setItem(
    'lastDXF',
    JSON.stringify({
      ...temp1.attributes,
      id: temp1.id,
    })
  );
};

window.d3 = d3;

// window.test = () => {
//   let rv = new Vector3D(0.0, -1.0, -1.0);
//   let rp = new Vector3D(0.0, 0.0, 10.0);
//   let pn = new Vector3D(0.0, 0.0, 1.0);
//   let pp = new Vector3D(0.0, 0.0, 5.0);
//   let ip = intersectPoint(rv, rp, pn, pp);
//   console.log("The ray intersects the plane at ", ip);
// }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
