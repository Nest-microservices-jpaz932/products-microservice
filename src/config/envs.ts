import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    NATS_SERVERS: string[];
}

const envSchema = joi
    .object({
        PORT: joi.number().required(),
        DATABASE_URL: joi.string().required(),
        NATS_SERVERS: joi.array().items(joi.string()).required(),
    })
    .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value as EnvVars;

const {
    PORT: port = 3000,
    DATABASE_URL: databaseUrl,
    NATS_SERVERS: natsServers,
} = envVars;

export const envs = {
    port,
    databaseUrl,
    natsServers,
};
