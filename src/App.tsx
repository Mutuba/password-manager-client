import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "@components/authentication/Login";
import Register from "@components/authentication/Register";
import { AuthProvider, AuthContext } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider initialState={{ user: null, userToken: null, loading: true }}>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute component={Home} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
}) => {
  const authContext = React.useContext(AuthContext);

  if (!authContext || authContext.loading) {
    return <div>Loading...</div>;
  }

  return authContext.user ? <Component /> : <Navigate to="/login" />;
};

export default App;
