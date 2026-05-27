'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'

export default function SessionSync() {
  const { data: session, status } = useSession()
  const setCurrentUser = useStore(s => s.setCurrentUser)
  const fetchItems = useStore(s => s.fetchItems)
  const fetchFavorites = useStore(s => s.fetchFavorites)
  const fetchRequests = useStore(s => s.fetchRequests)
  const fetched = useRef(false)

  useEffect(() => {
    if (status === 'loading' || fetched.current) return
    fetched.current = true

    if (session?.user) {
      setCurrentUser(session.user)
      fetchItems()
      fetchFavorites()
      fetchRequests()
    } else {
      setCurrentUser(null)
      fetchItems()
    }
  }, [session, status, setCurrentUser, fetchItems, fetchFavorites, fetchRequests])

  return null
}
