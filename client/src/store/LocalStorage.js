export const saveAuthInfo = (state) => {
  if (!state) {
    throw new Error("state object is null");
  }
  const serializedState = JSON.stringify(state);
  localStorage.setItem("authentication", serializedState);
};

export const loadAuthInfo = () => {
  const serializedState = localStorage.getItem("authentication");
  if (!serializedState) {
    return null;
  }
  return JSON.parse(serializedState);
};
