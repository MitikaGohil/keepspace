import axios from "axios";
import { FETCH_USERS, ADD_USER, EDIT_USER, DELETE_USER } from "./types";
import { formatData } from "../utils/helper";
import { API_BASE_URL } from "../constants";

export const fetchUsers = () => dispatch => {
    fetch(API_BASE_URL)
    .then(res => res.json())
    .then(res => {
        const users = formatData(res.results);
        dispatch({
            type: FETCH_USERS,
            payload: users
        });
    })
    .catch(err => console.log(err));
};

export const addEditUsers = (userData) => dispatch => {
    if (!userData[0].edit) {
        dispatch({
            type: ADD_USER,
            payload: userData
        });
    } else {
        dispatch({
            type: EDIT_USER,
            payload: userData
        });
    }
};

export const removeUsers = (usersNameArr) => dispatch => {
    dispatch({
        type: DELETE_USER,
        payload: usersNameArr 
    });
};
