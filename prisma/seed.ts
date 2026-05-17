import 'dotenv/config'
import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ adapter: new PrismaNeonHttp(process.env.DATABASE_URL!, {}) })

type SeedItem = {
  name: string
  description?: string
  price?: number
  priceNote?: string
  highlight?: boolean
}

type SeedSection = {
  slug: string
  label: string
  subtitle: string
  note?: string
  menuType: 'A_LA_CARTE' | 'LUNCH' | 'DRINKS'
  parentSlug?: string
  items: SeedItem[]
}

const sections: SeedSection[] = [
  // ============ À LA CARTE ============
  {
    slug: 'raw-and-cold-bar',
    label: 'Raw & Cold Bar',
    subtitle: 'To Begin',
    menuType: 'A_LA_CARTE',
    items: [
      { name: 'Freshly Shucked Oysters', description: 'Albany, WA · Mignonette', price: 6, priceNote: 'ea' },
      { name: 'Yellowtail Kingfish', description: 'Citrus cured, buttermilk dressing, salmon roe, heirloom radish, fresh herbs', price: 29 },
      { name: 'Wagyu Tartare', description: 'Wagyu rump MB5+, traditional condiments, anchovy aioli, aged parmesan, puffed wild rice, potato crisp', price: 29 },
      { name: "Mayura 'Signature' MB9+ Bresaola", description: 'Cabot cheddar, Guindillas chilli', price: 19 },
    ],
  },
  {
    slug: 'starters',
    label: 'Starters',
    subtitle: 'Small Plates',
    menuType: 'A_LA_CARTE',
    items: [
      { name: 'House Made Brioche Rolls', description: 'Smoked honey, parmesan, garlic & walnut crisp', price: 15 },
      { name: 'Grilled King Prawns', description: 'Kampot pepper butter, grilled dukkah bread', price: 29 },
      { name: 'Beetroot Crisp', description: "Burnt honey, goat's curd", price: 24 },
      { name: 'Burrata', description: 'Fennel jam, cold press extra virgin olive oil, grilled focaccia', price: 28 },
      { name: 'Crispy Calamari', description: 'Szechuan honey, fennel, cucumber, soft herbs', price: 19 },
      { name: 'Wagyu Short Rib Croquettes', description: "Gentlemen's relish, Davidson plum, aged parmesan", price: 26 },
      { name: 'Grilled Scallops', description: 'Adobo butter, parsley', price: 32 },
    ],
  },
  {
    slug: 'handmade-pastas',
    label: 'Handmade Pastas',
    subtitle: 'From the Pasta Room',
    menuType: 'A_LA_CARTE',
    items: [
      { name: 'Goat Cheese Tortellini', description: 'Brown butter, sage, smoked honey fig, pine nuts, aged parmesan', price: 42 },
      { name: 'Lobster Linguine', description: 'Prawn, calamari, confit cherry tomato, dill, hint of chilli, bisque reduction', price: 46, highlight: true },
      { name: 'Wagyu Cheek Pappardelle', description: 'Slow braised in San Marzano tomato, chimichurri, parmesan', price: 44 },
    ],
  },
  {
    slug: 'mains',
    label: 'Something Else',
    subtitle: 'Mains',
    menuType: 'A_LA_CARTE',
    items: [
      { name: 'Flamed Chicken', description: 'Open flame chicken, lime & coconut laksa, crispy leaves', price: 39 },
      { name: 'Slow Braised Beef Short Ribs', description: 'Shiraz glaze, creamy mash, puffed wild rice', price: 48, highlight: true },
      { name: 'Pork Belly', description: 'Caramelised apple, fennel slaw, mustard jus', price: 44 },
      { name: 'Aussie Lamb Skewer', description: 'Smoked eggplant, chimichurri, sumac onion, pepper butter', price: 54 },
      { name: 'Pan-Roasted Barramundi', description: 'Prawn meat, chowder clams, mussels, butter beans, piquillo peppers, confit cherry tomatoes', price: 46 },
      { name: 'Wagyu Meat & Bone Marrow Burger', description: '250g Mayura wagyu patty, pickled cucumber, crispy onions, mustard ketchup, melted cheese, brioche bun, crispy chips', price: 36 },
    ],
  },
  // STEAKS — parent + 3 children
  {
    slug: 'steaks',
    label: 'Steaks',
    subtitle: 'From the Coals',
    note: 'All steaks glazed with Signature Basting. Served with crispy chips, cos & radicchio salad, or mash.',
    menuType: 'A_LA_CARTE',
    items: [],
  },
  {
    slug: 'steaks-angus',
    label: 'Riverine Premium Black Angus',
    subtitle: 'Grain Fed 150 Days',
    menuType: 'A_LA_CARTE',
    parentSlug: 'steaks',
    items: [
      { name: 'Eye Fillet 200g · MB2+', description: 'Recommended: Medium Rare', price: 59 },
      { name: 'Striploin 300g · MB2+', description: 'Recommended: Medium Rare / Medium', price: 64 },
      { name: 'Scotch Fillet 350g', description: 'Recommended: Medium', price: 78 },
      { name: 'Rib-Eye on Bone 400g · MB2+', description: 'Recommended: Medium', price: 94 },
      { name: 'T-Bone 800g · MB3+', description: 'Recommended: Medium Rare / Medium', price: 96 },
    ],
  },
  {
    slug: 'steaks-wagyu',
    label: 'Wagyu',
    subtitle: 'Grain Fed 450 Days',
    menuType: 'A_LA_CARTE',
    parentSlug: 'steaks',
    items: [
      { name: 'Scotch Fillet 300g · MB5+', description: 'Recommended: Medium Rare', price: 92, highlight: true },
      { name: 'Striploin 350g · MB5+', description: 'Recommended: Medium Rare / Medium', price: 98 },
      { name: 'Rump 300g · MB5+', description: 'Recommended: Medium Rare / Medium', price: 69 },
    ],
  },
  {
    slug: 'steaks-sharing',
    label: 'Sharing Steak',
    subtitle: 'Serves Two',
    menuType: 'A_LA_CARTE',
    parentSlug: 'steaks',
    items: [
      { name: "O'Connor Tomahawk 1.3kg · MB3+", description: 'Grain fed 240 days, served with chips, salad & sauce', price: 212, highlight: true, priceNote: 'serves 2' },
    ],
  },
  {
    slug: 'favourite-sides',
    label: 'Favourite Sides',
    subtitle: 'To Share',
    menuType: 'A_LA_CARTE',
    items: [
      { name: 'Charred Broccolini', description: "Fermented chilli butter, smoked goat's curd, almonds", price: 18 },
      { name: 'Wagyu Potato', description: 'Parmesan, truffle aioli', price: 16 },
      { name: 'Cos & Radicchio Salad', description: 'Radish, cucumber, herbs, buttermilk dressing, parmesan', price: 14 },
      { name: 'Brown Butter Mash', description: 'Lava salt, shallot crumbs, chives', price: 12 },
      { name: 'Pulled Beef Mac & Cheese', description: 'Black garlic, aged cheddar, chives', price: 22 },
    ],
  },
  {
    slug: 'sauces',
    label: 'Sauces',
    subtitle: 'On the Side',
    menuType: 'A_LA_CARTE',
    items: [
      { name: 'Creamy Mushroom', price: 5 },
      { name: 'Peppercorn', price: 5 },
      { name: 'Fermented Chilli', price: 6 },
      { name: 'Chimichurri', price: 5 },
      { name: 'Black Garlic & Herb Butter', price: 5 },
    ],
  },
  {
    slug: 'desserts',
    label: 'Desserts',
    subtitle: 'Sweet Endings',
    menuType: 'A_LA_CARTE',
    items: [
      { name: 'Chocolate Fondant', description: 'Hazelnut gelato, praline, dehydrated raspberry', price: 23 },
      { name: 'Basque Cheesecake', description: 'Compressed cherries, vanilla cream, basil', price: 22 },
      { name: 'Sticky Date Pudding', description: 'Salted caramel ice cream, cinnamon anglaise, caramel crisp', price: 22 },
      { name: 'Duo of Sorbet', description: 'Blood orange or mango, berries', price: 14 },
    ],
  },
  {
    slug: 'kids',
    label: 'To Our Little Guests',
    subtitle: 'Kids Menu',
    menuType: 'A_LA_CARTE',
    items: [
      { name: 'Cheese Burger', price: 22 },
      { name: 'Grilled Chicken Tenders', price: 18 },
      { name: 'Mac & Cheese', description: 'Cheddar & mozzarella, béchamel sauce', price: 14 },
    ],
  },

  // ============ LUNCH ============
  {
    slug: 'lunch-set-pricing',
    label: 'Set Menu Pricing',
    subtitle: 'Mon–Fri · 10:30 AM – 3 PM',
    note: 'Available Monday to Friday, 10:30 AM – 3 PM. Not available on public holidays.',
    menuType: 'LUNCH',
    items: [
      { name: 'Mains & House Drink', price: 39 },
      { name: 'Two Courses with House Drink', price: 49 },
      { name: 'Three Courses with House Drink', price: 56, highlight: true },
    ],
  },
  {
    slug: 'lunch-entree',
    label: 'Entrée',
    subtitle: 'Choose One',
    menuType: 'LUNCH',
    items: [
      { name: 'House Made Brioche Rolls', description: 'Smoked honey, parmesan, garlic & walnut crisp' },
      { name: 'Crispy Calamari', description: 'Szechuan honey, fennel, cucumber, soft herbs' },
      { name: "Mayura 'Signature' MB9+ Bresaola", description: 'Cabot cheddar, Guindillas chilli' },
      { name: 'Beetroot Crisp', description: "Burnt honey, goat's curd" },
    ],
  },
  {
    slug: 'lunch-mains',
    label: 'Mains',
    subtitle: 'Choose One',
    menuType: 'LUNCH',
    items: [
      { name: 'Wagyu Meat & Bone Marrow Burger', description: '250g Mayura wagyu beef patty, pickled cucumber, crispy onions, mustard ketchup, melted cheese, toasted brioche bun, crispy chips' },
      { name: 'Crispy Pork Tacos', description: 'Crispy pork belly, fennel & cabbage slaw, kimchi mayo, coriander, crunchy chips' },
      { name: 'Lamb Ragu Pappardelle', description: 'Slow braised in San Marzano tomato, chimichurri, parmesan' },
      { name: 'Steamed Mussels', description: 'Cured ham, thyme, saffron cream, grilled sourdough' },
      { name: 'Pork Milanese', description: 'Parmesan cheese, crispy capers & sage, red wine jus, cos & radicchio salad' },
      { name: 'Seafood Linguine', description: 'Tiger prawns, clams, mussels, calamari, scallops, lobster bisque, cherry tomatoes, capers, chilli' },
      { name: 'Heirloom Beetroots', description: "Goat's curd, burnt honey leek infused lentils, red onion, toasted almonds, pepita seeds, herbs" },
      { name: 'Flamed Chicken', description: 'Open flame chicken, lime & coconut laksa, crispy leaves' },
      { name: 'Slow Cooked Beef Cheek', description: 'Creamy potato mash, honey glazed carrot, kale, crispy onion, gremolata, red wine jus' },
      { name: '200g Eye of Rump', description: 'Signature basting, served with chips, salad or mash' },
      { name: 'Super Food Salad', description: 'Kale, quinoa, apple, halloumi, hummus, almonds, goji berries, pomegranate, honey mustard dressing (optional chicken or salmon)' },
    ],
  },
  {
    slug: 'lunch-desserts',
    label: 'Desserts',
    subtitle: 'Choose One',
    menuType: 'LUNCH',
    items: [
      { name: 'Sticky Date Pudding', description: 'Salted caramel ice cream, cinnamon anglaise, caramel crisp' },
      { name: 'Duo of Sorbet', description: 'Blood orange or mango, berries' },
    ],
  },

  // ============ DRINKS ============
  {
    slug: 'signature-cocktails',
    label: 'Signature Cocktails',
    subtitle: 'House Creations',
    menuType: 'DRINKS',
    items: [
      { name: 'Whiskey Highball', description: 'Single Malt Whiskey with Seasonal Fruit Infused House Made Kombucha', price: 20 },
      { name: 'Clarified New York Sour', description: 'House whiskey, freshly squeezed Lemon Juice, Lactic Acid and Simple Syrup', price: 20 },
      { name: 'Fig and Lime Daiquiri', description: 'Bacardi, Fig Liqueur, Freshly Squeezed Lime Juice and Simple Syrup', price: 21 },
      { name: 'White Beauty', description: 'Absolute Vodka, Yuzu Shu, Curacao, Chardonnay Verjus and Wonder Foam', price: 21 },
    ],
  },
  {
    slug: 'barrel-cocktails',
    label: 'Barrel Cocktails',
    subtitle: 'Aged & Stirred',
    menuType: 'DRINKS',
    items: [
      { name: 'Ember Old Fashioned', description: 'Whiskey, Wattle Seed and Macadamia', price: 21, highlight: true },
      { name: "Ember's Aged Negroni", description: 'Dry Gin, Antica Formula and Campari', price: 21 },
    ],
  },
  {
    slug: 'chilled-martinis',
    label: 'Chilled Martinis',
    subtitle: 'Served Ice-Cold',
    menuType: 'DRINKS',
    items: [
      { name: "Denver's Martini", description: 'Dry Gin, Fruit and Herbs Sgroppino', price: 21 },
      { name: 'Iced Martini (Off–Dry)', description: 'Dry Gin, German Ice Wine, House Made Seasonal Wine Cordial', price: 21 },
    ],
  },
  {
    slug: 'aperitifs-digestifs',
    label: 'Aperitifs / Digestifs',
    subtitle: 'Before & After',
    menuType: 'DRINKS',
    items: [
      { name: 'Ember Spritz', description: 'Sparkling wine, Marionette Bitter, Autonomy Davo Plum and House-made Bergamot Syrup', price: 18 },
      { name: 'Clarified Alexander', description: 'Brandy, Ruby Port, Lemon Juice and Cream De Cacao', price: 20 },
      { name: 'Amaro Saluto', description: 'Montenegro, Apricot, Orgeat and Freshly Squeezed Lime Juice', price: 21 },
    ],
  },
  {
    slug: 'non-alcoholics',
    label: 'Non-Alcoholics',
    subtitle: 'Mocktails',
    note: 'Any House Spirit can be added to these drinks for an additional $7.',
    menuType: 'DRINKS',
    items: [
      { name: 'House Made Chinnoto', description: 'Dehydrated Sustainable Citrus, Organic Herbs and Fermented Brown Sugar', price: 14 },
      { name: 'Kombucha Highball', description: 'House Fermented Kombucha Juice, Bergamot Jus and Natural Molasses', price: 14 },
      { name: 'Sunrise Sour', description: 'Sustainable Orange Cordial, Citrus, Wonder Foam and Simple Syrup', price: 14 },
      { name: 'Floral Garden', description: 'Seedlip Garden, House Made Cordial, Apple Juice', price: 16 },
    ],
  },
  // Wine by the glass (parent + children)
  {
    slug: 'wine-by-glass',
    label: 'Wine by the Glass',
    subtitle: 'Curated Pours',
    menuType: 'DRINKS',
    items: [],
  },
  {
    slug: 'wine-rose-sparkling',
    label: 'Rosé & Sparkling',
    subtitle: 'By the Glass',
    menuType: 'DRINKS',
    parentSlug: 'wine-by-glass',
    items: [
      { name: 'Bandini Prosecco', description: 'Veneto, Italy', price: 14 },
      { name: 'La Galope Rosé', description: 'Côtes de Gascogne, South West France', price: 16 },
      { name: 'Champagne Taittinger Brut Réserve', description: 'Reims, Champagne, France', price: 26, highlight: true },
    ],
  },
  {
    slug: 'wine-whites',
    label: 'Whites',
    subtitle: 'By the Glass',
    menuType: 'DRINKS',
    parentSlug: 'wine-by-glass',
    items: [
      { name: 'Fiano Tellurian', description: 'Heathcote, Victoria', price: 16 },
      { name: 'Catalina Sounds Sauvignon Blanc', description: 'Marlborough, New Zealand', price: 16 },
      { name: 'Single File Chardonnay', description: 'Great Southern, Western Australia', price: 16 },
      { name: 'Handorf Hill Grüner Veltliner', description: 'Adelaide Hills, South Australia', price: 16 },
      { name: 'Maude Pinot Gris', description: 'Central Otago, New Zealand', price: 16 },
    ],
  },
  {
    slug: 'wine-reds',
    label: 'Reds',
    subtitle: 'By the Glass',
    menuType: 'DRINKS',
    parentSlug: 'wine-by-glass',
    items: [
      { name: 'Indigo Vineyard Pinot Noir', description: 'Beechworth, Victoria', price: 16 },
      { name: "Clarendon Hills Grenache 'Domaine Clarendon'", description: 'Blewitt Springs, McLaren Vale', price: 16 },
      { name: 'Moppity Atrius Tempranillo', description: 'Hilltops, NSW', price: 16 },
      { name: "Seppelt's Field Shiraz", description: 'Barossa Valley, South Australia', price: 18 },
      { name: "Penny's Hill Cab Sav Edwards Road", description: 'McLaren Vale, South Australia', price: 18 },
    ],
  },
  {
    slug: 'wine-fortified',
    label: 'Sweet / Fortified Wines',
    subtitle: 'Served 90ml',
    menuType: 'DRINKS',
    parentSlug: 'wine-by-glass',
    items: [
      { name: 'Maxwell Spiced Mead', description: 'McLaren Vale, South Australia', price: 14, priceNote: '90ml' },
      { name: 'Rutherglen Muscadelle Topaque', description: 'Rutherglen, Victoria', price: 14, priceNote: '90ml' },
      { name: 'Rutherglen Tawny', description: 'Rutherglen, Victoria', price: 14, priceNote: '90ml' },
    ],
  },
  // Spirits (parent + children)
  {
    slug: 'spirits',
    label: 'Spirits',
    subtitle: 'The Back Bar',
    menuType: 'DRINKS',
    items: [],
  },
  {
    slug: 'spirits-vodka',
    label: 'Vodka',
    subtitle: 'Back Bar',
    menuType: 'DRINKS',
    parentSlug: 'spirits',
    items: [
      { name: 'Absolut Vodka', price: 14 },
      { name: 'Grey Goose Vodka', price: 17 },
      { name: 'Hartshorn Sheep Whey Vodka', price: 21 },
    ],
  },
  {
    slug: 'spirits-dry-gin',
    label: 'Dry & Aromatic Gins',
    subtitle: 'Back Bar',
    menuType: 'DRINKS',
    parentSlug: 'spirits',
    items: [
      { name: "Melbourne Gin Company 'Dry'", price: 14 },
      { name: 'Patient Wolf Dry Gin', price: 14 },
      { name: 'Tanqueray Gin', price: 14 },
      { name: 'Bombay Sapphire', price: 15 },
      { name: 'Four Pillars', price: 16 },
      { name: "Hendrick's", price: 16 },
      { name: "Archie Rose 'Signature Dry' Gin", price: 16 },
    ],
  },
  {
    slug: 'spirits-fruity-gin',
    label: 'Fruity Gin',
    subtitle: 'Back Bar',
    menuType: 'DRINKS',
    parentSlug: 'spirits',
    items: [
      { name: "Four Pillars 'Bloody Shiraz'", price: 15 },
      { name: 'Plymouth Sloe Gin', price: 15 },
      { name: "Gordon's Pink Gin", price: 15 },
    ],
  },
  {
    slug: 'spirits-whisky',
    label: 'Whisky & Single Malt',
    subtitle: 'Back Bar',
    menuType: 'DRINKS',
    parentSlug: 'spirits',
    items: [
      { name: 'Starward Two-Fold Double Grain Whiskey', price: 13 },
      { name: 'Canadian Club', price: 13.5 },
      { name: 'Johnnie Walker Red Label', price: 14 },
      { name: 'Jameson Irish Whiskey', price: 14 },
      { name: 'Singleton Malt Master Whiskey', price: 14 },
      { name: 'Morris Signature Single Malt', price: 14 },
      { name: 'Monkey Shoulder Blended Malt', price: 14 },
      { name: 'Johnnie Walker 12 Black Label', price: 15 },
      { name: 'Gospel Solera Rye Whiskey', price: 15 },
      { name: 'Glenfiddich 12 Years Old', price: 16 },
      { name: 'Lark Distillery Symphony', price: 16 },
      { name: 'Laphroaig 10 Years Old', price: 16 },
      { name: 'Macallan 12 Years Old', price: 19 },
      { name: 'Johnnie Walker Blue Label', price: 35, highlight: true },
    ],
  },
  {
    slug: 'spirits-japanese-whisky',
    label: 'Japanese Whisky',
    subtitle: 'Back Bar',
    menuType: 'DRINKS',
    parentSlug: 'spirits',
    items: [
      { name: 'Nikka From the Barrel', price: 18 },
      { name: 'Hibiki Harmony', price: 18 },
    ],
  },
  {
    slug: 'spirits-rum',
    label: 'Rum',
    subtitle: 'Back Bar',
    menuType: 'DRINKS',
    parentSlug: 'spirits',
    items: [
      { name: 'Bacardi', price: 12 },
      { name: 'Bundaberg Rum', price: 12 },
    ],
  },
]

