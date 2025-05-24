const express = require('express');
const router = express.Router();

const { VoiceResponse } = require('twilio').twiml;

const { advanceStep, getCurrentStep, saveResponse } = require('../logic/flow');

router.post('/', async (req, res) => {
    const twiml = new VoiceResponse();
    const callSid = req.body.CallSid;
    const userResponse = req.body.SpeechResult;

    if (userResponse) {
        console.log(
            `CallSid: ${callSid} - Step: ${step.key} - User Response: ${userResponse}`
        );
        saveResponse(callSid, userResponse);
        advanceStep(callSid);
    }

    const step = getCurrentStep(callSid);

    if (step) {
        const gather = twiml.gather({
            input: 'speech',
            action: '/info',
            method: 'POST',
        });
        gather.say(step.prompt);
    } else {
        console.log('Gathered info. Redirecting to appointments.');
        twiml.redirect('/appointments');
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

module.exports = router;
