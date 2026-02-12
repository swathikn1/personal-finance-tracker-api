import express from 'express'
import type { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('TypeScript With Express!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
