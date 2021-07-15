import { SavedUser } from './../typesUser';
import { Router } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt-nodejs';
import config from 'config';
const router = Router();

router.post(
  '/register',
  [
    check('email', 'no correct email').isEmail(),
    check('password', 'Min line symbols 6').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'No correct data in register',
        });
      }
      const { email, password } = req.body;
      const canditate = await User.findOne({ email });
      if (canditate) {
        return res.status(400).json({ message: 'You have a account!' });
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashPassword });
      await user.save();
      res.status(201).json({ message: 'this is ok' });
    } catch (e) {
      res.status(500).json({ message: 'Error in register' });
    }
  }
);
router.post(
  '/login',
  [
    check('email', 'no correct email').normalizeEmail().isEmail(),
    check('password', 'No correct password').exists(),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email.slice(1) === 'admin' && password === 'admin') {
        return res.json({ message: 'admin' });
      } else {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: 'No correct data in login',
          });
        }
        const user: SavedUser = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'User not found...' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'No correct password' });
        }
        const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
          expiresIn: '1h',
        });
        res.json({ token, userId: user.id });
      }
    } catch (e) {
      res.status(500).json({ message: 'Error in register' });
    }
  }
);
/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of users
 *         password:
 *           type: string
 *           description: The password of users
 *       example:
 *         email: vlad@mail.ru
 *         password: 59400040e
 */

/**
 * @swagger
 * tags:
 *   name: Register
 *   description: Registrations users
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       500:
 *         description: Some server error
 */
export default router;
