const express = require('express');
const router = express.Router();

const { VoiceResponse } = require('twilio').twiml;

const { advanceStep, saveResponse } = require('../logic/flow');

router.post('/', (req, res) => {
    const callSid = req.body.CallSid;
    const userResponse = req.body.SpeechResult;
    const twiml = new VoiceResponse();

    if (userResponse) {
        saveResponse(callSid, userResponse);
    }

    const nextStep = advanceStep(callSid);

    if (nextStep && nextStep.group === 'info') {
        const gather = twiml.gather({
            input: 'speech',
            action: '/info',
            method: 'POST',
        });
        gather.say(nextStep.prompt);
    } else {
        twiml.redirect('/insurance');
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

module.exports = router;
