import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static public folder for uploads or assets
app.use('/uploads', express.static(path.join(__dirname, 'public/assets')));

// Seed Data
const defaultCategories = [
  { _id: 'cat-theme', name: 'Theme Based Cakes', slug: 'theme', cakeCount: 10 },
  { _id: 'cat-premium', name: 'Premium Flavours', slug: 'premium', cakeCount: 8 },
  { _id: 'cat-regular', name: 'Regular Flavours', slug: 'regular', cakeCount: 8 },
  { _id: 'cat-cheesecake', name: 'Cheesecakes', slug: 'cheesecake', cakeCount: 4 },
  { _id: 'cat-unique', name: 'Unique & Interactive', slug: 'unique', cakeCount: 3 },
  { _id: 'cat-celebration', name: 'Celebration & Festive', slug: 'celebration', cakeCount: 12 },
  { _id: 'cat-cookies', name: 'Cookies & Biscuits', slug: 'cookies', cakeCount: 5 },
  { _id: 'cat-snacks', name: 'Savory Snacks & Breads', slug: 'snacks', cakeCount: 7 }
];

const rawCakes = [
  // 1. Theme Based Cakes
  {
    name: 'Boss Baby 3D Designer Cake',
    slug: 'boss-baby-designer-cake',
    categorySlug: 'theme',
    basePrice: 1299,
    image: '/assets/catalog/boss-baby.jpg',
    flavors: ['Belgian Dark Truffle', 'Dutch Chocolate', 'Butterscotch Crunch'],
    description: 'Artisanal fondant Boss Baby themed celebration cake with edible briefcase, dollar notes, and sunglasses piping.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Avengers Superhero Multiverse Cake',
    slug: 'avengers-superhero-cake',
    categorySlug: 'theme',
    basePrice: 1450,
    image: '/assets/catalog/avengers-theme.jpg',
    flavors: ['Red Velvet Truffle', 'Dark Chocolate Ganache'],
    description: 'Dynamic superhero tier cake featuring edible emblems of Iron Man, Captain America, Thor, and Hulk.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Exotic Jungle Safari Animal Cake',
    slug: 'jungle-safari-animal-cake',
    categorySlug: 'theme',
    basePrice: 1350,
    image: '/assets/catalog/jungle-theme.jpg',
    flavors: ['Fresh Pineapple', 'Madagascar Vanilla'],
    description: 'Charming handcrafted sugar paste jungle figures including lion, giraffe, and elephant over palm leaf piping.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Grand Cricket Stadium Pitch Cake',
    slug: 'cricket-stadium-pitch-cake',
    categorySlug: 'theme',
    basePrice: 1250,
    image: '/assets/catalog/cricket-pitch.jpg',
    flavors: ['Butterscotch Crunch', 'Dutch Chocolate'],
    description: 'Perfect for cricket lovers! Features miniature bat, ball, wickets, and green coconut grass pitch.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Speedster Hot Wheels Car Theme Cake',
    slug: 'speedster-hot-wheels-cake',
    categorySlug: 'theme',
    basePrice: 1399,
    image: '/assets/catalog/car-theme.jpg',
    flavors: ['Rich Chocolate Fudge', 'Belgium Dark Ganache'],
    description: 'High-octane racetrack cake featuring asphalt piping, checkered flags, and miniature race cars.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Magical Fairytale Castle Cake',
    slug: 'magical-fairytale-castle-cake',
    categorySlug: 'theme',
    basePrice: 1699,
    image: '/assets/catalog/fairy-castle.jpg',
    flavors: ['Strawberry Compote', 'Vanilla Cream'],
    description: 'Stunning royal fairytale castle with pastel pink turrets, edible glitter, and gold sugar pearls.',
    isBestseller: false,
    isFeatured: true
  },
  {
    name: 'Fantasy Barbie Ballerina Gown Cake',
    slug: 'fantasy-barbie-ballerina-cake',
    categorySlug: 'theme',
    basePrice: 1550,
    image: '/assets/catalog/fantasy-barbie-doll.jpg',
    flavors: ['Mixed Fruit Fantasy', 'Strawberry Cream'],
    description: 'Elegant doll cake clothed in ruffles of delicate whipped strawberry butter-cream.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Glamour Makeup Vanity Box Cake',
    slug: 'glamour-makeup-vanity-cake',
    categorySlug: 'theme',
    basePrice: 1450,
    image: '/assets/catalog/makeup-theme.jpg',
    flavors: ['Belgian Truffle', 'Nutella Hazelnut'],
    description: 'Complete fashionista treat with edible lipstick, blush brush, compact powder, and eyeshadow palette.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Street Foodie Burger & Fries Cake',
    slug: 'street-foodie-burger-fries-cake',
    categorySlug: 'theme',
    basePrice: 1350,
    image: '/assets/catalog/foodie-theme.jpg',
    flavors: ['Dutch Chocolate', 'Cookies & Cream'],
    description: 'Whimsical illusion cake sculpted to look like a giant gourmet burger with crispy sugar fries.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Playful Masha & The Bear Adventure Cake',
    slug: 'masha-and-bear-adventure-cake',
    categorySlug: 'theme',
    basePrice: 1399,
    image: '/assets/catalog/masha-bear.jpg',
    flavors: ['Fresh Pineapple', 'Berry Bliss'],
    description: 'Adorable forest scene with edible Masha and her friendly Bear companion for kids birthday celebrations.',
    isBestseller: false,
    isFeatured: false
  },

  // 2. Premium Flavours
  {
    name: 'Royal Shahi Rasmalai Cake',
    slug: 'royal-shahi-rasmalai-cake',
    categorySlug: 'premium',
    basePrice: 750,
    image: '/assets/catalog/rasmalai-cake.jpg',
    flavors: ['Kesar Rasmalai Infusion', 'Cardamom Pista Milk'],
    description: 'Our signature Indo-Western creation. Sponge soaked in real saffron Angoori Rasmalai milk, layered with pistachio slivers and dried rose petals.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Pure Belgian Dark Truffle Cake',
    slug: 'pure-belgian-dark-truffle-cake',
    categorySlug: 'premium',
    basePrice: 699,
    image: '/assets/catalog/belgium-chocolate.jpg',
    flavors: ['70% Callebaut Dark Ganache', 'Dutch Truffle'],
    description: 'Deep, decadent 70% dark Belgian chocolate mousse layered between moist chocolate sponge.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Dutch Chocolate Silk Cake',
    slug: 'dutch-chocolate-silk-cake',
    categorySlug: 'premium',
    basePrice: 649,
    image: '/assets/catalog/dutch-chocolate.jpg',
    flavors: ['Dutch Cocoa Silk', 'Velvet Truffle'],
    description: 'Smooth, silken Dutch chocolate cream with glossy mirror-glaze finish.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Ferrero Hazelnut Chocolate Crunch',
    slug: 'ferrero-hazelnut-chocolate-crunch',
    categorySlug: 'premium',
    basePrice: 799,
    image: '/assets/catalog/hazelnut-chocolate.jpg',
    flavors: ['Roasted Hazelnut Praline', 'Nutella Ganache'],
    description: 'Decadent chocolate cake packed with roasted Piedmont hazelnuts and crunchy wafer praline.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Nutella Cream Overload Cake',
    slug: 'nutella-cream-overload-cake',
    categorySlug: 'premium',
    basePrice: 749,
    image: '/assets/catalog/nutella-chocolate.jpg',
    flavors: ['Original Ferrero Nutella', 'Hazelnut Buttercream'],
    description: 'Generously spread with thick Nutella cream and topped with hazelnut swirls.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Almond Nougatine Dark Chocolate',
    slug: 'almond-nougatine-dark-chocolate',
    categorySlug: 'premium',
    basePrice: 699,
    image: '/assets/catalog/chocolate-almond.jpg',
    flavors: ['Toasted Californian Almond', 'Dark Ganache'],
    description: 'Loaded with slow-roasted Californian almonds inside and crowned with crunchy almond flakes.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Crushed Oreo Midnight Fudge Cake',
    slug: 'crushed-oreo-midnight-fudge-cake',
    categorySlug: 'premium',
    basePrice: 649,
    image: '/assets/catalog/oreo-chocolate.jpg',
    flavors: ['Cookies & Cream', 'Dark Chocolate Fudge'],
    description: 'Classic chocolate sponge layered with Oreo cream and topped with mini Oreo biscuits.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Red Velvet Cream Cheese Premium Cake',
    slug: 'red-velvet-cream-cheese-premium',
    categorySlug: 'premium',
    basePrice: 749,
    image: '/assets/catalog/red-velvet-premium.jpg',
    flavors: ['Classic Red Velvet', 'Philadelphia Cream Cheese'],
    description: 'Crimson cocoa sponge complemented by whipped tangy Philadelphia cream cheese frosting.',
    isBestseller: true,
    isFeatured: true
  },

  // 3. Regular Flavours
  {
    name: 'Classic Black Forest Cherry Cake',
    slug: 'classic-black-forest-cherry-cake',
    categorySlug: 'regular',
    basePrice: 499,
    image: '/assets/catalog/black-forest.jpg',
    flavors: ['Black Forest Cherry', 'Kirsch Whipped Cream'],
    description: 'Generously layered with vanilla whipped cream, sour black cherries, and dark chocolate shavings.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Snow White Forest Cake',
    slug: 'snow-white-forest-cake',
    categorySlug: 'regular',
    basePrice: 499,
    image: '/assets/catalog/white-forest.jpg',
    flavors: ['White Chocolate Shavings', 'Fresh Cherry Compote'],
    description: 'Soft vanilla sponge filled with juicy cherries and covered in pure white chocolate curls.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Golden Butterscotch Praline Crunch',
    slug: 'golden-butterscotch-praline-crunch',
    categorySlug: 'regular',
    basePrice: 480,
    image: '/assets/catalog/butterscotch-crunch.jpg',
    flavors: ['Brown Sugar Butterscotch', 'Cashew Praline'],
    description: 'A perennial favorite! Sweet butterscotch caramel cream filled with golden crunchy cashew praline.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Fresh Tropical Pineapple Gateau',
    slug: 'fresh-tropical-pineapple-gateau',
    categorySlug: 'regular',
    basePrice: 450,
    image: '/assets/catalog/pineapple-fresh.jpg',
    flavors: ['Fresh Pineapple Chunks', 'Vanilla Sponge'],
    description: 'Light, moist sponge packed with juicy, hand-diced tropical pineapple chunks and light cream.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Strawberry Fields Garden Cake',
    slug: 'strawberry-fields-garden-cake',
    categorySlug: 'regular',
    basePrice: 460,
    image: '/assets/catalog/strawberry-regular.jpg',
    flavors: ['Mahabaleshwar Strawberry Crush', 'Vanilla Bean'],
    description: 'Infused with sweet Mahabaleshwar strawberry coulis and crowned with pink rosettes.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Blueberry Orchard Bliss Cake',
    slug: 'blueberry-orchard-bliss-cake',
    categorySlug: 'regular',
    basePrice: 490,
    image: '/assets/catalog/blueberry-regular.jpg',
    flavors: ['Wild Blueberry Filling', 'Silky Vanilla Cream'],
    description: 'Tangy Canadian blueberry compote nestled between fluffy layers of sponge cake.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Black Currant Velvet Delight',
    slug: 'black-currant-velvet-delight',
    categorySlug: 'regular',
    basePrice: 480,
    image: '/assets/catalog/black-current.jpg',
    flavors: ['Black Currant Compote', 'Whipped Frosting'],
    description: 'Exotic purple currant cream with balanced tangy notes and crushed fruit bits.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Exotic Mixed Fruit Fiesta',
    slug: 'exotic-mixed-fruit-fiesta',
    categorySlug: 'regular',
    basePrice: 550,
    image: '/assets/catalog/mix-fruit-regular.jpg',
    flavors: ['Fresh Kiwi, Apple, Orange & Cherry', 'Light Custard Cream'],
    description: 'Crowned with an assortment of glazed fresh seasonal fruits over vanilla pastry cream.',
    isBestseller: true,
    isFeatured: true
  },

  // 4. Cheesecakes
  {
    name: 'New York Blueberry Glazed Cheesecake',
    slug: 'ny-blueberry-glazed-cheesecake',
    categorySlug: 'cheesecake',
    basePrice: 899,
    image: '/assets/catalog/blueberry-cheesecake.jpg',
    flavors: ['Baked Philadelphia Cheese', 'Wild Blueberry Coulis'],
    description: 'Slow-baked creamy cheesecake on a crunchy graham cracker crust, topped with rich blueberry glaze.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Lotus Biscoff Speculoos Cheesecake',
    slug: 'lotus-biscoff-speculoos-cheesecake',
    categorySlug: 'cheesecake',
    basePrice: 949,
    image: '/assets/catalog/lotus-biscoff-cheese.jpg',
    flavors: ['Lotus Biscoff Spread', 'Caramelized Biscuit Base'],
    description: 'Infused with Belgian Lotus Biscoff spread and crowned with crushed caramel biscuits.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Cookies & Cream Oreo Cheesecake',
    slug: 'cookies-cream-oreo-cheesecake',
    categorySlug: 'cheesecake',
    basePrice: 879,
    image: '/assets/catalog/oreo-cheesecake.jpg',
    flavors: ['Oreo Cookie Crust', 'Cream Cheese Marble'],
    description: 'Velvety cream cheese packed with chunks of chocolate sandwich cookies over dark biscuit base.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Royal Red Velvet Swirl Cheesecake',
    slug: 'royal-red-velvet-swirl-cheesecake',
    categorySlug: 'cheesecake',
    basePrice: 899,
    image: '/assets/catalog/red-velvet-cheese.jpg',
    flavors: ['Red Velvet Cocoa Swirl', 'Tangy Cream Cheese'],
    description: 'A harmonious hybrid of rich cocoa red velvet cake swirled through New York style cheesecake.',
    isBestseller: false,
    isFeatured: false
  },

  // 5. Unique & Interactive Cakes
  {
    name: 'Tsunami Waterfall Pull-Me-Up Cake',
    slug: 'tsunami-waterfall-pull-me-up-cake',
    categorySlug: 'unique',
    basePrice: 850,
    image: '/assets/catalog/pull-me-up.jpg',
    flavors: ['Warm Molten Chocolate Ganache', 'Hazelnut Crunch'],
    description: 'Interactive celebration showstopper! Pull the transparent collar to release an avalanche of molten Belgian chocolate cascading over your cake.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Explosion Bombshell Surprise Cake',
    slug: 'explosion-bombshell-surprise-cake',
    categorySlug: 'unique',
    basePrice: 999,
    image: '/assets/catalog/bombshell-cake.jpg',
    flavors: ['Dutch Truffle Secret Core', 'Choco Pearls'],
    description: 'Housed in an acrylic shell that opens in four petals to reveal the artisan birthday cake hidden inside.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Golden Heart Smash Dome Pinata Cake',
    slug: 'golden-heart-smash-pinata-cake',
    categorySlug: 'unique',
    basePrice: 950,
    image: '/assets/catalog/dome-pinata.jpg',
    flavors: ['Handcrafted Chocolate Dome', 'Assorted Confections Inside'],
    description: 'Comes with a mini wooden hammer! Smash open the chocolate dome to discover fresh cake, chocolates, and handwritten message.',
    isBestseller: true,
    isFeatured: true
  },

  // 6. Celebration & Festive
  {
    name: 'Silver Jubilee Anniversary Floral Tier Cake',
    slug: 'silver-jubilee-anniversary-cake',
    categorySlug: 'celebration',
    basePrice: 1599,
    image: '/assets/catalog/anniversary-cake.jpg',
    flavors: ['Vanilla Almond', 'Strawberry Rose'],
    description: 'Handcrafted wafer paper flowers, silver leaf accents, and customized anniversary monogram.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Royal Engagement Rings Tier Cake',
    slug: 'royal-engagement-rings-cake',
    categorySlug: 'celebration',
    basePrice: 1750,
    image: '/assets/catalog/engagement-cake.jpg',
    flavors: ['Royal Kesar Pista', 'Belgian White Chocolate'],
    description: 'Multi-tiered luxury engagement centerpiece featuring edible sugar rings and gold leaf embroidery.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Sweet Stork Baby Shower Cake',
    slug: 'sweet-stork-baby-shower-cake',
    categorySlug: 'celebration',
    basePrice: 1299,
    image: '/assets/catalog/baby-shower-cake.jpg',
    flavors: ['Blueberry Vanilla', 'Fresh Mango Cream'],
    description: 'Gentle pastel blue and pink sugar accents with edible baby booties and bunting flags.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Welcome Baby Celebration Cake',
    slug: 'welcome-baby-celebration-cake',
    categorySlug: 'celebration',
    basePrice: 1199,
    image: '/assets/catalog/welcome-baby.jpg',
    flavors: ['Fresh Pineapple', 'Strawberry Cream'],
    description: 'Celebrate the arrival of the newborn with handcrafted teddy bear and baby rattle toppers.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'First Milestone Birthday Crown Cake',
    slug: 'first-milestone-birthday-crown-cake',
    categorySlug: 'celebration',
    basePrice: 1350,
    image: '/assets/catalog/first-birthday-cake.jpg',
    flavors: ['Soft Vanilla Custard', 'Chocolate Silk'],
    description: 'A royal golden crown topper celebrating your little one turning one year old.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Romantic Valentines Velvet Heart Cake',
    slug: 'romantic-valentines-heart-cake',
    categorySlug: 'celebration',
    basePrice: 799,
    image: '/assets/catalog/valentines-heart-cake.jpg',
    flavors: ['Red Velvet Cream Cheese', 'Dark Chocolate Truffle'],
    description: 'Heart-shaped velvet cake topped with fresh strawberries and romantic cursive message piping.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Best Mom In The World Cake',
    slug: 'best-mom-mothers-day-cake',
    categorySlug: 'celebration',
    basePrice: 699,
    image: '/assets/catalog/mothers-day-cake.jpg',
    flavors: ['Rasmalai Kesar', 'Fresh Fruit'],
    description: 'Express your deepest love for Mom with delicate buttercream roses and heartfelt message plaque.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Super Dad Fathers Day Mustache Cake',
    slug: 'super-dad-fathers-day-cake',
    categorySlug: 'celebration',
    basePrice: 699,
    image: '/assets/catalog/fathers-day-cake.jpg',
    flavors: ['Coffee Mocha Truffle', 'Butterscotch Crunch'],
    description: 'Classic navy and gold piping with chocolate mustache and necktie elements.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Sacred Raksha Bandhan Sister-Brother Cake',
    slug: 'raksha-bandhan-celebration-cake',
    categorySlug: 'celebration',
    basePrice: 650,
    image: '/assets/catalog/raksha-bandhan-cake.jpg',
    flavors: ['Kaju Katli Kesar Cream', 'Dry Fruit Symphony'],
    description: 'Edible fondant Rakhi motif celebrating sibling love with traditional festive flavors.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Lord Krishna Janmashtami Makhan Cake',
    slug: 'lord-krishna-janmashtami-cake',
    categorySlug: 'celebration',
    basePrice: 750,
    image: '/assets/catalog/janmashtami-cake.jpg',
    flavors: ['Shahi Malai Peda', 'Pista Kesar'],
    description: 'Miniature clay pot (Matki) sculpted from chocolate with butter cream spilling over.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Auspicious Ganesh Modak Truffle Cake',
    slug: 'auspicious-ganesh-modak-truffle-cake',
    categorySlug: 'celebration',
    basePrice: 799,
    image: '/assets/catalog/modak-cake.jpg',
    flavors: ['Jaggery Coconut Praline', 'Dark Chocolate'],
    description: 'Fusion festive celebration cake adorned with handcrafted golden modak bonbons.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Diwali Shubh Deepavali Sparkle Cake',
    slug: 'diwali-shubh-deepavali-cake',
    categorySlug: 'celebration',
    basePrice: 850,
    image: '/assets/catalog/diwali-greeting.jpg',
    flavors: ['Kesar Badam Praline', 'Belgium Truffle'],
    description: 'Decorated with golden edible diyas and rangoli patterns for the festival of lights.',
    isBestseller: false,
    isFeatured: false
  },

  // 7. Cookies & Biscuits
  {
    name: 'Artisan Almond Crunch Cookies (250g)',
    slug: 'artisan-almond-crunch-cookies',
    categorySlug: 'cookies',
    basePrice: 180,
    image: '/assets/catalog/almond-crunch-cookies.jpg',
    flavors: ['Toasted Almond', 'Pure Cow Butter'],
    description: 'Crunchy golden baked butter cookies loaded with sliced roasted almonds.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Loaded Choco Chips Butter Cookies (250g)',
    slug: 'loaded-choco-chips-cookies',
    categorySlug: 'cookies',
    basePrice: 160,
    image: '/assets/catalog/choco-chips-cookies.jpg',
    flavors: ['Belgian Choco Chips', 'Vanilla Butter'],
    description: 'Crispy cookies loaded with premium dark and milk chocolate chips in every bite.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Rich Cashew Nut Nan Khatai (250g)',
    slug: 'rich-cashew-nut-nan-khatai',
    categorySlug: 'cookies',
    basePrice: 175,
    image: '/assets/catalog/cashew-nuts-cookies.jpg',
    flavors: ['Cardamom Cashew', 'Desi Ghee'],
    description: 'Melt-in-mouth traditional Gujarat bakery nan khatai biscuits baked with pure ghee.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Mix Dry Fruit Shahi Cookies (300g)',
    slug: 'mix-dry-fruit-shahi-cookies',
    categorySlug: 'cookies',
    basePrice: 220,
    image: '/assets/catalog/mix-dry-fruit-cookies.jpg',
    flavors: ['Pista, Badam & Kaju', 'Butter Cookie'],
    description: 'Packed with crushed pistachios, almonds, and cashew nuts for tea-time indulgence.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Toasted Coconut Delight Macaroon Biscuits',
    slug: 'toasted-coconut-delight-biscuits',
    categorySlug: 'cookies',
    basePrice: 150,
    image: '/assets/catalog/coconut-delight-cookies.jpg',
    flavors: ['Desiccated Coconut', 'Golden Butter'],
    description: 'Golden toasted coconut flakes give these crunchy cookies a tropical aroma.',
    isBestseller: false,
    isFeatured: false
  },

  // 8. Savory Snacks & Breads
  {
    name: 'Shree Bhuvneshwari Masala Garlic Khari (200g)',
    slug: 'bhuvneshwari-masala-garlic-khari',
    categorySlug: 'snacks',
    basePrice: 95,
    image: '/assets/catalog/masala-garlic-khari.jpg',
    flavors: ['Roasted Garlic & Cumin', 'Flaky Puff Pastry'],
    description: 'Darshil Panchasara’s iconic Gujarat bakery puff pastry layered with aromatic garlic and cumin spices.',
    isBestseller: true,
    isFeatured: true
  },
  {
    name: 'Classic Single Bite Maska Khari (250g)',
    slug: 'classic-single-bite-maska-khari',
    categorySlug: 'snacks',
    basePrice: 90,
    image: '/assets/catalog/single-bite-khari.jpg',
    flavors: ['Pure Butter Layered', 'Crispy Golden Flakes'],
    description: 'Super-crispy golden puff pastry bites made to dip in hot masala chai.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Spicy Potato & Pea Bakery Puffs (4 pcs)',
    slug: 'spicy-potato-pea-bakery-puffs',
    categorySlug: 'snacks',
    basePrice: 120,
    image: '/assets/catalog/bakery-puffs.jpg',
    flavors: ['Spiced Aloo Mutter', 'Crisp Puff Shell'],
    description: 'Freshly baked flaky pastry stuffed with seasoned potato and green peas.',
    isBestseller: true,
    isFeatured: false
  },
  {
    name: 'Sweet Cream Horn Rolls (Pack of 4)',
    slug: 'sweet-cream-horn-rolls',
    categorySlug: 'snacks',
    basePrice: 140,
    image: '/assets/catalog/cream-roll.jpg',
    flavors: ['Vanilla Cream Filling', 'Flaky Horn Shell'],
    description: 'Crispy horn-shaped baked pastry stuffed to the brim with fluffy sweet vanilla cream.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Assorted Choco & Vanilla Muffins (Pack of 6)',
    slug: 'assorted-choco-vanilla-muffins',
    categorySlug: 'snacks',
    basePrice: 180,
    image: '/assets/catalog/muffins-pack.jpg',
    flavors: ['Chocolate Chip & Blueberry', 'Golden Sponge'],
    description: 'Soft, moist eggless tea muffins crowned with chocolate chunks and sugar crystals.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Fresh Daily Baked Pav Breads (Pack of 6)',
    slug: 'fresh-daily-baked-pav-breads',
    categorySlug: 'snacks',
    basePrice: 40,
    image: '/assets/catalog/pav-breads.jpg',
    flavors: ['Pillowy Milk Bread', 'Sesame Crust'],
    description: 'Pillowy soft artisan pav baked fresh every morning without preservatives.',
    isBestseller: false,
    isFeatured: false
  },
  {
    name: 'Golden Elaichi Premium Toast Rusks (300g)',
    slug: 'golden-elaichi-premium-toast-rusks',
    categorySlug: 'snacks',
    basePrice: 110,
    image: '/assets/catalog/premium-rusks.jpg',
    flavors: ['Fragrant Cardamom', 'Double Baked Rusk'],
    description: 'Double baked extra-crisp toast flavored with freshly ground green cardamom.',
    isBestseller: true,
    isFeatured: false
  }
];

