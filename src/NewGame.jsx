import React, { useState, useContext } from "react";
import { __RouterContext } from "react-router-dom";
import styled from "styled-components";
import {
  FormControl,
  InputLabel,
  Select,
  Input,
  OutlinedInput,
  MenuItem,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function NewGame() {
  const classes = useStyles();
  const { history } = useContext(__RouterContext);
  const [numberOfGames, setNumberOfGames] = useState({
    label: "2/3",
    value: { total: 3, toWin: 2 }
  });

  const [gameSettings, setGameSettings] = React.useState({
    toWin: 2,
    playTill: 21
  });
  function handleChange(event) {
    console.log(event);

    setGameSettings(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  }

  return (
    <div>
      <h1>Start a New Game:</h1>
      <form className={classes.root} autoComplete="off">
        <input id="team1" />
        <input id="team2" />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="games-to-win">Games To Win</InputLabel>
          <Select
            value={gameSettings.toWin}
            onChange={handleChange}
            inputProps={{
              name: "gamesToWin",
              id: "games-to-win"
            }}>
            <MenuItem value={2}>2/3</MenuItem>
            <MenuItem value={1}>1</MenuItem>
          </Select>
        </FormControl>
      </form>
      <Button
        variant="contained"
        onClick={() => {
          history.push("/active-game");
        }}>
        Start
      </Button>
    </div>
  );
}
