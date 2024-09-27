import React from "react";

type SpinnerProps = {
  size?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ size = "8" }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div
      data-testid="spinner"
      className={`inline-block h-${size} w-${size} animate-spin rounded-full border-4 border-t-transparent border-blue-500`}
    ></div>
  </div>
);

export default Spinner;
