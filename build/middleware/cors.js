const getCorsSetupper = (ALLOWED_ORIGIN) => {
    if (!ALLOWED_ORIGIN) {
        console.log("ALLOWED_ORIGIN defaulted to '*'");
        ALLOWED_ORIGIN = '*';
    }
    return (req, res, next) => {
        res.header(`Access-Control-Allow-Origin`, `${ALLOWED_ORIGIN}`);
        res.header(`Access-Control-Allow-Methods`, `POST`);
        res.header(`Access-Control-Allow-Headers`, `Content-Type`);
        next();
    };
};
export { getCorsSetupper, };
