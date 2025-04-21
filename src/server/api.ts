import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = express.Router();

router.get('/git', async (req: Request, res: Response) => {
  try {
    const { command } = req.query;
    
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'يجب تحديد الأمر' });
    }

    // التحقق من أن الأمر هو أمر Git مسموح به
    const allowedCommands = ['add', 'commit', 'push'];
    const commandParts = command.split(' ');
    if (!allowedCommands.includes(commandParts[0])) {
      return res.status(403).json({ error: 'أمر غير مسموح به' });
    }

    const { stdout, stderr } = await execAsync(`git ${command}`);
    
    if (stderr) {
      console.warn('Git warning:', stderr);
    }

    res.json({ success: true, output: stdout });
  } catch (error) {
    console.error('Git error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تنفيذ الأمر' });
  }
});

export default router; 