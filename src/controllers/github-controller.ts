import { Request, Response } from 'express';
import { TaskModel } from '../model/task-model';
import { encodeToken } from '../utils/auth';
import { catchAsync } from '../errors/catch-async';
import logger from '../utils/logger';

export const githubCallback = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        logger.warn('githubCallback failed')
        return res.redirect('/login?error=Authentication failed');
    }
    const user = req.user as any;
    const tasks = await TaskModel.find({ forUser: user._id });

    const token = encodeToken({ id: user._id });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    logger.info(`user ${user.name} loged in with github`)
    res.render('profile', { user, tasks });
})

export const githubFailure = catchAsync((req: Request, res: Response) => {
    logger.warn('githubFailure failed')

    res.redirect('/login?error=GitHub authentication failed');
})
