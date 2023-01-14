export const checkSession = (item, value) => {
  const sessionItem = sessionStorage.getItem(item);
  if (!sessionItem) {
    sessionStorage.setItem(item, value);
  }
  return sessionItem;
};
