'use strict'

export function Updater() {
	return {
		view: vnode => m('span', [
			m(polythene.Button, {
				label: 'Update Release',
				events: {
					onclick: e => vnode.attrs.onupdateversion('release'),
				},
			}),
			m(polythene.Button, {
				label: 'Update Snapshot',
				events: {
					onclick: e => vnode.attrs.onupdateversion('snapshot'),
				},
			}),
		])
	}
}
