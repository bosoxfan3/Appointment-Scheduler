const steps = {
    info: [
        { key: 'name', prompt: 'Please say your full name.' },
        { key: 'dob', prompt: 'What is your date of birth?' },
    ],
    insurance: [
        {
            key: 'insurancePayer',
            prompt: 'What is the name of your insurance provider?',
        },
        {
            key: 'insuranceId',
            prompt: 'Please say your insurance ID number.',
        },
    ],
    referral: [
        [
            {
                key: 'hasReferral',
                prompt: 'Do you have a referral?',
            },
            {
                key: 'referralPhysician',
                prompt: 'What is the name of the physician who referred you?',
                conditional: (data) =>
                    data.hasReferral?.toLowerCase().includes('yes'),
            },
            {
                key: 'complaint',
                prompt: 'What is the reason for your visit?',
            },
        ],
    ],
    contact: [
        {
            key: 'address',
            prompt: 'Please say your full home address, including street, city, state, and zip code.',
        },
        {
            key: 'phone',
            prompt: 'What is your phone number?',
        },
        {
            key: 'email',
            prompt: 'What is your email address?',
        },
    ],
    confirm: [
        {
            key: 'confirm',
            prompt: 'Thank you. Please wait while we find available providers and times.',
        },
    ],
};
const stepGroups = ['info', 'insurance', 'referral', 'contact', 'confirm'];

const sessions = {};

const fakeAppointments = {
    'Dr. Smith': ['Monday 9am', 'Tuesday 1pm'],
    'Dr. Lee': ['Wednesday 2pm', 'Thursday 11am'],
    'Dr. Patel': ['Friday 10am', 'Friday 3pm'],
};

function getSession(callSid) {
    if (!sessions[callSid]) {
        sessions[callSid] = {
            groupIndex: 0,
            stepIndex: 0,
            data: {},
        };
    }
    return sessions[callSid];
}

function getCurrentStep(callSid) {
    const session = getSession(callSid);
    const currentGroup = stepGroups[session.groupIndex];
    const currentStep = steps[currentGroup]?.[session.stepIndex];
    return { ...currentStep, group: currentGroup };
}

function advanceStep(callSid) {
    const session = getSession(callSid);
    const currentGroup = session.currentGroup;
    const groupSteps = steps[currentGroup];

    session.stepIndex++;

    // Skip steps with unmet conditions
    while (
        session.stepIndex < groupSteps.length &&
        groupSteps[session.stepIndex].conditional &&
        !groupSteps[session.stepIndex].conditional(session.data)
    ) {
        session.stepIndex++;
    }

    return groupSteps[session.stepIndex];
}

function saveResponse(callSid, value) {
    const session = getSession(callSid);
    const currentGroup = stepGroups[session.groupIndex];
    const currentStep = steps[currentGroup]?.[session.stepIndex];
    if (currentStep) {
        session.data[currentStep.key] = value;
    }
}

function isComplete(callSid) {
    const session = getSession(callSid);
    return session.groupIndex >= stepGroups.length;
}

function getCollectedData(callSid) {
    return getSession(callSid).data;
}

function resetSession(callSid) {
    delete sessions[callSid];
}

function getAvailableAppointments(sessionData) {
    if (sessionData.referralPhysician) {
        const doc = sessionData.referralPhysician.trim();
        if (fakeAppointments[doc]) {
            return fakeAppointments[doc];
        }
        // fallback if name doesn't match exactly
        return [];
    }
    // no referral, return all available slots for all doctors
    return Object.entries(fakeAppointments).flatMap(([doc, slots]) =>
        slots.map((slot) => `${doc}: ${slot}`)
    );
}

module.exports = {
    getSession,
    getCurrentStep,
    advanceStep,
    saveResponse,
    isComplete,
    getCollectedData,
    resetSession,
    getAvailableAppointments,
};
