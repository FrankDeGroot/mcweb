'use strict'

const { enableAppInsights } = require('../config/config')
const { error } = require('../utils/log')

exports.enableMonitoring = () => {
  if (enableAppInsights) {
    try {
      const key = require('../../.keys').applicationInsightsInstrumentationKey
      require('applicationinsights').setup(key)
        .setSendLiveMetrics(true)
        .start()
    } catch (caught) {
      error('Error starting Application Insights', caught)
    }
  }
}
