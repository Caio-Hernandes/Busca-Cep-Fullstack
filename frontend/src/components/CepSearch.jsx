// components/CepSearch.js - Página de busca e cadastro
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CepSearch.css';

const URL = 'https://viacep.com.br/ws/';
const API_URL = 'https://busca-cep-fullstack.onrender.com';

const CepSearch = () => {
  const [cep, setCep] = useState('');
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
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

  // Buscar CEP na API externa
  const handleBlur = async () => {
    if (!cep || cep.length < 8) return;
    
    setLoading(true); 
    try {
      const response = await fetch(`${URL}${cep}/json/`);
      const data = await response.json();
       
      if (data.erro) {
        setMessage('CEP não encontrado');
        setInfo({});
      } else {
        setInfo(data);
        setMessage('');
      }
    } catch (error) {
      setMessage('Erro ao buscar CEP');
      setInfo({});
    }
    setLoading(false);
  };

  // Cadastrar CEP no banco de dados
  const handleCadastrar = async () => {
    if (!info.cep) {
      setMessage('Busque um CEP válido primeiro');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setMessage('Você precisa estar logado');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ceps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` //jwt fortíssimo
        },
        body: JSON.stringify({
          cep: info.cep,
          logradouro: info.logradouro || '',
          localidade: info.localidade || '',
          uf: info.uf || ''
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('CEP cadastrado com sucesso!');
        // Limpar formulário
        setCep('');
        setInfo({});
      } else {
        // Se token expirou ou é inválido
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setMessage('Sessão expirada. Faça login novamente');
          navigate('/login');
        } else {
          setMessage(data.error || 'Erro ao cadastrar CEP');
        }
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor');
    }
    setLoading(false);
  };

  // Limpar mensagem após 3 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="cep-container">
      <div className="cep-card">
        <h1 className="title">Busca de CEP</h1>
        
        {/* Mensagem de feedback */}
        {message && (
          <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Digite seu CEP"
            className="cep-input"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onBlur={handleBlur}
            disabled={loading}
          />
          
          <input
            type="text"
            placeholder="Rua"
            className="input-padrao address-input"
            value={info.logradouro || 'Rua não encontrada'}
            readOnly
          />
          
          <div className="city-state-group">
            <input
              type="text"
              placeholder="Cidade"
              className="city-input"
              value={info.localidade || 'Cidade não encontrada'}
              readOnly
            />
            <input
              type="text"
              placeholder="Estado"
              className="state-input"
              value={info.uf || 'Estado não encontrado'}
              readOnly
            />
          </div>
          
          <div className="button-group">
            <button 
              className="search-button"
              onClick={handleCadastrar}
              disabled={loading || !info.cep}
            >
              {loading ? 'Buscando...' : 'Cadastrar'}
            </button>
            
            <Link to="/lista" className="list-button">
              Ver CEPs Cadastrados
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CepSearch;