-- Public LiquidSpace listings within 25 miles of each demo city, for the Add Space listing directory.
-- Run through the Pulse connector (or the BigQuery console, project liquidspace-data-utilities) and save the
-- result as pulse-listings.csv in the project root. Then: node scripts/build-listing-directory.mjs
WITH centers AS (
  SELECT 'austin' AS city, 30.2672 AS lat, -97.7431 AS lng UNION ALL
  SELECT 'chicago', 41.8781, -87.6298 UNION ALL
  SELECT 'minneapolis', 44.9778, -93.2650 UNION ALL
  SELECT 'dallas', 32.7767, -96.7970 UNION ALL
  SELECT 'porto', 41.1579, -8.6291 UNION ALL
  SELECT 'denver', 39.7508, -104.9966 UNION ALL
  SELECT 'lisbon', 38.7223, -9.1393
)
SELECT
  c.city,
  w.WPPPermalink AS url,
  v.VenueName AS venue,
  w.WorkspaceTitle AS title,
  w.Scenario AS type,
  w.MaxCapacity AS desks,
  SAFE_CAST(NULLIF(w.MonthRate, '') AS FLOAT64) AS rate,
  ROUND(v.Latitude, 5) AS lat,
  ROUND(v.Longitude, 5) AS lng,
  FORMAT_DATE('%F', DATE(w.ModifiedDate)) AS modified,
  w.BookingMethod AS booking,
  w.MinimumTerm AS min_term
FROM `liquidspace-data-utilities.sales_ops.Workspaces` w
JOIN `liquidspace-data-utilities.sales_ops.Venues` v ON v.ID = w.VenueID
JOIN centers c
  ON ST_DISTANCE(ST_GEOGPOINT(v.Longitude, v.Latitude), ST_GEOGPOINT(c.lng, c.lat)) < 40234
WHERE w.Status = 'Public' AND w.Hidden = 'False' AND w.WPPPermalink IS NOT NULL
ORDER BY c.city, url
