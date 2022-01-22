export type User = {
	id: string;
	email: string;
	name: string;
	avatar: string;
	settings: Settings;
	confirmationToken: string | null;
	confirmationSentAt: string | null;
	invitedAt: string | null;
	confirmedAt: string | null;
	createdAt: string;
	modifiedAt: string;
	deletedAt: string | null;
};

export type Settings = {};
