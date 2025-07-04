import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CepSearch from './components/CepSearch.jsx';
import CepList from './components/CepList.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import './App.css';

// Componente para rotas privadas
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // Verifica autenticação sempre que o componente é renderizado
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  // Função para atualizar o estado de autenticação
  const updateAuthStatus = () => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
  };

  // Função para logout
  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthStatus();
  navigate('/login') // força reload e redireciona
};

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
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

        {/* Rotas */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CepSearch isLoggedIn={isLoggedIn} />} />
            
            <Route path="/login" element={
              <LoginForm onLoginSuccess={updateAuthStatus} />
            } />
            
            <Route path="/register" element={
              <RegisterForm onRegisterSuccess={updateAuthStatus} />
            } />
            
            <Route path="/lista" element={
              <PrivateRoute>
                <CepList user={user} />
              </PrivateRoute>
            } />
            
            {/* Redirecionamento para páginas não encontradas */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;