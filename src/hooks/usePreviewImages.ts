import React, { useCallback, useRef } from "react";
import Module from "module";

const parsePromises = async (promises: Promise<any>[]) => {
  const modules: (Module & { default: string })[] = await Promise.all(promises);
  return modules.filter((mod) => Boolean(mod)).map((mod) => mod.default);
};

const importAssets = async () => {
  const promises: Promise<any>[] = [];
  for (let i = 1; i <= 407; i++) {
    promises.push(
      import(`@/assets/edan-meyer_stable-diffusion/.thumbnails/${i}.jpg`).catch(
        (e) => {
          console.log(e);
          return null;
        }
      )
    );
  }

  return await parsePromises(promises);
};

export default function usePreviewImages(
  assetId: string,
  ext: "jpg" | "png" = "jpg"
) {
  const thumbnailSrcRefs = useRef<string[]>([]);
  const tryCount = useRef(0);

  const getPreviewImagesFromSec = useCallback(
    (time_sec: number) => {
      if (time_sec >= thumbnailSrcRefs.current.length) return "E_NO_SRC";

      return thumbnailSrcRefs.current[time_sec];
    },
    [thumbnailSrcRefs, thumbnailSrcRefs.current]
  );

  if (thumbnailSrcRefs.current.length === 0 && tryCount.current <= 2) {
    tryCount.current++;

    switch (assetId) {
      case "edan-mayer_stable-diffusion":
        (async () => {
          thumbnailSrcRefs.current = await importAssets();
        })();
        break;

      default:
        break;
    }
  }

  return { getPreviewImagesFromSec };
}
