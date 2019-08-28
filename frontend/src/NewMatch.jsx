import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { initializeMatchAction } from "./store/actions/actions";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function NewMatch({ history }) {
  const [keyboardShowing, showKeyboard] = useState(false);
  const [inputTarget, setInputTarget] = useState(null);
  const dispatch = useDispatch();
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

  const [layoutName, setLayoutName] = useState("default");

  const [state, setState] = useState({
    team1_name: "",
    team2_name: "",
    pointsToWin: 21,
    gamesToWin: 2
  });
  const { team1_name, team2_name, gamesToWin, pointsToWin } = state;
  function handleChange(e) {
    setState({
      ...state,
      [e.target.name]:
        e.target.name === "pointsToWin" || e.target.name === "gamesToWin"
          ? parseInt(e.target.value)
          : e.target.value
    });
  }

  function handleFocus(e) {
    showKeyboard(true);

    setLayoutName(e.target.name === "pointsToWin" ? "numpad" : "default");

    setInputTarget(e.target.name);
  }

  return (
    <div style={{ height: "100%", display: "grid" }}>
      {/* <h1>Start a New Game:</h1> */}
      <form
        className="new-match-form"
        autoComplete="off"
        onSubmit={async e => {
          e.preventDefault();

          createMatch({
            variables: state
          })
            .then(res => {
              const data = res.data.createMatch;

              dispatch(initializeMatchAction({ data, history }));
            })
            .catch(err => console.error(err));
        }}>
        <div>
          <label htmlFor="team1" onFocus={e => handleFocus(e)}>
            Team 1:
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
            Team 2:
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
            Best of:
            <select
              name="gamesToWin"
              id="game-type"
              value={gamesToWin}
              onChange={e => handleChange(e)}>
              <option value="2">2/3</option>
              <option value="1">1</option>
            </select>
          </label>
        </div>
        <div>
          <label
            htmlFor="pointsToWin"
            onFocus={e => handleFocus(e)}
            onBlur={() => {}}>
            Points To Win:
            <input
              type="number"
              name="pointsToWin"
              value={pointsToWin}
              onChange={e => handleChange(e)}
            />
          </label>
        </div>
        <button type="submit" className="btn--full-width">
          {mutationLoading ? "Loading..." : "Start Match"}
        </button>
      </form>
      {keyboardShowing && (
        <div className="keyboard__container">
          <Keyboard
            onChange={input => {
              setState({
                ...state,
                [inputTarget]:
                  inputTarget === "pointsToWin" || inputTarget === "gamesToWin"
                    ? parseInt(input)
                    : input
              });
            }}
            inputName={inputTarget}
            layoutName={layoutName}
            layout={{
              default: [
                "q w e r t y u i o p {bksp}",
                "a s d f g h j k l",
                "{shift} z x c v b n m",
                "{space} {close}"
              ],
              shift: [
                "Q W E R T Y U I O P {bksp}",
                "A S D F G H J K L",
                "{shift} Z X C V B N M",
                "{space} {close}"
              ],
              numpad: ["7 8 9", "4 5 6", "1 2 3", " 0 {ok}"]
            }}
            onKeyPress={btn => {
              if (btn === "{shift}") {
                setLayoutName(layoutName === "default" ? "shift" : "default");
              }
              if (btn === "{close}" || btn === "{ok}") {
                showKeyboard(false);
              }
            }}
            mergeDisplay={true}
            display={{
              "{bksp}": "⌫",
              "{close}": "Exit",
              "{shift}": "⇪",
              "{ok}": "✓"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default NewMatch;
