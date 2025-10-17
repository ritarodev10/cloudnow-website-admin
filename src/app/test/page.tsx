import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(108, 0, 162)"
      gradientBackgroundEnd="rgb(0, 17, 82)"
      firstColor="200, 89%, 19%"
      secondColor="200, 52%, 10%"
      thirdColor="200, 67%, 11%"
      fourthColor="200, 100%, 24%"
      fifthColor="200, 29%, 10%"
      pointerColor="200, 89%, 19%"
      size="80%"
      blendingValue="hard-light"
      interactive={true}
    >
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          CloudNow Brand Colors
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}
