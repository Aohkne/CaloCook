import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS,
		},
	});

	await transporter.sendMail({
		from: process.env.GMAIL_USER,
		to,
		subject,
		html: text,
	});
};

export default sendEmail;
