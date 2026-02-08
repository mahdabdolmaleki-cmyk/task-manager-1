import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import UserModel from '../model/user-model';
require('dotenv/config');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:5500/user/auth/github/callback';

passport.use(
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_CALLBACK_URL,
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                let user = await UserModel.findOne({ githubId: profile.id });

                if (user) {
                    return done(null, user);
                }

                const name = profile.displayName || profile.username || 'User';
                const nameParts = name.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || '';

                user = await UserModel.create({
                    name: firstName,
                    family: lastName,
                    email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
                    githubId: profile.id,
                    githubUsername: profile.username,
                    profilePicture: profile.photos?.[0]?.value,
                    authProvider: 'github',
                    level: 'junior'
                });

                return done(null, user);
            } catch (error: any) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error: any) {
        done(error, null);
    }
});

export default passport;
