-- =============================================================================
-- Seed: 30 starter destinations (expand to 150 before launch)
-- Run AFTER 001_initial_schema.sql
-- =============================================================================

insert into public.destinations (name, state, lat, lng, description, tags, best_months, avg_budget_low, avg_budget_high, difficulty, permits_required, permit_info)
values

('Ladakh', 'Jammu & Kashmir', 34.1526, 77.5771,
 'High-altitude desert plateau — iconic for bike expeditions, Pangong Lake, and Nubra Valley.',
 ARRAY['adventure','bike','photography','altitude'], ARRAY[6,7,8,9], 3000, 8000, 'hard', true,
 'Inner Line Permit (ILP) required for Nubra Valley, Pangong Tso, and Dha-Hanu. Available online.'),

('Spiti Valley', 'Himachal Pradesh', 32.2464, 78.0337,
 'Cold desert mountain valley with ancient monasteries and dramatic landscapes.',
 ARRAY['adventure','photography','spiritual','offbeat'], ARRAY[6,7,8,9,10], 2000, 5000, 'hard', false, null),

('Rishikesh', 'Uttarakhand', 30.0869, 78.2676,
 'Adventure capital of India — yoga, whitewater rafting, bungee jumping.',
 ARRAY['adventure','spiritual','yoga','wellness'], ARRAY[2,3,4,9,10,11], 1500, 4000, 'easy', false, null),

('Manali', 'Himachal Pradesh', 32.2396, 77.1887,
 'Mountain resort town — gateway to Rohtang Pass, Solang Valley.',
 ARRAY['adventure','snow','honeymoon','trekking'], ARRAY[1,2,3,6,7,8,9,10], 2000, 6000, 'easy', false, null),

('Goa', 'Goa', 15.2993, 74.1240,
 'India''s beach capital — parties, seafood, Portuguese heritage, water sports.',
 ARRAY['beach','nightlife','water_sports','cultural'], ARRAY[11,12,1,2,3], 2000, 8000, 'easy', false, null),

('Varanasi', 'Uttar Pradesh', 25.3176, 82.9739,
 'One of the world''s oldest cities — sacred ghats, Ganga Aarti, spiritual energy.',
 ARRAY['spiritual','cultural','photography','pilgrimage'], ARRAY[10,11,12,1,2,3], 1200, 3500, 'easy', false, null),

('Coorg', 'Karnataka', 12.3375, 75.8069,
 'Coffee and spice plantation hills — romantic, misty, family-friendly.',
 ARRAY['nature','family','honeymoon','coffee'], ARRAY[10,11,12,1,2,3,4], 2500, 6000, 'easy', false, null),

('Andaman Islands', 'Andaman & Nicobar', 11.7401, 92.6586,
 'Pristine beaches, crystal-clear water, world-class diving.',
 ARRAY['beach','diving','snorkeling','nature'], ARRAY[10,11,12,1,2,3,4,5], 3000, 8000, 'easy', false, null),

('Hampi', 'Karnataka', 15.3350, 76.4600,
 'UNESCO World Heritage — Vijayanagara Empire ruins in a surreal boulder landscape.',
 ARRAY['cultural','history','photography','offbeat'], ARRAY[10,11,12,1,2,3], 1000, 3000, 'easy', false, null),

('Kedarkantha Trek', 'Uttarakhand', 31.0280, 78.1637,
 'One of India''s most popular winter treks — summit at 12,500 ft with panoramic views.',
 ARRAY['trekking','snow','adventure','winter'], ARRAY[12,1,2,3,4], 1500, 3000, 'moderate', false, null),

('Darjeeling', 'West Bengal', 27.0360, 88.2627,
 'Queen of hill stations — toy train, tea gardens, Kanchenjunga views.',
 ARRAY['nature','tea','family','photography'], ARRAY[3,4,5,9,10,11], 2000, 5000, 'easy', false, null),

('Jaipur', 'Rajasthan', 26.9124, 75.7873,
 'Pink City — forts, palaces, bazaars, street food, Rajput heritage.',
 ARRAY['cultural','history','photography','family'], ARRAY[10,11,12,1,2,3], 1500, 5000, 'easy', false, null),

('Udaipur', 'Rajasthan', 24.5854, 73.7125,
 'City of Lakes — royal palaces, Lake Pichola, romantic sunsets.',
 ARRAY['romantic','cultural','photography','luxury'], ARRAY[10,11,12,1,2,3], 2000, 8000, 'easy', false, null),

('Munnar', 'Kerala', 10.0889, 77.0595,
 'High-altitude tea plantations — misty valleys, waterfalls, wildlife.',
 ARRAY['nature','tea','honeymoon','family'], ARRAY[9,10,11,12,1,2], 2000, 5000, 'easy', false, null),

('Kerala Backwaters', 'Kerala', 9.4981, 76.3388,
 'Houseboat cruises through tranquil lagoons, canals, and rice paddies.',
 ARRAY['nature','houseboat','honeymoon','family'], ARRAY[9,10,11,12,1,2], 3000, 10000, 'easy', false, null),

