-- =============================================================================
-- Seed: 20 Persona Archetypes
-- Based on validated Indian traveler research (EY, Skift, RedSeer)
-- Run AFTER 001_initial_schema.sql
-- =============================================================================

insert into public.persona_archetypes (name, persona_type, description, traits, sample_destinations)
values

-- Memory Makers (4 archetypes)
('Memory Maker — Budget Backpacker', 'memory_maker',
 'College student or fresh grad traveling with a group on a shoestring. Instagram Reels-first.',
 '{"age_range": "18-22", "budget_per_day_inr": 800, "group_size": "4-8", "booking_lead": "7-14 days", "content_goal": "go_viral"}',
 ARRAY['Rishikesh', 'Kasol', 'Mcleod Ganj', 'Hampi', 'Pondicherry']),

('Memory Maker — Offbeat Explorer', 'memory_maker',
 'Young professional who avoids mainstream spots to create unique content.',
 '{"age_range": "22-26", "budget_per_day_inr": 2000, "group_size": "2-4", "booking_lead": "14-21 days", "content_goal": "hidden_gems"}',
 ARRAY['Ziro Valley', 'Majuli', 'Khimsar', 'Gokarna', 'Chopta']),

('Memory Maker — Festival Chaser', 'memory_maker',
 'Travels specifically for festivals and cultural events — Hornbill, Rann Utsav, Pushkar.',
 '{"age_range": "20-28", "budget_per_day_inr": 2500, "group_size": "3-6", "booking_lead": "30-60 days", "content_goal": "cultural_moments"}',
 ARRAY['Pushkar', 'Rann of Kutch', 'Nagaland (Hornbill)', 'Bikaner', 'Hampi']),

('Memory Maker — Weekend Warrior', 'memory_maker',
 'Metros-based, frequent short trips (2-3 days) over weekends.',
 '{"age_range": "23-28", "budget_per_day_inr": 3000, "group_size": "2-6", "booking_lead": "3-7 days", "content_goal": "quick_reels"}',
 ARRAY['Coorg', 'Lonavala', 'Dalhousie', 'Ooty', 'Wayanad']),

-- Globe Trotters (4 archetypes)
('Globe Trotter — Bleisure Traveler', 'globe_trotter',
 'Senior professional extending business trips into leisure. Quality-first, time-poor.',
 '{"age_range": "32-42", "budget_per_day_inr": 12000, "group_size": "1-2", "booking_lead": "7-30 days", "content_goal": "polished_vlog"}',
 ARRAY['Singapore', 'Dubai', 'Bangkok', 'Colombo', 'Bali']),

('Globe Trotter — Curated Experiences', 'globe_trotter',
 'Millennial HNI seeking unique, instagrammable luxury experiences.',
 '{"age_range": "28-38", "budget_per_day_inr": 20000, "group_size": "1-4", "booking_lead": "30-90 days", "content_goal": "aspirational_content"}',
 ARRAY['Santorini', 'Maldives', 'Bhutan', 'Bali', 'Rajasthan (luxury)']),

('Globe Trotter — Solo Female Traveler', 'globe_trotter',
 'Independent professional traveling solo, sharing safety tips and inspiration.',
 '{"age_range": "26-38", "budget_per_day_inr": 5000, "group_size": "1", "booking_lead": "21-45 days", "content_goal": "inspire_and_inform"}',
 ARRAY['Kerala', 'Hampi', 'Udaipur', 'Goa', 'Southeast Asia']),

('Globe Trotter — Digital Nomad', 'globe_trotter',
 'Remote worker combining work and travel, staying 2-4 weeks per destination.',
 '{"age_range": "25-35", "budget_per_day_inr": 4000, "group_size": "1", "booking_lead": "0-7 days", "content_goal": "lifestyle_content"}',
 ARRAY['Goa', 'Rishikesh', 'McLeod Ganj', 'Chiang Mai', 'Tbilisi']),

-- Novice Travelers (3 archetypes)
('Novice — First Solo Trip', 'novice',
 'Late 20s first-timer planning their debut independent trip. Anxious, needs guidance.',
 '{"age_range": "20-26", "budget_per_day_inr": 1200, "group_size": "1", "booking_lead": "30-60 days", "content_goal": "document_for_self", "primary_lang": "Hindi"}',
 ARRAY['Rishikesh', 'Manali', 'Agra', 'Jaipur', 'Amritsar']),

('Novice — Tier-2 City First-Timer', 'novice',
 'Young professional from a smaller city planning their first trip beyond their home state.',
 '{"age_range": "22-30", "budget_per_day_inr": 1000, "group_size": "2-4", "booking_lead": "21-45 days", "content_goal": "whatsapp_sharing", "primary_lang": "Hindi"}',
 ARRAY['Goa', 'Mumbai', 'Delhi', 'Varanasi', 'Shimla']),

