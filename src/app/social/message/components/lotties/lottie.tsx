import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../../../../public/lottiefiles/loading.json"; // File JSON của Lottie

const LottieComponent = () => {
  return (
    <div className="m-auto flex h-[300px] w-full items-center justify-center">
      <div className="w-[200px]">
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default LottieComponent;
