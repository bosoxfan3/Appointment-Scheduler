const express = require('express');
const router = express.Router();

const { VoiceResponse } = require('twilio').twiml;

const { advanceStep, getCurrentStep, saveResponse } = require('../sessionFlow');

const { sanitizeEmailInput } = require('../email');

router.post('/', async (req, res) => {
    const twiml = new VoiceResponse();
    const callSid = req.body.CallSid;
    let userResponse = req.body.SpeechResult;

    if (userResponse) {
        const currentStep = getCurrentStep(callSid);
        if (currentStep?.key === 'email') {
            userResponse = sanitizeEmailInput(userResponse);
        }
        saveResponse(callSid, userResponse);
        advanceStep(callSid);
    }

    const step = getCurrentStep(callSid);

    if (step) {
        const gather = twiml.gather({
            input: 'speech',
            hints: 'email', // helps Twilio better recognize email input speech patterns
            action: '/info',
            method: 'POST',
        });
        gather.say(step.prompt);
    } else {
        twiml.redirect('/appointments');
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

module.exports = router;
