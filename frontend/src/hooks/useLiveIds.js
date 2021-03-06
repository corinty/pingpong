import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { UPDATE_GAME, UPDATE_IDS } from "../store/types";
import { useDispatch, useSelector } from "react-redux";
import { gql } from "apollo-boost";
import { db } from "../store/db";

export default function useLiveIds() {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = db.doc("app/activeIds").onSnapshot(ref => {
      setData(ref.data());
      dispatch({ type: UPDATE_IDS, payload: ref.data() });
      if (loading) setLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  return { ...data, loading };
}
