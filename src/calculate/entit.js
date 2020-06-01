import {getGlobal, setGlobal} from 'reactn';
import GetCal from './cal';
const GetEnt = () => {
  GetCal();
  let dxf = getGlobal().dxf.entities;
  let entities2 = {};
  for (let o of dxf) {
    if (o.layer === 'aBase') {
      entities2[o.id] = {play: o.play, playRow: o.playRow, inside: []};
      dxf.map((l) => {
        if (l.aBaseId) {
          if (
            o.id === l.aBaseId &&
            l.layer !== 'aCourt' &&
            l.layer !== 'aGrid'
          ) {
            entities2[o.id].inside.push(l);
          }
        }
      });
    }
  }
  setGlobal({entities2});
  return entities2;
};
export default GetEnt;
