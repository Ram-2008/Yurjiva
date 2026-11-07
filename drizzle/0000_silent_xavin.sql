CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`sender` text NOT NULL,
	`created` integer NOT NULL,
	`payload` text NOT NULL
);
