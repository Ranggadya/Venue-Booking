ALTER TABLE "event_bookings" RENAME COLUMN "event_date" TO "start_date";

ALTER TABLE "event_bookings" ADD COLUMN "end_date" DATE;

UPDATE "event_bookings"
SET "end_date" = "start_date"
WHERE "end_date" IS NULL;

ALTER TABLE "event_bookings" ALTER COLUMN "end_date" SET NOT NULL;
