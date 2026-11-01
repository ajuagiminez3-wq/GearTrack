-- Optional test data for a NEW or EMPTY GearTrack database. Run once only.
USE geartrack;
INSERT INTO gear_items (name, brand, category_id, purchase_price, purchase_date, is_available, notes) VALUES
('Sony a7S III', 'Sony', 1, 0.00, NULL, TRUE, 'Sample inventory item'),
('24-70mm Zoom Lens', 'Sony', 2, 0.00, NULL, TRUE, 'Sample inventory item'),
('FS300C Light', 'Neewer', 3, 0.00, NULL, TRUE, 'Sample inventory item');
