import React from "react";
import Slider from "./Slider";

const SliderGrid = () => {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full w-full">
      <div>
        <Slider page={1} delay={8000} />
      </div>
      <div className="row-span-2 col-start-3 row-start-1">
        {" "}
        <Slider page={2} delay={4000} />
      </div>
      <div className="col-start-2 row-start-1">
        {" "}
        <Slider page={3} delay={10000} />
      </div>
      <div className="col-span-2 row-span-2">
        {" "}
        <Slider page={4} delay={14000} />
      </div>
      <div className="col-start-3 row-start-3">
        {" "}
        <Slider page={5} delay={12000} />
      </div>
    </div>
  );
};

export default SliderGrid;
