const steps = [
    { key: 'name', prompt: 'Please say your full name.' },
    { key: 'dob', prompt: 'What is your date of birth?' },
    {
        key: 'insurancePayer',
        prompt: 'What is the name of your insurance provider?',
    },
    { key: 'insuranceId', prompt: 'Please say your insurance ID number.' },
    {
        key: 'referral',
        prompt: 'Do you have a referral? If so, to which physician?',
    },
    { key: 'complaint', prompt: 'What is the reason for your visit?' },
    {
        key: 'address',
        prompt: 'Please say your full home address, including street, city, and zip code.',
    },
    { key: 'phone', prompt: 'What is your phone number?' },
    { key: 'email', prompt: 'You may optionally provide your email address.' },
    {
        key: 'confirm',
        prompt: 'Thank you. Please wait while we find available providers and times.',
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
