import { GET_PROFILE, PROFILE_ERROR } from '../actions/types';

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

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
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
    default:
      return state;
  }
}
