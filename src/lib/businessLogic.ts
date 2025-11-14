// Calculate current income after upgrades and managers
export function calculateBusinessIncome(
    baseIncome: number,
    upgradeLevel: number,
    incomeManagerLevel: number
  ): number {
    // Each upgrade: 2x multiplier
    let income = baseIncome * Math.pow(2, upgradeLevel);
    
    // Income manager: +20% per level
    let managerBonus = 1 + (incomeManagerLevel * 0.2);
    
    return Math.floor(income * managerBonus);
  }
  
  // Calculate current speed after upgrades and managers
  export function calculateBusinessSpeed(
    baseSpeed: number,
    upgradeLevel: number,
    speedManagerLevel: number
  ): number {
    // Each upgrade: 2x faster (divide by 2)
    let speed = baseSpeed / Math.pow(2, upgradeLevel);
    
    // Speed manager: reduces collection time
    if (speedManagerLevel > 0) {
      speed = speed / speedManagerLevel; // Level 1 = same, Level 2 = 2x faster
    }
    
    return Math.max(5, speed); // Minimum 5 seconds
  }
  
  // Calculate upgrade cost
  export function calculateUpgradeCost(
    baseCost: number,
    currentUpgradeLevel: number
  ): number {
    // Each upgrade costs 1.5x more
    return Math.floor(baseCost * 1.5 * Math.pow(1.5, currentUpgradeLevel));
  }
  
  // Calculate manager cost
  export function calculateManagerCost(
    baseCost: number,
    currentLevel: number,
    tier: number
  ): number {
    // Each tier base cost increases 10x
    let tierBaseCost = baseCost * Math.pow(10, tier - 1);
    
    // Each level costs 2x more
    return Math.floor(tierBaseCost * Math.pow(2, currentLevel));
  }
  
  // Check if collection is ready
  export function isCollectionReady(lastCollected: Date, currentSpeed: number): boolean {
    const now = new Date();
    const secondsPassed = (now.getTime() - lastCollected.getTime()) / 1000;
    return secondsPassed >= currentSpeed;
  }
  
  // Format time remaining
  export function getTimeRemaining(lastCollected: Date, currentSpeed: number): string {
    const now = new Date();
    const secondsPassed = (now.getTime() - lastCollected.getTime()) / 1000;
    const secondsRemaining = Math.max(0, currentSpeed - secondsPassed);
    
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = Math.floor(secondsRemaining % 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }