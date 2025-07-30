Sistema de Busca e Cadastro de CEPs

Aplicação fullstack que permite buscar informações de CEPs brasileiros utilizando uma API pública e salvar os resultados para consulta futura. Conta com sistema de autenticação, frontend em React e backend em Node.js com banco PostgreSQL.

 Funcionalidades

- Cadastro e login de usuários com autenticação via JWT
-  Busca de CEPs por meio da API ViaCEP
-  Salvamento dos CEPs pesquisados no banco de dados
-  Listagem personalizada dos CEPs salvos por usuário
-  Interface responsiva e limpa

 Tecnologias Utilizadas

Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT para autenticação

Frontend
- React.js (Vite)
- CSS
- Consumo de APIs via Fetch

 Deploy
- Backend e frontend hospedados na Render
- Banco de dados no Railway

*Infra migrada da Railway para Supabase devido a limitações de uso gratuito. Projeto atualizado com pooling ativo via Supavisor, garantindo estabilidade para testes por recrutadores.*

 Créditos
Odair Michael — estrutura inicial do formulário de busca (frontend)

Caio Hernandes — backend completo, banco de dados, autenticação, estilização e deploy





