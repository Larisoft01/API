# 🚀 Jitterbit Order API

API REST para gerenciamento de pedidos — Teste Técnico Jitterbit.

## 🛠️ Tecnologias

- **Node.js** + **Express**
- **MongoDB** (via Mongoose)
- **JWT** para autenticação
- **Swagger** para documentação

---

## ⚙️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/jitterbit-order-api.git
cd jitterbit-order-api
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o `.env` com suas configurações:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/jitterbit_orders
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d
```

### 4. Inicie o servidor
```bash
# Produção
npm start

# Desenvolvimento (com nodemon)
npm run dev
```

---

## 📖 Documentação

Após iniciar o servidor, acesse:
```
http://localhost:3000/api-docs
```

---

## 🔐 Autenticação

Todos os endpoints de pedidos requerem um token JWT.

### Registrar usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "senha123"}'
```

### Fazer login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "senha123"}'
```
Guarde o `token` retornado e use no header `Authorization: Bearer <token>`.

---

## 📦 Endpoints

### Criar pedido (Obrigatório)
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

### Buscar pedido por ID (Obrigatório)
```bash
curl http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer <token>"
```

### Listar todos os pedidos (Opcional)
```bash
curl http://localhost:3000/order/list \
  -H "Authorization: Bearer <token>"
```

### Atualizar pedido (Opcional)
```bash
curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 15000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 7500
      }
    ]
  }'
```

### Deletar pedido (Opcional)
```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer <token>"
```

---

## 🗃️ Mapeamento de Dados

| Entrada (Request)  | Banco de Dados  |
|--------------------|-----------------|
| numeroPedido       | orderId         |
| valorTotal         | value           |
| dataCriacao        | creationDate    |
| items[].idItem     | items[].productId |
| items[].quantidadeItem | items[].quantity |
| items[].valorItem  | items[].price   |

---

## 📁 Estrutura do Projeto

```
src/
├── config/
│   ├── database.js     # Conexão MongoDB
│   └── swagger.js      # Configuração Swagger
├── controllers/
│   ├── authController.js   # Lógica de autenticação
│   └── orderController.js  # Lógica de pedidos (+ mapeamento)
├── middlewares/
│   └── auth.js         # Validação JWT
├── models/
│   ├── Order.js        # Schema MongoDB de pedidos
│   └── User.js         # Schema MongoDB de usuários
├── routes/
│   ├── authRoutes.js   # Rotas /auth
│   └── orderRoutes.js  # Rotas /order
├── app.js              # Configuração Express
└── server.js           # Entry point
```
