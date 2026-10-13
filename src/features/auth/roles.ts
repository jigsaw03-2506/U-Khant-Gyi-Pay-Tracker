// The admin account sees everything. Every other logged-in account is an
// employee and can only record new transfers.
// Keep this email the same as ADMIN_EMAIL in firestore.rules.
export const ADMIN_EMAIL = 'yairhlagit2@gmail.com'

export function isAdminEmail(email: string | null | undefined): boolean {
  return (email ?? '').trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
}
