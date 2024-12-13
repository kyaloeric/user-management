// import "reflect-metadata";
// import { DataSource } from "typeorm";
// import { User } from "./entities/User";
// import { Role } from "./entities/Role";
// import 'dotenv/config';
// import { DB_CONFIG } from "./config";


// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || '5432', 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   synchronize: true, 
//   logging: true, 
//   entities: [
//     User,
//     Role
//   ],
//   migrations: [
//     "src/migration/**/*.ts"
//   ],
//   subscribers: [],
// });




import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Role } from "./entities/Role";
import { CONFIG } from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: CONFIG.database.host,
  port: CONFIG.database.port,
  username: CONFIG.database.username,
  password: CONFIG.database.password,
  database: CONFIG.database.database,
  synchronize: true, 

  // synchronize: CONFIG.server.nodeEnv === 'development',
  logging: CONFIG.server.nodeEnv === 'development',
  entities: [User, Role],
  migrations: ["src/migration/**/*.ts"],
  subscribers: [],
});
