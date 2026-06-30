CREATE TABLE `edges` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`target` text NOT NULL,
	`type` text,
	`label` text,
	FOREIGN KEY (`source`) REFERENCES `nodes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target`) REFERENCES `nodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `nodes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`position` text NOT NULL,
	`size` text NOT NULL,
	`type` text NOT NULL,
	`color` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
