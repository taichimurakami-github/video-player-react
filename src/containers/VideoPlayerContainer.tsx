import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useKeyboardShortcutSetterForVideoPlayer } from "@/hooks/useKeyboardInput";
// import VideoSubtitle from "@/ui/VideoSubtitle";
import { LoadingScreen } from "@/ui/LoadingScreen";
import VideoSeekbar from "@/ui/VideoSeekbar";
import VideoToolbar from "@/ui/VideoToolbar";

export const VideoStateCtx = createContext({});

export default function VideoPlayerContainer(
  props: PropsWithChildren<{
    videoElemId: string;
    videoSrc: string;
    enableLiveMode: boolean;
  }>
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentTimeRef = useRef<number>(0);

  // キーボードショートカットの設定
  useKeyboardShortcutSetterForVideoPlayer(videoRef);

  const handleOnPlayAndPause = useCallback(() => {
    // if (videoState.elem) {
    //   setVideoState((b) => ({
    //     ...b,
    //     paused: (videoState.elem as HTMLVideoElement).paused,
    //   }));
    // }
  }, []);

  const handleOntimeUpdate = useCallback(() => {
    if (!videoRef.current) {
      return;
    }

    currentTimeRef.current = videoRef.current.currentTime;
  }, [videoRef.current]);

  const handleOnWating = useCallback(() => {}, []);

  const handleOnCanPlay = useCallback(() => {}, []);

  /** 必要になったら実装予定-------------------------------------------- */

  const handleRequestFullScreen = useCallback(() => {
    console.log("full screen is requested!");
    // const elem = document.getElementsByClassName("main_player_wrapper")[0];
    // if (!elem) {
    //   return;
    // }

    // elem.requestFullscreen().then(() => {
    //   updateVideoStateOnRequestFullScreen();
    // });
  }, []);

  const handleExitFullScreen = useCallback(() => {
    console.log("exit full screen.");
    // if (!videoState.elem) {
    //   return;
    // }
    // document.exitFullscreen().then(() => {
    //   updateVideoStateOnExitFullScreen();
    // });
  }, []);

  /** ---------------------------------------------------------------- */

  useEffect(() => {}, [videoRef.current]);

  return (
    <div className="main_player_wrapper relative w-full max-w-[1600px] mx-auto py-8 px-2">
      <div
        className="video-container z-0 relative content_player_wrapper"
        onClick={() => {
          if (videoRef.current) {
            videoRef.current.paused
              ? videoRef.current.play()
              : videoRef.current.pause();
          }
        }}
      >
        <video
          id={props.videoElemId}
          style={{
            width: "100%",
          }}
          ref={videoRef}
          // set event listener for video controls
          onTimeUpdate={handleOntimeUpdate}
          onPlay={handleOnPlayAndPause}
          onPause={handleOnPlayAndPause}
          onWaiting={handleOnWating}
          onCanPlay={handleOnCanPlay}
        >
          <source src={props.videoSrc} type="video/mp4"></source>
          <div className="absolute top-0 left-0 w-full h-full">
            <LoadingScreen></LoadingScreen>
          </div>
        </video>
      </div>
    </div>
  );
}
