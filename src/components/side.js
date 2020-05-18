/** @jsx jsx */
import {useState, useGlobal, useMemo, Fragment} from 'reactn';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {jsx, css} from '@emotion/core';
import {text} from '../constants/colors';
import {syncSelected} from '../constants/entities';
import {StructureEdit} from './edit';

const style = css`
  position: absolute;
  right: 0;
  top: 30px;
  height: calc(100% - 30px);
  width: 300px;
  background: rgb(44, 44, 44);
  box-shadow: 0 0 2px 0 #000;
  z-index: 10;
  .titleBar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    > div {
      display: block;
      font-size: 11px;
      text-align: center;
      color: ${text};
      line-height: 30px;
      background: rgba(0, 0, 0, 0.15);
      transition: 0.3s ease-out all 0s;
      cursor: pointer;
      &.active {
        background: transparent;
        cursor: default;
      }
      &:hover {
        background: rgba(54, 54, 54);
      }
    }
  }
  .container {
    height: calc(100% - 30px);
    overflow-y: auto;
  }
  .properties {
    > div {
      height: auto;
      font-size: 14px;
      width: calc(100% - 20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 5px 10px;
      position: relative;
      > div {
        width: calc(100% - 20px);
        position: relative;
        padding: 5px 10px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
    }
  }
  .layers {
    padding: 15px;
    div {
      position: relative;
    }
    h3 {
      font-size: 14px;
      line-height: 25px;
      color: ${text};
      margin: 0;
      font-weight: normal;
      cursor: pointer;
      svg {
        margin-right: 10px;
      }
    }
    .eye {
      position: absolute;
      right: 0;
      top: 0;
      height: 25px;
      cursor: pointer;
    }
    .children {
      padding-left: 16px;
      padding-bottom: 16px;
      font-size: 12px;
      .eye {
        font-size: 14px;
      }
    }
  }
  .types {
    padding: 15px;
    div {
      position: relative;
    }
    h3 {
      font-size: 14px;
      line-height: 25px;
      color: ${text};
      margin: 0;
      font-weight: normal;
      cursor: pointer;
      svg {
        margin-right: 10px;
      }
    }
    .eye {
      position: absolute;
      right: 0;
      top: 0;
      height: 25px;
      cursor: pointer;
    }
  }
  .spacer {
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.15);
    margin: 5px 0;
  }
`;

export const fullLayers = [
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

const Side = () => {
  const dxf = useGlobal('dxf')[0];
  const [tab, setTab] = useState('layers');
  const [selectedLayers, setSelected] = useGlobal('selectedLayers');

  const objectClick = useMemo(
    () => (item) => () => {
      let select = selectedLayers.includes(item)
        ? selectedLayers.filter((i) => i !== item)
        : [...selectedLayers, item];
      setSelected(select);
      syncSelected(select);
    },
    [selectedLayers, setSelected]
  );

  const selected = useMemo(() => dxf && dxf.entities.find((i) => i.selected), [
    dxf,
  ]);
  return (
    <div css={style}>
      <div className={'titleBar'}>
        <div
          className={tab === 'layers' ? 'active' : null}
          onClick={() => setTab('layers')}>
          Layers
        </div>
        <div
          className={tab === 'properties' ? 'active' : null}
          onClick={() => setTab('properties')}>
          Properties
        </div>
        <div
          className={tab === 'Edit' ? 'active' : null}
          onClick={() => setTab('Edit')}>
          Edit
        </div>
      </div>
      <div className="container">
        {tab === 'layers' ? (
          <Fragment>
            <div className={'layers'}>
              {fullLayers.map((item2) =>
                item2 !== 'elevation' ? (
                  <div className={'objects-' + item2} key={item2}>
                    <div className={'eye'} onClick={objectClick(item2)}>
                      <FontAwesomeIcon
                        icon={
                          selectedLayers.includes(item2) ? 'eye' : 'eye-slash'
                        }
                      />
                    </div>
                    <h3>{item2}</h3>
                  </div>
                ) : null
              )}
            </div>
            <div className="spacer" />
          </Fragment>
        ) : tab === 'properties' ? (
          <div className={'properties'}>
            {selected &&
              Object.entries(selected).map(([key, val]) =>
                key.toLowerCase() === 'vertices' ? null : (
                  <div key={key}>
                    {key}:{' '}
                    {val && typeof val === 'object'
                      ? Object.entries(val).map(([key2, val2]) =>
                          key2.toLowerCase().includes('vertices') ? null : (
                            <div key={key2}>
                              {key2}: {JSON.stringify(val2)}
                            </div>
                          )
                        )
                      : JSON.stringify(val)}
                  </div>
                )
              )}
          </div>
        ) : tab === 'Edit' ? (
          <div className={'edit'}>
            <StructureEdit selected={selected} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default Side;
