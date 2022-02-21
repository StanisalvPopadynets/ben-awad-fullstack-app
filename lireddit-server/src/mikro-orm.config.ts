import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post, User } from "./entities";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: "lireddit",
  user: "postgres",
  password: "postgres",
  debug: !__prod__,
  type: "postgresql",
  entities: [Post, User],
} as Parameters<typeof MikroORM.init>[0];
