-- ============================================================
-- ĐN-UniShare Database Schema
-- Chạy script này trong Supabase SQL Editor
-- ============================================================

-- 1. Users (mở rộng từ Auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  faculty TEXT NOT NULL DEFAULT 'Khác',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Items
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sach', 'do-hoc-tap', 'do-ktx', 'suatan', 'tailieu', 'khac')),
  condition TEXT NOT NULL CHECK (condition IN ('moi', 'tot', 'kha', 'cu')),
  exchange_type TEXT NOT NULL DEFAULT 'mienphi' CHECK (exchange_type IN ('mienphi', 'traodoi')),
  image TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL,
  posted_by TEXT NOT NULL,
  poster_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  poster_faculty TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'completed', 'cancelled')),
  requested_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho tìm kiếm
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_items_category ON public.items(category);
CREATE INDEX idx_items_poster ON public.items(poster_id);
CREATE INDEX idx_items_created ON public.items(created_at DESC);

-- 3. Requests
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  item_title TEXT NOT NULL,
  requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  poster_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'collected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, requester_id)
);

CREATE INDEX idx_requests_requester ON public.requests(requester_id);
CREATE INDEX idx_requests_item ON public.requests(item_id);
CREATE INDEX idx_requests_status ON public.requests(status);

-- 4. Favorites
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

CREATE INDEX idx_favorites_user ON public.favorites(user_id);

-- 5. Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  participant_names TEXT[] NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  item_title TEXT NOT NULL DEFAULT '',
  last_message TEXT DEFAULT '',
  last_message_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_participants ON public.conversations USING GIN(participant_ids);

-- 6. Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at ASC);

-- 7. Ratings
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rater_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT DEFAULT '',
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rater_id, target_id, item_id)
);

CREATE INDEX idx_ratings_target ON public.ratings(target_id);

-- 8. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies
-- Users: ai cũng đọc được, chỉ tự sửa được profile mình
CREATE POLICY "users_read_all" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (id = auth.uid());

-- Items: ai cũng xem được, chỉ chủ đăng mới sửa/xóa
CREATE POLICY "items_read_all" ON public.items FOR SELECT USING (true);
CREATE POLICY "items_insert_auth" ON public.items FOR INSERT WITH CHECK (poster_id = auth.uid());
CREATE POLICY "items_update_own" ON public.items FOR UPDATE USING (poster_id = auth.uid());
CREATE POLICY "items_delete_own" ON public.items FOR DELETE USING (poster_id = auth.uid());

-- Requests
CREATE POLICY "requests_select_own" ON public.requests FOR SELECT USING (
  requester_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.items WHERE items.id = requests.item_id AND items.poster_id = auth.uid())
);
CREATE POLICY "requests_insert_auth" ON public.requests FOR INSERT WITH CHECK (requester_id = auth.uid());
CREATE POLICY "requests_update_poster" ON public.requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.items WHERE items.id = requests.item_id AND items.poster_id = auth.uid())
);

-- Favorites
CREATE POLICY "fav_select_own" ON public.favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "fav_insert_own" ON public.favorites FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "fav_delete_own" ON public.favorites FOR DELETE USING (user_id = auth.uid());

-- Conversations & Messages: participant mới được xem
CREATE POLICY "conv_select_participant" ON public.conversations FOR SELECT USING (auth.uid() = ANY(participant_ids));
CREATE POLICY "conv_insert_auth" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = ANY(participant_ids));

CREATE POLICY "msg_select_participant" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE conversations.id = messages.conversation_id AND auth.uid() = ANY(conversations.participant_ids))
);
CREATE POLICY "msg_insert_participant" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations WHERE conversations.id = messages.conversation_id AND auth.uid() = ANY(conversations.participant_ids))
);

-- Ratings
CREATE POLICY "ratings_select_all" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "ratings_insert_auth" ON public.ratings FOR INSERT WITH CHECK (rater_id = auth.uid());

-- 10. Enable Realtime cho messages, conversations, items
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.requests;
