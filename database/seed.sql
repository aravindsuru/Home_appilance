-- ============================================================
-- GK Services Appliance Repairs — Seed Data
-- Database Layer: PostgreSQL / Supabase
-- ============================================================

INSERT INTO public.service_requests 
  (mobile_number, appliance_type, brand, appliance_age, customer_name, customer_area, problem_description, preferred_contact_time, status, admin_notes, is_spam)
VALUES
  ('9876543210', 'Washing Machine', 'LG', '2–3 years', 'Rahul Sharma', 'Madhapur', 'Drum not spinning during spin cycle. Making loud grinding noise.', 'Morning (9 AM - 12 PM)', 'New', '', false),
  ('9849012345', 'Refrigerator', 'Samsung', '1–2 years', 'Priya Reddy', 'Kukatpally', 'Freezer is working fine but lower fridge section is not cooling.', 'Afternoon (12 PM - 4 PM)', 'Contacted', 'Called customer. Scheduled visit for tomorrow morning.', false),
  ('9701234567', 'Washing Machine', 'IFB', '3–5 years', 'Suresh Kumar', 'Gachibowli', 'Water leakage from the front door during wash cycle.', 'Evening (4 PM - 8 PM)', 'Service Scheduled', 'Assigned technician Ramesh (Technician ID #12).', false),
  ('9988776655', 'Refrigerator', 'Whirlpool', '5–7 years', 'Anitha Devi', 'Banjara Hills', 'Compressor making constant clicking sound and turns off after 5 seconds.', 'Anytime', 'Completed', 'Replaced starter relay capacitor with genuine Whirlpool part. 90-day warranty issued.', false),
  ('9123456789', 'Washing Machine', 'Bosch', 'Less than 1 year', 'Vikram Varma', 'Jubilee Hills', 'Error code E18 displayed on digital screen. Water not draining.', 'Morning (9 AM - 12 PM)', 'New', '', false),
  ('9000112233', 'Refrigerator', 'Godrej', 'More than 7 years', 'Venkat Rao', 'Ameerpet', 'Heavy ice accumulation on back wall and door gasket is loose.', 'Afternoon (12 PM - 4 PM)', 'Cancelled', 'Customer repaired via local electrician before arrival.', false);