('Ziro Valley', 'Arunachal Pradesh', 27.5930, 93.8302,
 'Offbeat valley of the Apatani tribe — lush rice fields, folk music festival.',
 ARRAY['offbeat','cultural','nature','tribal'], ARRAY[9,10,3,4,5], 2000, 4000, 'moderate', true,
 'Inner Line Permit (ILP) required for Arunachal Pradesh. Apply at state borders.'),

('Rann of Kutch', 'Gujarat', 23.7337, 70.8022,
 'Great White Desert — annual Rann Utsav festival, salt flats, stargazing.',
 ARRAY['photography','festival','offbeat','nature'], ARRAY[11,12,1,2], 2000, 5000, 'easy', false, null),

('Roopkund Trek', 'Uttarakhand', 30.2627, 79.7314,
 'Mysterious skeleton lake trek at 16,499 ft — one of India''s most dramatic high-altitude routes.',
 ARRAY['trekking','adventure','altitude','nature'], ARRAY[5,6,7,8,9], 2000, 4000, 'hard', false, null),

('Pushkar', 'Rajasthan', 26.4899, 74.5511,
 'Sacred lake town — Brahma temple, camel fair, bohemian market.',
 ARRAY['spiritual','cultural','photography','offbeat'], ARRAY[10,11,12,1,2,3], 1500, 4000, 'easy', false, null),

('Majuli', 'Assam', 26.9500, 94.1667,
 'World''s largest river island — Vaishnavite monasteries, mask-making traditions.',
 ARRAY['offbeat','cultural','nature','tribal'], ARRAY[10,11,12,1,2,3], 1500, 3000, 'easy', false, null),

('Meghalaya', 'Meghalaya', 25.4670, 91.3662,
 'Abode of clouds — living root bridges, cleanest village, waterfalls, caves.',
 ARRAY['nature','offbeat','adventure','photography'], ARRAY[10,11,12,1,2,3,4], 2000, 5000, 'moderate', false, null),

('Pondicherry', 'Puducherry', 11.9416, 79.8083,
 'French Riviera of the East — colonial architecture, beaches, Sri Aurobindo Ashram.',
 ARRAY['beach','cultural','spiritual','history'], ARRAY[10,11,12,1,2,3,4], 1500, 5000, 'easy', false, null),

('Tirupati', 'Andhra Pradesh', 13.6288, 79.4192,
 'One of the world''s most visited pilgrimage sites — Venkateswara Swamy Temple.',
 ARRAY['pilgrimage','spiritual'], ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 1000, 3000, 'easy', false, null),

('Vaishno Devi', 'Jammu & Kashmir', 32.9883, 74.9550,
 'Sacred cave shrine of Goddess Vaishno — 12km trek through mountains.',
 ARRAY['pilgrimage','trekking','spiritual'], ARRAY[3,4,5,8,9,10], 1500, 4000, 'moderate', false, null),

('Jim Corbett National Park', 'Uttarakhand', 29.5300, 78.7747,
 'India''s oldest national park — Bengal tigers, elephants, over 600 bird species.',
 ARRAY['wildlife','safari','nature','photography'], ARRAY[11,12,1,2,3,4,5,6], 4000, 12000, 'easy', false, null),

('Ranthambore', 'Rajasthan', 26.0173, 76.5026,
 'Premier tiger reserve with medieval fort backdrop — one of India''s best wildlife spots.',
 ARRAY['wildlife','safari','photography','history'], ARRAY[10,11,12,1,2,3,4,5,6], 3000, 10000, 'easy', false, null),

('Kasol', 'Himachal Pradesh', 32.0100, 77.3200,
 'Backpacker village in Parvati Valley — trekking, cafes, Kheerganga.',
 ARRAY['backpacker','trekking','offbeat','nature'], ARRAY[3,4,5,6,9,10,11], 1000, 3000, 'moderate', false, null),

('Ooty', 'Tamil Nadu', 11.4102, 76.6950,
 'Queen of the Nilgiris — toy train, rose garden, tea estates, family-friendly.',
 ARRAY['nature','family','tea','honeymoon'], ARRAY[3,4,5,9,10,11,12], 1500, 4000, 'easy', false, null),

('Amritsar', 'Punjab', 31.6340, 74.8723,
 'Golden Temple, Wagah Border, Punjabi food — deeply spiritual and patriotic.',
 ARRAY['spiritual','pilgrimage','food','cultural'], ARRAY[10,11,12,1,2,3], 1200, 3500, 'easy', false, null),

('Chopta', 'Uttarakhand', 30.4800, 79.2200,
 'Mini Switzerland of Uttarakhand — Tungnath trek, rhododendron forests, snow.',
 ARRAY['trekking','offbeat','nature','photography'], ARRAY[3,4,5,6,10,11], 1500, 3000, 'moderate', false, null);
