-- Seed Data for Recycling Facilities
INSERT INTO public.recycling_facilities (
  id, name, address, city, state, pincode, latitude, longitude, accepted_materials, contact, source_url, is_verified, verified_at, facility_type, operating_hours, notes
) VALUES 
(
  'fac-saahas-bangalore',
  'Saahas Zero Waste Resource Recovery Center',
  'Survey No. 49/2, Doddakannelli, Sarjapur Road',
  'Bengaluru',
  'Karnataka',
  '560035',
  12.9121,
  77.6891,
  ARRAY['plastic', 'paper_cardboard', 'e_waste', 'textile', 'glass', 'metal'],
  '+91 80 4168 9389',
  'https://saahaszerowaste.com',
  TRUE,
  '2026-03-15',
  'specialist_dropoff',
  'Mon-Sat: 09:30 AM - 05:30 PM',
  'Accepts segregated household dry waste, MLP, and electronics.'
),
(
  'fac-karo-sambhav-delhi',
  'Karo Sambhav Authorized E-Waste Collection Hub',
  'Okhla Industrial Area Phase-II',
  'New Delhi',
  'Delhi',
  '110020',
  28.5355,
  77.2718,
  ARRAY['e_waste', 'hazardous', 'metal'],
  '1800 2121 454',
  'https://www.karosambhav.com',
  TRUE,
  '2026-04-01',
  'specialist_dropoff',
  'Mon-Fri: 10:00 AM - 06:00 PM',
  'PRO authorized e-waste dismantling partner.'
),
(
  'fac-paperman-chennai',
  'Paperman Circular Foundation Hub',
  '12, 1st Cross Street, Karpagam Avenue, R.A. Puram',
  'Chennai',
  'Tamil Nadu',
  '600028',
  13.0242,
  80.2589,
  ARRAY['paper_cardboard', 'plastic', 'metal', 'glass'],
  '+91 80150 80150',
  'https://www.paperman.in',
  TRUE,
  '2026-02-10',
  'ngo',
  'Mon-Sat: 09:00 AM - 06:00 PM',
  'Community collection partner across Chennai.'
);
