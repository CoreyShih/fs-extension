const getUser = () => window.localStorage.getItem("loggedBloglistUser");

const saveUser = (user) =>
  window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));

const removeUser = () => window.localStorage.removeItem("loggedBloglistUser");

export { getUser, saveUser, removeUser };
