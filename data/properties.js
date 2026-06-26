/* ==========================================================================
   betterhomes — shared property data
   --------------------------------------------------------------------------
   A tiny "database" of listings. In a real project this would come from an
   API; for this teaching site we keep it as a plain global array so every
   page (home, listings) can read the same data with no build step.
   All listings are fictional and used for demonstration only.
   ========================================================================== */
window.PROPERTIES = [
  {
    id: "BH-1001",
    title: "Skyline 2-bed with Burj Khalifa view",
    community: "Downtown Dubai",
    type: "Apartment",
    purpose: "sale",
    price: 3250000,
    beds: 2,
    baths: 3,
    area: 1420,
    featured: true,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "BH-1002",
    title: "Beachfront villa on the Palm",
    community: "Palm Jumeirah",
    type: "Villa",
    purpose: "sale",
    price: 18500000,
    beds: 5,
    baths: 6,
    area: 6200,
    featured: true,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "BH-1003",
    title: "Marina-facing 1-bed, high floor",
    community: "Dubai Marina",
    type: "Apartment",
    purpose: "rent",
    price: 135000,
    beds: 1,
    baths: 2,
    area: 780,
    featured: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "BH-1004",
    title: "Family townhouse with private garden",
    community: "Dubai Hills Estate",
    type: "Townhouse",
    purpose: "sale",
    price: 4650000,
    beds: 4,
    baths: 4,
    area: 2900,
    featured: false,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "BH-1005",
    title: "Designer penthouse with terrace",
    community: "Business Bay",
    type: "Penthouse",
    purpose: "sale",
    price: 9800000,
    beds: 3,
    baths: 4,
    area: 3300,
    featured: false,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "BH-1006",
    title: "Bright studio, walk to metro",
    community: "Jumeirah Village Circle",
    type: "Apartment",
    purpose: "rent",
    price: 62000,
    beds: 0,
    baths: 1,
    area: 410,
    featured: false,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "BH-1007",
    title: "Golf-course villa, fully upgraded",
    community: "Arabian Ranches",
    type: "Villa",
    purpose: "sale",
    price: 7250000,
    beds: 5,
    baths: 5,
    area: 4800,
    featured: false,
    image: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "BH-1008",
    title: "Lake-view 3-bed for rent",
    community: "Business Bay",
    type: "Apartment",
    purpose: "rent",
    price: 210000,
    beds: 3,
    baths: 4,
    area: 1850,
    featured: false,
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=70"
  },
  {
    id: "BH-1009",
    title: "Mansion plot with sea glimpses",
    community: "Emirates Hills",
    type: "Villa",
    purpose: "sale",
    price: 32000000,
    beds: 7,
    baths: 9,
    area: 12000,
    featured: false,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=70"
  }
];

/* Helper used across pages to format AED prices consistently. */
window.formatAED = function (value) {
  return "AED " + value.toLocaleString("en-AE");
};
