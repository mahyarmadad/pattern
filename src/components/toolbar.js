/** @jsx jsx */
import React, {useState, useMemo} from 'react';
import {css, jsx} from '@emotion/core';
import ReactTooltip from 'react-tooltip';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const UUID = text => {
  return (
    text +
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

const Toolbar = ({children, right, top}) => {
  const [open, setOpen] = useState(true);
  const leftIcon = right ? 'right' : 'left';
  const rightIcon = right ? 'left' : 'right';

  const tooltips = {};
  const childrens = React.Children.map(children, (child, i) => {
    if (child) {
      const ID = UUID('menu' + i);
      if (child.props.tooltip) {
        tooltips[ID] = child.props.tooltip;
      }
      return React.cloneElement(child, {
        className: child.props.active ? 'active' : '',
        active: null,
        'data-tip': true,
        'data-for': ID,
      });
    } else return null;
  });
  const side = `${leftIcon}: ${open ? 0 : '-40px'};`;

  const mainStyle = useMemo(
    () => theme => css`
      width: 45px;
      height: auto;
      background: ${theme.primaryDark};
      position: absolute;
      transition: 0.3s ease-out all 0s;
      z-index: 50;
      top: ${top ? top : '80px'};
      box-shadow: ${right ? '1px' : '-1px'} 1px 0 1px rgba(0, 0, 0, 0.15);
      ${side}
      > div:not(.close):not(.__react_component_tooltip) {
        width: 45px;
        height: 45px;
        padding: 10px 5px;
        text-align: center;
        box-sizing: border-box;
        line-height: 32px;
        cursor: pointer;
        position: relative;
        &:hover {
          background: rgba(255, 255, 255, 0.15);
          .menu {
            display: block;
          }
        }
        .menu {
          display: none;
          position: absolute;
          right: 100%;
          top: 0;
          background: ${theme.primaryDark};
          box-shadow: 0 2px 2px 1px rgba(20, 20, 20, 0.2);
          > div {
            min-height: 40px;
            width: 120px;
            text-align: center;
            line-height: 40px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.15);
            cursor: pointer;
            &:hover {
              background: rgba(255, 255, 255, 0.1);
            }
          }
          &.bigMenu {
            > div {
              width: 200px;
            }
          }
        }
      }
      > div.active {
        background: rgba(255, 255, 255, 0.15);
      }
      .close {
        background: ${theme.primaryDark};
        position: absolute;
        width: 20px;
        height: 20px;
        ${rightIcon}: -20px;
        text-align: center;
        top: 0;
        cursor: pointer;
        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      }
    `,
    [top, right, side, rightIcon]
  );

  return (
    <div css={mainStyle}>
      <div
        className={'close'}
        onClick={() => {
          if (open) setOpen(false);
          else setOpen(true);
        }}>
        <FontAwesomeIcon
          icon={open ? 'angle-' + leftIcon : 'angle-' + rightIcon}
        />
      </div>
      {Object.keys(tooltips).map(key => (
        <ReactTooltip id={key} type="dark" effect="float" key={key}>
          {tooltips[key]}
        </ReactTooltip>
      ))}
      {childrens}
    </div>
  );
};

export default Toolbar;
