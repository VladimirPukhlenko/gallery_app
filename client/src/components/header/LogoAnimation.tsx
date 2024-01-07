"use client";
import React from "react";
import Lottie from "lottie-react";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";

import animationData from "../../../public/animations/logo.json";

const dancing_script = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const LogoAnimation = () => {
  return (
    <Link href={"/"} className="flex items-center gap-4">
      <div className="rounded-md w-10 h-10 overflow-hidden hidden sm:block">
        <Lottie animationData={animationData} loop={false} />
      </div>
      <h1
        className={` text-2xl sm:text-3xl font-semibold ${dancing_script.className}`}
      >
        Gallery app
      </h1>
    </Link>
  );
};

export default LogoAnimation;
