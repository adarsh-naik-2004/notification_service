import { config } from 'dotenv'
config()

export const Config = {
    kafka: {
        broker: process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : [''],
        sasl: {
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD,
        },
    },

    frontend: {
        clienturl: process.env.FRONTEND_CLIENT_URL,
    },

    mail: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            password: process.env.MAIL_PASSWORD,
        },
        from: process.env.MAIL_FROM,
    },

    env: {
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    port:{
        server: process.env.PORT
    }
}