// Helper to format cakes
const categoriesMap = {};
defaultCategories.forEach((c) => {
  categoriesMap[c.slug] = c;
});

let cakes = rawCakes.map((c, i) => {
  const cat = categoriesMap[c.categorySlug] || { _id: 'cat-all', name: 'Artisan Bakes', slug: c.categorySlug };
  const basePrice = c.basePrice;
  return {
    _id: `cake-${i + 1}`,
    name: c.name,
    slug: c.slug,
    category: cat,
    categorySlug: c.categorySlug,
    categoryName: cat.name,
    basePrice,
    images: [c.image, '/assets/catalog/cakepool-brand-banner.jpg'],
    rating: Number((4.6 + (i % 5) * 0.08).toFixed(1)),
    numReviews: 24 + (i * 7) % 85,
    isBestseller: !!c.isBestseller,
    isFeatured: !!c.isFeatured,
    isEggless: true,
    isGlutenFree: i % 7 === 0,
    flavors: c.flavors,
    weightOptions: [
      { weight: '0.5 kg', servings: '4-6 Slices', price: Math.round(basePrice * 0.7), isDefault: false },
      { weight: '1.0 kg', servings: '8-10 Slices', price: basePrice, isDefault: true },
      { weight: '1.5 kg', servings: '12-14 Slices', price: Math.round(basePrice * 1.45), isDefault: false },
      { weight: '2.0 kg', servings: '16-20 Slices', price: Math.round(basePrice * 1.9), isDefault: false }
    ],
    description: c.description,
    ingredients: '100% Pure Vegetarian Eggless Sponge, Callebaut Cocoa, Real Dairy Cream, Pure Saffron, Fine Pistachio & Almond slivers, Natural Fruit Compote.',
    shelfLife: '3-4 Days (Refrigerate below 5°C)',
    storageInstructions: 'Store in airtight box inside the refrigerator. Keep away from direct sunlight.'
  };
});

