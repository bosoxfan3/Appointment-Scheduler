const express = require('express');
const { VoiceResponse } = require('twilio').twiml;
const bodyParser = require('body-parser');
const flow = require('./logic/flow');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/voice', (req, res) => {
    const twiml = new VoiceResponse();
    const callSid = req.body.CallSid;
    const speechResult = req.body.SpeechResult;

    // If we received a speech response, save it and advance the step
    if (speechResult) {
        flow.saveResponse(callSid, speechResult);
        flow.advanceStep(callSid);
    }

    // Get the current question
    const step = flow.getCurrentStep(callSid);

    if (!step) {
        // If no more steps, end the call or say thanks
        const collected = flow.getCollectedData(callSid);
        twiml.say('Thank you. We have recorded your information. Goodbye!');
        console.log('Call complete. Collected data:', collected);
        flow.resetSession(callSid);
    } else {
        const gather = twiml.gather({
            input: 'speech',
            action: '/voice',
            method: 'POST',
            timeout: 5,
        });
        gather.say(step.prompt);
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
