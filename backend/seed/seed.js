const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const VendorProfile = require('../models/VendorProfile');
const Service = require('../models/Service');
const Package = require('../models/Package');
const Enquiry = require('../models/Enquiry');
const Review = require('../models/Review');
const Favourite = require('../models/Favourite');

const categoriesData = [
  {
    name: 'Photographers',
    slug: 'photographers',
    description: 'Candid wedding, pre-wedding, maternity, and event photographers capturing life\'s magical moments.',
    icon: 'Camera',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    displayOrder: 1,
  },
  {
    name: 'Videographers',
    slug: 'videographers',
    description: 'Cinematic wedding films, teasers, 4K multi-cam coverage, and live broadcast streaming.',
    icon: 'Video',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    displayOrder: 2,
  },
  {
    name: 'Caterers',
    slug: 'caterers',
    description: 'Gourmet Indian, Continental, live counters, Mughlai feasts, and custom culinary spreads.',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    displayOrder: 3,
  },
  {
    name: 'Decorators',
    slug: 'decorators',
    description: 'Floral mandaps, whimsical fairy light canopies, theme stages, and contemporary backdrops.',
    icon: 'Palette',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    displayOrder: 4,
  },
  {
    name: 'Makeup Artists',
    slug: 'makeup-artists',
    description: 'HD bridal makeup, airbrush styling, groom grooming, party looks, and celebrity hair couture.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    displayOrder: 5,
  },
  {
    name: 'Mehendi Artists',
    slug: 'mehendi-artists',
    description: 'Intricate Rajasthani, Arabic, portrait, organic henna designs with dark, rich stains.',
    icon: 'Hand',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    displayOrder: 6,
  },
  {
    name: 'DJs and Music Providers',
    slug: 'djs-and-music',
    description: 'Electrifying Bollywood DJs, live acoustic bands, Punjabi dhol, and state-of-the-art concert sound.',
    icon: 'Music',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    displayOrder: 7,
  },
  {
    name: 'Wedding Planners',
    slug: 'wedding-planners',
    description: 'Turnkey luxury wedding coordination, guest hospitality, destination logistics, and vendor curation.',
    icon: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    displayOrder: 8,
  },
  {
    name: 'Event Planners',
    slug: 'event-planners',
    description: 'End-to-end planning for birthdays, anniversaries, corporate milestones, and private soirees.',
    icon: 'CalendarCheck',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    displayOrder: 9,
  },
  {
    name: 'Venues',
    slug: 'venues',
    description: 'Royal palaces, heritage forts, beach resorts, banquet halls, and open-air lush lawns.',
    icon: 'Building2',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    displayOrder: 10,
  },
  {
    name: 'Event Management Companies',
    slug: 'event-management',
    description: 'Large-scale concert production, sound & light trussing, conferences, and college festival management.',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    displayOrder: 11,
  },
  {
    name: 'Entertainment Providers',
    slug: 'entertainment-providers',
    description: 'Celebrity anchors, standup comedians, magicians, fire performers, and choreographers.',
    icon: 'PartyPopper',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    displayOrder: 12,
  },
];

