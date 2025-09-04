import { getSession } from 'next-auth/react';
import { getServerSession } from "next-auth/next";
import prisma from '../../../lib/prisma';
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {

    /* doesn't work cause idk why
    doesn't get fuill context of session and returns null, even when logged in ( api/auth/session returns proper object with proper user details) */

    //const session = await getSession({req});

    const session = await getServerSession(req, res, authOptions);

    console.log(session);

    if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, content } = req.body;

    const result = await prisma.post.create({
        data: {
            title: title,
            content: content,
            author: { 
                connect: {
                    email: session.user.email
                }
            }
        }
    });

    res.json(result);
}