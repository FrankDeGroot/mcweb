export function Nav () {
  return {
    view: vnode => [
      m('nav', [
        item('#!/update', 'Update Server'),
        item('#!/change', 'Change World'),
        item('#!/create', 'Create World'),
        item('#!/gamerules', 'Gamerules'),
        item('#!/operators', 'Set Operators')
      ])
    ]
  }
}

function item (hash, name) {
  return window.location.hash === hash
    ? m('div', name)
    : m('a', {
      href: hash
    }, name)
}
