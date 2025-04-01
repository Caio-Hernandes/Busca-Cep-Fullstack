import React, { useEffect, useState } from 'react';
import './CepSearch.css';

const CepSearch = () => {
  return (
    <div className="cep-container">
      <div className="cep-card">
        <h1 className="title">Busca de CEP</h1>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="CEP"
            className="cep-input"
          />
          
          <input
            type="text"
            placeholder="Rua"
            className="input-padrao address-input"
          />
          
          <div className="city-state-group">
            <input
              type="text"
              placeholder="Cidade"
              className="city-input"
            />
            <input
              type="text"
              placeholder="Estado"
              className="state-input"
            />
          </div>
          
          <button className="search-button">
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CepSearch;