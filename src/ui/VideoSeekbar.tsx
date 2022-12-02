import useVideoSeekbar from "@/hooks/useVideoSeekbar";
import { VideoElemCtx } from "@/providers/VideoElemProvider";
import { getStringFormatCurrentTime } from "@/utils/getStringFormatCurrentTime";
import React, { useContext } from "react";

export default function VideoSeekbar(props: {}) {
  const videoElement = useContext(VideoElemCtx);

  if (!videoElement) {
    return <></>;
  }

  const {
    seekbarWrapperRef,
    seekbarHeight,
    seekbarWrapperProps,
    draggerRef,
    draggerRadius,
    draggerLeft,
    previewContainerLeft,
    previewImgSrc,
    previewVisibility,
    previewCurrentTime_sec,
  } = useVideoSeekbar(videoElement, false);

  return (
    <div
      className={`relative w-full flex bg-gray-400 cursor-pointer select-none`}
      ref={seekbarWrapperRef}
      style={{
        height: seekbarHeight,
      }}
      {...seekbarWrapperProps}
    >
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 dragger cursor-pointer bg-white rounded-full"
        ref={draggerRef}
        style={{
          width: draggerRadius,
          height: draggerRadius,
          left: draggerLeft,
        }}
      ></div>
      <div
        className="played-area bg-red-600 h-full"
        style={{
          width: draggerLeft,
        }}
      ></div>
      <div
        className="thumbnail-showcase-area absolute top-0 w-[250px] bg-gray-800 -translate-x-1/2 -translate-y-[110%] rounded-sm flex flex-col p-1 pointer-events-none"
        style={{
          left: previewContainerLeft,
          visibility: previewVisibility ? "visible" : "hidden",
        }}
      >
        <img
          className="max-h-[200px]"
          src={previewImgSrc}
          alt="preview_thumbnail"
        ></img>
        <p className="text-white text-center text-xl py-2">
          {getStringFormatCurrentTime(previewCurrentTime_sec)}
        </p>
      </div>
    </div>
  );
}
