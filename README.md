# Appointment Scheduler

## Overview

This is a Node.js and Express-based voice application that collects patient information, offers available appointment slots, and sends confirmation emails. It uses:

-   Twilio Voice API for telephony and speech recognition
-   SendGrid for sending confirmation emails
-   Express.js for the server and routing

## Features

-   Multi-step voice interaction collecting patient name, email, and reason for visit
-   Reads available appointment slots and lets users select via speech
-   Sends confirmation emails to patients with appointment details
-   Session management to track call progress and user responses

## Setup

## Prerequisites

-   Node.js and npm installed
-   A Twilio phone number with voice webhook configured
-   A SendGrid account and verified sender email
-   ngrok or public URL to expose your local server (for Twilio webhooks)

Once you have those, create a .env file:

```
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Running the App

1. node index.js
2. ngrok http 3000
3. Set your Twilio voice webhook URL to https://your-ngrok-url/info
4. Call your Twilio number

## How It Works

1. User calls the Twilio number.
2. The /info route collects name, email, and reason for visit via speech.
3. After collecting info, the call redirects to /appointments where available slots are read.
4. User selects appointment by speaking.
5. Confirmation email is sent using SendGrid.
6. Call ends.

## Future Improvements

-   Add address collection and validation.
-   Add referral question with conditional flow.
-   Improve appointment matching with fuzzy string logic.
-   Add persistent database storage.
-   Better error handling and retries.

## ✍️ Author

Built by [Daniel Acquesta](https://danielacquesta.dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
