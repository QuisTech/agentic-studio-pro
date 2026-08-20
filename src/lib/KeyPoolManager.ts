import { createGroq } from '@ai-sdk/groq';

export class KeyPoolManager {
  private static activeIndex = 0;
  private static exhaustedKeys: Set<string> = new Set();

  public static getActiveIndex(totalKeys: number): number {
    if (totalKeys === 0) return 0;
    return this.activeIndex % totalKeys;
  }

  public static setActiveIndex(index: number, totalKeys: number): void {
    if (totalKeys > 0) {
      this.activeIndex = index % totalKeys;
    }
  }

  public static markKeyExhausted(key: string): void {
    this.exhaustedKeys.add(key);
  }

  public static isKeyExhausted(key: string): boolean {
    return this.exhaustedKeys.has(key);
  }

  public static resetExhaustedKeys(): void {
    this.exhaustedKeys.clear();
  }

  public static maskKey(key: string): string {
    if (!key) return "none";
    if (key.length <= 10) return key;
    return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
  }
}
