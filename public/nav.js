const menu = [
  { hash: '#!/update', name: 'Update Server' },
  { hash: '#!/change', name: 'Change World' },
  { hash: '#!/create', name: 'Create World' },
  { hash: '#!/gamerules', name: 'Gamerules' },
  { hash: '#!/operators', name: 'Set Operators' }
]

export function nav () {
  return _`<nav>${menu.map(item)}</nav>`
}

function item ({ hash, name }) {
  return window.location.hash === hash
    ? _`<div>${name}</div>`
    : _`<a href=${hash}>${name}</a>`
}
