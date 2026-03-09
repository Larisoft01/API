const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// ─── Middlewares globais ───────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Documentação Swagger ──────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Rotas ────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);

// ─── Rota raiz ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Jitterbit Order API está rodando!',
    docs: 'http://localhost:3000/api-docs',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
      },
      orders: {
        create: 'POST /order',
        getById: 'GET /order/:orderId',
        list: 'GET /order/list',
        update: 'PUT /order/:orderId',
        delete: 'DELETE /order/:orderId',
      },
    },
  });
});

// ─── Handler de rota não encontrada ───────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota '${req.originalUrl}' não encontrada.`,
  });
});

// ─── Handler de erros globais ──────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.',
    error: err.message,
  });
});

module.exports = app;
