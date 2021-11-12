export default (email, role, token) => {
  return {
    email: email,
    role: role,
    name: "",
    username: "",
    password: "",
    token: {
      secret: token,
      expires: new Date().getTime() + 1000 * 60 * 60 * 24,
    },
    verified: false,
    timestamp: new Date(),
  };
};