let categories = [...defaultCategories];

// In-Memory Database for Users, Orders, Coupons, Reviews, Custom Orders
let users = [
  {
    _id: 'user-admin',
    name: 'Darshil Panchasara (Head Chef)',
    email: 'admin@bhuvneshwari.com',
    role: 'admin',
    phone: '+91 98765 43210',
    addresses: [
      {
        name: 'Darshil Panchasara',
        phone: '+91 98765 43210',
        street: 'Shree Bhuvneshwari Cake Shop, Main Road',
        apartment: 'Opp. City Garden',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        isDefault: true
      }
    ],
    wishlist: ['cake-1', 'cake-11']
  },
  {
    _id: 'user-guest',
    name: 'Sweet Patron',
    email: 'guest@sweetcrumbs.com',
    role: 'customer',
    phone: '+91 91234 56789',
    addresses: [
      {
        name: 'Sweet Patron',
        phone: '+91 91234 56789',
        street: '402, Lotus Residency, SG Highway',
        apartment: 'B-Block',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380054',
        isDefault: true
      }
    ],
    wishlist: []
  }
];

let currentUser = users[0]; // Admin by default so all features & admin panel work immediately

let coupons = [
  {
    _id: 'cpn-1',
    code: 'BHUVNESHWARI15',
    discountPercentage: 15,
    minOrderAmount: 499,
    maxDiscountAmount: 250,
    validUntil: '2026-12-31',
    description: '15% Off on all signature celebration cakes'
  },
  {
    _id: 'cpn-2',
    code: 'SWEET10',
    discountPercentage: 10,
    minOrderAmount: 299,
    maxDiscountAmount: 150,
    validUntil: '2026-12-31',
    description: 'Flat 10% discount on sweet delights'
  },
  {
    _id: 'cpn-3',
    code: 'DARSHIL25',
    discountPercentage: 25,
    minOrderAmount: 999,
    maxDiscountAmount: 500,
    validUntil: '2026-12-31',
    description: "Chef Darshil's VIP 25% anniversary discount"
  }
];

