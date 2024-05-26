const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)

    // fallback : send 404
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

module.exports = {
    register
}