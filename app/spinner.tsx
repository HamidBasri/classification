import { Spin } from "antd";
import { Loader } from "lucide-react";
import React from "react";

const Spinner = () => {
  return (
    <Spin
      indicator={<Loader style={{ fontSize: 24 }} className="animate-spin" />}
      spinning
    />
  );
};

export default Spinner;
