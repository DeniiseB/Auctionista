import React, { useState, useEffect } from "react";


function formatTime(time) {
  return new Date(time);
}

function calcDiffInMinutes(dateA, dateB) {
  //dateA = currentTime
  //dateB = deadline

  var timeleft = dateB - dateA;
  var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
  if (days > 1) { 
    let fulltime = days + ' days and ' + (hours+1)+" hours remaining" 
    
    return fulltime
  } else {

    let fulltime = ' ' + hours + ' : ' + minutes + ' : ' + seconds;
    return fulltime
  }

}

function Counter({ dateFrom }) {

  let formattedTime = formatTime(dateFrom);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [minutesDiff, setMinutesDiff] = useState(
    calcDiffInMinutes(currentDate, formattedTime)
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentDate]);

  useEffect(() => {
    setMinutesDiff(calcDiffInMinutes(currentDate, formattedTime));
    
  }, [currentDate, formattedTime]);

  return (
    <div className="timeWrapper" style={styles.timeWrapper}>
      <div>Time left: </div>
      <div>{minutesDiff}</div>
    </div>
  );

};

export default Counter;

const styles = {
  timeWrapper: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "1vh",
  }
}