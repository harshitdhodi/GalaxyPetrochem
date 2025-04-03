import React from 'react';
import missionVision from '../../images/missionbanner.jpg';
import { Banner } from '../Banner';
import img from "../../images/introduction.png"
const MissionVision = () => {
  return (
    <>
        
    <div className="lg:ml-20 m-auto mission-vision-container">
      <img 
        src={missionVision} 
        alt="Mission Vision"
        className="mission-vision-image"
      />
    </div>
    </>
  );
};

export default MissionVision;
