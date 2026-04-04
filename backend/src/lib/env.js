import dotenv from "dotenv";
dotenv.config();

const requireEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const env = {
    PORT: Number(process.env.PORT) || 5000,
    MONGO_URL: requireEnv("MONGO_URL"),
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: requireEnv("JWT_SECRET"),
    RESEND_API_KEY: requireEnv("RESEND_API_KEY"),
    EMAIL_FROM: requireEnv("EMAIL_FROM"),
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "Messenger",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
    CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),
    ARCJET_KEY: requireEnv("ARCJET_KEY"),
    ARCJET_ENV: requireEnv("ARCJET_ENV"),    
}
