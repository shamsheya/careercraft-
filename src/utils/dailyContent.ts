export function getDailySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getDailyPick<T>(arr: T[], count: number): T[] {
  const seed = getDailySeed();
  const shuffled = seededShuffle(arr, seed);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function isNewDay(): boolean {
  const last = localStorage.getItem('careercraft_last_date');
  const today = new Date().toISOString().split('T')[0];
  if (last !== today) {
    localStorage.setItem('careercraft_last_date', today);
    return true;
  }
  return false;
}
