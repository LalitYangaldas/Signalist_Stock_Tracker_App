
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
    console.log('Testing email configuration...');
    console.log('Email:', process.env.NODEMAILER_EMAIL);

    // Create transporter with your actual env variables
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    try {
        // Verify connection
        await transporter.verify();
        console.log('✅ Server is ready to take our messages');

        // Send test email
        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: 'yangaldaslalit013@gmail.com', // Send to yourself for testing
            subject: 'Test Email from StocksApp',
            html: `
                <h1>Test Email Successful! 🎉</h1>
                <p>This is a test email from your StocksApp.</p>
                <p>If you're receiving this, your email configuration is working correctly.</p>
            `,
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}

testEmail();