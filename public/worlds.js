'use strict'

import { select } from './select.js'

export function Worlds() {
	return {
		view: vnode => select(
			'Worlds',
			value => vnode.attrs.onchange(vnode.attrs.model.world = value),
			vnode.attrs.model.worlds,
			vnode.attrs.model.world
		)
	}
}
