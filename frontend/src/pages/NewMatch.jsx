import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { db } from "../store/firebaseConfig";
import { initializeMatchAction } from "../store/actions/actions";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function NewMatch({ history }) {
    const dispatch = useDispatch();
    const [keyboardShowing, showKeyboard] = useState(false);
    const [isDisabled, disableButton] = useState(false);
    const [inputTarget, setInputTarget] = useState(null);
    const [layoutName, setLayoutName] = useState("default");
    const [state, setState] = useState({
        team1_name: "",
        team2_name: "",
        pointsToWin: 21,
        gamesToWin: 3,
    });

    const [createMatch, { loading: mutationLoading }] = useMutation(gql`
        mutation CreateMatch(
            $pointsToWin: Int
            $gamesToWin: Int
            $team1_name: String
            $team2_name: String
        ) {
            createMatch(
                pointsToWin: $pointsToWin
                gamesToWin: $gamesToWin
                team1_name: $team1_name
                team2_name: $team2_name
            ) {
                matchId
                gameId
                match {
                    pointsToWin
                    gamesToWin
                    team1_name
                    team2_name
                }
                game {
                    team1_score
                    team2_score
                    servingTeam
                }
            }
        }
    `);
    const [clearIds, { data }] = useMutation(gql`
        mutation {
            clearIds
        }
    `);
    useEffect(() => {
        clearIds();
    }, []);

    const { team1_name, team2_name, gamesToWin, pointsToWin } = state;
    function handleChange(e) {
        setState({
            ...state,
            [e.target.name]:
                e.target.name === "pointsToWin" || e.target.name === "gamesToWin"
                    ? parseInt(e.target.value)
                    : e.target.value,
        });
    }

    function handleFocus(e) {
        disableButton(true);
        setLayoutName(e.target.name === "pointsToWin" ? "numpad" : "default");
        setState({ ...state, [e.target.name]: "" });
        setInputTarget(e.target.name);
        showKeyboard(true);
    }

    return (
        <div style={{ display: "grid" }} className="pi-focused">
            <form
                className="new-match-form"
                autoComplete="off"
                onSubmit={async e => {
                    e.preventDefault();

                    createMatch({
                        variables: state,
                    })
                        .then(res => {
                            const data = res.data.createMatch;
                            dispatch(initializeMatchAction({ data, history }));
                        })
                        .catch(err => console.error(err));
                }}>
                <div>
                    <label htmlFor="team1" onFocus={e => handleFocus(e)}>
                        Green:
                        <input
                            value={team1_name}
                            name="team1_name"
                            id="team1"
                            onChange={e => handleChange(e)}
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="team2" onFocus={e => handleFocus(e)}>
                        Blue:
                        <input
                            value={team2_name}
                            name="team2_name"
                            onChange={e => handleChange(e)}
                            id="team2"
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="game-type">
                        Games To Play:
                        <select
                            name="gamesToWin"
                            id="game-type"
                            value={gamesToWin}
                            onChange={e => handleChange(e)}>
                            <option value="3">3</option>
                            <option value="2">2/3</option>
                            <option value="1">1</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="pointsToWin" onFocus={e => handleFocus(e)} onBlur={() => {}}>
                        Points To Win:
                        <input
                            type="number"
                            name="pointsToWin"
                            value={pointsToWin}
                            onChange={e => handleChange(e)}
                        />
                    </label>
                </div>

                <button disabled={isDisabled} type="submit" className="btn--full-width">
                    {mutationLoading ? "Loading..." : "Start Match"}
                </button>
            </form>
            {keyboardShowing && (
                <div
                    className={`keyboard__container ${
                        layoutName === "shift" ? "keyboard__container--shift" : ""
                    }`}>
                    <div className="keyboard__input">
                        <span>{state[inputTarget]}</span>
                    </div>
                    <Keyboard
                        onChange={input => {
                            setState({
                                ...state,
                                [inputTarget]:
                                    inputTarget === "pointsToWin" || inputTarget === "gamesToWin"
                                        ? parseInt(input)
                                        : input,
                            });
                        }}
                        inputName={inputTarget}
                        layoutName={layoutName}
                        layout={{
                            default: [
                                "q w e r t y u i o p {bksp}",
                                "a s d f g h j k l",
                                "z x c v b n m",
                                "{shift} & {space} , {close}",
                            ],
                            shift: [
                                "Q W E R T Y U I O P {bksp}",
                                "A S D F G H J K L",
                                "Z X C V B N M",
                                "{shift} & {space} , {close}",
                            ],
                            numpad: ["7 8 9", "4 5 6", "1 2 3", "{bksp} 0 {ok}"],
                        }}
                        buttonTheme={[
                            {
                                class: "highlight",
                                buttons: "{shift}",
                            },
                        ]}
                        onKeyPress={btn => {
                            if (btn === "{shift}") {
                                setLayoutName(layoutName === "default" ? "shift" : "default");
                            }
                            if (btn === "{close}" || btn === "{ok}") {
                                showKeyboard(false);
                                setTimeout(() => {
                                    disableButton(false);
                                }, 100);
                            }
                        }}
                        mergeDisplay={true}
                        display={{
                            "{bksp}": "⌫",
                            "{close}": "✓",
                            "{shift}": "⇪",
                            "{ok}": "✓",
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default NewMatch;
