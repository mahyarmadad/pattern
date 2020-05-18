/** @jsx jsx */
import {useMemo, useGlobal} from 'reactn';
import {jsx, css} from '@emotion/core';
import {primary, text} from '../constants/colors';

export const ContextContainer = () => {
  const contextPosition = useGlobal('contextPosition')[0];
  const contextObjects = useGlobal('contextObjects')[0];
  const showContext = useGlobal('showContext')[0];
  const style = useMemo(
    () => css`
      display: ${showContext ? 'block' : 'none'};
      background: ${primary};
      color: ${text};
      position: absolute;
      z-index: 9999;
      min-width: 120px;
      border-radius: 3px;
      box-shadow: 0 1px 3px 0px #111;
      > div {
        line-height: 30px;
        height: 30px;
        box-sizing: border-box;
        padding: 0 10px;
        font-size: 13px;
        width: 100%;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        &:last-child {
          border: none;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    `,
    [showContext]
  );
  return (
    <div
      id={'contextMenu'}
      css={style}
      style={{left: contextPosition[0], top: contextPosition[1]}}>
      {contextObjects.map((item, key) => (
        <div key={key} className={'context-child'} onClick={item.onClick}>
          {item.text}
        </div>
      ))}
    </div>
  );
};
