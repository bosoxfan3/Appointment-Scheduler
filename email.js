require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// helper to try and parse different styles of email voice responses
// aka most people sat "dot gmail"
// also tries to handle if someone spells their email letter by letter
function sanitizeEmailInput(speechText) {
    return speechText
        .toLowerCase()
        .replace(/\s*(at)\s*/gi, '@')
        .replace(/\s*(dot)\s*/gi, '.')
        .replace(/\s+/g, ''); // removes extra spaces like "b o b"
}

async function sendConfirmationEmail(toEmail, patientName, appointment) {
    const msg = {
        to: toEmail,
        from: 'acquesta.appointments@gmail.com',
        subject: 'Appointment Confirmation',
        text: `Hi ${patientName},\n\nYour appointment with ${appointment.doctor} at ${appointment.time} on ${appointment.day} is confirmed.\n\nThank you!`,
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sanitizeEmailInput, sendConfirmationEmail };
