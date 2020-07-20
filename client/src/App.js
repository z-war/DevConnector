import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./Util/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authAction";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import Register from "./components/auth/Register";

import Login from "./components/auth/Login";

import "./App.css";

// check for token
if (localStorage.jwtToken) {
  //Set the auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  //set current user
  store.dispatch(setCurrentUser(decoded));
  //check for expired token
  const currenttime = Date.now() / 1000;
  if (decoded.exp < currenttime) {
    //Logout User
    store.dispatch(logoutUser());
    //TODO : Clear Current Profile
    //Redirect to login
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
          </div>
          <div className="container">
            <Route exact path="/login" component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