('Novice — Package Tour Graduate', 'novice',
 'Moved from group tours to independent planning for the first time.',
 '{"age_range": "28-38", "budget_per_day_inr": 3000, "group_size": "2-4", "booking_lead": "30-60 days", "content_goal": "document_progress"}',
 ARRAY['Andaman', 'Coorg', 'Rajasthan', 'Kerala', 'Northeast India']),

-- Religious Pilgrims (3 archetypes)
('Pilgrim — Char Dham Devotee', 'pilgrim',
 'Family planning the sacred Char Dham yatra — highly researched, senior-inclusive.',
 '{"age_range": "40-65", "budget_per_day_inr": 3000, "group_size": "3-8", "booking_lead": "45-90 days", "content_goal": "family_memory"}',
 ARRAY['Badrinath', 'Kedarnath', 'Gangotri', 'Yamunotri', 'Haridwar']),

('Pilgrim — South India Temple Circuit', 'pilgrim',
 'Traveling through Tamil Nadu and Andhra temple towns — organized, community-oriented.',
 '{"age_range": "35-70", "budget_per_day_inr": 2000, "group_size": "5-20", "booking_lead": "30-60 days", "content_goal": "devotional_sharing", "primary_lang": "Tamil"}',
 ARRAY['Tirupati', 'Madurai', 'Rameswaram', 'Kanchipuram', 'Chidambaram']),

('Pilgrim — Evolving Pilgrim', 'pilgrim',
 'Younger generation combining pilgrimage with adventure and leisure.',
 '{"age_range": "25-40", "budget_per_day_inr": 2500, "group_size": "2-6", "booking_lead": "21-45 days", "content_goal": "instagram_with_reverence"}',
 ARRAY['Kedarnath trek', 'Varanasi', 'Amritsar', 'Rishikesh', 'Shirdi']),

-- Expedition Seekers (3 archetypes)
('Expedition Seeker — Himalayan Trekker', 'expedition',
 'Serious trekker building toward high-altitude routes. Detailed pre-trip researcher.',
 '{"age_range": "22-35", "budget_per_day_inr": 4000, "group_size": "4-12", "booking_lead": "60-120 days", "content_goal": "achievement_documentary"}',
 ARRAY['Roopkund', 'Hampta Pass', 'Kedarkantha', 'Chadar', 'Goecha La']),

('Expedition Seeker — Bike Rider', 'expedition',
 'Motorcycle enthusiast building toward Leh-Ladakh or Spiti. Part of biking communities.',
 '{"age_range": "24-38", "budget_per_day_inr": 5000, "group_size": "4-10", "booking_lead": "30-60 days", "content_goal": "epic_riding_content"}',
 ARRAY['Leh-Ladakh', 'Spiti Valley', 'Zanskar', 'Meghalaya', 'Arunachal Pradesh']),

('Expedition Seeker — Wildlife Enthusiast', 'expedition',
 'Safari and birding enthusiast. Methodical, educational content creator.',
 '{"age_range": "28-50", "budget_per_day_inr": 8000, "group_size": "2-6", "booking_lead": "45-90 days", "content_goal": "nature_education"}',
 ARRAY['Jim Corbett', 'Ranthambore', 'Kaziranga', 'Bandipur', 'Sundarbans']),

-- Family Orchestrators (3 archetypes)
('Family Orchestrator — Young Parents', 'family',
 'Couple with children under 10 planning family-friendly holidays.',
 '{"age_range": "30-40", "budget_per_day_inr": 8000, "group_size": "3-5", "booking_lead": "30-60 days", "content_goal": "family_memories"}',
 ARRAY['Coorg', 'Ooty', 'Shimla', 'Goa', 'Kerala']),

('Family Orchestrator — Multi-Gen Planner', 'family',
 'Planning trips for parents + kids spanning 3 generations. Comfort-first, train-preferring.',
 '{"age_range": "35-50", "budget_per_day_inr": 6000, "group_size": "5-10", "booking_lead": "45-90 days", "content_goal": "document_for_album"}',
 ARRAY['Rajasthan', 'Agra', 'Darjeeling', 'Munnar', 'Varanasi']),

('Family Orchestrator — School Holiday Planner', 'family',
 'Timing all travel around school vacations — summer, Diwali, Christmas, Pongal.',
 '{"age_range": "32-45", "budget_per_day_inr": 5000, "group_size": "3-6", "booking_lead": "30-45 days", "content_goal": "shareable_family_moments"}',
 ARRAY['Manali', 'Goa', 'Andaman', 'Sikkim', 'Uttarakhand']);
