// 📁 src/lib/tierData.ts
// Complete tier and business data for RISE OF A YN

export const TIERS = {
    1: {
      name: 'YN (Youngin\')',
      icon: '🧒',
      description: 'Learning the streets',
      minLevel: 1,
      maxLevel: 9,
      minXP: 0,
      maxXP: 2000,
      bossName: 'Neighborhood OG',
      bossIcon: '👴',
      powerRequired: 250,
      bossReward: { cash: 5000, xp: 500, respect: 50 },
    },
    2: {
      name: 'Trap (Block Boss)',
      icon: '🏚️',
      description: 'Running the block',
      minLevel: 10,
      maxLevel: 24,
      minXP: 2000,
      maxXP: 10000,
      bossName: 'Block Captain',
      bossIcon: '👨‍⚖️',
      powerRequired: 800,
      bossReward: { cash: 25000, xp: 2000, respect: 150 },
    },
    3: {
      name: 'Entrepreneur',
      icon: '💼',
      description: 'Going legit',
      minLevel: 25,
      maxLevel: 49,
      minXP: 10000,
      maxXP: 50000,
      bossName: 'City Controller',
      bossIcon: '🤵',
      powerRequired: 3000,
      bossReward: { cash: 100000, xp: 8000, respect: 400 },
    },
    4: {
      name: 'Boss',
      icon: '👑',
      description: 'Nationwide power',
      minLevel: 50,
      maxLevel: 79,
      minXP: 50000,
      maxXP: 200000,
      bossName: 'State Kingpin',
      bossIcon: '🎰',
      powerRequired: 10000,
      bossReward: { cash: 500000, xp: 40000, respect: 1500 },
    },
    5: {
      name: 'El Jefe',
      icon: '💎',
      description: 'Global dominance',
      minLevel: 80,
      maxLevel: 999,
      minXP: 200000,
      maxXP: Infinity,
      bossName: 'Global Don',
      bossIcon: '🌍',
      powerRequired: 50000,
      bossReward: { cash: 2000000, xp: 200000, respect: 5000 },
    },
  };
  
  export const BUSINESSES = {
    1: [ // Tier 1 - YN (BASE: 120-960 sec - DOUBLING pattern)
      {
        id: 'water-boy',
        name: 'Water Boy Crew',
        icon: '💧',
        tier: 1,
        baseIncome: 50,
        baseCost: 1000,
        baseSpeed: 120,  // 2 min
        description: 'Sell water to the homies',
      },
      {
        id: 'boot-removal',
        name: 'Car Boot Removal',
        icon: '👢',
        tier: 1,
        baseIncome: 75,
        baseCost: 2500,
        baseSpeed: 240,  // 4 min (2x)
        description: 'Remove boots from cars',
      },
      {
        id: 'sneaker-flip',
        name: 'Sneaker Flip',
        icon: '👟',
        tier: 1,
        baseIncome: 100,
        baseCost: 5000,
        baseSpeed: 480,  // 8 min (2x)
        description: 'Buy and resell sneakers',
      },
      {
        id: 'studio-shares',
        name: 'Studio Shares',
        icon: '🎤',
        tier: 1,
        baseIncome: 150,
        baseCost: 10000,
        baseSpeed: 960,  // 16 min (2x) - slowest in T1
        description: 'Rent studio time',
      },
    ],
    2: [ // Tier 2 - Trap (BASE: 1920-15360 sec - CONTINUES doubling pattern)
      {
        id: 'trap-house',
        name: 'Trap House',
        icon: '🏚️',
        tier: 2,
        baseIncome: 500,
        baseCost: 50000,
        baseSpeed: 1920,  // 32 min (2x from T1 slowest)
        description: 'Run a trap house',
      },
      {
        id: 'car-wash',
        name: 'Car Wash',
        icon: '🚗',
        tier: 2,
        baseIncome: 750,
        baseCost: 100000,
        baseSpeed: 3840,  // 64 min (2x)
        description: 'Professional car wash',
      },
      {
        id: 'food-truck',
        name: 'Food Truck',
        icon: '🍔',
        tier: 2,
        baseIncome: 1000,
        baseCost: 150000,
        baseSpeed: 7680,  // 128 min (2x)
        description: 'Mobile food operation',
      },
      {
        id: 'liquor-store',
        name: 'Liquor Store',
        icon: '🥃',
        tier: 2,
        baseIncome: 1500,
        baseCost: 250000,
        baseSpeed: 15360,  // 256 min (2x) - slowest in T2
        description: 'Corner liquor store',
      },
    ],
    3: [ // Tier 3 - Entrepreneur (BASE: 30720-245760 sec - CONTINUES doubling pattern)
      {
        id: 'car-dealership',
        name: 'Car Dealership',
        icon: '🏎️',
        tier: 3,
        baseIncome: 5000,
        baseCost: 500000,
        baseSpeed: 30720,  // 512 min (2x from T2 slowest)
        description: 'Sell luxury cars',
      },
      {
        id: 'real-estate',
        name: 'Real Estate',
        icon: '🏢',
        tier: 3,
        baseIncome: 7500,
        baseCost: 1000000,
        baseSpeed: 61440,  // 1024 min (2x)
        description: 'Property rentals',
      },
      {
        id: 'nightclub',
        name: 'Nightclub',
        icon: '🍾',
        tier: 3,
        baseIncome: 10000,
        baseCost: 2500000,
        baseSpeed: 122880,  // 2048 min (2x)
        description: 'VIP nightclub',
      },
      {
        id: 'record-label',
        name: 'Record Label',
        icon: '💿',
        tier: 3,
        baseIncome: 15000,
        baseCost: 5000000,
        baseSpeed: 245760,  // 4096 min (2x) - slowest in T3
        description: 'Music production',
      },
    ],
    4: [ // Tier 4 - Boss (BASE: 491520-3932160 sec - CONTINUES doubling pattern)
      {
        id: 'import-co',
        name: 'Import Co.',
        icon: '📦',
        tier: 4,
        baseIncome: 50000,
        baseCost: 10000000,
        baseSpeed: 491520,  // 8192 min (2x from T3 slowest)
        description: 'International imports',
      },
      {
        id: 'logistics',
        name: 'Logistics Fleet',
        icon: '🚚',
        tier: 4,
        baseIncome: 75000,
        baseCost: 25000000,
        baseSpeed: 983040,  // 16384 min (2x)
        description: 'Shipping operations',
      },
      {
        id: 'jet-lease',
        name: 'Jet Lease',
        icon: '✈️',
        tier: 4,
        baseIncome: 100000,
        baseCost: 50000000,
        baseSpeed: 1966080,  // 32768 min (2x)
        description: 'Private jet leasing',
      },
      {
        id: 'tech-startup',
        name: 'Tech Startup',
        icon: '💻',
        tier: 4,
        baseIncome: 150000,
        baseCost: 100000000,
        baseSpeed: 3932160,  // 65536 min (2x) - slowest in T4
        description: 'Tech company',
      },
    ],
    5: [ // Tier 5 - El Jefe (BASE: 7864320-62914560 sec - CONTINUES doubling pattern)
      {
        id: 'oil-field',
        name: 'Oil Field',
        icon: '🛢️',
        tier: 5,
        baseIncome: 500000,
        baseCost: 500000000,
        baseSpeed: 7864320,  // 131072 min (2x from T4 slowest)
        description: 'Oil production',
      },
      {
        id: 'wind-farm',
        name: 'Wind Farm',
        icon: '💨',
        tier: 5,
        baseIncome: 750000,
        baseCost: 1000000000,
        baseSpeed: 15728640,  // 262144 min (2x)
        description: 'Renewable energy',
      },
      {
        id: 'cruise-line',
        name: 'Cruise Line',
        icon: '⛴️',
        tier: 5,
        baseIncome: 1000000,
        baseCost: 2500000000,
        baseSpeed: 31457280,  // 524288 min (2x)
        description: 'Luxury cruises',
      },
      {
        id: 'overseas-port',
        name: 'Overseas Port',
        icon: '🌊',
        tier: 5,
        baseIncome: 2000000,
        baseCost: 5000000000,
        baseSpeed: 62914560,  // 1048576 min (2x) - slowest in T5
        description: 'International port',
      },
    ],
  };
  
  export const ASSETS = {
    homes: [
      // Tier 1
      { id: 'trap-room', tier: 1, name: 'Trap Room', icon: '🛏️', price: 5000 },
      { id: 'basement', tier: 1, name: 'Studio Basement', icon: '🏚️', price: 10000 },
      { id: 'apartment', tier: 1, name: 'Shared Apartment', icon: '🏠', price: 15000 },
      { id: 'backhouse', tier: 1, name: 'Back-House', icon: '🏘️', price: 25000 },
      { id: 'duplex-1', tier: 1, name: 'Duplex', icon: '🏘️', price: 50000 },
      
      // Tier 2
      { id: 'loft', tier: 2, name: 'Garage Loft', icon: '🏢', price: 100000 },
      { id: 'house', tier: 2, name: 'One-Story Home', icon: '🏠', price: 200000 },
      { id: 'townhouse', tier: 2, name: 'Townhouse', icon: '🏘️', price: 350000 },
      { id: 'duplex-2', tier: 2, name: 'Duplex', icon: '🏘️', price: 500000 },
      { id: 'complex', tier: 2, name: '2-Unit Complex', icon: '🏢', price: 750000 },
      
      // Tier 3
      { id: 'suburban', tier: 3, name: 'Suburban Home', icon: '🏡', price: 1000000 },
      { id: 'lake-house', tier: 3, name: 'Lake House', icon: '🏞️', price: 2500000 },
      { id: 'condo', tier: 3, name: 'Condo', icon: '🏢', price: 3500000 },
      { id: 'estate-3', tier: 3, name: 'Mini Estate', icon: '👑', price: 5000000 },
      
      // Tier 4
      { id: 'mansion', tier: 4, name: 'Mansion', icon: '🏰', price: 10000000 },
      { id: 'penthouse', tier: 4, name: 'Penthouse', icon: '🌇', price: 25000000 },
      { id: 'estate-4', tier: 4, name: 'Estate', icon: '👑', price: 50000000 },
      { id: 'beach-villa', tier: 4, name: 'Beach Villa', icon: '🏝️', price: 75000000 },
      
      // Tier 5
      { id: 'mega-estate', tier: 5, name: 'Mega Estate', icon: '🏰', price: 500000000 },
      { id: 'island-villa', tier: 5, name: 'Island Villa', icon: '🏝️', price: 1000000000 },
      { id: 'compound', tier: 5, name: 'Desert Compound', icon: '🏜️', price: 2500000000 },
    ],
    cars: [
      // Tier 1
      { id: 'bike', tier: 1, name: 'Bike', icon: '🏍️', price: 2000 },
      { id: 'crown-vic', tier: 1, name: 'Crown Vic', icon: '🚗', price: 5000 },
      { id: 'civic', tier: 1, name: 'Civic', icon: '🚗', price: 8000 },
      { id: 'impala', tier: 1, name: 'Old Impala', icon: '🚙', price: 12000 },
      { id: 'charger-se', tier: 1, name: 'Charger SE', icon: '🏎️', price: 20000 },
      
      // Tier 2
      { id: 'altima', tier: 2, name: 'Altima', icon: '🚗', price: 50000 },
      { id: 'camaro', tier: 2, name: 'Camaro', icon: '🏎️', price: 75000 },
      { id: 'charger-rt', tier: 2, name: 'Charger RT', icon: '🏎️', price: 100000 },
      { id: 'accord', tier: 2, name: 'Accord Sport', icon: '🚗', price: 120000 },
      { id: 'tahoe', tier: 2, name: 'Tahoe LT', icon: '🚙', price: 150000 },
      
      // Tier 3
      { id: 'bmw', tier: 3, name: 'BMW M3', icon: '🏎️', price: 500000 },
      { id: 'tesla', tier: 3, name: 'Tesla S', icon: '🚗', price: 750000 },
      { id: 'mercedes', tier: 3, name: 'Mercedes C63', icon: '🏎️', price: 1000000 },
      { id: 'audi', tier: 3, name: 'Audi RS5', icon: '🏎️', price: 1250000 },
      { id: 'lexus', tier: 3, name: 'Lexus IS 350', icon: '🚗', price: 1500000 },
      
      // Tier 4
      { id: 'lambo', tier: 4, name: 'Lambo Huracán', icon: '🏎️', price: 5000000 },
      { id: 'mclaren', tier: 4, name: 'McLaren 720S', icon: '🏎️', price: 7500000 },
      { id: 'gwagon', tier: 4, name: 'G-Wagon', icon: '🚙', price: 10000000 },
      { id: 'range', tier: 4, name: 'Range SVR', icon: '🚙', price: 12500000 },
      { id: 'amg', tier: 4, name: 'AMG GT', icon: '🏎️', price: 15000000 },
      
      // Tier 5
      { id: 'rolls', tier: 5, name: 'Rolls Royce', icon: '👑', price: 100000000 },
      { id: 'bugatti', tier: 5, name: 'Bugatti', icon: '🏎️', price: 250000000 },
      { id: 'ferrari', tier: 5, name: 'Ferrari SF90', icon: '🏎️', price: 500000000 },
      { id: 'yacht', tier: 5, name: 'Super Yacht', icon: '⛵', price: 1000000000 },
    ],
  };
  
  // 📁 src/lib/tierData.ts - CORRECTED HUSTLES SECTION
