window.STICKER_DATA = {
  products: [
    {
      id: 'holo-legend-pack',
      name: 'Holo Legend Pack',
      category: 'Premium',
      price: 24,
      badge: 'Best Seller',
      description: '8 holographic die-cut stickers for creators, streamers, and premium brands.',
      features: ['Weatherproof laminate', 'Mirror holo finish', 'Ready in 5 business days']
    },
    {
      id: 'startup-launch-kit',
      name: 'Startup Launch Kit',
      category: 'Business',
      price: 39,
      badge: 'Popular',
      description: '20 matte logo stickers tailored for product launches, packaging, and events.',
      features: ['CMYK color matched', 'Perfect for shipping boxes', 'Bulk reorders saved in admin']
    },
    {
      id: 'artist-mini-drop',
      name: 'Artist Mini Drop',
      category: 'Creator',
      price: 18,
      badge: 'New',
      description: '12 glossy stickers optimized for illustrators selling limited edition drops.',
      features: ['Gloss finish', 'Small batch friendly', 'QR code add-on ready']
    },
    {
      id: 'event-swag-sheet',
      name: 'Event Swag Sheet',
      category: 'Events',
      price: 29,
      badge: 'Fast Turn',
      description: 'A5 custom sticker sheets for conferences, schools, and community campaigns.',
      features: ['Sheet kiss-cut layout', 'Rush production option', 'Ideal for giveaways']
    }
  ],
  metrics: {
    turnaround: '3-7 days',
    satisfaction: '98%',
    countries: '22+'
  },
  payoneer: {
    accountName: 'Your Studio Payoneer Account',
    email: 'payments@yourstickerstudio.com',
    note: 'Customers can request payment from card, bank, wallet, or marketplace balance. You receive settlement through your Payoneer workflow after manual confirmation.'
  },
  adminCredentials: {
    username: 'admin',
    password: 'stickers123'
  },
  seedOrders: [
    {
      id: 'ORD-1024',
      customer: 'Lina from Pixel Nest',
      productId: 'startup-launch-kit',
      qty: 3,
      amount: 117,
      paymentPlatform: 'PayPal',
      status: 'Awaiting Payment Proof',
      payoutRoute: 'Payoneer settlement queue',
      date: '2026-03-18'
    },
    {
      id: 'ORD-1023',
      customer: 'Jules Artist Shop',
      productId: 'artist-mini-drop',
      qty: 8,
      amount: 144,
      paymentPlatform: 'Card',
      status: 'Paid',
      payoutRoute: 'Paid out to Payoneer',
      date: '2026-03-17'
    }
  ]
};
