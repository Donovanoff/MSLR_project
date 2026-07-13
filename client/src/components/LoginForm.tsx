import React, { useState, FormEvent } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { RegistrationData, User } from "../types";

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [formData, setFormData] = useState<RegistrationData>({
    email: "",
    fullName: "",
    dob: "",
    password: "",
    scc: "",
  });

  const [serverMessage, setServerMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (serverMessage) setServerMessage("");
  };

  // Fix for the typing issue: the qr scanner returns an array of objects
  const handleScan = (result: Array<{ rawValue: string }>) => { 
    if (result && result.length > 0) {
      const scannedValue = result[0].rawValue;
      setFormData((prev) => ({ ...prev, scc: scannedValue }));
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerMessage("");
    setIsError(false);
    setIsLoading(true);

    const endpoint = isLoginMode ? "/api/login" : "/api/register";
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setServerMessage(data.message);
        setIsError(false);

        if (isLoginMode && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          
          onLoginSuccess(data.user);
          if (data.user.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } else {
          // Registration successful
          setFormData({ email: "", fullName: "", dob: "", password: "", scc: "" });
          setIsLoginMode(true); // Switch to login after registration
        }
      } else {
        setServerMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setServerMessage(`Failed to connect to the server :(`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setServerMessage("");
    setIsError(false);
    setFormData({ email: "", fullName: "", dob: "", password: "", scc: "" });
  };

  return (
    <div className="form-container">
      <h2>{isLoginMode ? "Login" : "Register Voter"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {!isLoginMode && (
          <>
            <div className="input-group">
              <label>Full name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Date of birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {!isLoginMode && (
          <div className="input-group">
            <label>SCC Code:</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                name="scc"
                value={formData.scc}
                onChange={handleChange}
                placeholder="Type/Scan your SCC code"
                required
              />
              <button
                type="button"
                onClick={() => setIsScanning(!isScanning)}
                style={{
                  width: "80px",
                  padding: "5px",
                  fontSize: "12px",
                  backgroundColor: "#6c757d",
                }}
              >
                {isScanning ? "Cancel" : "Scan QR code"}
              </button>
            </div>

            {isScanning && (
              <div className="scanner-container">
                <p style={{ marginTop: "0px" }}>Scan QR code</p>
                {/* @ts-ignore */}
                <Scanner onScan={handleScan} onError={(error) => console.log(error)} />
              </div>
            )}
          </div>
        )}

        <button type="submit" style={{ marginTop: "20px" }} disabled={isLoading}>
          {isLoading 
            ? "Connecting to server... (may take up to 50s)" 
            : isLoginMode ? "Login" : "Register"}
        </button>
      </form>

      <div className="toggle-container">
        <p>
          {isLoginMode ? "No account? " : "Already have an account? "}
          <span className="toggle-link" onClick={toggleMode}>
            {isLoginMode ? "Register" : "Login"}
          </span>
        </p>
      </div>

      {serverMessage && (
        <div className={`message-box ${isError ? "error" : "success"}`}>
          {serverMessage}
        </div>
      )}
    </div>
  );
};
