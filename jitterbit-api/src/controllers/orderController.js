const Order = require('../models/Order');

/**
 * Mapeia o JSON recebido na requisição para o formato do banco de dados.
 * Entrada:  { numeroPedido, valorTotal, dataCriacao, items: [{ idItem, quantidadeItem, valorItem }] }
 * Saída:    { orderId, value, creationDate, items: [{ productId, quantity, price }] }
 *
 * @param {Object} body - Corpo da requisição
 * @returns {Object} - Objeto mapeado para salvar no banco
 */
const mapRequestToDatabase = (body) => {
  const { numeroPedido, valorTotal, dataCriacao, items } = body;

  return {
    orderId: numeroPedido,
    value: valorTotal,
    creationDate: new Date(dataCriacao),
    items: items.map((item) => ({
      productId: parseInt(item.idItem, 10),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
};

// ─────────────────────────────────────────────
// POST /order — Criar novo pedido
// ─────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação básica dos campos obrigatórios
    if (!numeroPedido || !valorTotal || !dataCriacao || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios ausentes: numeroPedido, valorTotal, dataCriacao, items.',
      });
    }

    // Verifica se pedido já existe
    const existingOrder = await Order.findOne({ orderId: numeroPedido });
    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: `Pedido com número '${numeroPedido}' já existe.`,
      });
    }

    // Mapeia e salva no banco
    const mappedData = mapRequestToDatabase(req.body);
    const order = await Order.create(mappedData);

    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso.',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao criar pedido.',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET /order/:orderId — Buscar pedido por ID
// ─────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Pedido '${orderId}' não encontrado.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao buscar pedido.',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET /order/list — Listar todos os pedidos
// ─────────────────────────────────────────────
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ creationDate: -1 });

    return res.status(200).json({
      success: true,
      total: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao listar pedidos.',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// PUT /order/:orderId — Atualizar pedido
// ─────────────────────────────────────────────
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Se vier no formato original, mapeia; senão usa direto
    const hasOriginalFormat = req.body.numeroPedido !== undefined;
    const updateData = hasOriginalFormat ? mapRequestToDatabase(req.body) : req.body;

    const order = await Order.findOneAndUpdate(
      { orderId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Pedido '${orderId}' não encontrado para atualização.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Pedido atualizado com sucesso.',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao atualizar pedido.',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// DELETE /order/:orderId — Deletar pedido
// ─────────────────────────────────────────────
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOneAndDelete({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Pedido '${orderId}' não encontrado para exclusão.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Pedido '${orderId}' deletado com sucesso.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao deletar pedido.',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
};
