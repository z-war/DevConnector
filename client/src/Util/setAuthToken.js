import axios from "axios";

const setAuthtoken = (token) => {
  if (token) {
    //apply to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    //Delete the auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthtoken;
