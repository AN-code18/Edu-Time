import React from "react";
import HighLightText from "./HighLightText";
import CTAButton from "../../../components/core/HomePage/Button";
import Know_your_progress from "../../../assets/Images/Know_your_progress.png";
import Compare_with_others from "../../../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";

const LearningLanguageSection = () => {
  return (
    <div className="mt-[130px] mb-32">
      <div className="flex flex-col gap-5 items-center">
        <div className="text-4xl font-semibold text-center">
          Your Swiss knife For
          <HighLightText text={"learning any language"} />
          <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
            Using spin making learning multiple languages easy. with 20+
            languages realistic voice-over, progress tracking, custom schedule
            and more.
          </div>
          <div className="flex flex-row items-center justify-center mt-5">
            <img
              src={Know_your_progress}
              alt="Know_your_progress"
              className="object-contain -mr-32"
            />
            <img
              src={Compare_with_others}
              alt="Compare_with_others"
              className="object-contain "
            />
            <img
              src={Plan_your_lessons}
              alt="Plan_your_lessons"
              className="object-contain -ml-36 "
            />
          </div>
          <div className="w-fit mx-auto ">
            <CTAButton active={true} linkto={"/signup"}>
              <div>Learn More</div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
