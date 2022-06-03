import { authService } from "fbase";
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import "firebase/database";
import AuthForm from "components/AuthForm";

const Auth = () => {

    const onSocialClick = async (event) => {
        const { target: { name } } = event;
        let provider;

        if (name === "google") {
            provider = new GoogleAuthProvider();            
        } else if (name === "github") {
            provider = new GithubAuthProvider();
        }

        await signInWithPopup(authService, provider);
    }

    return (
        <div>
            <AuthForm /> 

            <div>
                <button name="google" onClick={ onSocialClick }>Continue with Google</button>
                <button name="github" onClick={ onSocialClick }>Continue with Github</button>
            </div>
        </div>
    );
}
export default Auth;