// components/CepList.js - Página de listagem
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CepList.css';

const API_URL = 'http://localhost:3001/api';

const CepList = () => {
  const [savedCeps, setSavedCeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Função para pegar o token do localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Verificar se usuário está logado
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Carregar CEPs salvos
  const loadSavedCeps = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ceps`, {
        headers: {
          'Authorization': `Bearer ${token}` // ← AQUI está o token JWT!
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedCeps(data);
      } else if (response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setMessage('Sessão expirada. Faça login novamente');
        navigate('/login');
      } else {
        setMessage('Erro ao carregar CEPs');
      }
    } catch (error) {
      setMessage('Erro ao carregar CEPs');
      console.error('Erro ao carregar CEPs:', error);
    }
    setLoading(false);
  };

  // Deletar CEP
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este CEP?')) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/ceps/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` //jwt lindao
        }
      });

      if (response.ok) {
        setMessage('CEP removido com sucesso!');
        loadSavedCeps(); // Recarregar lista
      } else if (response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setMessage('Sessão expirada. Faça login novamente');
        navigate('/login');
      } else {
        setMessage('Erro ao remover CEP');
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor');
    }
  };

  // Carregar CEPs ao montar o componente
  useEffect(() => {
    loadSavedCeps();
  }, []);

  // Limpar mensagem após 3 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="cep-list-container">
      <div className="list-header">
        <h1 className="list-title">CEPs Cadastrados</h1>
        <Link to="/" className="back-button">
          ← Voltar para Busca
        </Link>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading">
          <p>Carregando CEPs...</p>
        </div>
      )}

      {/* Lista vazia */}
      {!loading && savedCeps.length === 0 && (
        <div className="empty-state">
          <h3>Nenhum CEP cadastrado</h3>
          <p>Vá para a página de busca e cadastre seu primeiro CEP!</p>
          <Link to="/" className="cta-button">
            Cadastrar CEP
          </Link>
        </div>
      )}

      {/* Lista de CEPs */}
      {!loading && savedCeps.length > 0 && (
        <div className="ceps-grid">
          {savedCeps.map((item) => (
            <div key={item.id} className="cep-card">
              <div className="cep-header">
                <span className="cep-number">{item.cep}</span>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                  title="Remover CEP"
                >
                  X
                </button>
              </div>
              
              <div className="cep-details">
                <div className="detail-row">
                  <strong>Logradouro:</strong>
                  <span>{item.logradouro || 'Não informado'}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Cidade:</strong>
                  <span>{item.localidade || 'Não informado'}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Estado:</strong>
                  <span>{item.uf || 'Não informado'}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Cadastrado em:</strong>
                  <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      {!loading && savedCeps.length > 0 && (
        <div className="stats">
          <p>Total de CEPs cadastrados: <strong>{savedCeps.length}</strong></p>
        </div>
      )}
    </div>
  );
};

export default CepList;