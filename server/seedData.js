/**
 * server/seedData.js
 *
 * Run this script once to populate the database with sample products.
 * Usage: node seedData.js
 *
 * ⚠️ This script DELETES all existing products before inserting.
 *    Do not run it in production.
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const Product  = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name:        'Cosmic Dreams Tee',
    tagline:     'For those who dream in stardust',
    description: 'A premium graphic tee featuring an original hand-drawn galaxy artwork. Printed using water-based inks that stay soft wash after wash. This piece is for the dreamers who find the universe in everyday moments.',
    price:       799,
    salePrice:   null,
    category:    'graphic-tee',
    isFeatured:  true,
    allowCustomDesign: true,
    printPositions: ['front', 'back'],
    details: {
      fabric:   '100% Combed Cotton',
      fit:      'Regular Fit',
      washCare: 'Machine wash cold, inside out',
      weight:   '180 GSM',
    },
    sizes: [
      { label: 'XS', stock: 5  },
      { label: 'S',  stock: 15 },
      { label: 'M',  stock: 20 },
      { label: 'L',  stock: 18 },
      { label: 'XL', stock: 10 },
      { label: 'XXL',stock: 6  },
    ],
    colors: [
      { name: 'Midnight Black', hexCode: '#1a1a2e' },
      { name: 'Deep Navy',      hexCode: '#1e3a5f' },
      { name: 'Charcoal',       hexCode: '#3d3d3d' },
    ],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    ],
    rating: 4.8,
    numReviews: 34,
  },
  {
    name:        'Plain Essential Tee',
    tagline:     'Simple. Soft. Yours.',
    description: 'The foundation of every great wardrobe. Our plain tee is made from 100% organic cotton with a slight drop-shoulder cut that gives it a relaxed, modern feel. Canvas for your mind, comfort for your body.',
    price:       499,
    salePrice:   399,
    category:    'plain',
    isFeatured:  true,
    allowCustomDesign: true,
    printPositions: ['front', 'back', 'left-sleeve', 'right-sleeve'],
    details: {
      fabric:   '100% Organic Cotton',
      fit:      'Relaxed Fit',
      washCare: 'Machine wash cold',
      weight:   '160 GSM',
    },
    sizes: [
      { label: 'S',  stock: 25 },
      { label: 'M',  stock: 30 },
      { label: 'L',  stock: 30 },
      { label: 'XL', stock: 20 },
      { label: 'XXL',stock: 10 },
    ],
    colors: [
      { name: 'Snow White',     hexCode: '#f9f9f9' },
      { name: 'Vintage Black',  hexCode: '#222222' },
      { name: 'Sand Beige',     hexCode: '#d4b896' },
      { name: 'Sage Green',     hexCode: '#84a98c' },
      { name: 'Dusty Lavender', hexCode: '#b5a8d0' },
    ],
    images: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
    ],
    rating: 4.6,
    numReviews: 89,
  },
  {
    name:        'Urban Oversized Drop',
    tagline:     'Big silhouette, bigger attitude',
    description: 'The oversized tee that\'s taken over every streetwear mood board. A boxy silhouette with dropped shoulders, printed on heavyweight fabric for that premium, substantial feel. Wear it as a top or over a long-sleeve.',
    price:       899,
    category:    'oversized',
    isFeatured:  true,
    allowCustomDesign: true,
    printPositions: ['front', 'back'],
    details: {
      fabric:   '100% Cotton',
      fit:      'Oversized Drop-Shoulder',
      washCare: 'Hand wash cold recommended',
      weight:   '220 GSM',
    },
    sizes: [
      { label: 'S',  stock: 12 },
      { label: 'M',  stock: 15 },
      { label: 'L',  stock: 15 },
      { label: 'XL', stock: 12 },
      { label: 'XXL',stock: 8  },
    ],
    colors: [
      { name: 'Off White',    hexCode: '#f0ece4' },
      { name: 'Washed Black', hexCode: '#2c2c2c' },
      { name: 'Stone Grey',   hexCode: '#7a7a7a' },
    ],
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
    ],
    rating: 4.9,
    numReviews: 52,
  },
  {
    name:        'Brushstroke Art Tee',
    tagline:     'Wear the canvas, be the art',
    description: 'An abstract expressionist graphic tee featuring bold brushstroke art. Limited print run. When you put this on, you\'re not wearing a t-shirt — you\'re wearing a statement that art doesn\'t belong only in galleries.',
    price:       999,
    category:    'graphic-tee',
    isFeatured:  true,
    allowCustomDesign: false,
    details: {
      fabric:   'Cotton-Modal Blend (90/10)',
      fit:      'Slim Fit',
      washCare: 'Machine wash cold, do not tumble dry',
      weight:   '175 GSM',
    },
    sizes: [
      { label: 'XS', stock: 3 },
      { label: 'S',  stock: 8 },
      { label: 'M',  stock: 10 },
      { label: 'L',  stock: 8 },
      { label: 'XL', stock: 5 },
    ],
    colors: [
      { name: 'Natural White', hexCode: '#faf8f5' },
      { name: 'Ink Black',     hexCode: '#111111' },
    ],
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
    ],
    rating: 4.7,
    numReviews: 19,
  },
  {
    name:        'Crop Studio Tee',
    tagline:     'Short on length, long on attitude',
    description: 'A cropped tee for those who wear confidence as an accessory. Cut to hit just above the waist, in our softest cotton blend. Pairs with everything from high-waist jeans to cargo trousers.',
    price:       649,
    category:    'crop',
    isFeatured:  false,
    allowCustomDesign: true,
    printPositions: ['front'],
    details: {
      fabric:   'Cotton-Lycra Blend (95/5)',
      fit:      'Cropped, Slim Fit',
      washCare: 'Machine wash cold',
      weight:   '165 GSM',
    },
    sizes: [
      { label: 'XS', stock: 10 },
      { label: 'S',  stock: 12 },
      { label: 'M',  stock: 10 },
      { label: 'L',  stock: 6  },
    ],
    colors: [
      { name: 'Blush Pink',    hexCode: '#f4a0b0' },
      { name: 'Sky Blue',      hexCode: '#a0c4f4' },
      { name: 'Warm White',    hexCode: '#fefcf7' },
      { name: 'Mocha Brown',   hexCode: '#7d5a4f' },
    ],
    images: [
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600',
    ],
    rating: 4.5,
    numReviews: 28,
  },
  {
    name:        'Your Story Tee (Custom)',
    tagline:     'Designed by you. Made for you.',
    description: 'The blank canvas. Choose this if you want to design entirely from scratch — your photo, your text, your font, your placement. This is the most personal tee you\'ll ever own because it\'s 100% yours.',
    price:       1199,
    category:    'custom',
    isFeatured:  true,
    allowCustomDesign: true,
    printPositions: ['front', 'back', 'left-sleeve', 'right-sleeve'],
    details: {
      fabric:   '100% Ring-Spun Cotton',
      fit:      'Regular Fit (customisable)',
      washCare: 'Machine wash cold, inside out, no bleach',
      weight:   '185 GSM',
    },
    sizes: [
      { label: 'XS', stock: 50 },
      { label: 'S',  stock: 50 },
      { label: 'M',  stock: 50 },
      { label: 'L',  stock: 50 },
      { label: 'XL', stock: 50 },
      { label: 'XXL',stock: 50 },
    ],
    colors: [
      { name: 'Pure White',  hexCode: '#ffffff' },
      { name: 'Jet Black',   hexCode: '#0a0a0a' },
      { name: 'Navy Blue',   hexCode: '#1a237e' },
      { name: 'Bottle Green',hexCode: '#1b5e20' },
      { name: 'Maroon',      hexCode: '#880e4f' },
    ],
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600',
    ],
    rating: 5.0,
    numReviews: 127,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑  Cleared existing products');

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} sample products`);

    console.log('\nProduct names:');
    inserted.forEach((p) => console.log(`  - ${p.name} (${p._id})`));

    await mongoose.disconnect();
    console.log('\n✅ Database seeded successfully. Ready for demo!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedDB();
