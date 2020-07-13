'use strict'

export function select(title, onchange, list, selected) {
	return m(polythene.List, {
		header: { title },
		tiles: list.map(title => m(polythene.ListTile, {
			title,
			selected: selected === title,
			className: "themed-list-tile",
			events: {
				onclick: () => onchange(title)
			},
			rounded: true,
			compact: true,
			hoverable: true,
			insetH: true,
		}))
	})
}
