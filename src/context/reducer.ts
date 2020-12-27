import firebase from "firebase";

interface User {
  displayName: string | null;
  email: string;
}

export const initialState = {
  user: null as firebase.User | null,
};

export type State = typeof initialState;

export type Action = { type: "SET_USER"; payload: firebase.User | null };

export const setUser = (payload: firebase.User | null) => ({
  type: "SET_USER" as const,
  payload,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
