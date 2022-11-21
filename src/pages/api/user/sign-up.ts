import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { hashSync } from 'bcryptjs';
import { StatusCode } from '../../../constants/status-code';
import { RegExpPattern } from '../../../constants/reg-exp-pattern';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'POST':
            try {
                return await createUser(req, res);
            } catch(err) {
                throw new Error('Unexpected error');
            }
        default: 
            throw new Error('Request is failed');
    }
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
    const { body } = req;
    
    const userInDatabase = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    });

    if (userInDatabase !== null) {
        return res.status(StatusCode.BAD_REQUEST).json({emailError: 'This email is already registered.'});
    }

    if (!RegExp(RegExpPattern.EMAIL).test(body.email as string)) {
        return res.status(StatusCode.BAD_REQUEST).json({emailError: 'Email should be typed correctly.'});
    }

    try {
        await prisma.user.create({
            data: {
                ...body,
                password: hashSync(body.password, 10)
            }
        });

        return res.status(StatusCode.CREATED).json({success: 'User is created successfully.'});
    } catch(err) {
        return res.status(StatusCode.BAD_REQUEST).json({error: 'User is not created'});
    }
}
