const getCurrentUser = (user, setUser) => {
  if (user) {
    setUser(user);
  } else {
    const user = localStorage.getItem("userIsLogin");
    setUser(JSON.parse(user));
  }
};

export { getCurrentUser };
