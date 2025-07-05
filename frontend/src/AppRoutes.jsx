// AppRoutes.jsx
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CepSearch from './components/CepSearch';
import CepList from './components/CepList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const updateAuthStatus = () => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">Sistema de CEP</h1>

          <div className="nav-right">
            <div className="nav-links">
              <Link to="/" className="nav-link">Buscar CEP</Link>
              {isLoggedIn && (
                <Link to="/lista" className="nav-link">Meus CEPs</Link>
              )}
            </div>

            <div className="auth-links">
              {isLoggedIn ? (
                <>
                  <span className="nav-user">Olá, {user?.name}</span>
                  <button onClick={handleLogout} className="nav-link logout-btn">Sair</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">Entrar</Link>
                  <Link to="/register" className="nav-link">Cadastrar</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<CepSearch isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginForm onLoginSuccess={updateAuthStatus} />} />
          <Route path="/register" element={<RegisterForm onRegisterSuccess={updateAuthStatus} />} />
          <Route path="/lista" element={
            <PrivateRoute>
              <CepList user={user} />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;
