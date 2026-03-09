const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jitterbit Order API',
      version: '1.0.0',
      description: 'API de gerenciamento de pedidos - Teste Técnico Jitterbit',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        OrderInput: {
          type: 'object',
          required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
          properties: {
            numeroPedido: { type: 'string', example: 'v10089015vdb-01' },
            valorTotal: { type: 'number', example: 10000 },
            dataCriacao: { type: 'string', format: 'date-time', example: '2023-07-19T12:24:11.5299601+00:00' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  idItem: { type: 'string', example: '2434' },
                  quantidadeItem: { type: 'number', example: 1 },
                  valorItem: { type: 'number', example: 1000 },
                },
              },
            },
          },
        },
        OrderOutput: {
          type: 'object',
          properties: {
            orderId: { type: 'string', example: 'v10089015vdb-01' },
            value: { type: 'number', example: 10000 },
            creationDate: { type: 'string', format: 'date-time' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'number', example: 2434 },
                  quantity: { type: 'number', example: 1 },
                  price: { type: 'number', example: 1000 },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
