import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import config from 'config';
import auth from './routes/auth.routes';
import category from './routes/category.routes';
import cards from './routes/cards.routes';

require('dotenv').config();

const port = config.get('port') || 5000;
const app = express();

app.use(express.json());
app.use(morgan('short'));
app.use(cors());
app.use('/api/auth', auth);
app.use('/category', category);
app.use('/cards', cards);
app.use(express.static('public'));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Api English for kids',
      description: 'Swagger-json for English For Kids Panel',
      contract: {
        name: 'vladdominator',
      },
      servers: ['http://localhost:5000'],
    },
    version: '1.0.0',
  },
  apis: ['**/*.ts'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

async function start(): Promise<void> {
  try {
    await mongoose.connect(
      config.get('mongoUrl', {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
    );
    app.listen(port, () => console.log(`Running on port ${port}`));
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}
start();
