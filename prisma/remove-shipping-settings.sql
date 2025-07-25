-- Remove shipping-related settings from the database
DELETE FROM "Setting" WHERE key IN ('freeShippingLimit', 'standardShippingFee', 'expressShippingFee', 'processingTime');