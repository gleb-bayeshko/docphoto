"use client";
import React, { FC, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { cn } from "~/lib/utils";

interface IProps {
  duration: number;
}

const renderTime = ({ remainingTime }: { remainingTime: number }) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef<number>(-1);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  const timeClass =
    "absolute left-0 top-0 w-full h-full flex items-center justify-center translate-y-0 opacity-100 transition-all duration-300 ease-in-out";

  const timeUp = "opacity-0 translate-y-[-12px]";
  const timeDown = "opacity-0 translate-y-[12px]";
  return (
    <div className="relative max-h-[56px] max-w-[56px]">
      <div
        key={remainingTime}
        className={cn(timeClass, isTimeUp ? timeUp : "")}
      >
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={cn(timeClass, !isTimeUp ? timeDown : "")}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

const Loader: FC<IProps> = (props) => {
  
  return (
    <div className="h-[32px] w-[32px]">
      <CountdownCircleTimer
        isPlaying
        size={32}
        duration={props.duration}
        strokeWidth={4}
        colors={["#2563EB", "#2563EB", "#2563EB", "#2563EB"]}
        colorsTime={[10, 6, 3, 0]}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
};

export default Loader;
