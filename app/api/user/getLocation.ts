import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { JWT_SECRET, PROVIDER, CONTRACT_ADDRESS } from '@/constant';
import { supabase } from '@/utils/supabase/client';

const ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'role',
        type: 'int256',
      },
    ],
    name: 'RoleAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'int256',
        name: 'role',
        type: 'int256',
      },
    ],
    name: 'addRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getRole',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const provider = new ethers.JsonRpcProvider(PROVIDER);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

async function getLocationInfo(locationId: any) {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', locationId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err: any) {
    console.error('Error fetching location information:', err.message);
    throw err;
  }
}

export default async (req: any, res: any) => {
  try {
    const { locationId } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const isRegistered = await contract.getRole(decoded.address);
    if (isRegistered.toString() === '1' || isRegistered.toString() === '2') {
      const locationInfo = await getLocationInfo(locationId);
      res.json(locationInfo);
    } else {
      res.status(403).json({ error: 'Not registered' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
