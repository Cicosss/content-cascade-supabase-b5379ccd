-- Rimuovi i 6 record template dalla tabella points_of_interest
-- Questi sono i record creati il 2025-06-06 alle 05:28:16 con descrizioni generiche
DELETE FROM points_of_interest 
WHERE created_at = '2025-06-06 05:28:16.318394+00';