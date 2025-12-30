import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        width: "400px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
          Welcome to StickyFlow ✨
        </h2>

        {/* GitHub Login */}
        <a 
          href="http://localhost:5000/api/auth/github"
          style={{
            display: "block",
            padding: "15px",
            marginBottom: "20px",
            background: "#333",
            color: "white",
            textDecoration: "none",
            textAlign: "center",
            borderRadius: "10px",
            fontWeight: "500",
            fontSize: "16px"
          }}
        >
          📱 Continue with GitHub
        </a>

        <div style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
          OR
        </div>

        {/* Manual Login */}
        <form onSubmit={handleManualLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "15px",
              border: "2px solid #ddd",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "2px solid #ddd",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

<div style={{ marginTop: "20px", textAlign: "center" }}>
  <a 
    href="/register" 
    style={{ color: "#667eea", textDecoration: "none", display: "block", marginBottom: "10px" }}
  >
    Don't have an account? Register
  </a>
  <a 
    href="/dashboard" 
    style={{ color: "#666", textDecoration: "none" }}
  >
    Already logged in? Go to Dashboard
  </a>
</div>

      </div>
    </div>
  );
}

export default Login;
