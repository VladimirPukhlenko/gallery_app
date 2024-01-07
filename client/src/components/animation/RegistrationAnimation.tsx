"use client";
import React, { useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

import animationData from "../../../public/animations/registration.json";

const RegistrationAnimation = ({ isSubmitted }: { isSubmitted: boolean }) => {
  const animRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    animRef.current?.stop();
    const time = (animRef.current?.getDuration() || 0) * 1000;

    if (isSubmitted) {
      animRef.current?.play();
      setTimeout(() => {
        animRef.current?.stop();
      }, time);
    }
  }, [isSubmitted]);
  return (
    <span className="w-[4rem] h-[4rem]  lg:w-[6rem] lg:h-[6rem]">
      <Lottie lottieRef={animRef} animationData={animationData} loop={false} />
    </span>
  );
};

export default RegistrationAnimation;
