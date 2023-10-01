import React from 'react';
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({cardData , currentCard , setCurrentCard}) => {
  return (
    <div>
      <div>
        <div>{cardData?.heading}</div>
        <div>{cardData?.description}</div>
      </div>

      <div>
        {/**Level */}
        <div>
            <HiUsers />
            <p>{cardData?.level}</p>
        </div>

        {/**Flow chart */}
        <div>
            <ImTree />
            <p>{cardData?.lessionNumber} Lession</p>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
