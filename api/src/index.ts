import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
app.use(cors());
const port = process.env.port || 3000;

app.get('/', (req: Request, res: Response) => {
  const data = {
    success: true,
    body: {
      array: [1,2,3],
      number: 1,
      message: 'Hello, world!',
    },
  };
  res.json(data);
});

app.get('/episerver/api/example', (req: Request, res: Response) => {
  const data = {
    success: true,
    body: {
      dolbyOffLandscapeAsset: 'OFF video', // Add optimizely token here
      dolbyOffPortraitAsset: 'OFF video portrait', // Add optimizely token here
      dolbyOnLandscapeAsset: 'On video', // Remove enhanced
      dolbyOnPortraitAsset: 'On video portrait'
    },
  }
  res.json(data);
})

app.listen(port, () => {
  console.log(`[server]: Server is running on port ${port}`);
});