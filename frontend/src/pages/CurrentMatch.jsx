/* eslint-disable*/
import React, { useEffect } from "react";
import { __RouterContext, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@apollo/react-hooks";
import { db } from "../store/db";
import { UPDATE_MATCH } from "../store/types";
import Game from "../components/Game";
import Winner from "../components/Winner";
import useRegisterGamePad from "../hooks/useRegisterGamePad";
import useSubscribeToGame from "../hooks/useSubscribeToGame";

import { ACTIVE_MATCH_QUERY } from "../store/queries";

function CurrentMatch({ history, match: { params } }) {
    const matchInit = useSelector(state => state.app.matchInit);
    const matchId = useSelector(state => state.app.matchId);
    const winner = useSelector(state => state.game.winner);
    useRegisterGamePad();
    const { loading } = useSubscribeToGame();

    // return !matchId ? <Redirect to="/match" /> : <Game />;
    if (winner) {
        return <Winner />;
    }
    return loading ? <p>Loading...</p> : <Game />;
}

export default CurrentMatch;
