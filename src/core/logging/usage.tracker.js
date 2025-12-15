// Usage tracking for AI provider calls (in-memory)

const sessions = new Map(); // sessionId -> session data
const summaries = new Map(); // identity -> summary data

/**
 * Start a usage tracking session
 * @param {Object} params - Session parameters
 * @param {string} params.identity - User/identity identifier (default: "local-dev")
 * @param {string} params.provider - Provider name (e.g., "OPENAI", "GEMINI")
 * @param {string} params.task - Task type (e.g., "TEXT_GENERATION")
 * @returns {string} Session ID
 */
function startUsageSession({ identity = 'local-dev', provider, task }) {
  if (!provider || typeof provider !== 'string') {
    throw new Error('Provider must be a non-empty string');
  }
  if (!task || typeof task !== 'string') {
    throw new Error('Task must be a non-empty string');
  }

  const sessionId = `${identity}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();

  sessions.set(sessionId, {
    identity,
    provider,
    task,
    startTime,
    endTime: null,
    inputChars: 0,
    outputChars: 0,
    tokensIn: null,
    tokensOut: null,
    ms: 0,
    success: false
  });

  return sessionId;
}

/**
 * End a usage tracking session
 * @param {string} sessionId - Session ID from startUsageSession
 * @param {Object} metrics - Session metrics
 * @param {number} metrics.inputChars - Input character count (default: 0)
 * @param {number} metrics.outputChars - Output character count (default: 0)
 * @param {number|null} metrics.tokensIn - Input token count (optional)
 * @param {number|null} metrics.tokensOut - Output token count (optional)
 * @param {number} metrics.ms - Duration in milliseconds (default: calculated from startTime)
 * @param {boolean} metrics.success - Whether the call succeeded (default: true)
 */
function endUsageSession(sessionId, {
  inputChars = 0,
  outputChars = 0,
  tokensIn = null,
  tokensOut = null,
  ms = 0,
  success = true
} = {}) {
  const session = sessions.get(sessionId);
  if (!session) {
    return; // Session not found, ignore
  }

  const endTime = Date.now();
  const duration = ms > 0 ? ms : (endTime - session.startTime);

  session.endTime = endTime;
  session.inputChars = inputChars;
  session.outputChars = outputChars;
  session.tokensIn = tokensIn;
  session.tokensOut = tokensOut;
  session.ms = duration;
  session.success = success;

  // Update summary for this identity
  const identity = session.identity;
  if (!summaries.has(identity)) {
    summaries.set(identity, {
      byProvider: new Map(),
      byTask: new Map(),
      totalSessions: 0,
      totalInputChars: 0,
      totalOutputChars: 0,
      totalTokensIn: 0,
      totalTokensOut: 0,
      totalMs: 0,
      successfulSessions: 0,
      failedSessions: 0
    });
  }

  const summary = summaries.get(identity);
  summary.totalSessions++;
  summary.totalInputChars += inputChars;
  summary.totalOutputChars += outputChars;
  if (tokensIn !== null) summary.totalTokensIn += tokensIn;
  if (tokensOut !== null) summary.totalTokensOut += tokensOut;
  summary.totalMs += duration;
  if (success) {
    summary.successfulSessions++;
  } else {
    summary.failedSessions++;
  }

  // Update by provider
  const providerKey = session.provider;
  if (!summary.byProvider.has(providerKey)) {
    summary.byProvider.set(providerKey, {
      sessions: 0,
      inputChars: 0,
      outputChars: 0,
      tokensIn: 0,
      tokensOut: 0,
      ms: 0,
      successful: 0,
      failed: 0
    });
  }
  const providerStats = summary.byProvider.get(providerKey);
  providerStats.sessions++;
  providerStats.inputChars += inputChars;
  providerStats.outputChars += outputChars;
  if (tokensIn !== null) providerStats.tokensIn += tokensIn;
  if (tokensOut !== null) providerStats.tokensOut += tokensOut;
  providerStats.ms += duration;
  if (success) {
    providerStats.successful++;
  } else {
    providerStats.failed++;
  }

  // Update by task
  const taskKey = session.task;
  if (!summary.byTask.has(taskKey)) {
    summary.byTask.set(taskKey, {
      sessions: 0,
      inputChars: 0,
      outputChars: 0,
      tokensIn: 0,
      tokensOut: 0,
      ms: 0,
      successful: 0,
      failed: 0
    });
  }
  const taskStats = summary.byTask.get(taskKey);
  taskStats.sessions++;
  taskStats.inputChars += inputChars;
  taskStats.outputChars += outputChars;
  if (tokensIn !== null) taskStats.tokensIn += tokensIn;
  if (tokensOut !== null) taskStats.tokensOut += tokensOut;
  taskStats.ms += duration;
  if (success) {
    taskStats.successful++;
  } else {
    taskStats.failed++;
  }
}

/**
 * Get usage summary for an identity
 * @param {Object} params - Query parameters
 * @param {string} params.identity - Identity identifier (default: "local-dev")
 * @returns {Object} Usage summary with totals grouped by provider and task
 */
function getUsageSummary({ identity = 'local-dev' } = {}) {
  const summary = summaries.get(identity);
  if (!summary) {
    return {
      identity,
      byProvider: {},
      byTask: {},
      totalSessions: 0,
      totalInputChars: 0,
      totalOutputChars: 0,
      totalTokensIn: 0,
      totalTokensOut: 0,
      totalMs: 0,
      successfulSessions: 0,
      failedSessions: 0
    };
  }

  // Convert Maps to plain objects for JSON serialization
  const byProvider = {};
  for (const [provider, stats] of summary.byProvider.entries()) {
    byProvider[provider] = { ...stats };
  }

  const byTask = {};
  for (const [task, stats] of summary.byTask.entries()) {
    byTask[task] = { ...stats };
  }

  return {
    identity,
    byProvider,
    byTask,
    totalSessions: summary.totalSessions,
    totalInputChars: summary.totalInputChars,
    totalOutputChars: summary.totalOutputChars,
    totalTokensIn: summary.totalTokensIn,
    totalTokensOut: summary.totalTokensOut,
    totalMs: summary.totalMs,
    successfulSessions: summary.successfulSessions,
    failedSessions: summary.failedSessions
  };
}

module.exports = {
  startUsageSession,
  endUsageSession,
  getUsageSummary
};
