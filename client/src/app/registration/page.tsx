"use client";
import RegistrationAnimation from "@/components/animation/RegistrationAnimation";
import RegistrationForm from "@/components/auth/RegistrationForm";
import SliderGrid from "@/components/slider/SliderGrid";
import React, { useState } from "react";

const Registration = () => {
  const [isSubmitted, setSubmited] = useState(false);
  return (
    <div className="flex flex-col relative">
      <div className="flex justify-between items-center h-20 lg:h-24">
        <h1 className="text-3xl font-bold">Registration</h1>
        <RegistrationAnimation isSubmitted={isSubmitted} />
      </div>
      <div className="flex  gap-8   h-[calc(40rem-7rem)]">
        <div className="h-[90%] w-full flex   sm:h-full  gap-2 rounded-l-lg  overflow-hidden shadow-custom ">
          <div className="flex-1  grid content-start md:content-center  ">
            <RegistrationForm setSubmited={setSubmited} />
          </div>
          <div className=" flex-1 hidden md:block relative w-1/2">
            <SliderGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
