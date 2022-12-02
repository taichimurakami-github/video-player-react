import { VideoCurrentTimeCtx } from "@/providers/VideoCurrentTimeProvider";
import { VideoElemCtx } from "@/providers/VideoElemProvider";
import { getStringFormatCurrentTime } from "@/utils/getStringFormatCurrentTime";
import {
  faPause,
  faPlay,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useContext } from "react";

export default function VideoToolbar(props: PropsWithChildren<{}>) {
  const videoElement = useContext(VideoElemCtx);
  const currentTime = useContext(VideoCurrentTimeCtx);

  return (
    <ul className="video-tools-wrapper text-white select-none">
      <div className={`flex justify-between px-6 h-[60px]`}>
        <ul className="flex justify-between gap-6">
          <li
            className={`flex items-center cursor-pointer`}
            onClick={() => {
              if (!videoElement) return;
              videoElement.paused ? videoElement.play() : videoElement.pause();
            }}
          >
            <FontAwesomeIcon
              className="flex items-center text-2xl"
              icon={videoElement && videoElement.paused ? faPlay : faPause}
            ></FontAwesomeIcon>
          </li>

          <li className="flex items-center text-lg h-full select-none">
            <VideoCurrenttimeShowcase
              currentTime={currentTime}
            ></VideoCurrenttimeShowcase>
          </li>

          <li
            className="flex items-center cursor-pointer h-full"
            onClick={() => {
              if (!videoElement) return;
              videoElement.muted = true;
            }}
          >
            <FontAwesomeIcon
              className="text-white text-xl"
              icon={
                videoElement && videoElement.muted ? faVolumeMute : faVolumeUp
              }
            ></FontAwesomeIcon>
          </li>
        </ul>
        {/* <ul className={`flex justify-between gap-6`}>
          <li className={`flex items-center cursor-pointer`}>
            <FontAwesomeIcon
              className="text-xl"
              icon={faClosedCaptioning}
              onClick={() => {
                props.changeVideoSubtitleVisibility();
              }}
            />
          </li>
        </ul> */}
      </div>
    </ul>
  );
}

function VideoCurrenttimeShowcase(props: { currentTime: number }) {
  return <span>{getStringFormatCurrentTime(props.currentTime)}</span>;
}