let reviews = [
  {
    _id: 'rev-1',
    cakeId: 'cake-11',
    userName: 'Pooja Patel',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: 'The Royal Rasmalai cake was the highlight of our engagement party! 100% eggless, so soft and authentic kesar aroma.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'rev-2',
    cakeId: 'cake-1',
    userName: 'Aarav Mehta',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: 'Boss Baby cake was crafted with such perfection! My son was overjoyed. Thank you Darshil bhai!',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'rev-3',
    cakeId: 'cake-12',
    userName: 'Rhea Shah',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    comment: 'The Belgian Truffle is rich, dark and heavenly. Best patisserie in Gujarat!',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

let orders = [
  {
    _id: 'BCS-98421',
    user: users[0],
    orderItems: [
      {
        cake: 'cake-11',
        name: 'Royal Shahi Rasmalai Cake',
        image: '/assets/catalog/rasmalai-cake.jpg',
        weight: '1.0 kg',
        price: 750,
        flavor: 'Kesar Rasmalai Infusion',
        isEggless: true,
        messageOnCake: 'Happy 25th Silver Jubilee Mom & Dad',
        finishingStyle: 'Cursive Cream Piping',
        quantity: 1
      }
    ],
    shippingAddress: users[0].addresses[0],
    deliverySlot: {
      date: 'Today',
      timeSlot: '5:00 PM – 7:00 PM'
    },
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    subtotal: 750,
    discountAmount: 112.5,
    deliveryFee: 0,
    totalPrice: 637.5,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: 'BCS-98418',
    user: users[1],
    orderItems: [
      {
        cake: 'cake-12',
        name: 'Pure Belgian Dark Truffle Cake',
        image: '/assets/catalog/belgium-chocolate.jpg',
        weight: '1.0 kg',
        price: 699,
        flavor: '70% Callebaut Dark Ganache',
        isEggless: true,
        messageOnCake: 'Happy Birthday Rohan! 🎂',
        finishingStyle: 'Chocolate Plaque',
        quantity: 1
      }
    ],
    shippingAddress: users[1].addresses[0],
    deliverySlot: {
      date: 'Yesterday',
      timeSlot: '2:00 PM – 4:00 PM'
    },
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    subtotal: 699,
    discountAmount: 69.9,
    deliveryFee: 0,
    totalPrice: 629.1,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

let customOrders = [
  {
    _id: 'CUST-1042',
    customerName: 'Kavita Joshi',
    customerEmail: 'kavita@gmail.com',
    customerPhone: '+91 99887 76655',
    occasion: 'Wedding Sangeet',
    servings: '40-50 guests (5.0 kg)',
    flavor: 'Belgian Truffle + Saffron Pistachio 3-Tier',
    dietary: ['100% Eggless', 'Nut Free Tier'],
    budget: '₹8,000 – ₹12,000',
    deliveryDate: '2026-10-25',
    specialInstructions: 'Need cascading sugar orchids and edible gold leaf monogram with K & R.',
    status: 'Reviewing',
    createdAt: new Date().toISOString()
  }
];

// --- ROUTES ---

// 1. Categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, categories });
});

app.post('/api/categories', (req, res) => {
  const { name, slug } = req.body;
  const newCat = {
    _id: `cat-${Date.now()}`,
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    cakeCount: 0
  };
  categories.push(newCat);
  res.status(201).json({ success: true, category: newCat });
});

app.delete('/api/categories/:id', (req, res) => {
  categories = categories.filter((c) => c._id !== req.params.id && c.slug !== req.params.id);
  res.json({ success: true, message: 'Category removed' });
});

// 2. Cakes - Featured & Bestsellers
app.get('/api/cakes/featured', (req, res) => {
  const featured = cakes.filter((c) => c.isFeatured);
  const bestsellers = cakes.filter((c) => c.isBestseller);
  res.json({
    success: true,
    featured: featured.length ? featured : cakes.slice(0, 8),
    bestsellers: bestsellers.length ? bestsellers : cakes.slice(0, 8)
  });
});

// 3. Cakes - Catalog with filter, search, sort, pagination
app.get('/api/cakes', (req, res) => {
  let { search, category, maxPrice, isEggless, isGlutenFree, flavor, weight, sort, page = 1, limit = 12 } = req.query;

  let results = [...cakes];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.categoryName && c.categoryName.toLowerCase().includes(q))
    );
  }

  if (category && category !== 'all') {
    results = results.filter(
      (c) => c.categorySlug === category || (c.category && c.category.slug === category)
    );
  }

  if (maxPrice && Number(maxPrice) > 0) {
    results = results.filter((c) => c.basePrice <= Number(maxPrice));
  }

  if (isEggless === 'true') {
    results = results.filter((c) => c.isEggless);
  }

  if (isGlutenFree === 'true') {
    results = results.filter((c) => c.isGlutenFree);
  }

  if (flavor) {
    results = results.filter(
      (c) => c.flavors && c.flavors.some((f) => f.toLowerCase().includes(flavor.toLowerCase()))
    );
  }

  if (weight) {
    results = results.filter(
      (c) => c.weightOptions && c.weightOptions.some((w) => w.weight === weight)
    );
  }

  // Sorting
  if (sort === 'price-low') {
    results.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sort === 'price-high') {
    results.sort((a, b) => b.basePrice - a.basePrice);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else {
    // default 'bestseller'
    results.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
  }

  const totalCakes = results.length;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const pages = Math.ceil(totalCakes / limitNum) || 1;
  const offset = (pageNum - 1) * limitNum;
  const paginated = results.slice(offset, offset + limitNum);

  res.json({
    success: true,
    cakes: paginated,
    totalCakes,
    pages,
    currentPage: pageNum
  });
});

