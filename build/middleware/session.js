import session from 'express-session';
import redis from 'redis';
import RedisStore from 'connect-redis';
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "timetrackerApp:",
});
const sessionSetup = (secret) => {
    if (!secret) {
        throw new Error('Error in sessionSetup: session secret is undefined');
    }
    const sessionOptions = {
        store: redisStore,
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            // maxAge: 1000 * 60 * 60 *24,
            httpOnly: true,
            sameSite: 'none',
        }
    };
    return session(sessionOptions);
};
export { sessionSetup };
