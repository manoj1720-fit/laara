/**
 * LAARA – Product Data
 * Edit this file to add, remove, or update products.
 * All prices in Indian Rupees (₹).
 */

const LAARA_PRODUCTS = [
  {
    id: 1,
    name: "Classic Luxe Leggings",
    category: "everyday",
    categoryLabel: "Everyday Wear",
    badge: "Best Seller",
    price: 999,
    originalPrice: 1299,
    description: "Our signature everyday leggings crafted from ultra-soft, four-way stretch fabric. High-waisted with a comfortable wide waistband — perfect from morning coffee to evening walks.",
    colors: [
      { name: "Midnight Black", hex: "#111111" },
      { name: "Warm Ivory",     hex: "#F5ECD7" },
      { name: "Deep Navy",      hex: "#1B2A4A" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    bgGradient: "linear-gradient(160deg, #1a1a2e 0%, #111 60%, #2d2d44 100%)",
    features: [
      "4-way stretch fabric",
      "High-rise waistband",
      "Moisture-wicking",
      "Squat proof"
    ]
  },
  {
    id: 2,
    name: "Golden Hour Leggings",
    category: "active",
    categoryLabel: "Active",
    badge: "New",
    price: 1199,
    originalPrice: null,
    description: "Bold and beautiful, the Golden Hour is designed for those who refuse to blend in. Premium compression fabric with a golden shimmer stripe down each side.",
    colors: [
      { name: "Golden Black",   hex: "#F9C747" },
      { name: "Obsidian",       hex: "#1a1a1a" },
      { name: "Caramel",        hex: "#C68642" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    bgGradient: "linear-gradient(135deg, #F9C747 0%, #e8b430 40%, #111 100%)",
    features: [
      "Compression fabric",
      "Side pocket",
      "Golden stripe detail",
      "High-rise"
    ]
  },
  {
    id: 3,
    name: "Soft Cloud Lounge Pants",
    category: "lounge",
    categoryLabel: "Lounge",
    badge: null,
    price: 849,
    originalPrice: 1099,
    description: "Sink into comfort with our Cloud Lounge Pants. Feather-light ribbed jersey that feels like a second skin — ideal for home, travel or casual outings.",
    colors: [
      { name: "Dusty Rose",     hex: "#D4A5A5" },
      { name: "Sage",           hex: "#8FAF8F" },
      { name: "Cream",          hex: "#FFF5DC" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    bgGradient: "linear-gradient(160deg, #D4A5A5 0%, #c49090 60%, #b87e7e 100%)",
    features: [
      "Ribbed jersey fabric",
      "Relaxed fit",
      "Elastic waistband",
      "Ankle length"
    ]
  },
  {
    id: 4,
    name: "Butter Bliss Leggings",
    category: "everyday",
    categoryLabel: "Everyday Wear",
    badge: "Staff Pick",
    price: 1099,
    originalPrice: null,
    description: "Named for their famously soft, buttery feel, these full-length leggings are your go-to for any occasion. Seamless construction minimises chafing.",
    colors: [
      { name: "Charcoal",       hex: "#555555" },
      { name: "Plum",           hex: "#6B3A5C" },
      { name: "Olive",          hex: "#6B7A37" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    bgGradient: "linear-gradient(135deg, #555 0%, #333 60%, #222 100%)",
    features: [
      "Seamless knit",
      "Ultra-soft Nylon blend",
      "Tummy control panel",
      "Full-length"
    ]
  },
  {
    id: 5,
    name: "Power Flex Leggings",
    category: "active",
    categoryLabel: "Active",
    badge: "New",
    price: 1299,
    originalPrice: null,
    description: "Built for movement. High-intensity compression meets elegant design in our Power Flex — perfect for yoga, gym, dance or any activity that demands flexibility.",
    colors: [
      { name: "Electric Teal",  hex: "#0EA5A0" },
      { name: "Deep Plum",      hex: "#4A1A4A" },
      { name: "Jet Black",      hex: "#0A0A0A" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    bgGradient: "linear-gradient(135deg, #0EA5A0 0%, #0d9090 50%, #064040 100%)",
    features: [
      "High compression",
      "Mesh panel detail",
      "Deep side pockets",
      "7/8 length"
    ]
  },
  {
    id: 6,
    name: "Curves Embraced Plus Leggings",
    category: "plus",
    categoryLabel: "Plus Size",
    badge: null,
    price: 1099,
    originalPrice: 1399,
    description: "Because premium should be for every body. Our plus-size exclusive design offers all the softness and style of LAARA with an enhanced waistband built for ultimate comfort.",
    colors: [
      { name: "Classic Black",  hex: "#111111" },
      { name: "Berry",          hex: "#8B2252" },
      { name: "Chocolate",      hex: "#5C3317" }
    ],
    sizes: ["1X", "2X", "3X", "4X"],
    bgGradient: "linear-gradient(160deg, #8B2252 0%, #6a1a3f 50%, #3d0d24 100%)",
    features: [
      "Wide comfort waistband",
      "Full-length",
      "No dig waistband",
      "LAARA for every body"
    ]
  }
];

const LAARA_REVIEWS = [
  {
    id: 1,
    stars: 5,
    text: "These are genuinely the most comfortable leggings I have ever owned. The fabric is incredible — I wear mine almost every day and they still look brand new.",
    name: "Priya S.",
    location: "Bengaluru",
    avatarBg: "#F9C747",
    initial: "P"
  },
  {
    id: 2,
    stars: 5,
    text: "LAARA has completely changed what I expect from leggings. The fit is perfect, the material doesn't pill, and I always get compliments when I wear them out.",
    name: "Meera R.",
    location: "Mumbai",
    avatarBg: "#D4A5A5",
    initial: "M"
  },
  {
    id: 3,
    stars: 5,
    text: "Finally a leggings brand that actually delivers on its promises. High-waisted, stays up all day, and looks just as stunning as in the photos.",
    name: "Anjali K.",
    location: "Hyderabad",
    avatarBg: "#8FAF8F",
    initial: "A"
  },
  {
    id: 4,
    stars: 5,
    text: "Worth every rupee. I ordered two pairs and I'm already thinking about getting more in different colors. The quality is truly premium.",
    name: "Deepika T.",
    location: "Delhi",
    avatarBg: "#0EA5A0",
    initial: "D"
  },
  {
    id: 5,
    stars: 5,
    text: "LAARA is my new obsession! The leggings are squat-proof (I tested them!) and so flattering. Highly recommend to anyone who loves activewear.",
    name: "Kavya N.",
    location: "Chennai",
    avatarBg: "#6B3A5C",
    initial: "K"
  }
];

const LAARA_POLICIES = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Information We Collect",
        body: "We collect information you provide when making a purchase, subscribing to our newsletter or contacting us — including name, email address, shipping address and phone number."
      },
      {
        heading: "How We Use Your Information",
        body: "Your information is used to process and fulfil your orders, communicate shipping updates, respond to enquiries and (with your consent) send promotional offers."
      },
      {
        heading: "Data Security",
        body: "We take the security of your personal data seriously. All transactions are processed via trusted, encrypted payment gateways. We do not store payment card details."
      },
      {
        heading: "Third-Party Sharing",
        body: "We do not sell, trade or rent your personal data to third parties. We may share information with trusted partners strictly to fulfil your orders (e.g., shipping providers)."
      },
      {
        heading: "Contact",
        body: "For any privacy concerns, reach out to us on Instagram @laara.co.in.pdtr or via WhatsApp."
      }
    ]
  },
  shipping: {
    title: "Shipping Policy",
    sections: [
      {
        heading: "Processing Time",
        body: "Orders are processed within 1–3 business days after confirmation. You will receive a notification once your order has been dispatched."
      },
      {
        heading: "Delivery Time",
        body: "Standard delivery across India typically takes 5–8 business days. Delivery times may vary based on location and courier availability."
      },
      {
        heading: "Shipping Charges",
        body: "Shipping charges will be calculated and communicated at checkout. Free shipping may be offered on orders above a specified amount — check our latest promotions."
      },
      {
        heading: "Order Tracking",
        body: "Once dispatched, you will receive a tracking number via WhatsApp or email to monitor your delivery."
      },
      {
        heading: "Delivery Issues",
        body: "If your order is significantly delayed or arrives damaged, please contact us immediately via WhatsApp or Instagram and we will resolve the issue promptly."
      }
    ]
  },
  return: {
    title: "Return & Exchange Policy",
    sections: [
      {
        heading: "Return Window",
        body: "We accept return or exchange requests within 7 days of delivery, provided the item is unworn, unwashed and in its original packaging with all tags attached."
      },
      {
        heading: "How to Initiate a Return",
        body: "Contact us via WhatsApp or Instagram (@laara.co.in.pdtr) with your order details and reason for return. We will guide you through the process."
      },
      {
        heading: "Non-Returnable Items",
        body: "Items marked as final sale, discounted products or items without original packaging are not eligible for return or exchange."
      },
      {
        heading: "Refunds",
        body: "Once your return is received and inspected, we will process a refund or store credit within 5–7 business days. Refunds are issued via the original payment method."
      },
      {
        heading: "Exchanges",
        body: "We're happy to exchange for a different size or color, subject to availability. Exchange requests are processed within 3–5 business days after the original item is returned."
      }
    ]
  }
};
