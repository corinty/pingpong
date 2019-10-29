import React, { useState, useEffect } from "react";

export default function Clock() {
    const [time, updateTime] = useState();

    useEffect(() => {
        var timerID = setInterval(function() {
            const newTime = formatAMPM(new Date(), -5);
            if (newTime === time) return;
            updateTime(newTime);
        }, 1000);

        return () => clearInterval(timerID);
    }, [time]);
    return <div>{time}</div>;
}

function formatAMPM(date = new Date(), offset = 0) {
    var hours = date.getUTCHours() + offset;
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
}
