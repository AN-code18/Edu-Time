import React from "react";
import Instructor from "../../../assets/Images/Instructor.png";
import HighLightText from "./HighLightText";
import CTAButton from "../../../components/core/HomePage/Button";
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
  return (
    <div className="mt-16">
      <div className="flex flex-row gap-20 items-center">
        <div className="w-[50%]">
          <img src={Instructor} alt=" Instructor" className="shadow-white" />
        </div>

        <div className="w-[50%] flex flex-col gap-10">
          <div className="text-4xl font-semibold w-[50%]">
            Become an
            <HighLightText text={"Instructor"} />
          </div>
          <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>
        <div className="w-fit">
          <CTAButton active={true} linkto={"/signup"}>
            <div className="flex flex-row gap-2 items-center">
                Start learning today
                <FaArrowRight />
                </div>
          </CTAButton>
        </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
