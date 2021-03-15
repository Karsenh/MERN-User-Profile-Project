import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
} from '../actions/types';

const initialState = {
  // Profile data for user and
  profile: null,
  // Getting user profiles to display
  profiles: [],
  // Fetching github repos
  repos: [],
  loading: true,
  // Store any errors in the request
  error: {},
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    default:
      return state;
  }
}
