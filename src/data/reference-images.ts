export interface ProductReferenceImage {
  ideaId?: string
  keywords: string[]
  imageUrl: string
  sourceTitle: string
  sourceDomain: string
  alt: string
}

/**
 * Curated, high-fidelity real-world reference images of finished upcycled/recycled products.
 * Never generic geometric 3D shapes or fictitious mockups.
 * Clear source attribution provided.
 */
export const PRODUCT_REFERENCE_IMAGES: ProductReferenceImage[] = [
  {
    ideaId: "idea-bottle-planter",
    keywords: ["planter", "bottle", "herb", "self-watering", "pot", "plant"],
    imageUrl: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "Recycled Plastic Herb Planter Reference",
    sourceDomain: "Unsplash / Sustainable DIY Community",
    alt: "Indoor herb plant growing in a repurposed bottle container",
  },
  {
    ideaId: "idea-bottle-funnel",
    keywords: ["funnel", "scoop", "garden", "seed", "trowel"],
    imageUrl: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "Utility Bottle Funnel & Dispenser",
    sourceDomain: "Unsplash / Upcycling Reference",
    alt: "Utility funnel cut from recycled plastic container",
  },
  {
    ideaId: "idea-cardboard-desk-organizer",
    keywords: ["desk", "organizer", "cardboard", "box", "caddy", "stationery"],
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "Modular Kraft Cardboard Desk Organizer",
    sourceDomain: "Unsplash / Zero Waste Workspace",
    alt: "Desk organizer fabricated from clean layered corrugated cardboard",
  },
  {
    ideaId: "idea-cardboard-storage-bin",
    keywords: ["storage", "bin", "drawer", "divider", "closet"],
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "Reinforced Fabric-Lined Cardboard Storage Caddy",
    sourceDomain: "Unsplash / Reclaimed Storage",
    alt: "Cardboard storage bin with reinforced corners",
  },
  {
    ideaId: "idea-tshirt-tote-bag",
    keywords: ["tote", "bag", "t-shirt", "shopping", "no-sew"],
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "No-Sew Repurposed Cotton Tote Bag",
    sourceDomain: "Unsplash / Sustainable Apparel Reference",
    alt: "Sturdy shopping bag crafted from repurposed cotton garment",
  },
  {
    ideaId: "idea-tshirt-cleaning-cloths",
    keywords: ["cloth", "rag", "cleaning", "strip", "tshirt", "towel"],
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "Reusable Cotton Cleaning Rags",
    sourceDomain: "Unsplash / Eco Home Care",
    alt: "Hemmed and lint-free cotton workshop cloths",
  },
  {
    ideaId: "idea-denim-wall-organizer",
    keywords: ["denim", "jean", "pocket", "wall", "organizer", "textile"],
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "Upcycled Denim Jean Pocket Wall Organizer",
    sourceDomain: "Unsplash / Reclaimed Denim Reference",
    alt: "Hanging wall organizer featuring durable denim pockets for tools and crafts",
  },
  {
    ideaId: "idea-glass-spice-jar",
    keywords: ["jar", "glass", "spice", "container", "pantry"],
    imageUrl: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "Sanitized Reclaimed Glass Pantry Containers",
    sourceDomain: "Unsplash / Pantry Organization",
    alt: "Matching glass jars repurposed for spice and dry goods storage",
  },
  {
    ideaId: "idea-pallet-planter",
    keywords: ["wood", "pallet", "planter", "crate", "box", "timber"],
    imageUrl: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "Reclaimed Timber Herb Planter Box",
    sourceDomain: "Unsplash / Urban Gardening",
    alt: "Outdoor planter box constructed from clean pallet wood slats",
  },
  {
    ideaId: "idea-ewaste-certified-recycling",
    keywords: ["battery", "phone", "e-waste", "electronic", "lithium", "recycle"],
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    sourceTitle: "Authorized Electronic Waste Recovery Facility",
    sourceDomain: "Unsplash / E-Waste Management Hub",
    alt: "Authorized e-waste processing and sorting facility",
  },
]

/**
 * Retrieves the most relevant real-world reference image for a given idea.
 */
export function getProductReferenceImage(idea: {
  id?: string
  title?: string
  category?: string
  description?: string
}): ProductReferenceImage {
  // 1. Direct ID match
  if (idea.id) {
    const directMatch = PRODUCT_REFERENCE_IMAGES.find((img) => img.ideaId === idea.id)
    if (directMatch) return directMatch
  }

  // 2. Keyword score match based on title and description
  const fullText = `${idea.title || ""} ${idea.category || ""} ${idea.description || ""}`.toLowerCase()

  let bestMatch = PRODUCT_REFERENCE_IMAGES[0]
  let maxScore = -1

  for (const ref of PRODUCT_REFERENCE_IMAGES) {
    let score = 0
    for (const kw of ref.keywords) {
      if (fullText.includes(kw)) {
        score += 2
      }
    }
    if (score > maxScore) {
      maxScore = score
      bestMatch = ref
    }
  }

  return bestMatch
}
