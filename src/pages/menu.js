/** @jsx jsx */
import {css, jsx} from '@emotion/core';
import UserMenu from './userMenu';

const styles = theme => css`
  height: 30px;
  background: ${theme.primary};
  width: 100%;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
  position: relative;
  z-index: 70;
  > div {
    -webkit-user-select: initial;
    -webkit-app-region: no-drag;
  }
  .op {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    .ui-btn {
      margin: 0;
      width: 48px;
      height: 32px;
      border: 0;
      outline: 0;
      background: transparent;
    }
    .ui-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .ui-btn.close:hover {
      background: #e81123;
    }
    .ui-btn svg path,
    .ui-btn svg rect,
    .ui-btn svg polygon {
      fill: #fff;
    }
    .ui-btn svg {
      width: 10px;
      height: 10px;
    }
  }
  .left {
    position: absolute;
    left: 0;
    top: 0;
    text-align: center;
  }
`;

const win = nw.Window.get();
let maximized = false;
win.on('maximize', function() {
  maximized = true;
});
win.on('restore', function() {
  maximized = false;
});

export const Menu = () => {
  return (
    <div css={styles}>
      <div className={'left'}>
        <UserMenu />
      </div>
      <div className={'op'}>
        <button className="ui-btn minimize" onClick={() => win.minimize()}>
          <svg x="0px" y="0px" viewBox="0 0 10.2 1">
            <rect x="0" y="50%" width="10.2" height="1" />
          </svg>
        </button>
        <button
          className="ui-btn maximize"
          onClick={() => {
            if (maximized) win.restore();
            else win.maximize();
          }}>
          <svg viewBox="0 0 10 10">
            <path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" />
          </svg>
        </button>
        <button className="ui-btn close" onClick={() => win.close(true)}>
          <svg viewBox="0 0 10 10">
            <polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" />
          </svg>
        </button>
      </div>
      <span>ZEGARA Editor</span>
    </div>
  );
};
