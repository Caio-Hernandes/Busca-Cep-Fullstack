// App.js - Componente principal com roteamento
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CepSearch from './components/CepSearch.jsx';
import CepList from './components/CepList.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">Sistema de CEP</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">
                Buscar CEP
              </Link>
              <Link to="/lista" className="nav-link">
                CEPs Cadastrados
              </Link>
            </div>
          </div>
        </nav>

        {/* Rotas */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CepSearch />} />
            <Route path="/lista" element={<CepList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;