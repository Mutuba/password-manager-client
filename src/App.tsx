import React, { ComponentType, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Spinner from "./shared/Spinner";

const App: React.FC = () => {
  return (
    <AuthProvider>
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
  component: ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = React.memo(
  ({ component: Component }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
      return <Spinner size="100" />;
    }

    return user ? <Component /> : <Navigate to="/login" />;
  }
);

export default App;
