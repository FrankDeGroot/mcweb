'use strict'

import { ViewModel } from '../public/view_model.js'

describe('ViewModel', () => {
  it('should work', () => {
    const viewModel = new ViewModel()
    expect(viewModel.versions).toStrictEqual([])
  })
})
