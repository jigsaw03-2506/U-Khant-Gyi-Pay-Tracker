import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '../../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser)
  const [checking, setChecking] = useState(true)

  useEffect(
    () =>
      onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser)
        setChecking(false)
      }),
    [],
  )

  return { user, checking, logout: () => signOut(auth) }
}
