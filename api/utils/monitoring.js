'use strict'

const { error } = require('../utils/log')

exports.enableMonitoring = enableAppInsights => {
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
