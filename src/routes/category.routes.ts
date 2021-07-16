import Category from '../models/Category';
import { Router } from 'express';
import { updateCategory } from '../updateCategory';
import mongoose from 'mongoose';
import Cards from '../models/Cards';

const router = Router();
export interface Category {
  name: string;
  _deletedAt: Date;
}
export enum StatusCodes {
  Ok = 200,
  NotFound = 404,
  BadRequest = 400,
}
router.get('/', async (req, res) => {
  const allCategories = await Category.find({ _deletedAt: null });
  return res.json(allCategories);
});

// Get by id
router.get('/:id', async (req, res) => {
  const categoryId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.json({ message: 'nono' });
  if (!categoryId) {
    return res.status(StatusCodes.BadRequest);
  }
  const category = await Category.findById(categoryId);
  if (!category) {
    return res.sendStatus(StatusCodes.NotFound);
  }
  return res.json(category);
});

// Create new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const _id = mongoose.Types.ObjectId();
    const newCategory = await new Category({ _id, name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (e) {
    return res.status(StatusCodes.BadRequest).send(e);
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.json({ message: 'nono' });
  if (!id) {
    return res.status(StatusCodes.BadRequest);
  }
  try {
    await updateCategory({ _deletedAt: Date.now(), id });
    const category = await Category.findById(id);
    await Cards.updateMany(
      { categoryName: category.name },
      { $set: { _deletedAt: Date.now() } }
    );
    return res.sendStatus(StatusCodes.Ok);
  } catch (e) {
    return res.status(StatusCodes.BadRequest).send(e);
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.json({ message: 'nono' });
  const { name, _deletedAt, words } = req.body;
  if (!id) {
    return res.status(StatusCodes.BadRequest);
  }
  try {
    const category = await Category.findById(id);
    await Cards.updateMany(
      { categoryName: category.name },
      { $set: { categoryName: name } }
    );
    await updateCategory({ name, _deletedAt, id, words });
    return res.sendStatus(StatusCodes.Ok);
  } catch (e) {
    return res.status(StatusCodes.BadRequest).send(e);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of category
 *         _deletedAt:
 *           type: date
 *           description: The deleted category
 *         words:
 *           type: number
 *           description: The counts words in category
 *       example:
 *         name: Set A
 *         _deletedAt: null
 */

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Categories
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Returns the list of all the category
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: The list of the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get the category by id
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category id
 *     responses:
 *       200:
 *         description: The category description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: The category was not found
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The category was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /category/{id}:
 *  put:
 *    summary: Update the category by the id
 *    tags: [Category]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The category id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    responses:
 *      200:
 *        description: The category was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      404:
 *        description: The category was not found
 *      500:
 *        description: Some error happened
 */

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Remove the category by id
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category id
 *
 *     responses:
 *       200:
 *         description: The category was deleted
 *       404:
 *         description: The category was not found
 */

export default router;
