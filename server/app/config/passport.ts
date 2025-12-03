import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { db } from "../models/index.js";

const User = db.User;
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findByEmail(profile.emails![0]!.value);

                if (!user) {
                    user = new User({
                        email: profile.emails?.[0]?.value,
                        name: profile.displayName,
                        google_id: profile.id,
                        password_hash: null
                    });
                    await user.save();
                } else if (!user.google_id) {
                    user.google_id = profile.id;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err as Error);
            }
        })
);
