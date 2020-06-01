/** @jsx jsx */
import {useGlobal, setGlobal, useRef} from 'reactn';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import {css, jsx} from '@emotion/core';
import {removeUser} from '../constants/functions';
import DxfParser from 'dxf-parser';
import {toast} from 'react-toastify';
import fs from 'fs';
import {filterDXF} from '../constants/dxf';

const UserMenu = () => {
  const user = useGlobal('user')[0];
  const selector = useRef(null);
  const [src, setSrc] = useGlobal('src');

  let changeSrc = () => {
    const {value, files} = selector.current;
    if (src !== value && value) {
      const parser = new DxfParser();
      const file = files[0];
      setSrc(value);
      try {
        return fs.readFile(file.path, 'utf8', function (err, data) {
          if (err) throw err;
          let dxf = parser.parseSync(data);
          dxf.entities = [
            ...dxf.entities,
            // ...Object.values(dxf.blocks)
            //   .filter(item => item.entities)
            //   .map(item => item.entities)
            //   .reduce((a, b) => a.concat(b), []),
          ].filter((item) => item.type !== 'INSERT');
          dxf.entities = dxf.entities.map((item) => ({
            id: item.handle + item.ownerHandle,
            ...item,
          }));
          dxf = filterDXF(dxf);
          window.dxfFile = dxf;
          setGlobal({file: dxf});
        });
      } catch (e) {
        toast.warn('Your file is not standard', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  if (!user || !user.username || user.username === '') {
    return <div />;
  }
  const username = user.username.substring(0, 2).toUpperCase();
  return (
    <div
      css={css`
        display: inline-block;
        > .btn {
          padding: 0 5px;
          box-sizing: border-box;
          height: 30px;
          cursor: pointer;
          &:hover svg * {
            color: rgba(255, 255, 255, 0.15);
          }
          float: left;
          &.text {
            svg {
              margin-right: 5px;
            }
            &:hover {
              color: rgba(255, 255, 255, 0.15);
            }
          }
        }
        > .divider {
          height: 20px;
          margin: 5px 5px;
          box-sizing: border-box;
          width: 1px;
          background: rgba(255, 255, 255, 0.15);
          float: left;
        }
      `}>
      <div
        css={css`
          width: 30px;
          height: 30px;
          font-size: 12px;
          text-align: center;
          line-height: 35px;
          margin-right: 5px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 0px;
          float: left;
        `}>
        {username || 'DE'}
      </div>
      <ReactTooltip id="newfile" place="bottom" type="dark" effect="float">
        Open File
      </ReactTooltip>
      <ReactTooltip id="reload" place="bottom" type="dark" effect="float">
        Reload
      </ReactTooltip>
      <ReactTooltip id="help" place="bottom" type="dark" effect="float">
        Help
      </ReactTooltip>
      <ReactTooltip id="logout" place="bottom" type="dark" effect="float">
        LogOut
      </ReactTooltip>
      <div
        className={'btn'}
        data-tip
        data-for="newfile"
        onClick={() => {
          selector.current.click();
        }}>
        <input
          ref={selector}
          type="file"
          accept=".dxf"
          onChange={changeSrc}
          css={css`
            display: none;
          `}
        />
        <FontAwesomeIcon icon="folder-open" size="1x" color="#aaaaaa" />
      </div>
      <div
        className={'btn'}
        data-tip
        data-for="reload"
        onClick={() => {
          let gui = require('nw.gui');
          let win = gui.Window.get();
          chrome.runtime.reload();
          win.close(true);
        }}>
        <FontAwesomeIcon icon="sync" size="1x" color="#aaaaaa" />
      </div>
      <div className={'btn'} data-tip data-for="help" onClick={() => {}}>
        <FontAwesomeIcon icon="question" size="1x" color="#aaaaaa" />
      </div>
      <div
        className={'btn'}
        data-tip
        data-for="logout"
        onClick={() => {
          removeUser();
          chrome.runtime.reload();
        }}>
        <FontAwesomeIcon icon="sign-out-alt" size="1x" color="#aaaaaa" />
      </div>
      <div className="divider"></div>
      <div
        className={'btn text'}
        onClick={() => {
          setGlobal({route: 'projects'});
        }}>
        <FontAwesomeIcon icon="bars" size="1x" color="#aaaaaa" />
        Manage Projects
      </div>
    </div>
  );
};

export default UserMenu;
