const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));

const infoRoute = require('./routes/info');
const appointmentsRoute = require('./routes/appointments');

app.use('/info', infoRoute);
app.use('/appointments', appointmentsRoute);

app.get('/', (req, res) => res.send('Twilio Voice Intake Server'));

const PORT = process.env.PORT || 8080; // railway default is 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
