import React, { useEffect } from "react";
import { Link } from "react-router-dom";
var firebase = require("firebase");
var firebaseui = require("firebaseui");

const ui = new firebaseui.auth.AuthUI(firebase.auth());
export default function LandingPage() {
    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: "http://localhost:3000",
        // This must be true.
        handleCodeInApp: true,
        iOS: {
            bundleId: "com.example.ios",
        },
        android: {
            packageName: "com.example.android",
            installApp: true,
            minimumVersion: "12",
        },
        dynamicLinkDomain: "example.page.link",
    };

    useEffect(() => {
        // ui.start("#signin", {
        //     signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
        //     // Other config options...
        // });
    }, []);
    return (
        <div className="landing-page">
            <p>Welcome</p>
            <Link to="/match">Start Pi Based Tracker</Link>
            <Link to="/scoreboard">Scoreboard</Link>
            <Link to="/dashbaord">Dashboard</Link>
            <div id="signin"></div>
        </div>
    );
}
