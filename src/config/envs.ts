import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
}

const envSchema = joi
    .object({
        PORT: joi.number().required(),
        DATABASE_URL: joi.string().required(),
    })
    .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value as EnvVars;

const { PORT: port = 3000, DATABASE_URL: databaseUrl } = envVars;

export const envs = {
    port,
    databaseUrl,
};
