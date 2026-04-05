import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  FRONTEND_URL: requireEnv("FRONTEND_URL", "http://localhost:5173"),
  MYSQL_HOST: requireEnv("MYSQL_HOST", "localhost"),
  MYSQL_PORT: Number(process.env.MYSQL_PORT ?? 3306),
  MYSQL_USER: requireEnv("MYSQL_USER", "root"),
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ?? "",
  MYSQL_DATABASE: requireEnv("MYSQL_DATABASE", "goprint_db"),
  BLOB_READ_WRITE_TOKEN: requireEnv("BLOB_READ_WRITE_TOKEN", "development-token"),
  AUTH_TOKEN_SECRET: requireEnv("AUTH_TOKEN_SECRET", "goprint-dev-secret")
};
