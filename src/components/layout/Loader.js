import React from "react";
import { BounceyLoader } from "react-loaders-spinners";

const Loading = () => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)"
    }}
  >
    <BounceyLoader  loading={true.toString()} width={35} height={35} />
  </div>
);

export default Loading;
