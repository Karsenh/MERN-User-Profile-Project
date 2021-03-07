import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

const initialState = {
  // Look for an item in localstorage called 'token'
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  // Check that loading is complete (backend request made and response given)
  loading: true,
  // User data including name, email, avatar, etc. will be stored here
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      // If token is there - set the token to the payload
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        // Registration SUCCESS - Authenticated
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
      // Remove token entirely in the event of a failed login
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        // Registration FAILED - NOT authenticated
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
