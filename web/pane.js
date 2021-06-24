import { nav } from './nav.js'

export function pane (content, messages) {
  return _`${nav()}<main>${content}${messages}</main>`
}
