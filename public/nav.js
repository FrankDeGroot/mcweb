'use strict'

export function Nav () {
  return {
    view: vnode => [
      m('nav', [
        item('#!/update', 'Update Server'),
        item('#!/change', 'Change World'),
        item('#!/create', 'Create World'),
        item('#!/ops', 'Set Operators')
      ])
    ]
  }
}

function item (hash, name) {
  return m(window.location.hash === hash ? 'div' : 'a', {
    href: hash
  }, name)
}
