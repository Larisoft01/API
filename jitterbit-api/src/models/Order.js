const mongoose = require('mongoose');

/**
 * Schema do item do pedido.
 * Mapeia os campos recebidos na requisição para o formato do banco de dados.
 */
const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: [true, 'O ID do produto é obrigatório'],
    },
    quantity: {
      type: Number,
      required: [true, 'A quantidade é obrigatória'],
      min: [1, 'A quantidade deve ser no mínimo 1'],
    },
    price: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0, 'O preço não pode ser negativo'],
    },
  },
  { _id: true }
);

/**
 * Schema principal do pedido.
 * Representa a collection "orders" no MongoDB.
 */
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, 'O número do pedido é obrigatório'],
      unique: true,
      trim: true,
    },
    value: {
      type: Number,
      required: [true, 'O valor total é obrigatório'],
      min: [0, 'O valor total não pode ser negativo'],
    },
    creationDate: {
      type: Date,
      required: [true, 'A data de criação é obrigatória'],
    },
    items: {
      type: [itemSchema],
      required: [true, 'O pedido deve ter ao menos um item'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'O pedido deve conter pelo menos um item',
      },
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    versionKey: '__v',
  }
);

module.exports = mongoose.model('Order', orderSchema);
