# Task JWT API

API para gerenciamento de usuários e tarefas com autenticação JWT, construída com **Node.js**, **Express**, e **MongoDB**.

## 📌 Funcionalidades
- Cadastro e autenticação de usuários com JWT.
- CRUD de usuários.
- CRUD de tarefas associadas a usuários.
- Proteção de rotas com middleware de autenticação.
- Contagem de usuários por função.

## 🛠️ Tecnologias Utilizadas
- **Node.js**
- **Express.js**
- **MongoDB** + Mongoose
- **JSON Web Token (JWT)**

## 🚀 Como Executar

### 1️⃣ Clone o repositório:
```sh
git clone https://github.com/joaorafael1504/task-jwt-api.git
cd task-jwt-api
```

### 2️⃣ Instale as dependências:
```sh
npm install
```

### 3️⃣ Configure as variáveis de ambiente:
Crie um arquivo `.env` e adicione:
```env
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>/<database>
JWT_SECRET=sua_chave_secreta
PORT=3000
```

### 4️⃣ Inicie o servidor:
```sh
npm start
```
A API estará rodando em `http://localhost:3000`

## 🔑 Rotas Disponíveis

### 📌 Autenticação
- `POST /login` → Autentica usuário e retorna token JWT.
- `POST /register` → Registra um novo usuário.

### 📌 Usuários (Protegidas com JWT)
- `GET /users` → Lista todos os usuários.
- `GET /users/:id` → Obtém um usuário pelo ID.
- `PUT /users/:id` → Atualiza um usuário.
- `DELETE /users/:id` → Remove um usuário.
- `GET /users/roles/count` → Conta usuários por função.

### 📌 Tarefas (Protegidas com JWT)
- `GET /tasks` → Lista tarefas do usuário autenticado.
- `POST /tasks` → Cria uma nova tarefa.
- `PUT /tasks/:id` → Atualiza uma tarefa.
- `DELETE /tasks/:id` → Remove uma tarefa.
- `GET /tasks/no-owner` → Lista tarefas sem dono.
- `PUT /tasks/:id/assign` → Atribui uma tarefa a um usuário.

## Autor

Desenvolvido por João Rafael.

## 📜 Licença
Este projeto está sob a licença MIT. Sinta-se livre para contribuir! 😃
