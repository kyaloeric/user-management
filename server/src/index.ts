import express from "express";
import passport from "passport";
import session from "express-session";
import { ApolloServer } from "@apollo/server"; // Updated import
import { expressMiddleware } from "@apollo/server/express4"; // New import
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AuthService } from "./services/AuthService";
import { UserResolver } from "./resolvers/UserResolver";
import { RoleResolver } from "./resolvers/RoleResolver";
import { AuthResolver } from "./resolvers/AuthResolver";
import cors from 'cors'; // New import
import { json } from 'body-parser'; // New import
import { AppDataSource } from "./dataSource";
import { seedDatabase } from "./helper";
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

async function startApolloServer() {
  await AppDataSource.initialize();
  await seedDatabase();
  
  const schema = await buildSchema({
    resolvers: [UserResolver, RoleResolver, AuthResolver],
    authChecker: ({ context: { user } }) => {return !!user;},
    emitSchemaFile: path.resolve(__dirname, "migration/schema/schema.graphql"),

  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
        let user: any;

        if (token) {
          try {
            user = jwt.verify(token, JWT_SECRET);
          } catch (error) {
            console.error("Invalid token", error);
          }
        }

        return { req, user };
      },
    }),
  );

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
}

startApolloServer().catch((error) => {
  console.error("Error starting Apollo Server:", error);
});

// Google OAuth 2.0 routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/graphql" }),
  (req, res) => {
    const user = req.user as any; 
    if (!user) {
      return res.redirect("/graphql");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.redirect("/graphql");
  }
);

app.post("/login", express.json(), async (req, res) => {
  const { email, password } = req.body;

  try {
    const authService = new AuthService(); 
    const token = await authService.login(email, password);
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});