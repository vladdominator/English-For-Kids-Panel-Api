import { Request, Response, NextFunction, Router } from 'express';
import multer from 'multer';
import Cards from '../models/Cards';
import Category from '../models/Category';
import mongoose from 'mongoose';
import { updateCards } from '../updateCards';
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, 'public/images/');
    }
    if (file.mimetype === 'audio/mpeg') {
      cb(null, 'public/sounds/');
    }
  },
  filename: function (req, file, cb) {
    if (file.mimetype === 'audio/mpeg') {
      cb(
        null,
        file.originalname.includes('.mp3')
          ? file.originalname
          : file.originalname + '.mp3'
      );
    }
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(
        null,
        file.originalname.includes('.jpg')
          ? file.originalname
          : file.originalname + '.jpg'
      );
    }
  },
});
const upload = multer({ storage: storage });

interface MulterRequest extends Request {
  file: any;
  files: any;
}

router.post(
  '/',
  upload.array('file', 2),
  async (req: MulterRequest, res: Response): Promise<any> => {
    try {
      const { name, categoryName, translation, img, sound } = req.body;
      const newCard = new Cards({
        categoryName,
        name,
        translation,
        img,
        sound,
      });
      await newCard.save();
      const cat = await Category.updateOne(
        { name: categoryName },
        { $inc: { words: 1 } }
      );
      console.log(cat);
      return res.status(201).json(newCard);
    } catch (e) {
      return res.status(400).send(e);
    }
  }
);

router.get('/', async (req, res) => {
  const allCards = await Cards.find({ _deletedAt: null });
  return res.json(allCards);
});

router.get('/:id', async (req, res) => {
  const cardId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(cardId))
    return res.json({ message: 'nono' });
  if (!cardId) {
    return res.status(400);
  }
  const card = await Cards.findById(cardId);
  if (!card) {
    return res.sendStatus(404);
  }
  return res.json(card);
});

router.put('/:id', upload.array('file', 2), async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.json({ message: 'nono' });
  const { name, categoryName, translation, sound, img, _deletedAt } = req.body;
  if (!id) {
    return res.status(400);
  }
  try {
    await updateCards({
      name,
      categoryName,
      translation,
      sound,
      img,
      _deletedAt,
      id,
    });
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.json({ message: 'nono' });
  if (!id) {
    return res.status(400);
  }
  try {
    await updateCards({ _deletedAt: Date.now(), id });
    const card = await Cards.findById(id);
    const cat = await Category.updateOne(
      { name: card.categoryName },
      { $inc: { words: -1 } }
    );
    console.log(cat);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Cards:
 *       type: object
 *       required:
 *         - name
 *         - categoryName
 *         - translation
 *         - img
 *         - sound
 *         - file
 *       properties:
 *         name:
 *           type: string
 *           description: The name of card
 *         categoryName:
 *           type: string
 *           description: The category name of card
 *         translation:
 *           type: string
 *           description: The translation of card
 *         img:
 *           type: string
 *           description: The img of card
 *         sound:
 *           type: string
 *           description: The sound of card
 *         file:
 *           type: array
 *           items:
 *            type: string
 *            format: binary
 *            description: The file of card
 *       example:
 *         name: cat
 *         categoryName: Set A
 *         translation: кот
 *         img: http://localhost:5000/images/cat.jpg
 *         sound: http://localhost:5000/sounds/cat.mp3
 *
 */

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Cards
 */

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Returns the list of all the cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: The list of the cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cards'
 */

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Cards'
 *     responses:
 *       200:
 *         description: The card was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cards'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Get the card by id
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card id
 *     responses:
 *       200:
 *         description: The card description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cards'
 *       404:
 *         description: The card was not found
 */

/**
 * @swagger
 * /cards/{id}:
 *  put:
 *    summary: Update the card by the id
 *    tags: [Cards]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The card id
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/Cards'
 *    responses:
 *      200:
 *        description: The card was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Cards'
 *      404:
 *        description: The card was not found
 *      500:
 *        description: Some error happened
 */

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Remove the card by id
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card id
 *
 *     responses:
 *       200:
 *         description: The card was deleted
 *       404:
 *         description: The card was not found
 */

export default router;
