export interface Email {
	id: string;
	fromName: string;
	fromAddress: string;
	subject: string;
	body: string;
	isPhish: boolean;
	/** What gives it away (for phish) or why it is fine (for legit). */
	clues: string[];
}

// All companies, people and domains are fictional.
export const emails: Email[] = [
	{
		id: 'bank',
		fromName: 'Maplebank Security',
		fromAddress: 'alerts@maplebank-secure-login.com',
		subject: 'Unusual sign-in detected: verify within 24 hours',
		body: 'We noticed a sign-in from a new device. If you do not verify your identity within 24 hours, your account will be suspended. Verify now: maplebank.com/verify',
		isPhish: true,
		clues: [
			'The sender domain is a lookalike: maplebank-secure-login.com, not maplebank.com.',
			'It creates urgency with a deadline and a threat of suspension.',
			'The link text shows the real domain, but you cannot see where it actually points.'
		]
	},
	{
		id: 'parcel',
		fromName: 'Parcelly',
		fromAddress: 'updates@parcelly.com',
		subject: 'Your order #48213 has shipped',
		body: 'Good news! Your order is on its way and should arrive Thursday. You can follow it in the Parcelly app under Orders.',
		isPhish: false,
		clues: [
			'The sender domain matches the company.',
			'It references a specific order instead of a generic "your package".',
			'It sends you to the app you already use, not to a login link.'
		]
	},
	{
		id: 'helpdesk',
		fromName: 'IT Helpdesk',
		fromAddress: 'it-support@companny-helpdesk.net',
		subject: 'Mailbox storage full: re-enter your password',
		body: 'Dear user, your mailbox has exceeded its storage limit. To avoid losing incoming mail, re-enter your password at the link below within 2 hours.',
		isPhish: true,
		clues: [
			'The domain is misspelled ("companny") and external to your company.',
			'Real IT teams never ask you to re-enter your password by email.',
			'The greeting is generic ("Dear user").'
		]
	},
	{
		id: 'share',
		fromName: 'Cloudnest',
		fromAddress: 'no-reply@cloudnest.io',
		subject: 'You shared "Q3 roadmap" with Aiko Tanaka',
		body: 'Aiko Tanaka can now edit "Q3 roadmap". You can change access at any time from the document\'s Share menu.',
		isPhish: false,
		clues: [
			'It confirms an action you just took, rather than asking you to act.',
			'No credentials, payment or urgency are involved.',
			'It points you to a menu inside the product, not to an external page.'
		]
	},
	{
		id: 'ceo',
		fromName: 'Kenji Sato (CEO)',
		fromAddress: 'kenji.sato.ceo.office@freemail.example',
		subject: 'Quick favour: are you at your desk?',
		body: "I'm in back-to-back meetings. I need you to buy five gift cards for a client today and send me the codes. Please keep this between us for now.",
		isPhish: true,
		clues: [
			'An executive writing from a personal webmail address.',
			'Gift cards are a classic untraceable payment request.',
			'It asks for secrecy, which stops you from checking with anyone.'
		]
	}
];
