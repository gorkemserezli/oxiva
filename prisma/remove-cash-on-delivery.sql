-- Update paymentMethods to remove cashOnDelivery option
UPDATE "Setting" 
SET value = jsonb_set(
  value::jsonb, 
  '{creditCard,bankTransfer}', 
  '{"creditCard": true, "bankTransfer": false}'::jsonb
)
WHERE key = 'paymentMethods';