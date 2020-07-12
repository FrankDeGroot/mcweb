'use strict'

import { select } from './select.js'

export function Versions() {
	return {
		view: vnode => select(
			'Versions',
			value => vnode.attrs.onchange(vnode.attrs.model.version = value),
			vnode.attrs.model.versions,
			vnode.attrs.model.version
		)
	}
}

