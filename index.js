const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));

const infoRoute = require('./routes/info');
const appointmentsRoute = require('./routes/appointments');

app.use('/info', infoRoute);
app.use('/appointments', appointmentsRoute);

app.get('/', (req, res) => res.send('Twilio Voice Intake Server'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
