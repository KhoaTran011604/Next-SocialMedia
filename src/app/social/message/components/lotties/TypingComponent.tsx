import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../../../../public/lottiefiles/typing.json"; // File JSON của Lottie

const TypingComponent = ({ width = 50 }) => {
  return (
    <div className={`w-[${width}px]`}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default TypingComponent;
