const events = {
  fetchMethods: {
    topic: 'FETCH_METHODS',
    responseTopic: 'FETCHED_METHODS',
  },
  createAttempt: {
    topic: 'CREATE_ATTEMPT',
    responseTopic: 'CREATED_ATTEMPT',
  },
  completedAuth: {
    topic: 'COMPLETED_PROVIDER_AUTH_FLOW',
  },
  userData: {
    topic: 'EMIT_USER_DATA_RAW',
  },
}

export default events
