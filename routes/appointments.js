const express = require('express');
const router = express.Router();

const { VoiceResponse } = require('twilio').twiml;

const { sendConfirmationEmail } = require('../email');

const { getCollectedData } = require('../sessionFlow');

const appointments = [
    { doctor: 'Dr. Smith', day: 'Monday', time: '9 AM' },
    { doctor: 'Dr. Lee', day: 'Tuesday', time: '2 PM' },
    { doctor: 'Dr. Jones', day: 'Friday', time: '11 AM' },
];

// to try and match how Twilio pieces text together to what I have in the data above
const normalize = (str) =>
    str
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

router.post('/', async (req, res) => {
    const twiml = new VoiceResponse();
    const callSid = req.body.CallSid;

    if (!req.body.SpeechResult) {
        twiml.say('Here are the available appointments:');

        appointments.forEach(({ doctor, day, time }, i) => {
            twiml.say(`${doctor} on ${day} at ${time}.`);
        });

        const gather = twiml.gather({
            input: 'speech',
            action: '/appointments',
            method: 'POST',
            hints: appointments.map((a) => a.doctor).join(', '), // helps speech recognition by giving it the names it might hear
        });
        gather.say('Please say the doctor and time you would like.');

        res.type('text/xml');
        res.send(twiml.toString());
        return;
    }

    // user responded — try to match their choice
    const userChoice = (req.body.SpeechResult || '').toLowerCase();

    const matched = appointments.find(({ doctor, time }) => {
        return (
            normalize(userChoice).includes(normalize(doctor)) &&
            normalize(userChoice).includes(normalize(time))
        );
    });

    if (matched) {
        twiml.say(
            `You selected ${matched.doctor} at ${matched.time} on ${matched.day}. We will send you a confirmation email shortly.`
        );

        const sessionData = getCollectedData(callSid);
        if (sessionData.email) {
            await sendConfirmationEmail(
                sessionData.email,
                sessionData.name,
                matched
            );
        }

        twiml.say('Thank you for scheduling. Goodbye!');
        twiml.hangup();
    } else {
        twiml.say("Sorry, I didn't catch that.");
        twiml.redirect('/appointments'); // repeat the prompt if we can't find a match
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

module.exports = router;
