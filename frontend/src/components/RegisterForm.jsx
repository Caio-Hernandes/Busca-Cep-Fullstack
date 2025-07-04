import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Adicione esta linha
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Agora esta variável está definida
    setError('');

    try {
      const response = await fetch('https://busca-cep-fullstack.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro no cadastro');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onRegisterSuccess();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="auth-container">
    <h1 className="welcome-title">Faça seu cadastro</h1>

    <div className="auth-card">
      <h2 className="auth-title">Cadastro</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
        type="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nome"
        required
        disabled={isLoading}
      />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          disabled={isLoading}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Senha"
          required
          disabled={isLoading}
        />
        
        {error && <p className="error-message">{error}</p>}
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>
    </div>
  </div>
);
}

export default RegisterForm;