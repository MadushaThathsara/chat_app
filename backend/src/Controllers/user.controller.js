const login = (req, res) => {
   res.send("Login");
}

const logout = (req, res) => {
    res.send("Logout");
}

const signup = (req, res) => {
    res.send("Signup");
}

module.exports = { login, logout, signup };