// Expand from 3 to 5 hustles per tier with street-themed names

export const HUSTLES = {
  1: [ // Tier 1 - YN (Youngin')
    { 
      id: 'hustle-1', 
      name: 'Water Boy Crew', 
      icon: '💧', 
      reward: 100, 
      xp: 5, 
      energy: 5,
      danger: 1,
      description: 'Sell water to the homies. Low risk, quick cash.'
    },
    { 
      id: 'hustle-2', 
      name: 'Sneaker Resell', 
      icon: '👢', 
      reward: 150, 
      xp: 7, 
      energy: 8,
      danger: 1,
      description: 'Resell Fake Sneakers. Easy money.'
    },
    { 
      id: 'hustle-3', 
      name: 'Dime Bags', 
      icon: '🛍️', 
      reward: 250, 
      xp: 12, 
      energy: 15,
      danger: 2,
      description: 'Small package moving. Medium risk, better payout.'
    },
    { 
      id: 'hustle-4', 
      name: 'Petty Theft', 
      icon: '🏪', 
      reward: 400, 
      xp: 18, 
      energy: 25,
      danger: 2,
      description: 'Shoplift and resell. More risky, more profit.'
    },
    { 
      id: 'hustle-5', 
      name: 'Mugging', 
      icon: '👊', 
      reward: 600, 
      xp: 30, 
      energy: 40,
      danger: 3,
      description: 'Rob someone on street. High risk, high reward.'
    },
  ],
  
  2: [ // Tier 2 - Trap (Block Boss)
    { 
      id: 'hustle-1', 
      name: 'Trap House Ops', 
      icon: '🏚️', 
      reward: 1000, 
      xp: 50, 
      energy: 10,
      danger: 1,
      description: 'Run a trap house. Standard operation.'
    },
    { 
      id: 'hustle-2', 
      name: 'Street Plug', 
      icon: '📱', 
      reward: 2500, 
      xp: 100, 
      energy: 20,
      danger: 2,
      description: 'Move weight on the street. Medium heat.'
    },
    { 
      id: 'hustle-3', 
      name: 'Jewelry Heist', 
      icon: '💎', 
      reward: 5000, 
      xp: 200, 
      energy: 40,
      danger: 3,
      description: 'Rob a jewelry store. High risk, high heat.'
    },
    { 
      id: 'hustle-4', 
      name: 'Car Jacking', 
      icon: '🚗', 
      reward: 7500, 
      xp: 300, 
      energy: 50,
      danger: 3,
      description: 'Steal and flip cars. Serious heat.'
    },
    { 
      id: 'hustle-5', 
      name: 'Store Robbery', 
      icon: '🔫', 
      reward: 10000, 
      xp: 500, 
      energy: 60,
      danger: 4,
      description: 'Armed robbery. Very dangerous, huge payout.'
    },
  ],
  
  3: [ // Tier 3 - Entrepreneur
    { 
      id: 'hustle-1', 
      name: 'Business Deal', 
      icon: '💼', 
      reward: 10000, 
      xp: 500, 
      energy: 10,
      danger: 1,
      description: 'Legitimate business negotiation. Clean.'
    },
    { 
      id: 'hustle-2', 
      name: 'Casino Night', 
      icon: '🎰', 
      reward: 25000, 
      xp: 1000, 
      energy: 20,
      danger: 2,
      description: 'High stakes gambling run. Some risk.'
    },
    { 
      id: 'hustle-3', 
      name: 'Bank Robbery Plan', 
      icon: '🏦', 
      reward: 50000, 
      xp: 2500, 
      energy: 40,
      danger: 3,
      description: 'Plan and execute bank job. Major heat.'
    },
    { 
      id: 'hustle-4', 
      name: 'Home Invasion', 
      icon: '🏠', 
      reward: 75000, 
      xp: 3500, 
      energy: 50,
      danger: 3,
      description: 'Raid a wealthy home. Serious consequences.'
    },
    { 
      id: 'hustle-5', 
      name: 'Major Heist', 
      icon: '💰', 
      reward: 100000, 
      xp: 5000, 
      energy: 60,
      danger: 4,
      description: 'Orchestrate major robbery. Maximum heat.'
    },
  ],
  
  4: [ // Tier 4 - Boss
    { 
      id: 'hustle-1', 
      name: 'Corporation Deal', 
      icon: '🏢', 
      reward: 100000, 
      xp: 5000, 
      energy: 10,
      danger: 1,
      description: 'Corporate negotiation and contracts.'
    },
    { 
      id: 'hustle-2', 
      name: 'Hitman Job', 
      icon: '🎯', 
      reward: 250000, 
      xp: 10000, 
      energy: 20,
      danger: 2,
      description: 'Contract killing for hire. Extreme risk.'
    },
    { 
      id: 'hustle-3', 
      name: 'Middle Man Deals', 
      icon: '🤝', 
      reward: 500000, 
      xp: 25000, 
      energy: 40,
      danger: 3,
      description: 'International broker between cartels.'
    },
    { 
      id: 'hustle-4', 
      name: 'Stolen Goods Fence', 
      icon: '📦', 
      reward: 750000, 
      xp: 35000, 
      energy: 50,
      danger: 3,
      description: 'Move stolen military weapons internationally.'
    },
    { 
      id: 'hustle-5', 
      name: 'National Play', 
      icon: '🌎', 
      reward: 1000000, 
      xp: 50000, 
      energy: 60,
      danger: 4,
      description: 'Nationwide criminal operation.'
    },
  ],
  
  5: [ // Tier 5 - El Jefe
    { 
      id: 'hustle-1', 
      name: 'Global Deal', 
      icon: '🌍', 
      reward: 1000000, 
      xp: 50000, 
      energy: 10,
      danger: 1,
      description: 'Worldwide business operation.'
    },
    { 
      id: 'hustle-2', 
      name: 'International Cartel', 
      icon: '🚁', 
      reward: 2500000, 
      xp: 100000, 
      energy: 20,
      danger: 2,
      description: 'Control international cartel operations.'
    },
    { 
      id: 'hustle-3', 
      name: 'Government Contract', 
      icon: '🕵️', 
      reward: 5000000, 
      xp: 250000, 
      energy: 40,
      danger: 3,
      description: 'Secret government contracts.'
    },
    { 
      id: 'hustle-4', 
      name: 'Offshore Operation', 
      icon: '🏝️', 
      reward: 7500000, 
      xp: 350000, 
      energy: 50,
      danger: 3,
      description: 'Island-based criminal empire.'
    },
    { 
      id: 'hustle-5', 
      name: 'World Dominance', 
      icon: '👑', 
      reward: 10000000, 
      xp: 500000, 
      energy: 60,
      danger: 5,
      description: 'Global criminal empire. Ultimate power.'
    },
  ],
};