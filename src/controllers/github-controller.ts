import { Request, Response } from 'express';
import UserModel from '../model/user-model';
import TaskModel from '../model/task-model';
import { encodeToken } from '../utils/auth';

export const githubCallback = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.redirect('/login?error=Authentication failed');
        }

        const user = req.user as any;
        const tasks = await TaskModel.find({ forUser: user._id });

        const token = encodeToken({ id: user._id });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

        res.render('profile', { user, tasks });
    } catch (error: any) {
        res.status(500).render('login', { status: 'Authentication error occurred' });
    }
};

export const githubFailure = (req: Request, res: Response) => {
    res.redirect('/login?error=GitHub authentication failed');
};
