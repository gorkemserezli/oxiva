-- Remove shipping-related settings
DELETE FROM "Setting" WHERE key IN (
  'freeShippingLimit', 
  'standardShippingFee', 
  'expressShippingFee', 
  'processingTime'
);

-- Remove notification settings
DELETE FROM "Setting" WHERE key = 'notifications';

-- Remove cashOnDelivery from paymentMethods
UPDATE "Setting" 
SET value = jsonb_set(
  value::jsonb, 
  '{}', 
  '{"creditCard": true, "bankTransfer": false}'::jsonb
)
WHERE key = 'paymentMethods' 
AND value::jsonb ? 'cashOnDelivery';

-- List remaining settings for verification
SELECT key, value FROM "Setting" ORDER BY key;