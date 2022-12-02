import { createContext, PropsWithChildren, useState } from "react";

export type TVideoElemCtx = null | HTMLVideoElement;
export type TSetVideoElemCtx = (elem: TVideoElemCtx) => void;

export const VideoElemCtx = createContext<TVideoElemCtx>(null);
//@ts-ignore
export const SetVideoElemCtx = createContext<TSetVideoElemCtx>();

export const VideoElemRefCtxProvider = (props: PropsWithChildren) => {
  const [videoElemRef, setVideoElemRef] = useState<TVideoElemCtx>(null);

  const updateVideoElem = (videoElemRef: TVideoElemCtx) => {
    setVideoElemRef(videoElemRef);
  };

  return (
    <VideoElemCtx.Provider value={videoElemRef}>
      <SetVideoElemCtx.Provider value={updateVideoElem}>
        {props.children}
      </SetVideoElemCtx.Provider>
    </VideoElemCtx.Provider>
  );
};
