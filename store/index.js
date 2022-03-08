export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },

  loggedInUser(state) {
    return state.auth.user;
  },

  apiUrl() {
    return 'https://issue-app-api.herokuapp.com/api/v1';
  }
}
