'use strict'

exports.badRequest = 'BADREQUEST'
exports.notFound = 'NOTFOUND'
exports.serverFailure = 'SERVERFAILURE'
exports.isCustom = code => code === 'BADREQUEST' || code === 'NOTFOUND' || code === 'SERVERFAILURE'
