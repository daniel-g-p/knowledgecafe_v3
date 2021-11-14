export default (name, email, role, token) => {
  return {
    name: name,
    email: email,
    role: role,
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
