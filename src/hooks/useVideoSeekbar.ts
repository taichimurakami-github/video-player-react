import { VideoCurrentTimeCtx } from "@/providers/VideoCurrentTimeProvider";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import usePreviewImages from "./usePreviewImages";

const useVideoSeekbar = (
  videoElement: HTMLVideoElement,
  liveModeEnabled = false,
  seekbar_height: number = 10,
  dragger_radius: number = 20
) => {
  const currentTime = useContext(VideoCurrentTimeCtx);

  const seekbarWrapperRef = useRef(null);
  const draggerRef = useRef(null);
  const isDragging = useRef(false);
  const mouseClientX = useRef<null | number>(null);
  const latestCurrentTime = useRef(0);
  const isReviewing = useRef(false);

  const [draggerLeft, setDraggerLeft] = useState(0);
  const [seekbarHeight, setSeekbarHeight] = useState(seekbar_height);
  const [draggerRadius, setDraggerRadius] = useState(dragger_radius);

  const [previewVisibility, setPreviewVisibility] = useState(false);
  const [previewCurrentTime_sec, setPreviewCurrentTime] = useState<number>(0);
  const [previewContainerLeft, setPreviewContainerLeft] = useState(0);
  const [previewImgSrc, setPreviewImgSrc] = useState("");

  const { getPreviewImagesFromSec } = usePreviewImages(
    "edan-mayer_stable-diffusion"
  );

  const _getSeekbarWrapperRects = () => {
    if (seekbarWrapperRef.current) {
      return (
        seekbarWrapperRef.current as HTMLDivElement
      ).getBoundingClientRect();
    }
    throw new Error("E_NO_SEEKBAR_REF");
  };

  const _getNewCurrentTimeFromDraggerLeft = (newDraggerLeft: number) => {
    if (!videoElement) {
      return 1000;
    }
    const seekbarRect = _getSeekbarWrapperRects();

    // console.log(newDraggerLeft, seekbarRect.width, videoElement.duration);
    const rate = newDraggerLeft / seekbarRect.width;

    return liveModeEnabled
      ? Math.round(rate * latestCurrentTime.current)
      : Math.round(rate * videoElement.duration);
  };

  const _getDraggerLeft = (nowMouseClientX: number): number => {
    if (!seekbarWrapperRef.current) {
      throw new Error("E_NO_SEEKBAR_REF");
    }

    const seekbarRect = _getSeekbarWrapperRects();

    // MouseLeftの数値に基づいて、新たなDraggerLeftの値を計算
    const newDraggerLeft = nowMouseClientX - seekbarRect.x;

    // 算出されたDraggerLeftの値がシークバーの左端よりも左だった場合
    // シークバーの左端を返す
    if (newDraggerLeft <= 0) {
      return 0;
    }

    // 算出されたDraggerLeftの値がシークバーの右端よりも右だった場合
    // シークバーの右端を返す
    if (newDraggerLeft > seekbarRect.width) {
      return seekbarRect.width;
    }

    // 算出されたDraggerLeftの値が適切だった場合、そのまま値を返す
    return newDraggerLeft;
  };

  /**
   * Draggerのドラッグ操作終了時の処理
   *
   * 1. DraggerLeftの値を更新する
   * 2. VideoElementのCurrentTimeの値を更新する
   * 3. DraggableStateとonMouseDownClientXをリセットする
   *
   * @returns {void}
   */
  const _setCurrentTimeFromClientX = (clientX: number) => {
    // console.log("dragging end: " + e.clientX);
    const newDraggerLeft = _getDraggerLeft(clientX);

    //CurrentTime更新
    const newCurrentTime = _getNewCurrentTimeFromDraggerLeft(newDraggerLeft);
    // console.log("new current time : ", newCurrentTime);
    if (!Number.isNaN(newCurrentTime)) {
      videoElement.currentTime = newCurrentTime;
    } else {
      throw new Error("invalid new currentTime:" + newCurrentTime);
    }
  };

  const _setIsDragging = (value: boolean) => {
    isDragging.current = value;
    setSeekbarHeight(value ? seekbarHeight * 2 : seekbarHeight);
    setDraggerRadius(value ? draggerRadius * 1.5 : draggerRadius);
  };

  const _showPreview = (clientX: number) => {
    setPreviewVisibility(true);

    const hoverLeftXInSeekbarRect = _getDraggerLeft(clientX);

    const previewCurrentTime_sec = _getNewCurrentTimeFromDraggerLeft(
      hoverLeftXInSeekbarRect
    );

    setPreviewCurrentTime(() =>
      liveModeEnabled
        ? previewCurrentTime_sec - latestCurrentTime.current
        : previewCurrentTime_sec
    );
    setPreviewContainerLeft(hoverLeftXInSeekbarRect);

    setPreviewImgSrc(getPreviewImagesFromSec(previewCurrentTime_sec));
  };

  const _hidePreview = () => {
    setPreviewVisibility(() => false);
  };

  //LIVEモード時、もしDraggerが右端に位置していなければisReviewingフラグをONにする
  const _updateIsReviewingFlg = (newDraggerLeft: number) => {
    const marginPixel = 10;

    isReviewing.current =
      newDraggerLeft < Math.ceil(_getSeekbarWrapperRects().width) - marginPixel;

    // setIsLive(() => liveModeEnabled && !isReviewing.current);

    const newCurrentTime = _getNewCurrentTimeFromDraggerLeft(newDraggerLeft);
    // setLiveModeCurrentTime(newCurrentTime - latestCurrentTime.current);
  };

  /**
   * Draggerのドラッグに合わせ、DraggerLeftの値を更新する
   */
  const _moveDragger = (clientX: number) => {
    const newDraggerLeft = _getDraggerLeft(clientX);

    // liveModeEnabled && _updateIsReviewingFlg(newDraggerLeft);
    setDraggerLeft(newDraggerLeft);
  };

  const seekbarWrapperProps = {
    onMouseLeave: () => {
      if (!isDragging.current) {
        _setIsDragging(false);
        _hidePreview();
      }
    },
    onMouseMove: (e: MouseEvent) => {
      _showPreview(e.clientX);
    },
    onMouseDown: () => {
      _moveDragger(mouseClientX.current as number);
      _setIsDragging(true);
    },
  };

  /**
   * currentTimeのontimeupdateに合わせてDraggerLeftを更新
   */
  useEffect(() => {
    //ドラッグ中であれば処理を行わない
    if (isDragging.current) return;
    const seekbarRect = _getSeekbarWrapperRects();

    if (latestCurrentTime.current < videoElement.currentTime) {
      latestCurrentTime.current = videoElement.currentTime;
    }

    const denominator = liveModeEnabled
      ? latestCurrentTime.current
      : videoElement.duration;

    const parsedDenominator = denominator > 1 ? denominator : 1;

    const newDraggerLeft = Math.floor(
      seekbarRect.width * (currentTime / parsedDenominator)
    );

    //currentTimeから、新たなDraggerLeftの位置を計算・設定
    setDraggerLeft(newDraggerLeft);
    _updateIsReviewingFlg(newDraggerLeft);
  }, [currentTime]);

  useEffect(() => {
    document.onmousemove = (e) => {
      mouseClientX.current = e.clientX;

      if (isDragging.current) {
        _showPreview(e.clientX);
        _moveDragger(e.clientX);
      }
    };

    document.onmouseup = (e) => {
      // console.log("mouse up");
      if (isDragging.current) {
        _setCurrentTimeFromClientX(e.clientX);
        _setIsDragging(false);
        _hidePreview();
      }
    };

    //まれにdragイベントのみ発火してmousemoveイベントが発火しない場合があるため、
    //onmousemoveだけでなくdragも併用して設定すると安定する
    document.ondrag = (e) => {
      mouseClientX.current = e.clientX;

      if (isDragging.current) {
        _showPreview(e.clientX);
        _moveDragger(e.clientX);
      }
    };

    document.ondragend = (e) => {
      // console.log("drag end");
      if (isDragging.current) {
        _setCurrentTimeFromClientX(e.clientX);
        _setIsDragging(false);
      }
    };
  }, [videoElement]);

  return {
    seekbarWrapperRef,
    seekbarHeight,
    draggerRef,
    draggerRadius,
    draggerLeft,
    previewContainerLeft,
    previewVisibility,
    previewImgSrc,
    previewCurrentTime_sec,
    seekbarWrapperProps,
  };
};

export default useVideoSeekbar;
