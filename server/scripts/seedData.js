require('dotenv').config({ path: '../.env' });
const { connectDB } = require('../config/db');
const Site = require('../models/Site');

const sites = [
  {
    name: 'Brihadeeswarar Temple',
    slug: 'brihadeeswarar-temple',
    also_known_as: ['Big Temple', 'Peruvudaiyar Kovil'],
    location: { city: 'Thanjavur', state: 'Tamil Nadu', country: 'India', lat: 10.7828, lng: 79.1318 },
    category: 'Temple',
    dynasty_or_period: 'Chola dynasty, 11th century CE',
    year_built: '1010 CE',
    built_by: 'Raja Raja Chola I',
    architectural_style: 'Dravidian',
    historical_background: 'Built by Raja Raja Chola I in 1010 CE, this temple stood as the tallest structure in India at the time. It is the pinnacle of Chola architecture and engineering.',
    cultural_significance: 'A UNESCO World Heritage Site and living temple, it symbolises the artistic and imperial peak of the Chola dynasty. Daily rituals have continued unbroken for over 1000 years.',
    architectural_highlights: [
      '66-metre vimana — tallest in the world when built',
      'Shadow of the vimana never falls on the ground at noon',
      'Monolithic Nandi bull weighing 25 tonnes',
      '108 Shiva lingam shrines along the perimeter wall',
      'Chola-era murals under later Nayaka paintings',
    ],
    images:[
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop'
    ],
    legends_and_stories: 'Raja Raja Chola received divine guidance in a dream to build this temple. The capstone weighing 80 tonnes was placed using a ramp built several kilometres long from a nearby village.',
    virtual_tour_links: [
      { url: 'https://www.youtube.com/watch?v=H0M_hBBwCOQ', type: 'youtube', label: 'Aerial drone view' },
      { url: 'https://artsandculture.google.com/story/brihadeeswarar-temple', type: 'arts', label: 'Google Arts tour' },
    ],
    virtual_tour_hotspots: [
      { name: 'Main gopuram', description: 'The iconic 66-metre entrance tower covered in intricate carvings of celestial beings.' },
      { name: 'Nandi mandapam', description: 'Giant monolithic Nandi bull, one of the largest in South India, carved from a single rock.' },
      { name: 'Inner sanctum', description: 'The main Shiva lingam shrine at the heart of the temple complex.' },
    ],
    visitor_info: {
      timings: '6:00 AM – 12:30 PM, 4:00 PM – 8:30 PM',
      entry_fee: 'Free for all',
      best_time_to_visit: 'October to March',
      how_to_reach: 'Thanjavur railway station 3 km away. Auto-rickshaws available.',
      accessibility: 'Wheelchair access at main entrance. Steps inside mandapam.',
    },
    nearby_sites: ['Gangaikonda Cholapuram', 'Airavatesvara Temple', 'Saraswathi Mahal Library'],
    conservation_status: 'UNESCO protected',
    data_source: 'database',
  },
  {
    name: 'Hampi',
    slug: 'hampi',
    also_known_as: ['Vijayanagara', 'City of Ruins'],
    location: { city: 'Hampi', state: 'Karnataka', country: 'India', lat: 15.335, lng: 76.462 },
    category: 'Ruins',
    dynasty_or_period: 'Vijayanagara Empire, 14th–16th century CE',
    year_built: '1336 CE',
    built_by: 'Harihara I and Bukka Raya I',
    architectural_style: 'Vijayanagara',
    historical_background: 'Hampi was the capital of the Vijayanagara Empire. At its peak in the 15th century it was the second-largest city in the world with over 500,000 inhabitants.',
    cultural_significance: 'A UNESCO World Heritage Site, Hampi is sacred as the mythological Kishkindha from the Ramayana where Hanuman was born.',
    architectural_highlights: [
      'Stone chariot at Vittala Temple — symbol of Karnataka',
      'Musical pillars producing distinct Carnatic notes',
      'Elephant stables with Indo-Islamic dome architecture',
      'Stepped royal tank used for ceremonial bathing',
      'Virupaksha Temple — active for over 1300 years',
    ],
    legends_and_stories: 'Hampi is believed to be Kishkindha from the Ramayana. Matanga Hill is where sage Matanga cursed Vali. The river Tungabhadra is said to be the place where Sita dropped her ornaments while being carried away by Ravana.',
    virtual_tour_links: [
      { url: 'https://www.youtube.com/watch?v=hampi_example', type: 'youtube', label: 'Hampi ruins walkthrough' },
    ],
    virtual_tour_hotspots: [
      { name: 'Vittala Temple', description: 'Home to the iconic stone chariot and the famous musical pillars.' },
      { name: 'Virupaksha Temple', description: 'The oldest and most sacred shrine, still actively worshipped today.' },
    ],
    visitor_info: {
      timings: 'Open all day (monuments: 6 AM – 6 PM)',
      entry_fee: '₹40 Indians, ₹600 foreigners',
      best_time_to_visit: 'October to February',
      how_to_reach: 'Nearest railway: Hospet (13 km). Regular buses from Bengaluru.',
      accessibility: 'Uneven rocky terrain. Not wheelchair friendly.',
    },
    nearby_sites: ['Badami Cave Temples', 'Pattadakal', 'Aihole'],
    conservation_status: 'UNESCO protected',
    data_source: 'database',
  },
  {
    name: 'Ajanta Caves',
    slug: 'ajanta-caves',
    also_known_as: ['Ajanta Rock-cut Caves'],
    location: { city: 'Aurangabad', state: 'Maharashtra', country: 'India', lat: 20.5519, lng: 75.7033 },
    category: 'Cave',
    dynasty_or_period: '2nd century BCE to 6th century CE',
    year_built: '2nd century BCE',
    built_by: 'Buddhist monks and royal patrons',
    architectural_style: 'Rock-cut Buddhist',
    historical_background: 'The Ajanta Caves are 30 rock-cut Buddhist cave monuments carved between the 2nd century BCE and 480 CE. They were abandoned and forgotten until rediscovered by a British officer in 1819.',
    cultural_significance: 'A UNESCO World Heritage Site, the caves contain some of the finest surviving examples of ancient Indian art, including murals, sculptures, and frescoes depicting the life of Buddha.',
    architectural_highlights: [
      '30 caves cut entirely from basalt rock',
      'Murals depicting Jataka tales in vibrant mineral pigments',
      'Cave 26 contains a giant reclining Buddha',
      'Cave 1 has the famous Bodhisattva Padmapani painting',
      'Intricate pillared halls called chaityas and viharas',
    ],
    legends_and_stories: 'A British hunting party led by Captain John Smith accidentally discovered these caves in 1819 while hunting tigers. Smith scratched his name on Cave 10, which can still be seen today.',
    virtual_tour_links: [
      { url: 'https://www.youtube.com/watch?v=ajanta_example', type: 'youtube', label: 'Ajanta cave walkthrough' },
    ],
    virtual_tour_hotspots: [
      { name: 'Cave 1', description: 'Contains the famous Bodhisattva Padmapani mural, one of the greatest paintings in the ancient world.' },
      { name: 'Cave 26', description: 'Houses a magnificent 7-metre reclining Buddha with exquisitely carved details.' },
    ],
    visitor_info: {
      timings: '9:00 AM – 5:30 PM (closed Mondays)',
      entry_fee: '₹40 Indians, ₹600 foreigners',
      best_time_to_visit: 'November to March',
      how_to_reach: 'Aurangabad airport 100 km. State buses and taxis from Aurangabad.',
      accessibility: 'Steep paths and stairs. Limited wheelchair access.',
    },
    nearby_sites: ['Ellora Caves', 'Daulatabad Fort', 'Bibi Ka Maqbara'],
    conservation_status: 'UNESCO protected',
    data_source: 'database',
  },
];

async function seed() {
  await connectDB();
  await Site.deleteMany({});
  await Site.insertMany(sites);
  console.log(`✓ Seeded ${sites.length} sites`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); }); 