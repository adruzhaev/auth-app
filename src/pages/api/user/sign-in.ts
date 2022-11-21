import { NextApiRequest, NextApiResponse } from 'next';
import { sign, Secret } from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import { StatusCode } from '../../../constants/status-code';
import { compareSync } from 'bcryptjs';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'POST': 
            try {
                return await loginUser(req, res);
            } catch(err) {
                throw new Error('Unexpected error');
            }
        default: 
            throw new Error('Request is failed');
    }
}

async function loginUser(req: NextApiRequest, res: NextApiResponse) {
    const { body } = req;
    const token = await signJWT(body.email, 'secret');

    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        },
    });    

    if (user === null) {
        return res.status(StatusCode.NOT_FOUND).json({emailError: 'User is not found'});
    }

    if (!compareSync(body.password, user.password)) {
        return res.status(StatusCode.FORBIDDEN).json({passwordError: 'Password is incorrect'});
    }

    res.setHeader(
        'Set-Cookie',
        serialize('token', String(token), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'strict',
            path: '/'
        })
    );

    return res.status(StatusCode.OK).json({user});
}

function signJWT(email: string, secret: Secret) {
    return new Promise((resolve, reject) => {
        sign(
            {  
                email,
                iat: 1,
            },
            secret,
            {
                algorithm: 'HS256'
            },
            (err, token) => {
                if (err) {                    
                    reject(err);
                }

                resolve(token);
            }
        );
    });
}