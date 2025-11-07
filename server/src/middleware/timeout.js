export function timeout(seconds = 30) {
    const ms = seconds * 1000;

    return (req, res, next) => {
        // Set timeout for the request
        res.setTimeout(ms, () => {
            res.status(408).json({
                error: 'Request timeout',
                code: 'REQUEST_TIMEOUT',
                details: `Request exceeded ${seconds} second limit`
            });
        });

        next();
    };
}