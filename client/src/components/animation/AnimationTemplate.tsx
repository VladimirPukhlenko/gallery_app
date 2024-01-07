"use client";

import React, { FC, useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

import albumsAnim from "../../../public/animations/albums.json";
import favoritesAnim from "../../../public/animations/favorites.json";
import allAlbumsAnim from "../../../public/animations/allAlbums.json";
import recoveryAnim from "../../../public/animations/recovery.json";

const animations = {
  albums: {
    animationData: albumsAnim,
    speed: 0.5,
    size: "w-14 md:w-16",
  },
  favorites: {
    animationData: favoritesAnim,
    speed: 0.5,
    size: "w-24 md:w-28",
  },
  allAlbums: {
    animationData: allAlbumsAnim,
    speed: 1,
    size: "w-[5rem] md:w-[7rem]",
  },
  recovery: {
    animationData: recoveryAnim,
    speed: 0.8,
    size: "w-24 md:w-28",
  },
};

type Props = {
  animation: keyof typeof animations;
};
const AnimationTemplate: FC<Props> = ({ animation }) => {
  const animRef = useRef<LottieRefCurrentProps>(null);
  const currentAnimation = animations[animation];
  useEffect(() => {
    if (animRef.current) {
      animRef.current.setSpeed(currentAnimation.speed);
      const duration = animRef.current.getDuration()! * 1000;
      setTimeout(() => {
        animRef.current?.pause();
      }, duration);
    }
  }, []);

  return (
    <span className={currentAnimation.size}>
      <Lottie
        lottieRef={animRef}
        animationData={currentAnimation.animationData}
        loop={false}
      />
    </span>
  );
};

export default AnimationTemplate;
