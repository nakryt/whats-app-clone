import React from "react";
import "./Login.scss";
import { Button } from "@material-ui/core";
import { WhatsApp as WhatsAppIcon } from "@material-ui/icons";

import { auth, provider } from "../../firebase";
import { useStateValue } from "../../context/StateProvider";
import { setUser } from "../../context/reducer";

export const Login = () => {
  const { dispatch } = useStateValue();

  const signIn = async () => {
    try {
      const { user } = await auth.signInWithPopup(provider);
      if (user) dispatch(setUser(user));
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <div className="login">
      <div className="login__container">
        <WhatsAppIcon fontSize="large" color="secondary" />
        <div className="login__text">
          <h2>Sign in to WhatsApp</h2>
        </div>
        <Button onClick={signIn}>Sign In With Google</Button>
      </div>
    </div>
  );
};
