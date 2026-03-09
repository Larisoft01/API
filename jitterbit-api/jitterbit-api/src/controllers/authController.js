const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Gera um token JWT para o usuário autenticado.
 * @param {string} userId - ID do usuário
 * @returns {string} Token JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// ─────────────────────────────────────────────
// POST /auth/register — Registrar usuário
// ─────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e password são obrigatórios.',
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Usuário já existe.',
      });
    }

    const user = await User.create({ username, password });
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso.',
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao registrar usuário.',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// POST /auth/login — Login de usuário
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e password são obrigatórios.',
      });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso.',
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao realizar login.',
      error: error.message,
    });
  }
};

module.exports = { register, login };
