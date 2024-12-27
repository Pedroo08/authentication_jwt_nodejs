# Autenticação API - Node.js

Esta aplicação é uma API de autenticação construída com Node.js. Ela utiliza JWT (JSON Web Token) para autenticar usuários e oferece endpoints para registro, login e acesso a informações privadas de um usuário.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework para criação de APIs.
- **MongoDB**: Banco de dados NoSQL para armazenar os dados dos usuários.
- **Mongoose**: Biblioteca para modelagem de dados em MongoDB.
- **JWT (jsonwebtoken)**: Para autenticação segura por meio de tokens.
- **bcrypt**: Para hash de senhas.
- **dotenv**: Gerenciamento de variáveis de ambiente.

## Pré-requisitos

- Node.js e npm instalados.
- MongoDB configurado.
- Variáveis de ambiente configuradas no arquivo `.env`.

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```env
DB_USER=<seu_usuario_mongodb>
DB_PASS=<sua_senha_mongodb>
SECRET=<seu_segredo_para_jwt>
```

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd <nome-do-diretorio>
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie a aplicação:
   ```bash
   npm start
   ```

## Endpoints

### 1. Rota Pública

- **GET /**
  - Descrição: Rota de boas-vindas.
  - Resposta:
    ```json
    {
      "msg": "Bem-vindo à API"
    }
    ```

### 2. Registro de Usuário

- **POST /auth/register**
  - Descrição: Registra um novo usuário.
  - Parâmetros:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "confirmepassword": "string"
    }
    ```
  - Resposta de sucesso:
    ```json
    {
      "msg": "Usuário criado com sucesso"
    }
    ```

### 3. Login de Usuário

- **POST /auth/login**
  - Descrição: Autentica o usuário e retorna um token JWT.
  - Parâmetros:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Resposta de sucesso:
    ```json
    {
      "msg": "Autenticação realizada com sucesso",
      "token": "string"
    }
    ```

### 4. Rota Privada

- **GET /user/:id**
  - Descrição: Retorna informações do usuário com o ID fornecido.
  - Cabeçalho:
    ```
    Authorization: Bearer <token>
    ```
  - Resposta de sucesso:
    ```json
    {
      "user": {
        "_id": "string",
        "name": "string",
        "email": "string"
      }
    }
    ```

### Middleware de Verificação de Token

O middleware `checkToken` é utilizado para proteger as rotas privadas. Ele verifica a validade do token JWT enviado no cabeçalho `Authorization`.

## Estrutura de Pastas

```
.
├── controller.js
├── models
│   └── User.js
├── app.js
├── .env
├── package.json
└── README.md
```

## Model de Usuário

O modelo de usuário está definido no arquivo `models/User.js`:

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
```



