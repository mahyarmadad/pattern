/** @jsx jsx */
import React from "react";
import ReactLoading from "react-loading";
import { css, jsx } from "@emotion/core";

class Loading extends React.PureComponent {
  render() {
    return (
      <div
        css={css`
          width: 100%;
          height: 100%;
          text-align: center;
          position: relative;
        `}
      >
        <ReactLoading
          type={"bars"}
          color={"#cfcfcf"}
          height={60}
          width={100}
          css={css`
            margin: auto;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            position: absolute;
          `}
        />
      </div>
    );
  }
}

export default Loading;
