export function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 6) errors.push('Password must be at least 6 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
  return errors;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
