import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/constant';

export default async (req: any, res: any) => {
  const address = req.body.address;
  if (!address) {
    return res.status(400).json({
      error: 'Wallet address is required',
    });
  }

  const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1d' });

  res.json({ token });
};
