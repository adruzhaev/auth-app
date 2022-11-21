import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCode } from '../../../constants/status-code';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'POST': 
            try {
                return await logoutUser(req, res);
            } catch(err) {
                throw new Error('Unexpected error');
            }
        default: 
            throw new Error('Request is failed');
    }
}

async function logoutUser(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader(
      'Set-Cookie',
      serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0),
        sameSite: 'strict',
        path: '/'
      })
    );

    return res.status(StatusCode.OK).json({message: "User is successfully logged out"});
}