// 4. Cake Details by ID or Slug
app.get('/api/cakes/:identifier', (req, res) => {
  const { identifier } = req.params;
  const cake = cakes.find((c) => c._id === identifier || c.slug === identifier);
  if (!cake) {
    return res.status(404).json({ success: false, message: 'Cake not found' });
  }

  const relatedCakes = cakes
    .filter((c) => c._id !== cake._id && c.categorySlug === cake.categorySlug)
    .slice(0, 4);

  const cakeReviews = reviews.filter((r) => r.cakeId === cake._id);

  res.json({
    success: true,
    cake,
    relatedCakes: relatedCakes.length ? relatedCakes : cakes.filter((c) => c._id !== cake._id).slice(0, 4),
    reviews: cakeReviews
  });
});

// Admin Add Cake
app.post('/api/cakes', (req, res) => {
  const payload = req.body;
  const cat = categories.find((c) => c._id === payload.category || c.slug === payload.category) || categories[0];
  const newCake = {
    _id: `cake-${Date.now()}`,
    name: payload.name || 'Artisan Celebration Cake',
    slug: payload.name ? payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `cake-${Date.now()}`,
    category: cat,
    categorySlug: cat.slug,
    categoryName: cat.name,
    basePrice: Number(payload.basePrice) || 599,
    images: payload.images && payload.images.length ? payload.images : ['/assets/catalog/belgium-chocolate.jpg'],
    rating: 5.0,
    numReviews: 1,
    isBestseller: !!payload.isBestseller,
    isFeatured: !!payload.isFeatured,
    isEggless: true,
    isGlutenFree: !!payload.isGlutenFree,
    flavors: payload.flavors || ['Belgian Chocolate', 'Vanilla Truffle'],
    weightOptions: payload.weightOptions || [
      { weight: '1.0 kg', servings: '8-10 Slices', price: Number(payload.basePrice) || 599, isDefault: true }
    ],
    description: payload.description || 'Freshly baked artisanal specialty.',
    ingredients: payload.ingredients || 'Flour, Dairy butter, cocoa, sugar.',
    shelfLife: '3-4 Days refrigerated',
    storageInstructions: 'Refrigerate below 5°C.'
  };

  cakes.unshift(newCake);
  res.status(201).json({ success: true, cake: newCake });
});

