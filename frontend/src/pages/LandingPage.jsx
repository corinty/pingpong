import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_ACCESS } from "../store/types";

export default function LandingPage() {
    const dispatch = useDispatch();
    const isController = useSelector(state => state.app.isController);
    useEffect(() => {
        async function checkWriteAccess() {
            const urlParams = new URLSearchParams(window.location.search);
            const apiKey = urlParams.get("apiKey");
            if (apiKey) {
                const { isController } = await fetch(`/access-check/?apiKey=${apiKey}`).then(
                    res => {
                        return res.json();
                    }
                );

                dispatch({ type: UPDATE_ACCESS, payload: { isController } });
            }
        }
        checkWriteAccess();
    }, []);
    return (
        <div className="landing-page">
            <p>Welcome</p>
            {isController && <Link to="/match">Start Controller</Link>}
            <Link to="/scoreboard">Scoreboard</Link>
            <Link to="/dashbaord">Dashboard</Link>
            <div id="signin"></div>
        </div>
    );
}
