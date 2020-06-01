/** @jsx jsx */
import {useGlobal, useRef, setGlobal, getGlobal} from 'reactn';
import {jsx, css} from '@emotion/core';
import Toolbar from '../components/toolbar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Select from 'react-dropdown-select';
import Viewer from '../pages/viewer';
import Side from '../components/side';

setGlobal({
  showSelectModal: false,
  selectModalFunc: () => {},
  selectModalOptions: {},
  file: null,
  contextPosition: [0, 0],
  showContext: false,
  contextObjects: [],
  drawFill: false,
  axis: 'XY',
  selectedLayers: [
    // 'aGrid',
    // 'aCourt',
    // 'playerPositionBeforeHitting',
    // 'ballHittingPosition',
    // 'ballPlacementBoundry',
    // 'shotServe',
    // 'shotGroundStrokes',
    // 'condition',
    // 'opponentPositionBeforeHitting',
    // 'shotWithoutDrop',
    // 'opponentPositionAfterHitting',
    // 'shotGroundStrokesTopSpin',
    // 'shotForehandTopSpin',
    // 'shotForehand',
    // 'shotVolley',
    // 'shotLobBackhandUnderSpin',
    // 'ballPlacementTarget',
    // 'patternServe',
    // 'patternReturn',
    // 'patternGroundStroke',
    // 'shotGroundStrokesFlat',
    // 'shotGroundStrokesUnderSpin',
    // 'shotDrop',
    // 'patternMidCourt',
    // 'shotVolleySmash',
    // 'patternNet',
    'aBase',
    // 'shotBackhand',
    // 'shotLob',
    // 'patternDefensive',
    // 'aHitter',
  ],
  selectedTypes: [
    'constants',
    'posibilities',
    'voids',
    'gen',
    'levelBoundryTop',
    'levelBoundryBottom',
    'possible zones',
    'possible elements',
    'nodes',
  ],
  elevationLevels: [0, 5, 10, 15, 20, 25, 30],
  route: 'projects',
});

const LeftToolbar = () => {
  const [fill, setFill] = useGlobal('drawFill');
  const [axis, setAxis] = useGlobal('axis');

  return (
    <Toolbar highlight top="55px;">
      <div onClick={() => setFill(!fill)} active={fill} tooltip="Toggle Fill">
        <FontAwesomeIcon icon="fill" />
      </div>
      <div
        onClick={() => setAxis('XY')}
        active={axis === 'XY'}
        tooltip="Toggle Axis">
        XY
      </div>
      <div
        onClick={() => setAxis('XZ')}
        active={axis === 'XZ'}
        tooltip="Toggle Axis">
        XZ
      </div>
      <div
        onClick={() => setAxis('YZ')}
        active={axis === 'YZ'}
        tooltip="Toggle Axis">
        YZ
      </div>
    </Toolbar>
  );
};

const Main = () => {
  const [showSelectModal, setShowSelectModal] = useGlobal('showSelectModal');
  const selectModalOptions = useGlobal('selectModalOptions')[0];
  const searchModal = useRef(null);

  const selectModalFunc = (dt) => {
    const global = getGlobal();
    return global.selectModalFunc(dt);
  };

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
      `}>
      {showSelectModal && (
        <div
          css={css`
            position: absolute;
            left: 0;
            right: 0;
            top: 30px;
            width: 320px;
            z-index: 999;
            margin: auto;
          `}>
          <Select
            ref={searchModal}
            options={selectModalOptions}
            onChange={selectModalFunc}
            onDropdownClose={() => {
              window.keyDownRecord = true;
              setShowSelectModal(false);
            }}
            labelField="label"
            valueField="name"
            searchBy="name"
            name="search"
            dropdownGap={0}
            separator={false}
            dropdownHandle={false}
            css={(theme) => css`
              background: ${theme.primary};
              box-shadow: none !important;
              border: 1px solid rgba(0, 0, 0, 0.15);
              border-radius: 0;
              .react-dropdown-select-dropdown {
                background: ${theme.primary};
                box-shadow: none !important;
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 0;
                margin-top: -4px;
                span {
                  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
                }
              }
            `}
            searchable
            autoFocus
            closeOnSelect
            clearOnBlur
          />
        </div>
      )}
      <LeftToolbar />
      {/* <Toolbar right>
        <div
          onClick={autoSelectNode}
          active={currentNode}
          onContextMenu={cancelCurrentNode}
          tooltip="Auto select new node">
          <FontAwesomeIcon icon="braille" />
        </div>
        <div onClick={previousTime} tooltip="Previous time interval">
          <FontAwesomeIcon icon="chevron-left" />
        </div>
        <div onClick={nextTime} tooltip="Next time interval">
          <FontAwesomeIcon icon="chevron-right" />
        </div>
        <div onClick={savePlacements} tooltip="Save Episode Changes">
          <FontAwesomeIcon icon="user-check" />
        </div>
      </Toolbar> */}
      <Side />
      <Viewer />
    </div>
  );
};

export default Main;