// Admin Edit Cake
app.put('/api/cakes/:id', (req, res) => {
  const idx = cakes.findIndex((c) => c._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Cake not found' });

  cakes[idx] = { ...cakes[idx], ...req.body };
  res.json({ success: true, cake: cakes[idx] });
});

// Admin Delete Cake
app.delete('/api/cakes/:id', (req, res) => {
  cakes = cakes.filter((c) => c._id !== req.params.id);
  res.json({ success: true, message: 'Cake deleted' });
});

// 5. Auth
app.get('/api/auth/me', (req, res) => {
  res.json({ success: true, user: currentUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  let user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    user = {
      _id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: email.includes('admin') ? 'admin' : 'customer',
      phone: '+91 98765 00000',
      addresses: [],
      wishlist: []
    };
    users.push(user);
  }
  currentUser = user;
  res.json({
    success: true,
    user,
    token: `token-${user._id}-${Date.now()}`
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone } = req.body;
  const user = {
    _id: `user-${Date.now()}`,
    name: name || 'Sweet Patron',
    email: email || `user${Date.now()}@sweetcrumbs.com`,
    phone: phone || '+91 98765 43210',
    role: email && email.includes('admin') ? 'admin' : 'customer',
    addresses: [],
    wishlist: []
  };
  users.push(user);
  currentUser = user;
  res.status(201).json({
    success: true,
    user,
    token: `token-${user._id}-${Date.now()}`
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

app.put('/api/auth/profile', (req, res) => {
  currentUser = { ...currentUser, ...req.body };
  const uIdx = users.findIndex((u) => u._id === currentUser._id);
  if (uIdx !== -1) users[uIdx] = currentUser;
  res.json({ success: true, user: currentUser });
});

app.post('/api/auth/wishlist/:cakeId', (req, res) => {
  const { cakeId } = req.params;
  const exists = currentUser.wishlist.includes(cakeId);
  let action = '';
  if (exists) {
    currentUser.wishlist = currentUser.wishlist.filter((id) => id !== cakeId);
    action = 'removed';
  } else {
    currentUser.wishlist.push(cakeId);
    action = 'added';
  }
  res.json({
    success: true,
    wishlist: currentUser.wishlist,
    action,
    message: action === 'added' ? 'Saved to your Patisserie wishlist! ❤️' : 'Removed from wishlist'
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  res.json({ success: true, message: 'Password reset link sent to your registered email.' });
});

// 6. Reviews
app.get('/api/reviews', (req, res) => {
  res.json({ success: true, reviews });
});

app.post('/api/reviews/cake/:cakeId', (req, res) => {
  const { cakeId } = req.params;
  const { rating = 5, comment = '' } = req.body;
  const newReview = {
    _id: `rev-${Date.now()}`,
    cakeId,
    userName: currentUser?.name || 'Sweet Patron',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  };
  reviews.unshift(newReview);

  // Update cake rating
  const cake = cakes.find((c) => c._id === cakeId);
  if (cake) {
    cake.numReviews = (cake.numReviews || 0) + 1;
    cake.rating = Number((((cake.rating || 4.8) * (cake.numReviews - 1) + Number(rating)) / cake.numReviews).toFixed(1));
  }

  res.status(201).json({
    success: true,
    review: newReview,
    cakeRating: cake?.rating || rating,
    numReviews: cake?.numReviews || 1
  });
});

app.delete('/api/reviews/:id', (req, res) => {
  reviews = reviews.filter((r) => r._id !== req.params.id);
  res.json({ success: true, message: 'Review removed' });
});

// 7. Coupons
app.get('/api/coupons', (req, res) => {
  res.json({ success: true, coupons });
});

app.post('/api/coupons', (req, res) => {
  const newCpn = {
    _id: `cpn-${Date.now()}`,
    ...req.body
  };
  coupons.push(newCpn);
  res.status(201).json({ success: true, coupon: newCpn });
});

app.delete('/api/coupons/:id', (req, res) => {
  coupons = coupons.filter((c) => c._id !== req.params.id);
  res.json({ success: true, message: 'Coupon removed' });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, orderAmount = 0 } = req.body;
  const found = coupons.find((c) => c.code.toUpperCase() === (code || '').toUpperCase());

  if (!found) {
    return res.status(404).json({ success: false, message: 'Invalid promo code. Try BHUVNESHWARI15 or SWEET10' });
  }

  if (orderAmount < (found.minOrderAmount || 0)) {
    return res.status(400).json({
      success: false,
      message: `Minimum order value of ₹${found.minOrderAmount} required for coupon ${found.code}.`
    });
  }

  let discount = (orderAmount * found.discountPercentage) / 100;
  if (found.maxDiscountAmount && discount > found.maxDiscountAmount) {
    discount = found.maxDiscountAmount;
  }
  discount = Number(discount.toFixed(2));

  res.json({
    success: true,
    coupon: {
      ...found,
      discountAmount: discount
    }
  });
});

// 8. Orders
app.post('/api/orders', (req, res) => {
  const payload = req.body;
  const items = payload.orderItems || [];
  const subtotal = items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0);
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  let discountAmount = 0;

  if (payload.couponCode) {
    const cpn = coupons.find((c) => c.code.toUpperCase() === payload.couponCode.toUpperCase());
    if (cpn) {
      discountAmount = Math.min((subtotal * cpn.discountPercentage) / 100, cpn.maxDiscountAmount || 500);
    }
  }

  const totalPrice = Number((subtotal - discountAmount + deliveryFee).toFixed(2));
  const newOrder = {
    _id: `BCS-${Math.floor(10000 + Math.random() * 90000)}`,
    user: currentUser,
    orderItems: items,
    shippingAddress: payload.shippingAddress,
    deliverySlot: payload.deliverySlot || { date: 'Tomorrow', timeSlot: '2:00 PM – 4:00 PM' },
    paymentMethod: payload.paymentMethod || 'UPI',
    paymentStatus: payload.paymentMethod === 'COD' ? 'Pending' : 'Paid',
    orderStatus: 'Confirmed',
    subtotal,
    discountAmount,
    deliveryFee,
    totalPrice,
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);

  res.status(201).json({
    success: true,
    order: newOrder
  });
});

app.get('/api/orders/my-orders', (req, res) => {
  res.json({ success: true, orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((o) => o._id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
});

app.put('/api/orders/:id/cancel', (req, res) => {
  const order = orders.find((o) => o._id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.orderStatus = 'Cancelled';
  res.json({ success: true, order });
});

app.post('/api/orders/:id/verify-payment', (req, res) => {
  const order = orders.find((o) => o._id === req.params.id);
  if (order) {
    order.paymentStatus = 'Paid';
  }
  res.json({ success: true, message: 'Payment verified successfully', order });
});

// Admin Orders
app.get('/api/admin/orders', (req, res) => {
  const { status } = req.query;
  let filtered = [...orders];
  if (status && status !== 'all') {
    filtered = filtered.filter((o) => o.orderStatus.toLowerCase() === status.toLowerCase());
  }
  res.json({ success: true, orders: filtered });
});

app.put('/api/admin/orders/:id/status', (req, res) => {
  const order = orders.find((o) => o._id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.orderStatus = req.body.status || order.orderStatus;
  res.json({ success: true, order });
});

// 9. Custom Orders
app.post('/api/custom-orders', (req, res) => {
  const newReq = {
    _id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body,
    status: 'Pending Review',
    createdAt: new Date().toISOString()
  };
  customOrders.unshift(newReq);
  res.status(201).json({ success: true, customOrder: newReq });
});

app.get('/api/custom-orders', (req, res) => {
  res.json({ success: true, customOrders });
});

app.put('/api/custom-orders/:id', (req, res) => {
  const c = customOrders.find((x) => x._id === req.params.id);
  if (!c) return res.status(404).json({ success: false, message: 'Custom order not found' });
  Object.assign(c, req.body);
  res.json({ success: true, customOrder: c });
});

// 10. Admin Users
app.get('/api/admin/users', (req, res) => {
  res.json({ success: true, users });
});

app.put('/api/admin/users/:id/role', (req, res) => {
  const user = users.find((u) => u._id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.role = req.body.role || user.role;
  res.json({ success: true, user });
});

// 11. Admin Dashboard Stats
app.get('/api/admin/dashboard', (req, res) => {
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.totalPrice : 0), 48500);
  const totalOrders = orders.length + 65;
  const totalCakesCount = cakes.length;
  const totalUsersCount = users.length + 120;
  const pendingCustom = customOrders.filter((c) => c.status !== 'Completed').length;

  const orderStatusMap = {
    Confirmed: orders.filter((o) => o.orderStatus === 'Confirmed').length + 8,
    Baking: orders.filter((o) => o.orderStatus === 'Baking').length + 5,
    'Out for Delivery': orders.filter((o) => o.orderStatus === 'Out for Delivery').length + 3,
    Delivered: orders.filter((o) => o.orderStatus === 'Delivered').length + 48,
    Cancelled: orders.filter((o) => o.orderStatus === 'Cancelled').length + 1
  };

  const topProducts = cakes.filter((c) => c.isBestseller).slice(0, 5).map((c) => ({
    name: c.name,
    salesCount: c.numReviews * 3,
    revenue: c.numReviews * 3 * c.basePrice
  }));

  const monthlySales = [
    { month: 'Jun', sales: 42000 },
    { month: 'Jul', sales: 55000 },
    { month: 'Aug', sales: 68000 },
    { month: 'Sep', sales: 82000 },
    { month: 'Oct', sales: 94000 }
  ];

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      totalCakes: totalCakesCount,
      totalUsers: totalUsersCount,
      pendingCustomOrders: pendingCustom,
      orderStatusMap,
      recentOrders: orders.slice(0, 5),
      topProducts,
      monthlySales
    }
  });
});

app.listen(PORT, () => {
  console.log(`🍰 Bhuvneshwari Cake Shop Backend API Server listening on http://localhost:${PORT}`);
});
