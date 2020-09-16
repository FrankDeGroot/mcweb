'use strict'

const errors = {
	badRequest: 'BADREQUEST',
	notFound: 'NOTFOUND',
	serverFailure: 'SERVERFAILURE',
	downloadFailed: 'DOWNLOADFAILED',
}

for (const error in errors) {
	exports[error] = errors[error]
}
exports.isCustom = err => errors[err]
