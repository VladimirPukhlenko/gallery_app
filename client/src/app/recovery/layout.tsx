import AnimationTemplate from "@/components/animation/AnimationTemplate";
import SliderGrid from "@/components/slider/SliderGrid";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col relative ">
      <div className="flex justify-between items-center h-20 lg:h-24">
        <h1 className="text-3xl font-bold">Recovery</h1>
        <AnimationTemplate animation="recovery" />
      </div>
      <div className="w-full  flex justify-between  h-[calc(40rem-7rem)]">
        <div className="flex-1  grid content-start md:content-center  ">
          {children}
        </div>
        <div className=" flex-1 hidden md:block relative w-1/2">
          <SliderGrid />
        </div>
      </div>
    </div>
  );
};

export default layout;
