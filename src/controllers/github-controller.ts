import { Request, Response } from 'express';
import TaskModel from '../model/task-model';
import { encodeToken } from '../utils/auth';
import { catchAsync } from '../errors/catch-async';

export const githubCallback = catchAsync(async (req: Request, res: Response) => {
        if (!req.user) {
            return res.redirect('/login?error=Authentication failed');
        }
        const user = req.user as any;
        const tasks = await TaskModel.find({ forUser: user._id });

        const token = encodeToken({ id: user._id });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

        res.render('profile', { user, tasks });
})

export const githubFailure = catchAsync((req: Request, res: Response) => {
    res.redirect('/login?error=GitHub authentication failed');
})
