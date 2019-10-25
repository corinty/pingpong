import React from "react";
import Scoreboard from "../components/ScoreBoard";
import Clock from "../components/Clock";
export default function Dashboard() {
    return (
        <div className="dashboard">
            <div className="widget-table-status">
                <Scoreboard></Scoreboard>
            </div>

            <div className="widget-video"></div>

            <div className="widget-time">
                <Clock></Clock>
            </div>
        </div>
    );
}
