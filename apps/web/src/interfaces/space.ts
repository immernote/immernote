export type Space = {
	id: string;
	handle: string;
	name: string;
	icon: Icon;
	settings: Settings;
	domains: string[];
	invitationToken: string | null;
	createdAt: string;
	modifiedAt: string;
	deletedAt: string | null;
};

export type Icon = {
	type: string;
	value: string;
};

export type Settings = {};
