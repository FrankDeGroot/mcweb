'use strict'

exports.badRequest = 'BADREQUEST'
exports.notFound = 'NOTFOUND'
exports.isCustom = code => code === 'BADREQUEST' || code === 'NOTFOUND'
