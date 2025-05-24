const steps = [
    { key: 'name', prompt: 'Please say your full name.' },
    {
        key: 'email',
        prompt: 'What is your email address?',
    },
    {
        key: 'complaint',
        prompt: 'What is the reason for your visit?',
    },
];

const sessions = {};

function getSession(callSid) {
    if (!sessions[callSid]) {
        sessions[callSid] = {
            stepIndex: 0,
            data: {},
        };
    }
    return sessions[callSid];
}

function getCurrentStep(callSid) {
    const session = getSession(callSid);
    return steps[session.stepIndex];
}

function advanceStep(callSid) {
    const session = getSession(callSid);
    session.stepIndex++;
    return steps[session.stepIndex];
}

function saveResponse(callSid, value) {
    const session = getSession(callSid);
    const currentStep = steps[session.stepIndex];
    if (currentStep) {
        session.data[currentStep.key] = value;
    }
}

function isComplete(callSid) {
    const session = getSession(callSid);
    return session.stepIndex >= steps.length - 1;
}

function getCollectedData(callSid) {
    return getSession(callSid).data;
}

function resetSession(callSid) {
    delete sessions[callSid];
}

module.exports = {
    getSession,
    getCurrentStep,
    advanceStep,
    saveResponse,
    isComplete,
    getCollectedData,
    resetSession,
};
