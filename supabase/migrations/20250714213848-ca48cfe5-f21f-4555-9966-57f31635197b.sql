-- Rimuovi POI duplicati da poi_submissions che sono già in points_of_interest
DELETE FROM poi_submissions 
WHERE id IN (
  SELECT ps.id 
  FROM poi_submissions ps 
  INNER JOIN points_of_interest poi ON ps.id = poi.id
  WHERE ps.status = 'approved'
);