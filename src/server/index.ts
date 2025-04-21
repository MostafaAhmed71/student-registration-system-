import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import gitRouter from './api';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('/api', gitRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 