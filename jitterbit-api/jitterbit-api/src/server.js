require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

/**
 * Inicializa o servidor após conectar ao banco de dados.
 */
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📖 Documentação Swagger: http://localhost:${PORT}/api-docs\n`);
  });
};

startServer();
