// 📁 src/lib/energy.ts
// Energy Regeneration System

export function calculateEnergyRegen(lastRegenTime: string | null, maxEnergy: number, currentEnergy: number): {
    restoredEnergy: number;
    newEnergy: number;
    timeUntilFull: number;
  } {
    const now = new Date().getTime();
    const lastRegen = lastRegenTime ? new Date(lastRegenTime).getTime() : now;
    
    // 1 energy per minute
    const minutesPassed = Math.floor((now - lastRegen) / 1000 / 60);
    const restoredEnergy = minutesPassed * 1;
    const newEnergy = Math.min(currentEnergy + restoredEnergy, maxEnergy);
    
    // Time until full
    const energyNeeded = maxEnergy - newEnergy;
    const timeUntilFull = energyNeeded * 60 * 1000; // milliseconds
    
    return {
      restoredEnergy,
      newEnergy,
      timeUntilFull,
    };
  }
  
  export function formatTimeRemaining(milliseconds: number): string {
    if (milliseconds <= 0) return 'Full';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }