import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../../../../public/lottiefiles/typing.json"; // File JSON của Lottie

const TypingComponent = () => {
  return (
    <div className="w-[50px]">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default TypingComponent;
