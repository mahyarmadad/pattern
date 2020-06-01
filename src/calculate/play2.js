import {getGlobal} from 'reactn';
import pointInPolygon from 'robust-point-in-polygon';
import GetEnt from './entit';

const GetPlay2 = () => {
  GetEnt();
  let dxf = getGlobal().dxf.entities;
  let entities2 = getGlobal().entities2;
  // patternMidCourt
  // "ballHittingPosition",
  // 'ballPlacementBoundry',
  // ballPlacementTarget

  let play,
    count,
    result = [],
    shotplay = [],
    shotplay0 = [],
    typeOfShot,
    typeOfShot1,
    typeOfShot2,
    ballPosition1;
  let playpoint = dxf
    .filter((o) => o.layer === 'aBase')
    .map((o) => {
      // Pattern Mid Court
    });
  return console.log(result);
};
export default GetPlay2;
