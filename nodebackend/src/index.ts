import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3011;

// Enable CORS so your React frontend can access this server
app.use(cors());
app.use(express.json());


// but does this bad boy serve the react static files from the build folder? 
// why? when the react app does that?
app.use(express.static('build')); // thanks copilot. todo: tr

// Sample API route
app.get('/api/message', (req: Request, res: Response) => {
  res.json({ text: 'Hello from the TypeScript Node backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running smoothly on http://localhost:${PORT}`);
});
