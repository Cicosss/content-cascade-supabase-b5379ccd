
-- Aggiungi policy per permettere agli utenti autenticati di inserire POI
CREATE POLICY "Allow authenticated users to insert POI"
  ON points_of_interest
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Aggiungi policy per permettere agli utenti autenticati di aggiornare POI
CREATE POLICY "Allow authenticated users to update POI"
  ON points_of_interest
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Aggiungi policy per permettere agli utenti autenticati di eliminare POI
CREATE POLICY "Allow authenticated users to delete POI"
  ON points_of_interest
  FOR DELETE
  TO authenticated
  USING (true);
