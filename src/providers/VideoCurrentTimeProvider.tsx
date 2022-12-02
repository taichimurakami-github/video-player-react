import { createContext, PropsWithChildren, useState } from "react";

export type TVideoCurrentTimeCtx = number;
export type TSetVideoCurrentTimeCtx = (
  newCurrentTime: TVideoCurrentTimeCtx
) => void;

export const VideoCurrentTimeCtx = createContext<TVideoCurrentTimeCtx>(0);
//@ts-ignore
export const SetVideoCurrentTimeCtx = createContext<TSetVideoCurrentTimeCtx>();

export const VideoCurrentTimeCtxProvider = (props: PropsWithChildren) => {
  const [currentTime, setCurrentTime] = useState<TVideoCurrentTimeCtx>(0);

  const updateCurrentTime = (newCurrentTime: TVideoCurrentTimeCtx) => {
    setCurrentTime(newCurrentTime);
  };

  return (
    <SetVideoCurrentTimeCtx.Provider value={updateCurrentTime}>
      <VideoCurrentTimeCtx.Provider value={currentTime}>
        {props.children}
      </VideoCurrentTimeCtx.Provider>
    </SetVideoCurrentTimeCtx.Provider>
  );
};
