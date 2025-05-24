require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationEmail(toEmail, patientName, appointment) {
    const msg = {
        to: toEmail,
        from: 'acquesta.appointments@gmail.com',
        subject: 'Appointment Confirmation',
        text: `Hi ${patientName},\n\nYour appointment with ${appointment.doctor} at ${appointment.time} is confirmed.\n\nThank you!`,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendConfirmationEmail };
