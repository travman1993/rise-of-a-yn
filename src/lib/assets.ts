// 📁 src/lib/assets.ts
// Complete Assets System - 9 Categories x 5 Tiers
// Categories: Homes, Cars, Chains, Watches, Shoes, Dogs, Guns, Studios, Boats

export interface Asset {
    id: string;
    name: string;
    icon: string;
    tier: number;
    price: number;
    xp: number;
    respect: number;
    power: number;
    energy: number;
    category: 'home' | 'car' | 'chain' | 'watch' | 'shoes' | 'dog' | 'gun' | 'studio' | 'boat';
  }
  
  // ============================================
  // 🏠 HOMES - 5 Tiers
  // ============================================
  export const HOMES: Asset[] = [
    // Tier 1 - Shitty
    { id: 'h1-1', name: 'Trap Room', icon: '🛏️', tier: 1, price: 5000, xp: 10, respect: 5, power: 10, energy: 2, category: 'home' },
    { id: 'h1-2', name: 'Basement Spot', icon: '🏚️', tier: 1, price: 10000, xp: 15, respect: 8, power: 15, energy: 2, category: 'home' },
    { id: 'h1-3', name: 'Shared Apartment', icon: '🏠', tier: 1, price: 15000, xp: 20, respect: 10, power: 20, energy: 3, category: 'home' },
    { id: 'h1-4', name: 'Back-House', icon: '🏘️', tier: 1, price: 25000, xp: 25, respect: 12, power: 25, energy: 3, category: 'home' },
    { id: 'h1-5', name: 'Old Duplex', icon: '🏘️', tier: 1, price: 50000, xp: 30, respect: 15, power: 30, energy: 4, category: 'home' },
    
    // Tier 2 - Better
    { id: 'h2-1', name: 'Garage Loft', icon: '🏢', tier: 2, price: 100000, xp: 50, respect: 25, power: 50, energy: 5, category: 'home' },
    { id: 'h2-2', name: 'One-Story Home', icon: '🏠', tier: 2, price: 200000, xp: 75, respect: 35, power: 75, energy: 6, category: 'home' },
    { id: 'h2-3', name: 'Townhouse', icon: '🏘️', tier: 2, price: 350000, xp: 100, respect: 50, power: 100, energy: 7, category: 'home' },
    { id: 'h2-4', name: 'Duplex Complex', icon: '🏘️', tier: 2, price: 500000, xp: 125, respect: 60, power: 125, energy: 8, category: 'home' },
    { id: 'h2-5', name: '2-Unit Complex', icon: '🏢', tier: 2, price: 750000, xp: 150, respect: 75, power: 150, energy: 9, category: 'home' },
    
    // Tier 3 - Nice
    { id: 'h3-1', name: 'Downtown Loft', icon: '🏢', tier: 3, price: 1000000, xp: 250, respect: 100, power: 250, energy: 10, category: 'home' },
    { id: 'h3-2', name: 'Suburban Home', icon: '🏡', tier: 3, price: 1500000, xp: 300, respect: 125, power: 300, energy: 12, category: 'home' },
    { id: 'h3-3', name: 'Lake House', icon: '🏞️', tier: 3, price: 2500000, xp: 400, respect: 150, power: 400, energy: 14, category: 'home' },
    { id: 'h3-4', name: 'Luxury Condo', icon: '🏢', tier: 3, price: 3500000, xp: 500, respect: 175, power: 500, energy: 16, category: 'home' },
    { id: 'h3-5', name: 'Mini Estate', icon: '👑', tier: 3, price: 5000000, xp: 600, respect: 200, power: 600, energy: 18, category: 'home' },
    
    // Tier 4 - Expensive
    { id: 'h4-1', name: 'Mansion', icon: '🏰', tier: 4, price: 10000000, xp: 1000, respect: 300, power: 1000, energy: 20, category: 'home' },
    { id: 'h4-2', name: 'Penthouse', icon: '🌇', tier: 4, price: 25000000, xp: 1500, respect: 400, power: 1500, energy: 25, category: 'home' },
    { id: 'h4-3', name: 'Grand Estate', icon: '👑', tier: 4, price: 50000000, xp: 2000, respect: 500, power: 2000, energy: 30, category: 'home' },
    { id: 'h4-4', name: 'Beach Villa', icon: '🏝️', tier: 4, price: 75000000, xp: 2500, respect: 600, power: 2500, energy: 35, category: 'home' },
    { id: 'h4-5', name: 'Private Resort', icon: '🏖️', tier: 4, price: 100000000, xp: 3000, respect: 700, power: 3000, energy: 40, category: 'home' },
    
    // Tier 5 - Lavish
    { id: 'h5-1', name: 'Mega Estate', icon: '🏰', tier: 5, price: 500000000, xp: 5000, respect: 1000, power: 5000, energy: 50, category: 'home' },
    { id: 'h5-2', name: 'Island Villa', icon: '🏝️', tier: 5, price: 1000000000, xp: 7500, respect: 1500, power: 7500, energy: 60, category: 'home' },
    { id: 'h5-3', name: 'Desert Compound', icon: '🏜️', tier: 5, price: 2500000000, xp: 10000, respect: 2000, power: 10000, energy: 75, category: 'home' },
    { id: 'h5-4', name: 'Cliff Fortress', icon: '🏔️', tier: 5, price: 5000000000, xp: 12500, respect: 2500, power: 12500, energy: 100, category: 'home' },
    { id: 'h5-5', name: 'Ocean Palace', icon: '🌊', tier: 5, price: 10000000000, xp: 15000, respect: 3000, power: 15000, energy: 125, category: 'home' },
  ];
  
  // ============================================
  // 🚗 CARS - 5 Tiers
  // ============================================
  export const CARS: Asset[] = [
    // Tier 1
    { id: 'c1-1', name: 'Bike', icon: '🏍️', tier: 1, price: 2000, xp: 5, respect: 2, power: 5, energy: 1, category: 'car' },
    { id: 'c1-2', name: 'Crown Vic', icon: '🚗', tier: 1, price: 5000, xp: 8, respect: 4, power: 10, energy: 1, category: 'car' },
    { id: 'c1-3', name: 'Civic', icon: '🚗', tier: 1, price: 8000, xp: 10, respect: 5, power: 15, energy: 2, category: 'car' },
    { id: 'c1-4', name: 'Old Impala', icon: '🚙', tier: 1, price: 12000, xp: 12, respect: 6, power: 20, energy: 2, category: 'car' },
    { id: 'c1-5', name: 'Charger SE', icon: '🏎️', tier: 1, price: 20000, xp: 15, respect: 8, power: 25, energy: 2, category: 'car' },
    
    // Tier 2
    { id: 'c2-1', name: 'Altima', icon: '🚗', tier: 2, price: 50000, xp: 30, respect: 15, power: 50, energy: 3, category: 'car' },
    { id: 'c2-2', name: 'Camaro', icon: '🏎️', tier: 2, price: 75000, xp: 40, respect: 20, power: 75, energy: 4, category: 'car' },
    { id: 'c2-3', name: 'Charger RT', icon: '🏎️', tier: 2, price: 100000, xp: 50, respect: 25, power: 100, energy: 5, category: 'car' },
    { id: 'c2-4', name: 'Accord Sport', icon: '🚗', tier: 2, price: 120000, xp: 60, respect: 30, power: 120, energy: 5, category: 'car' },
    { id: 'c2-5', name: 'Tahoe LT', icon: '🚙', tier: 2, price: 150000, xp: 75, respect: 35, power: 150, energy: 6, category: 'car' },
    
    // Tier 3
    { id: 'c3-1', name: 'BMW M3', icon: '🏎️', tier: 3, price: 500000, xp: 200, respect: 75, power: 500, energy: 10, category: 'car' },
    { id: 'c3-2', name: 'Tesla S', icon: '🚗', tier: 3, price: 750000, xp: 250, respect: 100, power: 750, energy: 12, category: 'car' },
    { id: 'c3-3', name: 'Mercedes C63', icon: '🏎️', tier: 3, price: 1000000, xp: 300, respect: 125, power: 1000, energy: 14, category: 'car' },
    { id: 'c3-4', name: 'Audi RS5', icon: '🏎️', tier: 3, price: 1250000, xp: 350, respect: 150, power: 1250, energy: 16, category: 'car' },
    { id: 'c3-5', name: 'Lexus IS 350', icon: '🚗', tier: 3, price: 1500000, xp: 400, respect: 175, power: 1500, energy: 18, category: 'car' },
    
    // Tier 4
    { id: 'c4-1', name: 'Lambo Huracán', icon: '🏎️', tier: 4, price: 5000000, xp: 800, respect: 250, power: 5000, energy: 25, category: 'car' },
    { id: 'c4-2', name: 'McLaren 720S', icon: '🏎️', tier: 4, price: 7500000, xp: 1000, respect: 300, power: 7500, energy: 30, category: 'car' },
    { id: 'c4-3', name: 'G-Wagon', icon: '🚙', tier: 4, price: 10000000, xp: 1250, respect: 350, power: 10000, energy: 35, category: 'car' },
    { id: 'c4-4', name: 'Range SVR', icon: '🚙', tier: 4, price: 12500000, xp: 1500, respect: 400, power: 12500, energy: 40, category: 'car' },
    { id: 'c4-5', name: 'AMG GT', icon: '🏎️', tier: 4, price: 15000000, xp: 1750, respect: 450, power: 15000, energy: 45, category: 'car' },
    
    // Tier 5
    { id: 'c5-1', name: 'Rolls Royce', icon: '👑', tier: 5, price: 100000000, xp: 5000, respect: 1000, power: 50000, energy: 60, category: 'car' },
    { id: 'c5-2', name: 'Bugatti', icon: '🏎️', tier: 5, price: 250000000, xp: 7500, respect: 1500, power: 75000, energy: 75, category: 'car' },
    { id: 'c5-3', name: 'Ferrari SF90', icon: '🏎️', tier: 5, price: 500000000, xp: 10000, respect: 2000, power: 100000, energy: 100, category: 'car' },
    { id: 'c5-4', name: 'Space Car', icon: '🚀', tier: 5, price: 1000000000, xp: 12500, respect: 2500, power: 125000, energy: 125, category: 'car' },
    { id: 'c5-5', name: 'Flying Car', icon: '✈️', tier: 5, price: 2500000000, xp: 15000, respect: 3000, power: 150000, energy: 150, category: 'car' },
  ];
  
  // ============================================
  // ⛓️ CHAINS - 5 Tiers
  // ============================================
  export const CHAINS: Asset[] = [
    // Tier 1
    { id: 'ch1-1', name: 'Rope Chain', icon: '🪡', tier: 1, price: 5000, xp: 8, respect: 10, power: 20, energy: 1, category: 'chain' },
    { id: 'ch1-2', name: 'Bronze Chain', icon: '⛓️', tier: 1, price: 10000, xp: 12, respect: 15, power: 30, energy: 1, category: 'chain' },
    { id: 'ch1-3', name: 'Silver Chain', icon: '🪫', tier: 1, price: 15000, xp: 15, respect: 20, power: 40, energy: 2, category: 'chain' },
    { id: 'ch1-4', name: 'Cheap Gold', icon: '⛓️', tier: 1, price: 25000, xp: 20, respect: 25, power: 50, energy: 2, category: 'chain' },
    { id: 'ch1-5', name: 'Gold Plated', icon: '⛓️', tier: 1, price: 50000, xp: 25, respect: 30, power: 60, energy: 3, category: 'chain' },
    
    // Tier 2
    { id: 'ch2-1', name: 'Gold Chain', icon: '⛓️', tier: 2, price: 100000, xp: 50, respect: 50, power: 150, energy: 5, category: 'chain' },
    { id: 'ch2-2', name: 'Thick Gold', icon: '⛓️', tier: 2, price: 250000, xp: 75, respect: 75, power: 200, energy: 6, category: 'chain' },
    { id: 'ch2-3', name: 'Rose Gold', icon: '⛓️', tier: 2, price: 500000, xp: 100, respect: 100, power: 250, energy: 7, category: 'chain' },
    { id: 'ch2-4', name: 'Two Tone', icon: '⛓️', tier: 2, price: 750000, xp: 125, respect: 125, power: 300, energy: 8, category: 'chain' },
    { id: 'ch2-5', name: 'Diamond Studs', icon: '💎', tier: 2, price: 1000000, xp: 150, respect: 150, power: 350, energy: 9, category: 'chain' },
    
    // Tier 3
    { id: 'ch3-1', name: 'Diamond Chain', icon: '💎', tier: 3, price: 2500000, xp: 300, respect: 200, power: 750, energy: 12, category: 'chain' },
    { id: 'ch3-2', name: 'Flooded Out', icon: '💎', tier: 3, price: 5000000, xp: 400, respect: 250, power: 1000, energy: 14, category: 'chain' },
    { id: 'ch3-3', name: 'VVS Diamond', icon: '💎', tier: 3, price: 7500000, xp: 500, respect: 300, power: 1250, energy: 16, category: 'chain' },
    { id: 'ch3-4', name: 'Princess Cut', icon: '💎', tier: 3, price: 10000000, xp: 600, respect: 350, power: 1500, energy: 18, category: 'chain' },
    { id: 'ch3-5', name: 'Holy Grail', icon: '👑', tier: 3, price: 15000000, xp: 750, respect: 400, power: 1750, energy: 20, category: 'chain' },
    
    // Tier 4
    { id: 'ch4-1', name: 'Platinum Diamond', icon: '💎', tier: 4, price: 50000000, xp: 1500, respect: 600, power: 5000, energy: 30, category: 'chain' },
    { id: 'ch4-2', name: 'Colored Diamond', icon: '💎', tier: 4, price: 75000000, xp: 2000, respect: 700, power: 6000, energy: 35, category: 'chain' },
    { id: 'ch4-3', name: 'Rare Fancy', icon: '💎', tier: 4, price: 100000000, xp: 2500, respect: 800, power: 7000, energy: 40, category: 'chain' },
    { id: 'ch4-4', name: 'Perfect Diamond', icon: '💎', tier: 4, price: 150000000, xp: 3000, respect: 900, power: 8000, energy: 45, category: 'chain' },
    { id: 'ch4-5', name: 'Legendary', icon: '👑', tier: 4, price: 250000000, xp: 3500, respect: 1000, power: 9000, energy: 50, category: 'chain' },
    
    // Tier 5
    { id: 'ch5-1', name: 'Koh-i-Noor', icon: '💎', tier: 5, price: 500000000, xp: 5000, respect: 1200, power: 12000, energy: 75, category: 'chain' },
    { id: 'ch5-2', name: 'Hope Diamond', icon: '💎', tier: 5, price: 1000000000, xp: 7500, respect: 1500, power: 15000, energy: 100, category: 'chain' },
    { id: 'ch5-3', name: 'Crown Jewel', icon: '👑', tier: 5, price: 2500000000, xp: 10000, respect: 2000, power: 20000, energy: 125, category: 'chain' },
    { id: 'ch5-4', name: 'Imperial', icon: '👑', tier: 5, price: 5000000000, xp: 12500, respect: 2500, power: 25000, energy: 150, category: 'chain' },
    { id: 'ch5-5', name: 'Eternal Crown', icon: '👑', tier: 5, price: 10000000000, xp: 15000, respect: 3000, power: 30000, energy: 175, category: 'chain' },
  ];
  
  // ============================================
  // ⌚ WATCHES - 5 Tiers
  // ============================================
  export const WATCHES: Asset[] = [
    // Tier 1
    { id: 'w1-1', name: 'Digital Watch', icon: '⌚', tier: 1, price: 5000, xp: 10, respect: 8, power: 15, energy: 1, category: 'watch' },
    { id: 'w1-2', name: 'Timex', icon: '⌚', tier: 1, price: 10000, xp: 12, respect: 10, power: 20, energy: 2, category: 'watch' },
    { id: 'w1-3', name: 'Casio', icon: '⏰', tier: 1, price: 15000, xp: 15, respect: 12, power: 25, energy: 2, category: 'watch' },
    { id: 'w1-4', name: 'Seiko', icon: '⌚', tier: 1, price: 25000, xp: 20, respect: 15, power: 35, energy: 2, category: 'watch' },
    { id: 'w1-5', name: 'Citizen', icon: '⌚', tier: 1, price: 50000, xp: 25, respect: 20, power: 45, energy: 3, category: 'watch' },
    
    // Tier 2
    { id: 'w2-1', name: 'Omega', icon: '⌚', tier: 2, price: 100000, xp: 50, respect: 40, power: 100, energy: 5, category: 'watch' },
    { id: 'w2-2', name: 'TAG Heuer', icon: '⌚', tier: 2, price: 250000, xp: 75, respect: 60, power: 150, energy: 6, category: 'watch' },
    { id: 'w2-3', name: 'Longines', icon: '⌚', tier: 2, price: 500000, xp: 100, respect: 80, power: 200, energy: 7, category: 'watch' },
    { id: 'w2-4', name: 'Breitling', icon: '⌚', tier: 2, price: 750000, xp: 125, respect: 100, power: 250, energy: 8, category: 'watch' },
    { id: 'w2-5', name: 'Rolex', icon: '⌚', tier: 2, price: 1000000, xp: 150, respect: 120, power: 300, energy: 9, category: 'watch' },
    
    // Tier 3
    { id: 'w3-1', name: 'Cartier', icon: '⌚', tier: 3, price: 2500000, xp: 300, respect: 200, power: 750, energy: 12, category: 'watch' },
    { id: 'w3-2', name: 'Patek Philippe', icon: '⌚', tier: 3, price: 5000000, xp: 400, respect: 250, power: 1000, energy: 14, category: 'watch' },
    { id: 'w3-3', name: 'Audemars Piguet', icon: '⌚', tier: 3, price: 7500000, xp: 500, respect: 300, power: 1250, energy: 16, category: 'watch' },
    { id: 'w3-4', name: 'Jaeger-LeCoultre', icon: '⌚', tier: 3, price: 10000000, xp: 600, respect: 350, power: 1500, energy: 18, category: 'watch' },
    { id: 'w3-5', name: 'Grand Master', icon: '👑', tier: 3, price: 15000000, xp: 750, respect: 400, power: 1750, energy: 20, category: 'watch' },
    
    // Tier 4
    { id: 'w4-1', name: 'Diamond Rolex', icon: '⌚', tier: 4, price: 50000000, xp: 1500, respect: 600, power: 5000, energy: 30, category: 'watch' },
    { id: 'w4-2', name: 'Platinum PP', icon: '⌚', tier: 4, price: 75000000, xp: 2000, respect: 700, power: 6000, energy: 35, category: 'watch' },
    { id: 'w4-3', name: 'Gold Master', icon: '⌚', tier: 4, price: 100000000, xp: 2500, respect: 800, power: 7000, energy: 40, category: 'watch' },
    { id: 'w4-4', name: 'Elite', icon: '⌚', tier: 4, price: 150000000, xp: 3000, respect: 900, power: 8000, energy: 45, category: 'watch' },
    { id: 'w4-5', name: 'Priceless', icon: '👑', tier: 4, price: 250000000, xp: 3500, respect: 1000, power: 9000, energy: 50, category: 'watch' },
    
    // Tier 5
    { id: 'w5-1', name: 'Unique PP', icon: '⌚', tier: 5, price: 500000000, xp: 5000, respect: 1200, power: 12000, energy: 75, category: 'watch' },
    { id: 'w5-2', name: 'Royal Omega', icon: '⌚', tier: 5, price: 1000000000, xp: 7500, respect: 1500, power: 15000, energy: 100, category: 'watch' },
    { id: 'w5-3', name: 'King\'s Watch', icon: '👑', tier: 5, price: 2500000000, xp: 10000, respect: 2000, power: 20000, energy: 125, category: 'watch' },
    { id: 'w5-4', name: 'Imperial Piece', icon: '👑', tier: 5, price: 5000000000, xp: 12500, respect: 2500, power: 25000, energy: 150, category: 'watch' },
    { id: 'w5-5', name: 'Eternal Timepiece', icon: '👑', tier: 5, price: 10000000000, xp: 15000, respect: 3000, power: 30000, energy: 175, category: 'watch' },
  ];
  
  // ============================================
  // 👟 SHOES - 5 Tiers
  // ============================================
  export const SHOES: Asset[] = [
    // Tier 1
    { id: 's1-1', name: 'Walmart Specials', icon: '👟', tier: 1, price: 2000, xp: 5, respect: 5, power: 10, energy: 1, category: 'shoes' },
    { id: 's1-2', name: 'Generic Kicks', icon: '👟', tier: 1, price: 5000, xp: 8, respect: 8, power: 15, energy: 1, category: 'shoes' },
    { id: 's1-3', name: 'Basic Nike', icon: '👟', tier: 1, price: 10000, xp: 10, respect: 10, power: 20, energy: 2, category: 'shoes' },
    { id: 's1-4', name: 'Adidas', icon: '👟', tier: 1, price: 15000, xp: 12, respect: 12, power: 25, energy: 2, category: 'shoes' },
    { id: 's1-5', name: 'Puma', icon: '👟', tier: 1, price: 25000, xp: 15, respect: 15, power: 30, energy: 2, category: 'shoes' },
    
    // Tier 2
    { id: 's2-1', name: 'Air Max 90', icon: '👟', tier: 2, price: 50000, xp: 30, respect: 30, power: 80, energy: 4, category: 'shoes' },
    { id: 's2-2', name: 'Jordan 1s', icon: '👟', tier: 2, price: 100000, xp: 50, respect: 50, power: 120, energy: 5, category: 'shoes' },
    { id: 's2-3', name: 'Yeezy', icon: '👟', tier: 2, price: 250000, xp: 75, respect: 75, power: 180, energy: 6, category: 'shoes' },
    { id: 's2-4', name: 'Off-White', icon: '👟', tier: 2, price: 500000, xp: 100, respect: 100, power: 240, energy: 7, category: 'shoes' },
    { id: 's2-5', name: 'Travis Scott', icon: '👟', tier: 2, price: 1000000, xp: 125, respect: 125, power: 300, energy: 8, category: 'shoes' },
    
    // Tier 3
    { id: 's3-1', name: 'Air Jordan 11', icon: '👟', tier: 3, price: 2500000, xp: 250, respect: 200, power: 750, energy: 10, category: 'shoes' },
    { id: 's3-2', name: 'Rare Jordans', icon: '👟', tier: 3, price: 5000000, xp: 350, respect: 300, power: 1000, energy: 12, category: 'shoes' },
    { id: 's3-3', name: 'Supreme Collab', icon: '👟', tier: 3, price: 7500000, xp: 450, respect: 350, power: 1250, energy: 14, category: 'shoes' },
    { id: 's3-4', name: 'Fragment Design', icon: '👟', tier: 3, price: 10000000, xp: 550, respect: 400, power: 1500, energy: 16, category: 'shoes' },
    { id: 's3-5', name: 'Dior Sneaker', icon: '👑', tier: 3, price: 15000000, xp: 650, respect: 450, power: 1750, energy: 18, category: 'shoes' },
    
    // Tier 4
    { id: 's4-1', name: 'Balenciaga Triple', icon: '👟', tier: 4, price: 50000000, xp: 1200, respect: 600, power: 5000, energy: 25, category: 'shoes' },
    { id: 's4-2', name: 'Gucci Sneaker', icon: '👟', tier: 4, price: 75000000, xp: 1500, respect: 700, power: 6000, energy: 30, category: 'shoes' },
    { id: 's4-3', name: 'Louis V High', icon: '👟', tier: 4, price: 100000000, xp: 1800, respect: 800, power: 7000, energy: 35, category: 'shoes' },
    { id: 's4-4', name: 'Prada Sneaker', icon: '👟', tier: 4, price: 150000000, xp: 2200, respect: 900, power: 8000, energy: 40, category: 'shoes' },
    { id: 's4-5', name: 'Luxury Elite', icon: '👑', tier: 4, price: 250000000, xp: 2800, respect: 1000, power: 9000, energy: 45, category: 'shoes' },
    
    // Tier 5
    { id: 's5-1', name: 'Diamond Sneaker', icon: '👟', tier: 5, price: 500000000, xp: 4500, respect: 1200, power: 12000, energy: 60, category: 'shoes' },
    { id: 's5-2', name: 'Hermes Custom', icon: '👟', tier: 5, price: 1000000000, xp: 6500, respect: 1500, power: 15000, energy: 75, category: 'shoes' },
    { id: 's5-3', name: 'Hermès Leather', icon: '👑', tier: 5, price: 2500000000, xp: 8500, respect: 2000, power: 20000, energy: 100, category: 'shoes' },
    { id: 's5-4', name: 'Royal Custom', icon: '👑', tier: 5, price: 5000000000, xp: 10500, respect: 2500, power: 25000, energy: 125, category: 'shoes' },
    { id: 's5-5', name: 'Godly Kickz', icon: '👑', tier: 5, price: 10000000000, xp: 12500, respect: 3000, power: 30000, energy: 150, category: 'shoes' },
  ];
  
  // ============================================
  // 🐕 DOGS - 5 Tiers
  // ============================================
  export const DOGS: Asset[] = [
    // Tier 1
    { id: 'd1-1', name: 'Shelter Pup', icon: '🐶', tier: 1, price: 10000, xp: 15, respect: 10, power: 30, energy: 3, category: 'dog' },
    { id: 'd1-2', name: 'Street Dog', icon: '🐕', tier: 1, price: 20000, xp: 20, respect: 15, power: 40, energy: 3, category: 'dog' },
    { id: 'd1-3', name: 'Mixed Breed', icon: '🐕', tier: 1, price: 30000, xp: 25, respect: 20, power: 50, energy: 4, category: 'dog' },
    { id: 'd1-4', name: 'Starter Pit', icon: '🐕', tier: 1, price: 50000, xp: 30, respect: 25, power: 60, energy: 4, category: 'dog' },
    { id: 'd1-5', name: 'Young German', icon: '🐕', tier: 1, price: 75000, xp: 35, respect: 30, power: 70, energy: 5, category: 'dog' },
    
    // Tier 2
    { id: 'd2-1', name: 'Trained Pit', icon: '🐕', tier: 2, price: 150000, xp: 60, respect: 50, power: 150, energy: 7, category: 'dog' },
    { id: 'd2-2', name: 'German Shepherd', icon: '🐕', tier: 2, price: 300000, xp: 80, respect: 70, power: 200, energy: 8, category: 'dog' },
    { id: 'd2-3', name: 'Rottweiler', icon: '🐕', tier: 2, price: 500000, xp: 100, respect: 90, power: 250, energy: 9, category: 'dog' },
    { id: 'd2-4', name: 'Doberman', icon: '🐕', tier: 2, price: 750000, xp: 120, respect: 110, power: 300, energy: 10, category: 'dog' },
    { id: 'd2-5', name: 'War Dog', icon: '🐕', tier: 2, price: 1000000, xp: 150, respect: 130, power: 350, energy: 11, category: 'dog' },
    
    // Tier 3
    { id: 'd3-1', name: 'Cane Corso', icon: '🐕', tier: 3, price: 2500000, xp: 300, respect: 250, power: 800, energy: 15, category: 'dog' },
    { id: 'd3-2', name: 'Beast Breeder', icon: '🐕', tier: 3, price: 5000000, xp: 400, respect: 350, power: 1100, energy: 17, category: 'dog' },
    { id: 'd3-3', name: 'Elite K9', icon: '🐕', tier: 3, price: 7500000, xp: 500, respect: 450, power: 1400, energy: 19, category: 'dog' },
    { id: 'd3-4', name: 'Royal Guard', icon: '🐕', tier: 3, price: 10000000, xp: 600, respect: 550, power: 1700, energy: 21, category: 'dog' },
    { id: 'd3-5', name: 'Legendary Beast', icon: '👑', tier: 3, price: 15000000, xp: 750, respect: 650, power: 2000, energy: 23, category: 'dog' },
    
    // Tier 4
    { id: 'd4-1', name: 'Imported Alpha', icon: '🐕', tier: 4, price: 50000000, xp: 1500, respect: 800, power: 6000, energy: 35, category: 'dog' },
    { id: 'd4-2', name: 'Blood Bred', icon: '🐕', tier: 4, price: 75000000, xp: 2000, respect: 900, power: 7200, energy: 40, category: 'dog' },
    { id: 'd4-3', name: 'Champion Line', icon: '🐕', tier: 4, price: 100000000, xp: 2500, respect: 1000, power: 8400, energy: 45, category: 'dog' },
    { id: 'd4-4', name: 'Apex Predator', icon: '🐕', tier: 4, price: 150000000, xp: 3000, respect: 1100, power: 9600, energy: 50, category: 'dog' },
    { id: 'd4-5', name: 'Royal Protector', icon: '👑', tier: 4, price: 250000000, xp: 3500, respect: 1200, power: 10800, energy: 55, category: 'dog' },
    
    // Tier 5
    { id: 'd5-1', name: 'Mythical Beast', icon: '🐕', tier: 5, price: 500000000, xp: 5500, respect: 1500, power: 15000, energy: 75, category: 'dog' },
    { id: 'd5-2', name: 'Ancient Bloodline', icon: '🐕', tier: 5, price: 1000000000, xp: 8000, respect: 2000, power: 20000, energy: 100, category: 'dog' },
    { id: 'd5-3', name: 'Godly Guardian', icon: '👑', tier: 5, price: 2500000000, xp: 10500, respect: 2500, power: 25000, energy: 125, category: 'dog' },
    { id: 'd5-4', name: 'Eternal Alpha', icon: '👑', tier: 5, price: 5000000000, xp: 13000, respect: 3000, power: 30000, energy: 150, category: 'dog' },
    { id: 'd5-5', name: 'Unstoppable', icon: '👑', tier: 5, price: 10000000000, xp: 15000, respect: 3500, power: 35000, energy: 175, category: 'dog' },
  ];
  
  // ============================================
  // 🔫 GUNS - 5 Tiers
  // ============================================
  export const GUNS: Asset[] = [
    // Tier 1
    { id: 'g1-1', name: 'BB Gun', icon: '🔫', tier: 1, price: 5000, xp: 10, respect: 15, power: 50, energy: 2, category: 'gun' },
    { id: 'g1-2', name: '9mm', icon: '🔫', tier: 1, price: 15000, xp: 15, respect: 25, power: 75, energy: 2, category: 'gun' },
    { id: 'g1-3', name: '.38 Special', icon: '🔫', tier: 1, price: 25000, xp: 20, respect: 35, power: 100, energy: 3, category: 'gun' },
    { id: 'g1-4', name: '.45 ACP', icon: '🔫', tier: 1, price: 40000, xp: 25, respect: 45, power: 125, energy: 3, category: 'gun' },
    { id: 'g1-5', name: '.357 Magnum', icon: '🔫', tier: 1, price: 60000, xp: 30, respect: 55, power: 150, energy: 3, category: 'gun' },
    
    // Tier 2
    { id: 'g2-1', name: 'AR-15', icon: '🔫', tier: 2, price: 150000, xp: 75, respect: 100, power: 400, energy: 8, category: 'gun' },
    { id: 'g2-2', name: 'MP5', icon: '🔫', tier: 2, price: 300000, xp: 100, respect: 150, power: 500, energy: 9, category: 'gun' },
    { id: 'g2-3', name: 'AK-47', icon: '🔫', tier: 2, price: 500000, xp: 125, respect: 200, power: 600, energy: 10, category: 'gun' },
    { id: 'g2-4', name: 'M16', icon: '🔫', tier: 2, price: 750000, xp: 150, respect: 250, power: 700, energy: 11, category: 'gun' },
    { id: 'g2-5', name: 'Sig Sauer', icon: '🔫', tier: 2, price: 1000000, xp: 175, respect: 300, power: 800, energy: 12, category: 'gun' },
    
    // Tier 3
    { id: 'g3-1', name: 'Barrett M82', icon: '🔫', tier: 3, price: 2500000, xp: 400, respect: 400, power: 1500, energy: 18, category: 'gun' },
    { id: 'g3-2', name: 'Sniper Elite', icon: '🔫', tier: 3, price: 5000000, xp: 500, respect: 500, power: 2000, energy: 20, category: 'gun' },
    { id: 'g3-3', name: 'M249', icon: '🔫', tier: 3, price: 7500000, xp: 600, respect: 600, power: 2500, energy: 22, category: 'gun' },
    { id: 'g3-4', name: 'Mini Gun', icon: '🔫', tier: 3, price: 10000000, xp: 700, respect: 700, power: 3000, energy: 24, category: 'gun' },
    { id: 'g3-5', name: 'Legendary Arsenal', icon: '👑', tier: 3, price: 15000000, xp: 800, respect: 800, power: 3500, energy: 26, category: 'gun' },
    
    // Tier 4
    { id: 'g4-1', name: 'Combat Pro', icon: '🔫', tier: 4, price: 50000000, xp: 1800, respect: 1000, power: 8000, energy: 40, category: 'gun' },
    { id: 'g4-2', name: 'Military Grade', icon: '🔫', tier: 4, price: 75000000, xp: 2200, respect: 1200, power: 9500, energy: 45, category: 'gun' },
    { id: 'g4-3', name: 'Black Ops', icon: '🔫', tier: 4, price: 100000000, xp: 2600, respect: 1400, power: 11000, energy: 50, category: 'gun' },
    { id: 'g4-4', name: 'Spec Ops Elite', icon: '🔫', tier: 4, price: 150000000, xp: 3000, respect: 1600, power: 12500, energy: 55, category: 'gun' },
    { id: 'g4-5', name: 'Unstoppable Force', icon: '👑', tier: 4, price: 250000000, xp: 3500, respect: 1800, power: 14000, energy: 60, category: 'gun' },
    
    // Tier 5
    { id: 'g5-1', name: 'Prototype Weapon', icon: '🔫', tier: 5, price: 500000000, xp: 6000, respect: 2000, power: 20000, energy: 100, category: 'gun' },
    { id: 'g5-2', name: 'Future Tech', icon: '🔫', tier: 5, price: 1000000000, xp: 8500, respect: 2500, power: 25000, energy: 125, category: 'gun' },
    { id: 'g5-3', name: 'Orbital Cannon', icon: '👑', tier: 5, price: 2500000000, xp: 11000, respect: 3000, power: 30000, energy: 150, category: 'gun' },
    { id: 'g5-4', name: 'Doomsday', icon: '👑', tier: 5, price: 5000000000, xp: 13500, respect: 3500, power: 35000, energy: 175, category: 'gun' },
    { id: 'g5-5', name: 'God Weapon', icon: '👑', tier: 5, price: 10000000000, xp: 15000, respect: 4000, power: 40000, energy: 200, category: 'gun' },
  ];
  
  // ============================================
  // 🎙️ STUDIOS - 5 Tiers (Recording/Production)
  // ============================================
  export const STUDIOS: Asset[] = [
    // Tier 1
    { id: 'st1-1', name: 'Garage Studio', icon: '🎙️', tier: 1, price: 10000, xp: 15, respect: 10, power: 20, energy: 3, category: 'studio' },
    { id: 'st1-2', name: 'Basement Booth', icon: '🎙️', tier: 1, price: 20000, xp: 20, respect: 15, power: 30, energy: 3, category: 'studio' },
    { id: 'st1-3', name: 'Small Studio', icon: '🎙️', tier: 1, price: 40000, xp: 25, respect: 20, power: 40, energy: 4, category: 'studio' },
    { id: 'st1-4', name: 'Local Spot', icon: '🎙️', tier: 1, price: 60000, xp: 30, respect: 25, power: 50, energy: 4, category: 'studio' },
    { id: 'st1-5', name: 'Decent Studio', icon: '🎙️', tier: 1, price: 100000, xp: 35, respect: 30, power: 60, energy: 5, category: 'studio' },
    
    // Tier 2
    { id: 'st2-1', name: 'Pro Studio', icon: '🎙️', tier: 2, price: 250000, xp: 80, respect: 75, power: 150, energy: 10, category: 'studio' },
    { id: 'st2-2', name: 'Mastering Lab', icon: '🎙️', tier: 2, price: 500000, xp: 120, respect: 120, power: 200, energy: 12, category: 'studio' },
    { id: 'st2-3', name: 'Recording Complex', icon: '🎙️', tier: 2, price: 1000000, xp: 150, respect: 150, power: 250, energy: 14, category: 'studio' },
    { id: 'st2-4', name: 'Soundcheck', icon: '🎙️', tier: 2, price: 1500000, xp: 180, respect: 180, power: 300, energy: 16, category: 'studio' },
    { id: 'st2-5', name: 'Premium Studio', icon: '🎙️', tier: 2, price: 2000000, xp: 200, respect: 200, power: 350, energy: 18, category: 'studio' },
    
    // Tier 3
    { id: 'st3-1', name: 'Platinum Studio', icon: '🎙️', tier: 3, price: 5000000, xp: 400, respect: 300, power: 800, energy: 20, category: 'studio' },
    { id: 'st3-2', name: 'Gold Standard', icon: '🎙️', tier: 3, price: 10000000, xp: 500, respect: 400, power: 1100, energy: 22, category: 'studio' },
    { id: 'st3-3', name: 'Grammy Worthy', icon: '🎙️', tier: 3, price: 15000000, xp: 600, respect: 500, power: 1400, energy: 24, category: 'studio' },
    { id: 'st3-4', name: 'Elite Facility', icon: '🎙️', tier: 3, price: 20000000, xp: 700, respect: 600, power: 1700, energy: 26, category: 'studio' },
    { id: 'st3-5', name: 'Studio Paradise', icon: '👑', tier: 3, price: 30000000, xp: 800, respect: 700, power: 2000, energy: 28, category: 'studio' },
    
    // Tier 4
    { id: 'st4-1', name: 'Celebrity Studio', icon: '🎙️', tier: 4, price: 75000000, xp: 1800, respect: 1000, power: 6000, energy: 45, category: 'studio' },
    { id: 'st4-2', name: 'Iconic Label', icon: '🎙️', tier: 4, price: 150000000, xp: 2200, respect: 1200, power: 7500, energy: 50, category: 'studio' },
    { id: 'st4-3', name: 'Hitmaker Hub', icon: '🎙️', tier: 4, price: 250000000, xp: 2600, respect: 1400, power: 9000, energy: 55, category: 'studio' },
    { id: 'st4-4', name: 'Legendary Studio', icon: '🎙️', tier: 4, price: 400000000, xp: 3000, respect: 1600, power: 10500, energy: 60, category: 'studio' },
    { id: 'st4-5', name: 'Industry Standard', icon: '👑', tier: 4, price: 500000000, xp: 3500, respect: 1800, power: 12000, energy: 65, category: 'studio' },
    
    // Tier 5
    { id: 'st5-1', name: 'World Class', icon: '🎙️', tier: 5, price: 1000000000, xp: 6000, respect: 2000, power: 18000, energy: 100, category: 'studio' },
    { id: 'st5-2', name: 'Heavenly Sound', icon: '🎙️', tier: 5, price: 2500000000, xp: 8500, respect: 2500, power: 22000, energy: 125, category: 'studio' },
    { id: 'st5-3', name: 'Divine Creation', icon: '👑', tier: 5, price: 5000000000, xp: 11000, respect: 3000, power: 26000, energy: 150, category: 'studio' },
    { id: 'st5-4', name: 'Eternal Harmony', icon: '👑', tier: 5, price: 7500000000, xp: 13500, respect: 3500, power: 30000, energy: 175, category: 'studio' },
    { id: 'st5-5', name: 'Godly Sound', icon: '👑', tier: 5, price: 10000000000, xp: 15000, respect: 4000, power: 35000, energy: 200, category: 'studio' },
  ];
  
  // ============================================
  // ⛵ BOATS - 5 Tiers
  // ============================================
  export const BOATS: Asset[] = [
    // Tier 1
    { id: 'b1-1', name: 'Rowboat', icon: '🚣', tier: 1, price: 10000, xp: 15, respect: 10, power: 20, energy: 3, category: 'boat' },
    { id: 'b1-2', name: 'Fishing Boat', icon: '⛵', tier: 1, price: 25000, xp: 20, respect: 15, power: 30, energy: 3, category: 'boat' },
    { id: 'b1-3', name: 'Small Speedboat', icon: '🚤', tier: 1, price: 50000, xp: 25, respect: 20, power: 40, energy: 4, category: 'boat' },
    { id: 'b1-4', name: 'Jet Ski', icon: '🛥️', tier: 1, price: 75000, xp: 30, respect: 25, power: 50, energy: 4, category: 'boat' },
    { id: 'b1-5', name: 'Party Boat', icon: '⛵', tier: 1, price: 100000, xp: 35, respect: 30, power: 60, energy: 5, category: 'boat' },
    
    // Tier 2
    { id: 'b2-1', name: 'Cabin Cruiser', icon: '⛵', tier: 2, price: 300000, xp: 100, respect: 100, power: 200, energy: 12, category: 'boat' },
    { id: 'b2-2', name: 'Sport Yacht', icon: '🛥️', tier: 2, price: 600000, xp: 150, respect: 150, power: 300, energy: 14, category: 'boat' },
    { id: 'b2-3', name: 'Motor Yacht', icon: '⛵', tier: 2, price: 1000000, xp: 200, respect: 200, power: 400, energy: 16, category: 'boat' },
    { id: 'b2-4', name: 'Luxury Yacht', icon: '🛥️', tier: 2, price: 1500000, xp: 250, respect: 250, power: 500, energy: 18, category: 'boat' },
    { id: 'b2-5', name: 'Super Yacht', icon: '⛵', tier: 2, price: 2000000, xp: 300, respect: 300, power: 600, energy: 20, category: 'boat' },
    
    // Tier 3
    { id: 'b3-1', name: 'Mega Yacht', icon: '⛵', tier: 3, price: 5000000, xp: 500, respect: 400, power: 1000, energy: 25, category: 'boat' },
    { id: 'b3-2', name: 'Private Cruiser', icon: '🛥️', tier: 3, price: 10000000, xp: 600, respect: 500, power: 1300, energy: 28, category: 'boat' },
    { id: 'b3-3', name: 'Floating Palace', icon: '⛵', tier: 3, price: 15000000, xp: 700, respect: 600, power: 1600, energy: 31, category: 'boat' },
    { id: 'b3-4', name: 'Elite Vessel', icon: '🛥️', tier: 3, price: 20000000, xp: 800, respect: 700, power: 1900, energy: 34, category: 'boat' },
    { id: 'b3-5', name: 'Imperial Ship', icon: '👑', tier: 3, price: 30000000, xp: 900, respect: 800, power: 2200, energy: 37, category: 'boat' },
    
    // Tier 4
    { id: 'b4-1', name: 'Luxury Cruiser', icon: '⛵', tier: 4, price: 100000000, xp: 2000, respect: 1200, power: 8000, energy: 50, category: 'boat' },
    { id: 'b4-2', name: 'Private Island', icon: '🛥️', tier: 4, price: 200000000, xp: 2400, respect: 1400, power: 9500, energy: 55, category: 'boat' },
    { id: 'b4-3', name: 'Billionaire Yacht', icon: '⛵', tier: 4, price: 350000000, xp: 2800, respect: 1600, power: 11000, energy: 60, category: 'boat' },
    { id: 'b4-4', name: 'Royal Fleet', icon: '🛥️', tier: 4, price: 500000000, xp: 3200, respect: 1800, power: 12500, energy: 65, category: 'boat' },
    { id: 'b4-5', name: 'Legendary Vessel', icon: '👑', tier: 4, price: 750000000, xp: 3600, respect: 2000, power: 14000, energy: 70, category: 'boat' },
    
    // Tier 5
    { id: 'b5-1', name: 'Floating Empire', icon: '⛵', tier: 5, price: 1500000000, xp: 6500, respect: 2500, power: 20000, energy: 125, category: 'boat' },
    { id: 'b5-2', name: 'Godly Yacht', icon: '🛥️', tier: 5, price: 3000000000, xp: 9000, respect: 3000, power: 25000, energy: 150, category: 'boat' },
    { id: 'b5-3', name: 'Eternal Ocean', icon: '👑', tier: 5, price: 6000000000, xp: 11500, respect: 3500, power: 30000, energy: 175, category: 'boat' },
    { id: 'b5-4', name: 'Celestial Seas', icon: '👑', tier: 5, price: 9000000000, xp: 14000, respect: 4000, power: 35000, energy: 200, category: 'boat' },
    { id: 'b5-5', name: 'Infinite Horizon', icon: '👑', tier: 5, price: 15000000000, xp: 16000, respect: 4500, power: 40000, energy: 250, category: 'boat' },
  ];
  
  // ============================================
  // EXPORT ALL ASSETS
  // ============================================
  export const ALL_ASSETS = {
    home: HOMES,
    car: CARS,
    chain: CHAINS,
    watch: WATCHES,
    shoes: SHOES,
    dog: DOGS,
    gun: GUNS,
    studio: STUDIOS,
    boat: BOATS,
  };
  
  export const ASSET_CATEGORIES = [
    { name: 'Homes', icon: '🏠', key: 'home' },
    { name: 'Cars', icon: '🚗', key: 'car' },
    { name: 'Chains', icon: '⛓️', key: 'chain' },
    { name: 'Watches', icon: '⌚', key: 'watch' },
    { name: 'Shoes', icon: '👟', key: 'shoes' },
    { name: 'Dogs', icon: '🐕', key: 'dog' },
    { name: 'Guns', icon: '🔫', key: 'gun' },
    { name: 'Studios', icon: '🎙️', key: 'studio' },
    { name: 'Boats', icon: '⛵', key: 'boat' },
  ];