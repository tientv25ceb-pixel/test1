import { useEffect } from 'react'
import { supabase } from './supabase'
import { useStore } from './store'

export function useRealtimeMessages(conversationId: string | null) {
  const fetchMessages = useStore((s) => s.fetchMessages)

  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchMessages(conversationId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, fetchMessages])
}
