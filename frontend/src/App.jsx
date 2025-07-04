import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import CepSearch from './components/CepSearch.jsx';
import CepList from './components/CepList.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import './App.css';

// Importe seu componente PrivateRoute existente
import PrivateRoute from './components/PrivateRoute.jsx'; // ou o caminho correto

// Componente separado para navbar (para usar useNavigate)
const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout(); // Atualiza o estado no App
    navigate('/login'); // Usa navigate ao invés de window.location.href
  };

  return (
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
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  // Função para atualizar o estado de autenticação
  const updateAuthStatus = () => {
    const newLoginStatus = !!localStorage.getItem('token');
    const newUser = JSON.parse(localStorage.getItem('user') || 'null');
    
    setIsLoggedIn(newLoginStatus);
    setUser(newUser);
    
    // Force re-render para garantir que mudanças sejam aplicadas
    console.log('Estado atualizado:', { isLoggedIn: newLoginStatus, user: newUser });
  };

  // Escuta mudanças no localStorage (para casos de logout em outras abas)
  useEffect(() => {
    const handleStorageChange = () => {
      updateAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Navbar usando o componente separado */}
        <Navbar 
          isLoggedIn={isLoggedIn} 
          user={user} 
          onLogout={updateAuthStatus} 
        />

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
              isLoggedIn ? <CepList user={user} /> : <Navigate to="/login" />
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