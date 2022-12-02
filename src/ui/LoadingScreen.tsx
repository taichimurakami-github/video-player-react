import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export function LoadingScreen() {
  return (
    <div className="w-full h-full bg-white text-gray-600 flex-xyc flex-col gap-4">
      <FontAwesomeIcon className="fa-spin-pulse text-[75px]" icon={faSpinner} />
      <p className="text-xl">Loading...</p>
    </div>
  );
}
