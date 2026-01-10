ALTER TABLE "markman"."bookmarks" ALTER COLUMN "browserId" SET DEFAULT -1;--> statement-breakpoint
ALTER TABLE "markman"."bookmarks" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "markman"."bookmarks" ALTER COLUMN "parentId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "markman"."bookmarks" ALTER COLUMN "pathFromRoot" DROP NOT NULL;