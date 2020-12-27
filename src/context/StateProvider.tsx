import React, { FC, createContext, useReducer, useContext } from "react";
import { Action, initialState, State } from "./reducer";

export const StateContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

interface Props {
  reducer: (state: State, action: Action) => State;
  initialState: State;
}

export const StateProvider: FC<Props> = ({
  reducer,
  initialState,
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
