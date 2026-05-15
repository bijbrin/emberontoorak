import 'dotenv/config'
import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ adapter: new PrismaNeonHttp(process.env.DATABASE_URL!, {}) })

async function main() {
  await prisma.reservation.deleteMany({})
  await prisma.menuItem.deleteMany({})
  await prisma.menuSection.deleteMany({})
  await prisma.wineItem.deleteMany({})
  await prisma.wineSection.deleteMany({})
  await prisma.job.deleteMany({})

  const sections = [
    {
      slug: 'small-plates', label: 'Small Plates', subtitle: 'To Begin', sortOrder: 0,
      items: [
        { name: 'Wagyu Tartare', description: 'Hand-cut MBS 9+, quail egg, truffle oil, sourdough crisps', price: 48, highlight: false, sortOrder: 0 },
        { name: 'Hiramasa Kingfish Crudo', description: 'Dashi gel, nori oil, yuzu kosho, finger lime', price: 42, highlight: false, sortOrder: 1 },
        { name: 'Cloudy Bay Diamond Clams', description: 'Finger lime, cultured cream, sea herbs, grilled bread', price: 38, highlight: false, sortOrder: 2 },
        { name: 'Natural Oysters', description: 'Pacific Coast, shallot mignonette, lemon — half dozen', price: 36, highlight: false, sortOrder: 3 },
        { name: 'House-Smoked Duck Rillettes', description: 'Cornichons, grain mustard, toasted brioche', price: 34, highlight: false, sortOrder: 4 },
        { name: 'Burrata & Heirloom Tomato', description: 'Basil oil, aged balsamic, fleur de sel, sourdough', price: 29, highlight: false, sortOrder: 5 },
      ],
    },
    {
      slug: 'fire', label: 'Fire & Beef', subtitle: 'Premium Cuts from the Coals', sortOrder: 1,
      note: 'All cuts are cooked over 1,200° ironbark coals and served with a house jus and your choice of sauce: béarnaise, café de Paris butter, or red wine reduction.',
      items: [
        { name: 'Fullblood Wagyu Scotch Fillet', description: 'MBS 9+ · Darling Downs, QLD · 300g', price: 185, highlight: true, sortOrder: 0 },
        { name: '45-Day Dry-Aged T-Bone', description: 'Rangers Valley Black Angus · 1.2kg · serves two', price: 165, highlight: false, sortOrder: 1 },
        { name: 'Blackmore Wagyu Tenderloin', description: 'MBS 8 · Gippsland, VIC · 220g', price: 145, highlight: false, sortOrder: 2 },
        { name: 'Full Blood Wagyu Short Rib', description: '36-hour slow cooked, finished over coals · Bone-in · 600g', price: 128, highlight: false, sortOrder: 3 },
        { name: 'Rangers Valley Sirloin', description: 'Grass-fed · Cape Grim, TAS · 250g', price: 98, highlight: false, sortOrder: 4 },
      ],
    },
    {
      slug: 'ocean', label: 'The Ocean', subtitle: 'From the Raw Bar & Grill', sortOrder: 2,
      items: [
        { name: 'Whole Roasted Barramundi', description: 'Fennel butter, preserved lemon, capers, warrigal greens', price: 72, highlight: false, sortOrder: 0 },
        { name: 'Moreton Bay Bug Tails', description: 'Café de Paris butter, charred sourdough, lemon', price: 68, highlight: false, sortOrder: 1 },
        { name: 'Scallops au Gratin', description: 'Herb crumb, white wine, cream, chervil', price: 52, highlight: false, sortOrder: 2 },
        { name: 'Prawn & Chorizo Skewers', description: 'Smoked paprika oil, lemon aioli, shaved fennel', price: 44, highlight: false, sortOrder: 3 },
      ],
    },
    {
      slug: 'sides', label: 'Sides', subtitle: 'To Share', sortOrder: 3,
      items: [
        { name: 'Truffle Mac & Cheese', description: 'Black truffle, aged gruyère, house-made breadcrumb', price: 24, highlight: false, sortOrder: 0 },
        { name: 'Heirloom Tomato Salad', description: 'Burrata, basil oil, aged balsamic', price: 22, highlight: false, sortOrder: 1 },
        { name: 'Charred Broccolini', description: 'Almonds, dried chilli, preserved lemon', price: 18, highlight: false, sortOrder: 2 },
        { name: 'Roasted Root Vegetables', description: "Whipped goat's cheese, dukkah, pomegranate", price: 19, highlight: false, sortOrder: 3 },
        { name: 'Hand-Cut Fries', description: 'Rosemary salt, smoked aioli', price: 16, highlight: false, sortOrder: 4 },
      ],
    },
    {
      slug: 'desserts', label: 'Desserts', subtitle: 'Sweet Endings', sortOrder: 4,
      items: [
        { name: 'Dark Chocolate & Caramel Tart', description: 'Valrhona 70%, salted caramel, gold leaf, crème fraîche', price: 24, highlight: false, sortOrder: 0 },
        { name: 'Crème Brûlée', description: 'Madagascar vanilla, seasonal berry compote', price: 22, highlight: false, sortOrder: 1 },
        { name: 'Australian Cheese Selection', description: 'Three cheeses, quince paste, house-made lavosh, honeycomb', price: 38, highlight: false, sortOrder: 2 },
        { name: 'Soufflé of the Evening', description: 'Ask your server — please allow 20 minutes', price: 26, highlight: false, sortOrder: 3 },
      ],
    },
  ] as const

  for (const { items, ...sectionData } of sections) {
    const section = await prisma.menuSection.create({ data: sectionData })
    for (const item of items) {
      await prisma.menuItem.create({ data: { ...item, sectionId: section.id } })
    }
  }

  const wineSections = [
    {
      slug: 'glass', label: 'By the Glass', sortOrder: 0,
      items: [
        { name: "Tonight's Pour", varietal: "Nebbiolo d'Alba", region: 'Piedmont, Italy', year: '2022', price: 28, highlight: true, sortOrder: 0 },
        { name: 'Leeuwin Art Series', varietal: 'Chardonnay', region: 'Margaret River, WA', year: '2021', price: 22, highlight: false, sortOrder: 1 },
        { name: 'Yangarra', varietal: 'Grenache', region: 'McLaren Vale, SA', year: '2021', price: 19, highlight: false, sortOrder: 2 },
        { name: 'Yering Station', varietal: 'Pinot Noir', region: 'Yarra Valley, VIC', year: '2022', price: 18, highlight: false, sortOrder: 3 },
        { name: 'Pewsey Vale', varietal: 'Riesling', region: 'Eden Valley, SA', year: '2023', price: 16, highlight: false, sortOrder: 4 },
        { name: 'House White', varietal: 'Sauvignon Blanc', region: 'Adelaide Hills, SA', year: '2024', price: 14, highlight: false, sortOrder: 5 },
      ],
    },
    {
      slug: 'reds', label: 'Red Wines', sortOrder: 1,
      items: [
        { name: 'Penfolds Grange', varietal: 'Shiraz', region: 'Barossa Valley, SA', year: '2018', price: 1200, highlight: false, sortOrder: 0 },
        { name: 'Henschke Hill of Grace', varietal: 'Shiraz', region: 'Eden Valley, SA', year: '2019', price: 900, highlight: false, sortOrder: 1 },
        { name: 'Bass Phillip Reserve', varietal: 'Pinot Noir', region: 'Gippsland, VIC', year: '2020', price: 480, highlight: false, sortOrder: 2 },
        { name: "d'Arenberg Dead Arm", varietal: 'Shiraz', region: 'McLaren Vale, SA', year: '2019', price: 195, highlight: false, sortOrder: 3 },
        { name: 'Elderton Command', varietal: 'Cabernet Sauvignon', region: 'Barossa Valley, SA', year: '2018', price: 185, highlight: false, sortOrder: 4 },
        { name: 'Yering Station Reserve', varietal: 'Pinot Noir', region: 'Yarra Valley, VIC', year: '2021', price: 120, highlight: false, sortOrder: 5 },
        { name: 'Wirra Wirra The Angelus', varietal: 'Cabernet Sauvignon', region: 'McLaren Vale, SA', year: '2020', price: 95, highlight: false, sortOrder: 6 },
        { name: 'Gemtree Obsidian', varietal: 'Shiraz', region: 'McLaren Vale, SA', year: '2022', price: 72, highlight: false, sortOrder: 7 },
      ],
    },
    {
      slug: 'whites', label: 'White Wines', sortOrder: 2,
      items: [
        { name: 'Giaconda', varietal: 'Chardonnay', region: 'Beechworth, VIC', year: '2022', price: 280, highlight: false, sortOrder: 0 },
        { name: 'Shaw + Smith M3', varietal: 'Chardonnay', region: 'Adelaide Hills, SA', year: '2022', price: 145, highlight: false, sortOrder: 1 },
        { name: 'Grosset Polish Hill', varietal: 'Riesling', region: 'Clare Valley, SA', year: '2023', price: 110, highlight: false, sortOrder: 2 },
        { name: 'Oakridge 864', varietal: 'Chardonnay', region: 'Yarra Valley, VIC', year: '2021', price: 85, highlight: false, sortOrder: 3 },
        { name: 'Mac Forbes', varietal: 'Pinot Gris', region: 'Yarra Valley, VIC', year: '2023', price: 68, highlight: false, sortOrder: 4 },
        { name: 'Hochkirch', varietal: 'Riesling', region: 'Henty, VIC', year: '2023', price: 62, highlight: false, sortOrder: 5 },
      ],
    },
    {
      slug: 'sparkling', label: 'Sparkling & Champagne', sortOrder: 3,
      items: [
        { name: 'Dom Pérignon', varietal: 'Champagne Blend', region: 'Champagne, France', year: '2013', price: 580, highlight: false, sortOrder: 0 },
        { name: 'Bollinger Special Cuvée', varietal: 'Champagne Blend', region: 'Champagne, France', year: 'NV', price: 165, highlight: false, sortOrder: 1 },
        { name: 'Chandon Blanc de Blancs', varietal: 'Chardonnay', region: 'Yarra Valley, VIC', year: '2021', price: 75, highlight: false, sortOrder: 2 },
        { name: 'Jansz Premium Cuvée', varietal: 'Chardonnay / Pinot Noir', region: 'Tasmania', year: 'NV', price: 58, highlight: false, sortOrder: 3 },
      ],
    },
  ] as const

  for (const { items, ...sectionData } of wineSections) {
    const section = await prisma.wineSection.create({ data: sectionData })
    for (const item of items) {
      await prisma.wineItem.create({ data: { ...item, sectionId: section.id } })
    }
  }

  const reservations = [
    { firstName: 'James', lastName: 'Hartley', email: 'james.hartley@gmail.com', phone: '+61 412 334 556', date: '2026-05-14', time: '18:30', guests: 2, occasion: 'Anniversary', dietary: null, notes: 'Window table preferred', status: 'CONFIRMED' },
    { firstName: 'Priya', lastName: 'Menon', email: 'priya.menon@outlook.com', phone: '+61 423 112 789', date: '2026-05-14', time: '19:00', guests: 4, occasion: null, dietary: 'Vegetarian (1 guest)', notes: null, status: 'CONFIRMED' },
    { firstName: 'Oliver', lastName: 'Chen', email: 'oliver.chen@me.com', phone: null, date: '2026-05-14', time: '20:00', guests: 6, occasion: 'Birthday', dietary: null, notes: 'Birthday cake arranged — please keep chilled', status: 'PENDING' },
    { firstName: 'Sophie', lastName: 'Whitmore', email: 'swhitmore@icloud.com', phone: '+61 400 221 983', date: '2026-05-15', time: '19:30', guests: 2, occasion: 'Date night', dietary: 'Gluten free', notes: null, status: 'PENDING' },
    { firstName: 'Marcus', lastName: 'Delgado', email: 'm.delgado@bigpond.com', phone: '+61 438 009 452', date: '2026-05-15', time: '20:30', guests: 3, occasion: null, dietary: null, notes: null, status: 'CONFIRMED' },
    { firstName: 'Natalie', lastName: 'Burns', email: 'nat.burns@gmail.com', phone: '+61 417 663 201', date: '2026-05-16', time: '18:00', guests: 5, occasion: 'Farewell dinner', dietary: 'Nut allergy (1 guest)', notes: 'Host is paying — please present one bill', status: 'PENDING' },
    { firstName: 'Liam', lastName: 'O\'Brien', email: 'liamobrien@proton.me', phone: null, date: '2026-05-16', time: '19:00', guests: 2, occasion: null, dietary: null, notes: null, status: 'CONFIRMED' },
    { firstName: 'Anika', lastName: 'Sharma', email: 'anika.sharma@gmail.com', phone: '+61 401 774 338', date: '2026-05-17', time: '20:00', guests: 8, occasion: 'Corporate dinner', dietary: 'Halal (3 guests), vegetarian (2 guests)', notes: 'Private dining room requested', status: 'PENDING' },
    { firstName: 'Tom', lastName: 'Kirkwood', email: 'tomkirkwood@hotmail.com', phone: '+61 421 559 877', date: '2026-05-18', time: '19:30', guests: 2, occasion: 'Proposal', dietary: null, notes: 'Champagne on arrival please — surprise', status: 'CONFIRMED' },
    { firstName: 'Grace', lastName: 'Nguyen', email: 'grace.nguyen@outlook.com', phone: '+61 409 882 114', date: '2026-05-10', time: '18:30', guests: 3, occasion: null, dietary: null, notes: null, status: 'CANCELLED' },
    { firstName: 'Daniel', lastName: 'Fraser', email: 'd.fraser@gmail.com', phone: '+61 432 100 564', date: '2026-05-11', time: '20:00', guests: 2, occasion: 'Anniversary', dietary: null, notes: null, status: 'CONFIRMED' },
    { firstName: 'Isabella', lastName: 'Park', email: 'isabella.park@me.com', phone: null, date: '2026-05-12', time: '19:00', guests: 4, occasion: 'Birthday', dietary: 'Vegan (1 guest)', notes: null, status: 'CONFIRMED' },
    { firstName: 'Ryan', lastName: 'Stafford', email: 'ryanstafford@yahoo.com', phone: '+61 415 230 991', date: '2026-05-13', time: '20:30', guests: 2, occasion: null, dietary: null, notes: null, status: 'PENDING' },
    { firstName: 'Mei', lastName: 'Liu', email: 'mei.liu@gmail.com', phone: '+61 427 445 823', date: '2026-05-19', time: '18:30', guests: 10, occasion: 'Engagement', dietary: 'Shellfish allergy (2 guests)', notes: 'Celebration cake from external baker arriving at 9pm', status: 'PENDING' },
    { firstName: 'Cameron', lastName: 'Scott', email: 'cam.scott@bigpond.net.au', phone: '+61 403 667 210', date: '2026-05-20', time: '19:00', guests: 2, occasion: null, dietary: null, notes: null, status: 'CANCELLED' },
  ] as const

  for (const r of reservations) {
    await prisma.reservation.create({ data: r })
  }

  const jobs = [
    {
      slug: 'head-chef',
      title: 'Head Chef de Cuisine',
      department: 'Kitchen',
      type: 'Full-time',
      location: 'Toorak, VIC',
      salary: '$120k – $140k + super',
      summary: 'Lead the brigade, drive the seasonal menu, and uphold the precision and theatre that define every plate at Ember.',
      responsibilities: [
        'Own daily kitchen operations, service standards, and food cost targets.',
        'Develop seasonal menus in collaboration with the Executive Chef and Sommelier.',
        'Mentor a brigade of twelve across all sections, from larder to wood-fire.',
        'Maintain supplier relationships and weekly produce sourcing.',
      ],
      requirements: [
        '5+ years in a senior role within a hatted or fine-dining kitchen.',
        'Demonstrated experience leading a brigade of ten or more.',
        'Deep understanding of wood-fire and live-flame cookery.',
        'Australian work rights and unrestricted availability across evenings and weekends.',
      ],
      sortOrder: 0,
    },
    {
      slug: 'sommelier',
      title: 'Head Sommelier',
      department: 'Beverage',
      type: 'Full-time',
      location: 'Toorak, VIC',
      salary: '$95k – $110k + tips',
      summary: 'Curate a 600-bin cellar, host pairing journeys, and guide our floor team through the language of the list.',
      responsibilities: [
        'Curate and rotate the wine list across Old World, New World, and rare verticals.',
        'Host nightly pairing tables and tasting menu progressions.',
        'Train floor staff weekly on varietals, regions, and service technique.',
        'Manage cellar inventory, par levels, and supplier negotiations.',
      ],
      requirements: [
        'Court of Master Sommeliers Level 2 (or WSET Diploma equivalent).',
        '4+ years on a premium floor, ideally within a hatted venue.',
        'Confident host with strong table-side presence and storytelling.',
        'RSA, Victorian liquor knowledge, and Australian work rights.',
      ],
      sortOrder: 1,
    },
    {
      slug: 'floor-manager',
      title: 'Floor Manager / Maître d’',
      department: 'Front of House',
      type: 'Full-time',
      location: 'Toorak, VIC',
      salary: '$85k – $95k + tips',
      summary: 'Set the tone of the room. Run service with quiet authority, anticipate every need, and remember every name.',
      responsibilities: [
        'Lead nightly service across forty covers and a twelve-seat chef’s table.',
        'Manage reservations, VIP relationships, and private dining bookings.',
        'Coach a floor team of eight on technique, sequence, and pace.',
        'Liaise with kitchen and bar leadership on flow and timing.',
      ],
      requirements: [
        '3+ years floor management in a premium dining environment.',
        'Exceptional memory for guests, preferences, and detail.',
        'Calm under pressure with a hospitable, unflappable presence.',
        'RSA and Australian work rights.',
      ],
      sortOrder: 2,
    },
    {
      slug: 'bartender',
      title: 'Bartender / Mixologist',
      department: 'Bar',
      type: 'Full-time',
      location: 'Toorak, VIC',
      salary: '$70k – $80k + tips',
      summary: 'Build a cocktail program inspired by fire, smoke, and citrus. Make every guest at the bar feel like a regular.',
      responsibilities: [
        'Craft and refresh a seasonal cocktail menu of ten signature drinks.',
        'Run service behind a four-seat bar plus floor cocktail orders.',
        'Maintain bar par levels, glassware, and weekly inventory.',
        'Collaborate with the Sommelier on aperitif and digestif pairings.',
      ],
      requirements: [
        '3+ years behind a cocktail-led bar.',
        'Strong classics foundation with creative flair on modern technique.',
        'RSA and Australian work rights.',
      ],
      sortOrder: 3,
    },
    {
      slug: 'pastry-chef',
      title: 'Pastry Chef',
      department: 'Kitchen',
      type: 'Full-time',
      location: 'Toorak, VIC',
      salary: '$80k – $95k + super',
      summary: 'Lead the pastry section. Close every meal with a memory — plated desserts, petit fours, and house breads.',
      responsibilities: [
        'Develop and execute the seasonal dessert menu and petit fours.',
        'Manage daily bread program and viennoiserie.',
        'Mentor two commis pastry chefs.',
        'Maintain pastry costs, ordering, and section mise en place.',
      ],
      requirements: [
        '4+ years pastry experience, including a senior role.',
        'Strong chocolate, sugar, and plated dessert technique.',
        'Australian work rights and weekend availability.',
      ],
      sortOrder: 4,
    },
    {
      slug: 'senior-server',
      title: 'Senior Server',
      department: 'Front of House',
      type: 'Full or part-time',
      location: 'Toorak, VIC',
      salary: '$32 – $38 / hr + tips',
      summary: 'Carry the rhythm of the room. Read tables, time courses, and bring the menu to life with confidence and warmth.',
      responsibilities: [
        'Run six to eight tables per service across tasting and à la carte menus.',
        'Articulate menu, provenance, and pairings with precision.',
        'Support junior staff and runners during peak service.',
      ],
      requirements: [
        '2+ years in a hatted or premium dining venue.',
        'Strong wine and food knowledge.',
        'RSA and Australian work rights.',
      ],
      sortOrder: 5,
    },
  ] as const

  for (const j of jobs) {
    await prisma.job.create({
      data: {
        ...j,
        responsibilities: [...j.responsibilities],
        requirements: [...j.requirements],
        published: true,
      },
    })
  }

  console.log('✓ Seeded menu, wine list, reservations, and jobs.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
