import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";

const authService = new AuthService();
const userService = new UserService();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Instead of returning a token directly, you may want to return the user object or the user ID
        const user = await authService.googleOAuth(profile);
        done(null, user); // Pass the user object here, instead of a token.
      } catch (err) {
        done(err, false);
      }
    }
  )
);

// Store user ID in session
passport.serializeUser((user: any, done) => {
  done(null, user.id); // Store the user ID or a unique identifier.
});

// Retrieve user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    // Retrieve the user based on the ID stored in the session
    const user = await userService.findUserById(id);
    done(null, user); // Pass the user object to the done callback
  } catch (err) {
    done(err, null);
  }
});
