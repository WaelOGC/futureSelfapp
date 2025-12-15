// Single source of truth for development status
// Used by bootstrap, run-ai-task, and dashboard

let DEV_STATUS = {
  envReady: false,
  openaiReady: false,
  lastTest: null // "OK" | "FAILED" | null
};

function setEnvReady(value) {
  DEV_STATUS.envReady = value;
}

function setOpenaiReady(value) {
  DEV_STATUS.openaiReady = value;
}

function setLastTest(value) {
  DEV_STATUS.lastTest = value;
}

function getStatus() {
  return { ...DEV_STATUS };
}

module.exports = {
  DEV_STATUS,
  setEnvReady,
  setOpenaiReady,
  setLastTest,
  getStatus
};