const sampleVendorsData = [
  {
    userName: 'Karan Mehra',
    userEmail: 'karan.lens@eventease.com',
    userPhone: '+91 98201 12345',
    businessName: 'Lumiere Wedding Stories',
    tagline: 'Timeless moments captured with soul and cinematic grandeur',
    categorySlugs: ['photographers', 'videographers'],
    city: 'Mumbai',
    address: 'Bandra West, Mumbai, Maharashtra',
    startingPrice: 45000,
    experienceYears: 7,
    rating: 4.9,
    reviewCount: 48,
    isApproved: true,
    availabilityStatus: 'available',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    description: 'Lumiere Wedding Stories is an award-winning photography collective specializing in candid wedding storytelling, aerial drone visuals, and heirloom photo books. Having documented over 300 luxury weddings across India and Europe, we blend photojournalistic instinct with fine art aesthetics.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        title: 'Grand Royal Sangeet',
        caption: 'High energy dance celebrations captured under golden ambient chandeliers.',
      },
      {
        url: 'https://images.unsplash.com/photo-1519225424933-cb1d31c62f25?auto=format&fit=crop&w=800&q=80',
        title: 'Emotional Varmala Exchange',
        caption: 'Gentle teary-eyed moments between bride and groom as rose petals shower.',
      },
      {
        url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
        title: 'Sun-drenched Pre-Wedding',
        caption: 'Romantic beach sunset golden hour portraiture in Goa.',
      },
    ],
    packages: [
      {
        name: 'Silver Celebration Package',
        price: 45000,
        duration: '1 Day (8 Hours)',
        description: 'Ideal for intimate weddings, engagements, or cocktail soirees.',
        features: ['1 Traditional Photographer', '1 Candid Specialist', '300 High-Res Processed Photos', 'Online Digital Cloud Gallery'],
      },
      {
        name: 'Royal Heritage Gold Package',
        price: 95000,
        duration: '2 Days (Full Coverage)',
        description: 'Comprehensive 2-day wedding & sangeet photo + cinematic teaser.',
        isPopular: true,
        features: ['2 Candid Photographers', '1 Drone Pilot', '1 4K Cinematic Videographer', '3-5 Min Teaser Video', 'Designer Coffee Table Album (40 Pages)'],
      },
      {
        name: 'Platinum Destination Odyssey',
        price: 175000,
        duration: '3 Days Multi-Event',
        description: 'Unlimited coverage across Haldi, Mehendi, Sangeet, Wedding, and Reception.',
        features: ['Complete 5-Person Crew', 'Same-Day Edit Video Reel', 'Ultra 4K Drone Footage', '2 Premium Leather Albums', 'Raw Master Hard Drive Delivered'],
      },
    ],
    services: [
      {
        name: 'Candid Wedding Photography',
        price: 35000,
        pricingUnit: 'per day',
        description: 'Spontaneous, unposed shots capturing genuine emotions throughout the day.',
        deliverables: ['Full day coverage', 'Color-graded soft copies', 'Within 14 days delivery'],
      },
      {
        name: 'Cinematic Teaser & Highlight Film',
        price: 40000,
        pricingUnit: 'per event',
        description: '4K film reel set to licensed music capturing key speeches and rituals.',
        deliverables: ['3-5 minute 4K video', 'Social media 60-sec reel', 'Licensed audio'],
      },
    ],
  },
  {
    userName: 'Ananya Sharma',
    userEmail: 'ananya.decor@eventease.com',
    userPhone: '+91 98112 55432',
    businessName: 'Petals & Props Decor Studio',
    tagline: 'Transforming venues into enchanting wonderland dreamscapes',
    categorySlugs: ['decorators', 'wedding-planners'],
    city: 'Delhi',
    address: 'Hauz Khas Enclave, New Delhi',
    startingPrice: 60000,
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 62,
    isApproved: true,
    availabilityStatus: 'available',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    description: 'Petals & Props is a bespoke event design firm known for grand floral architecture, sustainable stage elements, and whimsical lighting designs. We design for celebrity weddings, elite corporate galas, and festive housewarmings with obsessive attention to symmetry, fragrance, and palette harmony.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        title: 'Glasshouse Botanical Mandap',
        caption: 'Overhanging wisteria and brass bells framing sunset vows.',
      },
      {
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
        title: 'Pastel Boho Mehendi Setup',
        caption: 'Pampas grass, macrame cushions, and marigold canopy accents.',
      },
    ],
    packages: [
      {
        name: 'Classic Elegance Decor',
        price: 60000,
        duration: 'Single Evening',
        description: 'Stage backdrop, photo booth, and welcome sign for engagements or birthdays.',
        features: ['Flower Arch Entryway', 'LED Neon Sign Board', 'Stage Floral Pillars', 'Cocktail Table Centerpieces'],
      },
      {
        name: 'Grand Royal Wedding Theme',
        price: 150000,
        duration: 'Wedding Ceremony',
        description: 'Immersive mandap, pathway lights, and floral tunnel entry.',
        isPopular: true,
        features: ['Lotus Water Mandap Design', 'Fairy Light Tunnel (50 Ft)', 'Imported Fresh Orchid Accents', 'Groom & Bride Royal Thrones'],
      },
    ],
    services: [
      {
        name: 'Floral Mandap & Stage Styling',
        price: 75000,
        pricingUnit: 'per event',
        description: 'Customized thematic mandap styling featuring fresh blooms and architectural fabrics.',
        deliverables: ['3D concept mockup', 'Fresh flower sourcing', 'Complete set up and teardown'],
      },
    ],
  },
  {
    userName: 'Chef Vikramaditya Roy',
    userEmail: 'vikram.catering@eventease.com',
    userPhone: '+91 97400 88211',
    businessName: 'The Royal Feast Gourmet Caterers',
    tagline: 'Artisanal culinary journeys from Awadhi royal kitchens to Mediterranean tables',
    categorySlugs: ['caterers'],
    city: 'Bengaluru',
    address: 'Indiranagar 100ft Road, Bengaluru, Karnataka',
    startingPrice: 1200,
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 94,
    isApproved: true,
    availabilityStatus: 'available',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=300&q=80',
    description: 'Headed by master chefs with Michelin training, The Royal Feast serves bespoke culinary experiences across tech summits, grand marriages, and milestone celebrations. We offer live pasta wheels, slow-dum biryanis, organic sushi bars, and artisanal dessert stations.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        title: 'Signature Awadhi Dawat',
        caption: 'Slow-cooked Dum Biryanis and Galouti Kebabs with warqi parathas.',
      },
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        title: 'Modern European Live Counter',
        caption: 'Parmesan wheel risotto and live woodfired sourdough flatbreads.',
      },
    ],
    packages: [
      {
        name: 'Silver Buffet Spread',
        price: 1200,
        duration: 'Per Plate (Min 100 Guests)',
        description: 'Delightful 3-course Indian spread with live chaat and hot jalebis.',
        features: ['3 Welcome Mocktails', '4 Starters (Veg & Non-Veg)', '7 Main Courses', '3 Desserts with Live Kulfi'],
      },
      {
        name: 'Gold Royal Banquet Buffet',
        price: 1950,
        duration: 'Per Plate (Min 150 Guests)',
        description: 'Multi-cuisine extravaganza with international and Indian royal fare.',
        isPopular: true,
        features: ['Live Sushi & Dimsum Counter', 'Awadhi Nizami Biryani Station', 'Live Pasta in Parmesan Wheel', 'Molecular Liquid Nitrogen Desserts'],
      },
    ],
    services: [
      {
        name: 'Full Wedding Catering Management',
        price: 1500,
        pricingUnit: 'per plate',
        description: 'Uniformed service staff, cutlery, crockery, live cooking stations, and hygiene protocols.',
        deliverables: ['Custom tasting session', 'Service staff & captain', 'Complete cleanup'],
      },
    ],
  },
  {
    userName: 'Simran Khurana',
    userEmail: 'simran.mua@eventease.com',
    userPhone: '+91 98722 34110',
    businessName: 'Glow Couture by Simran',
    tagline: 'Subtle elegance, radiant glass-skin finishes, and bespoke bridal hair',
    categorySlugs: ['makeup-artists'],
    city: 'Jaipur',
    address: 'C-Scheme, Jaipur, Rajasthan',
    startingPrice: 18000,
    experienceYears: 6,
    rating: 5.0,
    reviewCount: 35,
    isApproved: true,
    availabilityStatus: 'available',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    description: 'Certified by London Academy of Makeup, Simran specializes in signature radiant glass-skin bridal looks that photograph effortlessly from sunrise pheras to moonlit receptions. Using only premium luxury brands (Dior, Charlotte Tilbury, Tom Ford), she ensures comfort and enduring elegance.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
        title: 'Dewy Royalty Bridal Look',
        caption: 'Soft nude lips and rose gold eyelids complementing heritage lehenga.',
      },
    ],
    packages: [
      {
        name: 'Cocktail & Party Glam',
        price: 18000,
        duration: 'Single Session',
        description: 'Stunning evening glam with hair styling, eyelash application, and draping.',
        features: ['HD Makeup Application', 'Intricate Hair Styling', 'Lashes & Lenses', 'Saree / Dupatta Draping'],
      },
      {
        name: 'Royal Bridal Master Package',
        price: 35000,
        duration: 'Bridal Day Event',
        description: 'Comprehensive bridal transformation with pre-bridal skin prep.',
        isPopular: true,
        features: ['Airbrush or Luxury HD', 'Real Floral Hair Design', 'Jewellery & Veil Setting', 'Touchup Kit for Evening'],
      },
    ],
    services: [
      {
        name: 'Bridal HD & Airbrush Makeup',
        price: 30000,
        pricingUnit: 'per event',
        description: 'Flawless 18-hour waterproof makeup for brides.',
        deliverables: ['Dior/Huda Beauty products', 'Hair extensions styling', 'Draping assistance'],
      },
    ],
  },
  {
    userName: 'DJ Aryan Varma',
    userEmail: 'dj.aryan@eventease.com',
    userPhone: '+91 99302 77889',
    businessName: 'Electrowave Sounds & DJ Aryan',
    tagline: 'High-octane club beats, Bollywood remixes, and festival concert sound',
    categorySlugs: ['djs-and-music', 'entertainment-providers'],
    city: 'Mumbai',
    address: 'Andheri West, Mumbai, Maharashtra',
    startingPrice: 35000,
    experienceYears: 8,
    rating: 4.8,
    reviewCount: 52,
    isApproved: true,
    availabilityStatus: 'available',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    description: 'Electrowave Sounds delivers concert-grade audio experiences for high-profile sangeets, college fests, and corporate annual summits. Featuring JBL line arrays, cold pyro sparkles, CO2 jets, and seamless Bollywood, Commercial House, and Punjabi mixes.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
        title: 'Midnight Sangeet Dancefloor',
        caption: 'Cold pyros erupting as the crowd hits peak energy.',
      },
    ],
    packages: [
      {
        name: 'Club Sound & DJ Package',
        price: 35000,
        duration: '5 Hours',
        description: 'Standard setup for private parties, birthdays, and anniversaries.',
        features: ['Pro DJ with Pioneer CDJ 3000', '2 Tops + 2 Subs Sound System', 'Basic Dancefloor Lights', 'Cordless Microphones'],
      },
      {
        name: 'Mega Sangeet Arena Setup',
        price: 85000,
        duration: 'Full Evening',
        description: 'Concert-style trussing with moving heads, haze, and cold pyros.',
        isPopular: true,
        features: ['Line Array Acoustic Speakers', '8 Moving Beam Lights', 'Cold Spark Pyrotechnics (6 Units)', 'CO2 Smoke Cannons', 'Live Punjabi Dhol Duo'],
      },
    ],
    services: [
      {
        name: 'Live DJ & Music Mixing',
        price: 30000,
        pricingUnit: 'per event',
        description: '5-hour DJ set tailored to client song requests and genre preferences.',
        deliverables: ['Custom playlist consultation', 'Professional sound engineer', 'Microphones included'],
      },
    ],
  },
  {
    userName: 'Rhea & Dev Singhania',
    userEmail: 'rhea.weddings@eventease.com',
    userPhone: '+91 99991 44556',
    businessName: 'Vows & Veils Luxury Wedding Planners',
    tagline: 'Curating timeless, flawless celebrations across the world\'s most breathtaking destinations',
    categorySlugs: ['wedding-planners', 'event-planners'],
    city: 'Udaipur',
    address: 'Lake Pichola Road, Udaipur, Rajasthan',
    startingPrice: 150000,
    experienceYears: 10,
    rating: 5.0,
    reviewCount: 41,
    isApproved: true,
    availabilityStatus: 'available',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    description: 'Vows & Veils is an internationally acclaimed boutique wedding planning house known for destination weddings in Rajasthan palaces, Thailand shores, and Swiss alpine resorts. We orchestrate everything: royal hospitality, artist bookings, legal licenses, and exquisite styling.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        title: 'Palace Courtyard Dinner',
        caption: 'Over 2,000 candles illuminating a royal banquet beside Lake Pichola.',
      },
    ],
    packages: [
      {
        name: 'Month-of Wedding Coordination',
        price: 150000,
        duration: 'Last 30 Days + Event Days',
        description: 'Stepping in to coordinate all existing vendor contracts and day-of execution.',
        features: ['Timeline & Itinerary Creation', 'Vendor Coordination & Briefing', 'Day-of Floor Management', 'Guest Concierge Desk'],
      },
      {
        name: 'Turnkey Royal Destination Planning',
        price: 450000,
        duration: 'Complete 6-Month Planning',
        description: 'End-to-end luxury management for destination weddings.',
        isPopular: true,
        features: ['Venue Scouting & Contract Negotiations', 'Concept & Design Production', 'Celebrity Artist Procurement', 'Luggage & Airport Logistics', '24/7 Dedicated Event Director'],
      },
    ],
    services: [
      {
        name: 'Destination Wedding Management',
        price: 250000,
        pricingUnit: 'per event',
        description: 'Complete coordination for multi-day out-of-town wedding affairs.',
        deliverables: ['Guest hospitality team', 'RSVP tracking app', 'Vendor supervision'],
      },
    ],
  },
  {
    userName: 'Pooja Chhabra',
    userEmail: 'pooja.henna@eventease.com',
    userPhone: '+91 98887 66554',
    businessName: 'Radha Krishna Mehendi Arts',
    tagline: 'Intricate bridal storytelling in 100% organic herbal Rajasthani henna',
    categorySlugs: ['mehendi-artists'],
    city: 'Jaipur',
    address: 'Johari Bazaar, Jaipur, Rajasthan',
    startingPrice: 11000,
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 38,
    isApproved: true,
    availabilityStatus: 'available',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    description: 'Master henna designer Pooja Chhabra brings centuries-old Rajasthani and Marwari traditions to life with bespoke portraits of the bride, groom, pet dogs, and meaningful wedding motifs. Guaranteed chemical-free dark mahogany stain.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
        title: 'Detailed Bridal Portrait Henna',
        caption: 'Both arms filled with intricate temple architecture and miniature portraits.',
      },
    ],
    packages: [
      {
        name: 'Bridal Heritage Package',
        price: 15000,
        duration: '4-6 Hours',
        description: 'Complete hands up to elbows and feet up to calves in intricate bridal patterns.',
        isPopular: true,
        features: ['Bride and Groom Portrait Elements', 'Organic Henna Cones Included', 'Special Essential Oil Aftercare Kit', '1 Assistant for Family Members'],
      },
    ],
    services: [
      {
        name: 'Bridal Henna Designing',
        price: 12000,
        pricingUnit: 'per event',
        description: 'Customized bridal design with customized love story elements.',
        deliverables: ['Chemical-free henna cones', 'After-care balm', 'Design catalogue selection'],
      },
    ],
  },
  {
    userName: 'Raghavan Iyer',
    userEmail: 'raghav.palace@eventease.com',
    userPhone: '+91 94441 33221',
    businessName: 'The Palm Royal Beach Resort & Lawns',
    tagline: 'Panoramic Arabian Sea views, manicured palms, and palatial air-conditioned ballrooms',
    categorySlugs: ['venues'],
    city: 'Goa',
    address: 'Candolim Beach Road, North Goa',
    startingPrice: 200000,
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 77,
    isApproved: true,
    availabilityStatus: 'available',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    description: 'Spread over 12 acres of pristine beachfront in Candolim, The Palm Royal features an oceanfront lawn accommodating up to 1,200 guests, a crystal pillarless banquet hall, and 85 luxury boutique villas for visiting families.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        title: 'Sunset Beachfront Lawn',
        caption: 'Decorated for a sunset wedding ceremony with crashing waves in the background.',
      },
    ],
    packages: [
      {
        name: 'Sunset Lawn Evening Hire',
        price: 250000,
        duration: '12 Hours (12 PM - 12 AM)',
        description: 'Exclusive rental of seaside lawn, green rooms, and electrical generator backup.',
        isPopular: true,
        features: ['Capacity for up to 800 Guests', '2 Luxury Bridal Suites', 'Valet Parking for 150 Cars', 'Sound & Music License Clearances'],
      },
    ],
    services: [
      {
        name: 'Venue Day Rental',
        price: 200000,
        pricingUnit: 'per day',
        description: 'Complete resort event grounds access with security and housekeeping staff.',
        deliverables: ['Backup power generator', 'Bridal changing rooms', 'Dedicated venue manager'],
      },
    ],
  },
  {
    userName: 'Tanvi Joshi',
    userEmail: 'tanvi.events@eventease.com',
    userPhone: '+91 97690 11998',
    businessName: 'SparkleCraft Corporate & Fest Management',
    tagline: 'Technical brilliance and turnkey production for mega conferences, concerts, and college festivals',
    categorySlugs: ['event-management', 'entertainment-providers'],
    city: 'Pune',
    address: 'Koregaon Park, Pune, Maharashtra',
    startingPrice: 80000,
    experienceYears: 8,
    rating: 4.7,
    reviewCount: 33,
    isApproved: true,
    availabilityStatus: 'available',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    description: 'SparkleCraft manages tech conferences, product unveilings, and major college cultural festivals. Equipped with German aluminum stage trusses, high-lumen laser projectors, digital registration turnstiles, and crowd safety stewards.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        title: 'Tech Summit Mainstage',
        caption: 'Seamless 60-foot curved LED wall with dynamic motion graphics.',
      },
    ],
    packages: [
      {
        name: 'Corporate Summit Production',
        price: 120000,
        duration: 'Full Day Event',
        description: 'Complete audiovisual and staging for up to 500 delegates.',
        features: ['Full HD Stage LED Wall (20x10ft)', 'Podium with 4 Lapel Mics', 'Live Zoom / YouTube Broadcast Rig', 'Onsite Sound & Light Technicians'],
      },
    ],
    services: [
      {
        name: 'Concert & Fest Production',
        price: 150000,
        pricingUnit: 'per event',
        description: 'Turnkey trussing, acoustic sound, and stage management.',
        deliverables: ['Stage rigging', 'Safety clearances', 'Sound engineer crew'],
      },
    ],
  },
  {
    userName: 'Suresh Reddy',
    userEmail: 'suresh.cinema@eventease.com',
    userPhone: '+91 98480 22334',
    businessName: 'Cinematic Memories Studio',
    tagline: 'We turn real-life romance into Netflix-caliber documentary films',
    categorySlugs: ['videographers', 'photographers'],
    city: 'Hyderabad',
    address: 'Jubilee Hills, Hyderabad, Telangana',
    startingPrice: 50000,
    experienceYears: 7,
    rating: 4.8,
    reviewCount: 29,
    isApproved: true,
    availabilityStatus: 'available',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    description: 'Cinematic Memories is celebrated for capturing authentic laughter, tears, and family camaraderie through Sony FX3 cinema rigs, DJI Ronin gimbals, and sound-engineered lapel mics. Delivered with custom title sequences and color grading.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        title: 'Cinematic Phera Moments',
        caption: 'Slow motion 120fps fire ritual visual masterpiece.',
      },
    ],
    packages: [
      {
        name: 'Cinematic Wedding Film Package',
        price: 75000,
        duration: '2 Days',
        description: 'Comprehensive 4K film coverage with teaser and full ceremony cuts.',
        isPopular: true,
        features: ['2 Cinema Operators', 'Aerial Drone 4K', '5-7 Min Cinematic Film', 'Full Ceremony Video (60 Mins)', 'Delivered on Custom Wood USB'],
      },
    ],
    services: [
      {
        name: 'Wedding Highlight Reel',
        price: 45000,
        pricingUnit: 'per event',
        description: 'Professionally cut 3-5 minute video showcasing the high points of your event.',
        deliverables: ['Color-graded 4K master', 'Licensed music rights', 'Instagram vertical cut'],
      },
    ],
  },
  {
    userName: 'Aakash Verma',
    userEmail: 'aakash.anchor@eventease.com',
    userPhone: '+91 98190 44332',
    businessName: 'The Grand Emcee & Entertainment Hub',
    tagline: 'High-energy bilingual anchoring, interactive games, and standup humor',
    categorySlugs: ['entertainment-providers'],
    city: 'Delhi',
    address: 'South Extension, New Delhi',
    startingPrice: 25000,
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 44,
    isApproved: true,
    availabilityStatus: 'available',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    description: 'With over 500 events hosted across India, Singapore, and Dubai, Aakash brings charisma, warmth, and spontaneous crowd engagement to sangeets, corporate award nights, and anniversary bashes.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        title: 'Sangeet Stage Hosting',
        caption: 'Engaging family dance competition and trivia quiz.',
      },
    ],
    packages: [
      {
        name: 'Sangeet & Cocktail Hosting',
        price: 35000,
        duration: '4-5 Hours',
        description: 'Bilingual anchoring with custom games, couple roasts, and family trivia.',
        isPopular: true,
        features: ['Script Planning Session', 'Custom Interactive Couple Games', 'Bilingual (Hindi & English)', 'Seamless Coordination with DJ'],
      },
    ],
    services: [
      {
        name: 'Live Event Emcee',
        price: 25000,
        pricingUnit: 'per event',
        description: 'Professional stage hosting keeping the audience thrilled from start to finish.',
        deliverables: ['Pre-event script meeting', 'Crowd interaction games', 'Stage coordination'],
      },
    ],
  },
  {
    userName: 'Priya Sundaram',
    userEmail: 'priya.events@eventease.com',
    userPhone: '+91 98401 55667',
    businessName: 'Mandala Celebrations & Event Planners',
    tagline: 'Thoughtfully curated family functions, baby showers, and birthday extravaganzas',
    categorySlugs: ['event-planners', 'decorators'],
    city: 'Chennai',
    address: 'Nungambakkam, Chennai, Tamil Nadu',
    startingPrice: 30000,
    experienceYears: 5,
    rating: 4.8,
    reviewCount: 31,
    isApproved: true,
    availabilityStatus: 'available',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=300&q=80',
    description: 'Mandala Celebrations transforms ordinary family milestones into intimate, joy-filled affairs. From themed first birthdays with sensory activity zones to traditional Seemantham (baby shower) setups with brass urlis and temple jasmine.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
        title: 'Enchanted Forest Birthday',
        caption: 'Balloon installations and custom animal dessert tables.',
      },
    ],
    packages: [
      {
        name: 'Intimate Celebration Package',
        price: 35000,
        duration: 'Single Day',
        description: 'Ideal for 1st Birthdays, Baby Showers, and Housewarming ceremonies.',
        features: ['Theme Balloon & Floral Backdrop', 'Custom Acrylic Name Sign', 'Welcome Board with Easel', 'Cake Table Styling'],
      },
    ],
    services: [
      {
        name: 'Birthday & Milestone Planning',
        price: 30000,
        pricingUnit: 'per event',
        description: 'Full decor and entertainment coordination for private celebrations.',
        deliverables: ['Custom theme concept', 'Vendor sourcing', 'On-site execution'],
      },
    ],
  },
  {
    userName: 'Arjun Das',
    userEmail: 'arjun.decor@eventease.com',
    userPhone: '+91 98300 77112',
    businessName: 'Eden Floral & Stage Creations',
    tagline: 'Modern minimalist florals, architectural lighting, and bespoke photo-booths',
    categorySlugs: ['decorators'],
    city: 'Kolkata',
    address: 'Salt Lake Sector 1, Kolkata, West Bengal',
    startingPrice: 40000,
    experienceYears: 6,
    rating: 4.7,
    reviewCount: 26,
    isApproved: true,
    availabilityStatus: 'available',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1519225424933-cb1d31c62f25?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    description: 'Eden brings contemporary Parisian flair mixed with classical Indian aesthetics. We specialize in fairy light canopy ceilings, cascading tuberose curtains, and artistic photobooths.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1519225424933-cb1d31c62f25?auto=format&fit=crop&w=800&q=80',
        title: 'Fairy Light Starry Night Canopy',
        caption: 'Over 10,000 warm white micro lights cascading above dining tables.',
      },
    ],
    packages: [
      {
        name: 'Enchanted Evening Floral Decor',
        price: 55000,
        duration: 'Evening Event',
        description: 'Stage setup, entryway arch, and dining table centerpieces.',
        features: ['Fresh Rose & Baby\'s Breath Mandap', 'Pathway Lanterns with Candles', 'Photo Booth with Neon Text', 'Complete Setup & Teardown'],
      },
    ],
    services: [
      {
        name: 'Theme Backdrop & Lighting',
        price: 40000,
        pricingUnit: 'per event',
        description: 'Architectural mood lighting and custom stage backdrop design.',
        deliverables: ['3D lighting layout', 'LED warm wash', 'Fabric draping'],
      },
    ],
  },
  {
    userName: 'Meera Nambiar',
    userEmail: 'meera.makeup@eventease.com',
    userPhone: '+91 98450 33991',
    businessName: 'Velvet Brush Artistry by Meera',
    tagline: 'Timeless South Indian bridal aesthetics, temple jewelry setting, and flawless makeup',
    categorySlugs: ['makeup-artists'],
    city: 'Bengaluru',
    address: 'Koramangala, Bengaluru, Karnataka',
    startingPrice: 20000,
    experienceYears: 7,
    rating: 4.9,
    reviewCount: 34,
    isApproved: true,
    availabilityStatus: 'available',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    description: 'Specializing in Kanjeevaram silk saree draping, South Indian traditional bridal styling with fresh jasmine veni, and modern waterproof makeup suited for early morning muhurthams.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        title: 'Muhurtham Bride Elegance',
        caption: 'Traditional gold temple jewellery setting with matte airbrush makeup.',
      },
    ],
    packages: [
      {
        name: 'South Indian Muhurtham Bride',
        price: 25000,
        duration: 'Morning Ceremony',
        description: 'Complete saree pleating, temple jewellery pinning, hair poola jada, and HD makeup.',
        isPopular: true,
        features: ['Airbrush Base with 16-hr Wear', 'Fresh Poola Jada Floral Hair', 'Madisar / Kanjeevaram Saree Draping', 'Mother of Bride Quick Touchup'],
      },
    ],
    services: [
      {
        name: 'Bridal Saree & Makeup Styling',
        price: 22000,
        pricingUnit: 'per event',
        description: 'Full bridal styling from head to toe for traditional weddings.',
        deliverables: ['HD cosmetic products', 'Hair styling', 'Jewellery setting'],
      },
    ],
  },
  {
    userName: 'Rishi Kapoor',
    userEmail: 'rishi.caterers@eventease.com',
    userPhone: '+91 98101 99223',
    businessName: 'Chandni Chowk to Chowpatty Caterers',
    tagline: 'Legendary North Indian street food counters, royal kebabs, and live sweet making',
    categorySlugs: ['caterers'],
    city: 'Delhi',
    address: 'Pitampura, New Delhi',
    startingPrice: 900,
    experienceYears: 18,
    rating: 4.8,
    reviewCount: 88,
    isApproved: true,
    availabilityStatus: 'available',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    description: 'Renowned for our iconic live chaat street from Old Delhi, Dal Makhani simmered overnight for 24 hours, piping hot Amritsari Kulchas, and live hot jalebi with rabri stations.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        title: 'Chandni Chowk Live Chaat Counter',
        caption: 'Crispy golgappas with 5 flavored waters and dahi bhallas.',
      },
    ],
    packages: [
      {
        name: 'Dilli 6 Street & Dawat Package',
        price: 1100,
        duration: 'Per Plate (Min 100 Guests)',
        description: 'Iconic street food counters followed by royal Mughlai and Punjabi main courses.',
        features: ['5 Live Chaat Counters', 'Tandoor Live Breads', 'Overnight Dal Bukhara', 'Live Hot Jalebi with Rabri'],
      },
    ],
    services: [
      {
        name: 'Event Food & Live Counters',
        price: 1000,
        pricingUnit: 'per plate',
        description: 'Authentic Indian regional catering with interactive live food stations.',
        deliverables: ['Live cooking stations', 'Uniformed stewards', 'Buffet presentation'],
      },
    ],
  },
  {
    userName: 'Farhan Zaidi',
    userEmail: 'farhan.venue@eventease.com',
    userPhone: '+91 98220 88771',
    businessName: 'The Heritage Fort Palace & Lawns',
    tagline: 'A 200-year-old restored regal palace offering timeless royal grandeur for dream weddings',
    categorySlugs: ['venues', 'wedding-planners'],
    city: 'Jaipur',
    address: 'Amer Road, Jaipur, Rajasthan',
    startingPrice: 350000,
    experienceYears: 20,
    rating: 5.0,
    reviewCount: 56,
    isApproved: true,
    availabilityStatus: 'available',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    description: 'Set against the majestic Aravalli hills, The Heritage Fort Palace offers authentic sandstone courtyards, jharokha balconies for royal entries, a grand banquet hall, and 45 royal suites with peacocks wandering the manicured gardens.',
    portfolioImages: [
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        title: 'Courtyard Palace Illumination',
        caption: 'Diya lamps and torches lighting the sandstone corridors for royal reception.',
      },
    ],
    packages: [
      {
        name: 'Royal Palace 2-Day Wedding Buyout',
        price: 550000,
        duration: '48 Hours Buyout',
        description: 'Exclusive palace access including all lawns, ballrooms, and 20 guest rooms.',
        isPopular: true,
        features: ['Full Palace Grounds Access', 'Elephant / Camel Royal Procession Permission', 'Sound License up to 1 AM', '40 Dedicated Palace Staff & Security'],
      },
    ],
    services: [
      {
        name: 'Palace Venue Rental',
        price: 350000,
        pricingUnit: 'per day',
        description: 'Royal fort courtyard and garden lawns rental for weddings and receptions.',
        deliverables: ['Heritage suites included', 'Full power generator backup', 'Valet parking'],
      },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Clearing old collections...');
    await Promise.all([
      User.deleteMany({}),
      ServiceCategory.deleteMany({}),
      VendorProfile.deleteMany({}),
      Service.deleteMany({}),
      Package.deleteMany({}),
      Enquiry.deleteMany({}),
      Review.deleteMany({}),
      Favourite.deleteMany({}),
    ]);
    console.log('Cleaned old database collections.');

    // 1. Seed Admin User
    console.log('Seeding Admin user...');
    const adminUser = await User.create({
      name: 'EventEase Admin',
      email: 'admin@eventease.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 90000 00001',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    });

    // 2. Seed Sample Customers
    console.log('Seeding Customers...');
    const customer1 = await User.create({
      name: 'Aditi Sharma',
      email: 'customer@eventease.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    });

    const customer2 = await User.create({
      name: 'Rohan Verma',
      email: 'rohan@gmail.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 98111 22334',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    });

    // 3. Seed Service Categories
    console.log('Seeding Service Categories...');
    const createdCategories = await ServiceCategory.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // 4. Seed Vendors with Profiles, Services, and Packages
    console.log('Seeding Vendors, Services, and Packages...');
    const createdVendorProfiles = [];

    for (const vData of sampleVendorsData) {
      // Create Vendor User
      const vendorUser = await User.create({
        name: vData.userName,
        email: vData.userEmail,
        password: 'password123',
        role: 'vendor',
        phone: vData.userPhone,
        avatar: vData.logoImage,
      });

      // Map Category Slugs to IDs
      const categoryIds = vData.categorySlugs
        .map((slug) => categoryMap[slug])
        .filter(Boolean);

      // Create Vendor Profile
      const vendorProfile = await VendorProfile.create({
        user: vendorUser._id,
        businessName: vData.businessName,
        tagline: vData.tagline,
        description: vData.description,
        coverImage: vData.coverImage,
        logoImage: vData.logoImage,
        categories: categoryIds,
        city: vData.city,
        address: vData.address,
        startingPrice: vData.startingPrice,
        experienceYears: vData.experienceYears,
        rating: vData.rating,
        reviewCount: vData.reviewCount,
        isApproved: vData.isApproved,
        availabilityStatus: vData.availabilityStatus,
        portfolioImages: vData.portfolioImages,
        featured: vData.featured,
        socialLinks: {
          website: 'https://eventease.com',
          instagram: 'https://instagram.com/eventease',
          facebook: 'https://facebook.com/eventease',
        },
      });

      createdVendorProfiles.push(vendorProfile);

      // Create Services for this vendor
      for (const s of vData.services) {
        await Service.create({
          vendor: vendorProfile._id,
          category: categoryIds[0] || createdCategories[0]._id,
          name: s.name,
          description: s.description,
          price: s.price,
          pricingUnit: s.pricingUnit,
          deliverables: s.deliverables,
        });
      }

      // Create Packages for this vendor
      for (const p of vData.packages) {
        await Package.create({
          vendor: vendorProfile._id,
          name: p.name,
          description: p.description,
          price: p.price,
          duration: p.duration,
          features: p.features,
          isPopular: !!p.isPopular,
        });
      }
    }

    // 5. Seed Realistic Enquiries
    console.log('Seeding Sample Enquiries...');
    const enquiry1 = await Enquiry.create({
      customer: customer1._id,
      vendor: createdVendorProfiles[0]._id, // Lumiere Wedding Stories
      name: customer1.name,
      email: customer1.email,
      phone: customer1.phone,
      eventType: 'Wedding',
      eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // in 45 days
      eventLocation: 'Taj Lands End, Bandra, Mumbai',
      serviceType: 'Candid Wedding Photography & Cinematic Video',
      expectedBudget: 120000,
      message: 'Looking for a 2-day wedding and sangeet coverage. We love your royal aesthetic!',
      status: 'Accepted',
      vendorNotes: 'Spoke with Aditi. Scheduled initial creative consultation call for tomorrow 5 PM.',
    });

    const enquiry2 = await Enquiry.create({
      customer: customer1._id,
      vendor: createdVendorProfiles[1]._id, // Petals & Props Decor Studio
      name: customer1.name,
      email: customer1.email,
      phone: customer1.phone,
      eventType: 'Engagement',
      eventDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // in 20 days
      eventLocation: 'The Claridges, New Delhi',
      serviceType: 'Glasshouse Floral Mandap & Fairy Lights',
      expectedBudget: 75000,
      message: 'We want a romantic pastel themed engagement setup for 150 guests.',
      status: 'Pending',
    });

    const enquiry3 = await Enquiry.create({
      customer: customer2._id,
      vendor: createdVendorProfiles[2]._id, // The Royal Feast Gourmet Caterers
      name: customer2.name,
      email: customer2.email,
      phone: customer2.phone,
      eventType: 'Anniversary',
      eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      eventLocation: 'Prestige Golfshire, Bengaluru',
      serviceType: 'Gold Royal Banquet Buffet for 120 Guests',
      expectedBudget: 220000,
      message: 'Need live sushi counter and authentic Awadhi biryani spread for 25th anniversary.',
      status: 'Accepted',
      vendorNotes: 'Tasting session scheduled for this weekend.',
    });

    const enquiry4 = await Enquiry.create({
      customer: customer2._id,
      vendor: createdVendorProfiles[4]._id, // Electrowave Sounds & DJ Aryan
      name: customer2.name,
      email: customer2.email,
      phone: customer2.phone,
      eventType: 'Birthday',
      eventDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // in the past
      eventLocation: 'Juhu Beach Club, Mumbai',
      serviceType: 'Mega Sangeet Arena & Bollywood DJ',
      expectedBudget: 60000,
      message: 'Need high energy DJ setup for 30th birthday dance party.',
      status: 'Completed',
      vendorNotes: 'Event completed with outstanding client applause.',
    });

    // 6. Seed Sample Favourites
    console.log('Seeding Favourites...');
    await Favourite.create({
      customer: customer1._id,
      vendor: createdVendorProfiles[0]._id,
    });
    await Favourite.create({
      customer: customer1._id,
      vendor: createdVendorProfiles[2]._id,
    });
    await Favourite.create({
      customer: customer1._id,
      vendor: createdVendorProfiles[5]._id,
    });

    // 7. Seed Sample Reviews
    console.log('Seeding Reviews...');
    await Review.create({
      customer: customer1._id,
      vendor: createdVendorProfiles[0]._id,
      rating: 5,
      comment: 'Karan and his Lumiere team were extraordinary! They captured every smile, tear, and dance move without being intrusive. The teaser film brought my entire family to tears. Worth every rupee!',
      eventType: 'Wedding',
    });

    await Review.create({
      customer: customer2._id,
      vendor: createdVendorProfiles[0]._id,
      rating: 5,
      comment: 'Super professional crew, punctual, and the photo album quality is unmatched. High praise!',
      eventType: 'Engagement',
    });

    await Review.create({
      customer: customer1._id,
      vendor: createdVendorProfiles[2]._id,
      rating: 5,
      comment: 'The Awadhi biryani and the live parmesan wheel risotto were the absolute talk of our party. Chef Vikramaditya and his staff are masters of hospitality.',
      eventType: 'Family function',
    });

    console.log('====================================================');
    console.log('Database seeded successfully!');
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Vendors: ${createdVendorProfiles.length}`);
    console.log(`- Admin account: admin@eventease.com (pwd: password123)`);
    console.log(`- Customer account: customer@eventease.com (pwd: password123)`);
    console.log(`- Vendor accounts: karan.lens@eventease.com (pwd: password123)`);
    console.log('====================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedDatabase();

