import { TEST_DISPACTH } from "./types";
// REGISTER USER
export const registerUser = (userData) => {
  return {
    type: TEST_DISPACTH,
    payload: userData,
  };
};
