const appointments = [
    { doctor: 'Dr. Smith', time: 'Monday 9 AM' },
    { doctor: 'Dr. Lee', time: 'Tuesday 2 PM' },
    { doctor: 'Dr. Jones', time: 'Friday 11 AM' },
];

app.post('/appointments', (req, res) => {
    const twiml = new VoiceResponse();

    if (!req.body.SpeechResult) {
        // First time: read appointments and gather choice
        twiml.say('Here are the available appointments:');

        appointments.forEach(({ doctor, time }, i) => {
            twiml.say(`Option ${i + 1}: ${doctor} at ${time}.`);
        });

        const gather = twiml.gather({
            input: 'speech',
            action: '/appointments',
            method: 'POST',
            hints: appointments.map((a) => a.doctor).join(', '), // helps speech recognition
        });
        gather.say('Please say the doctor and time you would like.');

        res.type('text/xml');
        res.send(twiml.toString());
        return;
    }

    // User responded — try to match their choice
    const userChoice = req.body.SpeechResult.toLowerCase();

    const matched = appointments.find(({ doctor, time }) => {
        return (
            userChoice.includes(doctor.toLowerCase()) &&
            userChoice.includes(time.toLowerCase())
        );
    });

    if (matched) {
        twiml.say(
            `You selected ${matched.doctor} at ${matched.time}. We will send you a confirmation email shortly.`
        );

        // TODO: send confirmation email here

        twiml.say('Thank you for scheduling. Goodbye!');
        twiml.hangup();
    } else {
        twiml.say("Sorry, I didn't catch that.");
        twiml.redirect('/appointments'); // Repeat prompt
    }

    res.type('text/xml');
    res.send(twiml.toString());
});
