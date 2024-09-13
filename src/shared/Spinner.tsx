import React from "react";

type SpinnerProps = {
  size?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ size = "8" }) => (
  <div
    className={`inline-block h-${size} w-${size} animate-spin rounded-full border-4 border-t-transparent border-blue-500`}
  ></div>
);

export default Spinner;
