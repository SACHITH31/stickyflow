import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!token ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!token ? <Register /> : <Navigate to="/dashboard" />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={token ? <><Navbar /><Dashboard /></> : <Navigate to="/login" />} 
        />

        {/* OAuth Callback */}
        <Route 
          path="/auth/success" 
          element={
            <AuthCallback />
          } 
        />

        {/* Default redirect */}
        <Route 
          path="/" 
          element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

// OAuth callback component
function AuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  
  if (token) {
    localStorage.setItem("token", token);
    window.location.href = "/dashboard";
    return <div>Redirecting to Dashboard...</div>;
  }
  
  return <Navigate to="/login" />;
}

export default App;
