import "./App.css";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { showSuccess, showError } from "./Utils";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "https://reqres.in/api/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        showSuccess("Login successful");
        localStorage.setItem("token", response.data.token);
        window.location.href = "/user";
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        showError("Invalid username or password");
      } else {
        showError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" method="POST" onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit">Login</button>
          <a href="/register">Forget Password</a>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default App;