async function main() {
  await prisma.menuItem.deleteMany({})
  await prisma.menuSection.deleteMany({})
  await prisma.wineItem.deleteMany({})
  await prisma.wineSection.deleteMany({})

  for (let s = 0; s < sections.length; s++) {
    const { items, ...sectionData } = sections[s]
    const section = await prisma.menuSection.create({
      data: { ...sectionData, sortOrder: s },
    })
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      await prisma.menuItem.create({
        data: {
          sectionId: section.id,
          name: item.name,
          description: item.description ?? '',
          price: item.price ?? null,
          priceNote: item.priceNote ?? null,
          highlight: item.highlight ?? false,
          sortOrder: i,
        },
      })
    }
  }

  const jobCount = await prisma.job.count()
  if (jobCount === 0) {
    await prisma.job.create({
      data: {
        slug: 'sous-chef',
        title: 'Sous Chef',
        department: 'Kitchen',
        type: 'Full-time',
        location: 'Toorak, VIC',
        salary: 'Competitive',
        summary: 'Lead the line alongside our Head Chef in a high-volume, fire-driven kitchen.',
        responsibilities: [
          'Run service across grill, pasta, and raw sections',
          'Mentor junior chefs and apprentices',
          'Maintain consistent plating and timing standards',
        ],
        requirements: [
          '3+ years in a similar role at a hatted or fine-dining venue',
          'Cert III in Commercial Cookery or equivalent',
          'Comfortable working with live fire and dry-aged proteins',
        ],
        published: true,
        sortOrder: 0,
      },
    })
  }

  console.log(`Seeded ${sections.length} menu sections.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
