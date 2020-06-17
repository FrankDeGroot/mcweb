'use strict'

export function select(onchange, list, selected) {
	return m('select', {
		onchange: onchange
	}, list.map(item => m('option', item === selected ? { selected: 'selected' } : {}, item)))
}
