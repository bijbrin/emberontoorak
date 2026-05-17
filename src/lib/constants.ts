export const HOURS = [
  { day: 'Monday – Thursday', time: '11:00 am – 9:00 pm' },
  { day: 'Friday – Saturday', time: '11:00 am – 10:00 pm' },
  { day: 'Sunday', time: '11:00 am – 9:00 pm' },
] as const

export const TIME_SLOTS = [
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
] as const

export const PERKS = [
  { title: 'Family Meal', body: 'A proper sit-down meal cooked by the brigade before every service.' },
  { title: 'Cellar Education', body: 'Weekly tastings led by the Sommelier across regions, vintages, and verticals.' },
  { title: 'Sundays Off', body: 'A genuine weekend. The dining room is closed Sundays — the team rests.' },
  { title: 'Continuing Education', body: 'Annual stipend for WSET, Court of Master Sommeliers, or stages abroad.' },
] as const

export const MENU_SECTION_IDS = [
  'small-plates',
  'fire',
  'ocean',
  'sides',
  'desserts',
  'cellar',
] as const

export const INPUT_CLASS = 'form-input'
export const LABEL_CLASS = 'form-label'

// TheatreOfFire.tsx
export const FILM_STRIP = [
  {
    label: 'The Coal',
    description: '1,200° hardwood coals. No gas. No shortcuts.',
    gradient:
      'radial-gradient(ellipse at 40% 60%, rgba(254,119,67,0.75) 0%, #211F1C 35%, #141210 70%, #141210 100%)',
  },
  {
    label: 'The Sear',
    description: 'Maillard at its most violent. Crust formed in seconds.',
    gradient:
      'radial-gradient(ellipse at 60% 40%, rgba(254,119,67,0.55) 0%, #1C1A17 40%, #141210 70%, #141210 100%)',
  },
  {
    label: 'The Rest',
    description: '28 days of dry-age. 4 minutes of patience.',
    gradient:
      'radial-gradient(ellipse at 50% 70%, #447D9B 0%, #211F1C 40%, #141210 70%, #141210 100%)',
  },
] as const

export const STATS = [
  { value: '28', unit: 'Days', label: 'Dry-Aged' },
  { value: '1,200°', unit: '', label: 'Coals' },
  { value: '100%', unit: '', label: 'Grass-Fed' },
] as const

// SignatureDishes.tsx
export const STEAKS = [
  { name: 'Fullblood Wagyu Scotch Fillet', detail: 'MBS 9+ · Darling Downs, QLD', price: '185' },
  { name: '45-Day Dry-Aged T-Bone', detail: 'Rangers Valley Black Angus · 1.2kg', price: '165' },
  { name: 'Rangers Valley Sirloin', detail: 'Grass-Fed · Cape Grim, TAS', price: '98' },
] as const

export const RAW_BAR = [
  { name: 'Cloudy Bay Diamond Clams', detail: 'Finger lime, cultured cream', price: '38' },
  { name: 'Hiramasa Kingfish Crudo', detail: 'Dashi gel, nori, yuzu kosho', price: '42' },
] as const

export const CELLAR_POURS = [
  'Penfolds Grange 2018',
  'Bass Phillip Pinot Noir',
  'Henschke Hill of Grace',
  'Leeuwin Art Series Chard',
  'Yangarra Grenache 2021',
] as const

// WineList.tsx
export const WINES = [
  {
    name: 'Penfolds Grange',
    year: '2018',
    region: 'Barossa Valley, SA',
    varietal: 'Shiraz',
    price: '1,200',
    note: 'The Australian icon. Plum, dark chocolate, and cedar.',
    featured: false,
  },
  {
    name: "Tonight's Pour",
    year: '2022',
    region: 'Piedmont, Italy',
    varietal: "Nebbiolo d'Alba",
    price: '28 / glass',
    note: 'Roses, tar, and crushed stone. Ethereally light.',
    featured: true,
  },
  {
    name: 'Bass Phillip Reserve',
    year: '2020',
    region: 'Gippsland, VIC',
    varietal: 'Pinot Noir',
    price: '480',
    note: 'Impossibly elegant. Forest floor and Morello cherry.',
    featured: false,
  },
  {
    name: 'Henschke Hill of Grace',
    year: '2019',
    region: 'Eden Valley, SA',
    varietal: 'Shiraz',
    price: '900',
    note: 'A century of vines. Restrained power and complexity.',
    featured: false,
  },
  {
    name: 'Leeuwin Art Series',
    year: '2021',
    region: 'Margaret River, WA',
    varietal: 'Chardonnay',
    price: '320',
    note: 'Nectarine, toasted hazelnut, and vivid acidity.',
    featured: false,
  },
  {
    name: "d'Arenberg Dead Arm",
    year: '2019',
    region: 'McLaren Vale, SA',
    varietal: 'Shiraz',
    price: '195',
    note: 'Dense and brooding. Dark fruit and licorice.',
    featured: false,
  },
] as const
