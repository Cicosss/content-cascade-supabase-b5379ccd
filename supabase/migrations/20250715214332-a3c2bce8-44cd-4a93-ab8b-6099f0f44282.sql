-- Delete remaining template POI records from points_of_interest table
DELETE FROM points_of_interest 
WHERE created_at = '2025-06-06 05:28:16.671985+00'
AND id IN (
  '6be94a70-9d80-45b6-8b0f-0632fb0b1bbe',  -- Osteria del Borgo Antico
  '133f098f-582d-4048-bc54-0d901a625580',  -- Casa di Giulietta Romagnola
  'aad4a827-1c1a-4157-8705-5c298420066d',  -- Aquafan
  '390bcc02-01d2-49f8-8822-a41a5c4bdc1d',  -- Grotte di Onferno (template)
  '48dd10ae-dc56-4840-aa69-6106a9e2ceb1',  -- La Vera Piadineria 1952
  'e08ad801-050f-4cf2-b9f8-1c1d6c6eb9fd'   -- Tempio Malatestiano
);