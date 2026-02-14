# "Дух Города" (Spirit of the City) — PRD & Execution Plan

## Context
Gamified volunteer mobile app for a 24-hour hackathon. A virtual pet's health depends on real-world volunteer activity. 2 fullstack JS/TS devs, React Native (Expo) frontend, Python (FastAPI) backend, PostgreSQL.

---

## 1. CORE FEATURES (MVP)

| Feature | Priority |
|---------|----------|
| Auth (email + password, JWT) | P0 |
| Virtual pet with mood (happy/neutral/sad/sleeping based on activity) | P0 |
| Event list + detail + join/complete | P0 |
| XP, leveling, streak system | P0 |
| City map with event markers | P0 |
| Leaderboard | P1 |
| Achievements/badges | P1 |
| Pet evolution (egg→baby→teen→adult) | P1 |
| Other users' pets on map | P2 |

---

## 2. DATA MODEL

**Users** — id, email, password_hash, username, avatar_url, timestamps
**Pets** — id, user_id (1:1), name, mood, level, xp, xp_to_next_level, evolution_stage (1-4), last_fed_at, streak_days, streak_last_date, timestamps
**Events** — id, title, description, category (ecology/social/animals/education), lat/lng, address, start_time, end_time, xp_reward, max_participants, image_url
**EventParticipations** — id, user_id, event_id, status (joined/completed/cancelled), joined_at, completed_at
**Achievements** — id, key, title, description, icon, xp_bonus, condition_type, condition_value
**UserAchievements** — id, user_id, achievement_id, earned_at

### Pet Mechanics
- **Mood**: `<12h since activity = happy, <24h = neutral, <48h = sad, else = sleeping`
- **Leveling**: `xp_to_next_level = level * 100`, evolution at levels 1/3/6/10
- **Streak**: consecutive days with completed events, +5 XP bonus per streak day (max +50)

### Database Schema (PostgreSQL)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE pet_mood AS ENUM ('happy', 'neutral', 'sad', 'sleeping');
CREATE TYPE event_category AS ENUM ('ecology', 'social', 'animals', 'education');
CREATE TYPE participation_status AS ENUM ('joined', 'completed', 'cancelled');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL DEFAULT 'Spirit',
    mood pet_mood NOT NULL DEFAULT 'neutral',
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    xp_to_next_level INTEGER NOT NULL DEFAULT 100,
    evolution_stage INTEGER NOT NULL DEFAULT 1,
    last_fed_at TIMESTAMP WITH TIME ZONE,
    streak_days INTEGER NOT NULL DEFAULT 0,
    streak_last_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category event_category NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address VARCHAR(500),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    max_participants INTEGER,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE event_participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status participation_status NOT NULL DEFAULT 'joined',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, event_id)
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(300),
    icon VARCHAR(10) NOT NULL DEFAULT '🏆',
    xp_bonus INTEGER NOT NULL DEFAULT 0,
    condition_type VARCHAR(50) NOT NULL,
    condition_value INTEGER NOT NULL
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_events_location ON events(latitude, longitude);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_event_participations_user ON event_participations(user_id);
CREATE INDEX idx_event_participations_event ON event_participations(event_id);
```

### Seed Achievements

| Key | Title | Condition | XP Bonus |
|-----|-------|-----------|----------|
| first_event | Первый шаг | 1 event completed | 25 |
| events_5 | Постоянный помощник | 5 events completed | 50 |
| events_10 | Страж города | 10 events completed | 100 |
| streak_3 | В ритме | 3-day streak | 30 |
| streak_7 | Недельный воин | 7-day streak | 75 |
| eco_warrior | Эко-воин | 3 ecology events | 40 |
| animal_friend | Друг животных | 3 animal events | 40 |
| social_butterfly | Душа компании | 3 social events | 40 |
| teacher | Учитель | 3 education events | 40 |
| level_5 | Восходящая звезда | Reach level 5 | 50 |
| level_10 | Легенда города | Reach level 10 | 100 |

---

## 3. API ENDPOINTS (12 total)

### Auth
```
POST   /api/v1/auth/register
  Body: { email, password, username }
  Response: { user, pet, access_token }

POST   /api/v1/auth/login
  Body: { email, password }
  Response: { user, pet, access_token }

GET    /api/v1/auth/me
  Headers: Authorization: Bearer <token>
  Response: { user, pet }
```

### Pet
```
GET    /api/v1/pet
  Response: { pet } (mood recalculated dynamically)

PUT    /api/v1/pet
  Body: { name }
  Response: { pet }
```

### Events
```
GET    /api/v1/events
  Query: ?category=ecology&lat=43.25&lng=76.95
  Response: { events[], count }

GET    /api/v1/events/:id
  Response: { event, participants_count, is_joined, is_completed }

POST   /api/v1/events/:id/join
  Response: { participation }

POST   /api/v1/events/:id/complete
  Response: { participation, xp_earned, streak_bonus, pet, new_achievements[] }
```

### Gamification
```
GET    /api/v1/leaderboard
  Response: { leaderboard: [{ rank, username, level, xp, pet_name, pet_evolution_stage }] }

GET    /api/v1/achievements
  Response: { earned[], available[] }

GET    /api/v1/profile/stats
  Response: { events_completed, total_xp, streak_days, level, category_counts }
```

---

## 4. SCREENS & NAVIGATION

```
AuthStack (not logged in):
  WelcomeScreen     — Logo, tagline, Login/Register buttons
  LoginScreen       — Email + password form
  RegisterScreen    — Username + email + password form

MainTabs (logged in, bottom tabs):
  HomeTab           — Pet display (emoji 🥚🐣🐥🦅), mood color, XP bar, streak, level, "Find Events" button
  MapTab            — Full-screen map, colored markers (🟢ecology 🔵social 🟠animals 🟣education), bottom card on tap
  EventsTab         — Category filter chips → FlatList of EventCards → EventDetailScreen (join/complete)
  LeaderboardTab    — Ranked user list, current user highlighted
  ProfileTab        — Stats grid, achievements grid (colored=earned, grey=locked), logout
```

---

## 5. PROJECT STRUCTURE

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app, CORS, startup
│   ├── config.py               # Settings (DB URL, JWT secret)
│   ├── database.py             # SQLAlchemy async engine + session
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── pet.py
│   │   ├── event.py
│   │   ├── participation.py
│   │   └── achievement.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── pet.py
│   │   ├── event.py
│   │   └── gamification.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── pet.py
│   │   ├── events.py
│   │   └── gamification.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py     # JWT, password hashing
│   │   ├── pet_service.py      # Mood calc, XP, leveling, evolution
│   │   ├── event_service.py    # Join/complete logic
│   │   └── achievement_service.py
│   ├── middleware/
│   │   └── auth.py             # JWT dependency
│   └── seed.py                 # Seed events + achievements
├── requirements.txt
└── .env

mobile/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
└── src/
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── AuthStack.tsx
    │   └── MainTabs.tsx
    ├── screens/
    │   ├── WelcomeScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── RegisterScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── MapScreen.tsx
    │   ├── EventListScreen.tsx
    │   ├── EventDetailScreen.tsx
    │   ├── LeaderboardScreen.tsx
    │   └── ProfileScreen.tsx
    ├── components/
    │   ├── PetDisplay.tsx
    │   ├── XPBar.tsx
    │   ├── EventCard.tsx
    │   ├── CategoryChip.tsx
    │   ├── AchievementBadge.tsx
    │   ├── LeaderboardRow.tsx
    │   └── StatBox.tsx
    ├── api/
    │   ├── client.ts            # Axios + auth interceptor
    │   ├── auth.ts
    │   ├── pet.ts
    │   ├── events.ts
    │   └── gamification.ts
    ├── store/
    │   ├── authStore.ts         # Zustand
    │   └── petStore.ts
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useLocation.ts
    ├── constants/
    │   ├── colors.ts
    │   ├── petAssets.ts
    │   └── categories.ts
    ├── types/
    │   └── index.ts
    └── utils/
        └── formatting.ts
```

---

## 6. PARALLEL EXECUTION PLAN (24h)

### Dev A = Frontend (React Native/Expo) | Dev B = Backend (Python/FastAPI)

---

### Phase 1: Foundation (Hours 0-3)

**Hour 0 — Together (30 min):**
- Review this PRD
- Agree on API response shapes
- Create git repo with `backend/` and `mobile/` directories
- Dev B starts PostgreSQL (Neon.tech free tier)

**Dev A (H0.5-3):**
- `npx create-expo-app mobile --template blank-typescript`
- Install: react-navigation, react-native-maps, axios, zustand, expo-location, @react-native-async-storage/async-storage
- Setup folder structure, TypeScript types (`src/types/index.ts`), colors (`src/constants/colors.ts`)
- API client with auth interceptor (`src/api/client.ts`)
- Navigation: RootNavigator, AuthStack, MainTabs
- Auth screens: WelcomeScreen, LoginScreen, RegisterScreen
- Auth store (Zustand) + API functions

**Dev B (H0.5-3):**
- Create `backend/`, virtualenv, install: fastapi, uvicorn, sqlalchemy, asyncpg, python-jose, passlib, pydantic
- `app/config.py`, `app/database.py` (async SQLAlchemy)
- All models in `app/models/`
- Table creation via `metadata.create_all`
- Auth endpoints: register (auto-creates pet), login, /me
- `seed.py` — 15-20 events in Almaty + 11 achievements
- **✅ Checkpoint H3:** Auth E2E working, DB seeded

---

### Phase 2: Core Features (Hours 3-10)

**Dev A (H3-6):**
- Components: PetDisplay (emoji 🥚🐣🐥🦅 + mood colors), XPBar, StatBox
- HomeScreen: pet display, level, streak, XP bar, "Find Events" CTA
- petStore (Zustand) + `src/api/pet.ts`

**Dev B (H3-6):**
- `pet_service.py`: mood calculation, XP/leveling, streak logic, evolution
- Pet endpoints: GET /pet, PUT /pet
- Event endpoints: GET list, GET detail, POST join, POST complete
- `event_service.py` — complete event is the critical endpoint (awards XP, feeds pet, updates streak)

**Dev A (H6-10):**
- Components: EventCard, CategoryChip
- EventListScreen: category filters, FlatList
- EventDetailScreen: join/complete buttons, XP animation on complete
- `src/api/events.ts`
- Integrate all screens with real backend API
- **✅ Checkpoint H10:** Core loop works (register → pet → events → complete → XP)

**Dev B (H6-10):**
- `achievement_service.py`: check & award achievements on event completion
- Gamification endpoints: leaderboard, achievements, profile stats
- Hook achievements into event completion endpoint
- Test all endpoints
- **✅ Checkpoint H10:** Full backend API complete

---

### Phase 3: Map + Gamification UI (Hours 10-16)

**Dev A (H10-13):**
- MapScreen: expo-location permissions, react-native-maps, event markers (colored by category), bottom card on marker tap → EventDetail

**Dev A (H13-16):**
- LeaderboardScreen: ranked FlatList, current user highlighted
- ProfileScreen: stats grid, achievements grid, logout

**Dev B (H10-13):**
- Distance calc (Haversine) for events endpoint
- Create demo accounts (users at different levels/stages for demo)
- Debug help for Dev A

**Dev B (H13-16):**
- API error handling polish, input validation
- Deploy backend to Railway/Render free tier
- Update mobile API base URL
- **✅ Checkpoint H16:** All screens functional, backend deployed

---

### Phase 4: Polish (Hours 16-22)

**Dev A (H16-19):**
- Pet animations (Animated API: bounce on happy, shake on sad)
- Event completion celebration modal
- Loading spinners, empty states
- Tab bar icons (@expo/vector-icons)
- UI consistency pass

**Dev B (H16-19):**
- Final deployment testing
- Demo seed data polish
- Help with remaining bugs
- Write demo script

**Both (H19-22):**
- Full integration testing together
- Fix critical bugs
- Test on iOS + Android
- Prepare 2-3 demo accounts with different states

---

### Phase 5: Demo (Hours 22-24)

**Together:**
- Rehearse demo 2-3x
- Prepare talking points
- Backup: screen recording in case of live demo issues

**Demo flow:**
1. Welcome screen → Register → New pet (egg, neutral)
2. Browse map → See events
3. Open event → Join → Complete → XP animation, pet happy
4. Profile → "Первый шаг" achievement earned
5. Leaderboard
6. Switch to demo account → Evolved pet (level 10, adult 🦅)
7. Vision: real event integration, city partnerships, social features

---

## 7. MVP CUTLINE

| Condition | What to drop |
|-----------|-------------|
| Behind at H14 | Map (list only), leaderboard, achievements, pet evolution |
| Behind at H10 | Category filtering, animations, streak display |
| Emergency H18 | Hard-code mock API responses, demo via Swagger UI |

---

## 8. API RESPONSE TYPES (TypeScript Contract)

```typescript
// Auth
interface AuthResponse {
  user: { id: string; email: string; username: string; avatar_url: string | null; created_at: string; };
  pet: PetResponse;
  access_token: string;
}

// Pet
interface PetResponse {
  id: string;
  name: string;
  mood: 'happy' | 'neutral' | 'sad' | 'sleeping';
  level: number;
  xp: number;
  xp_to_next_level: number;
  evolution_stage: number;
  streak_days: number;
  last_fed_at: string | null;
}

// Event
interface EventResponse {
  id: string;
  title: string;
  description: string;
  category: 'ecology' | 'social' | 'animals' | 'education';
  latitude: number;
  longitude: number;
  address: string;
  start_time: string;
  end_time: string | null;
  xp_reward: number;
  max_participants: number | null;
  image_url: string | null;
  participants_count?: number;
  is_joined?: boolean;
  is_completed?: boolean;
}

// Complete Event
interface CompleteEventResponse {
  participation: { id: string; status: 'completed'; completed_at: string; };
  xp_earned: number;
  streak_bonus: number;
  pet: PetResponse;
  new_achievements: AchievementResponse[];
}

// Leaderboard
interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  pet_name: string;
  pet_evolution_stage: number;
}

// Achievement
interface AchievementResponse {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xp_bonus: number;
  earned_at?: string;
}
```

---

## 9. TECH DECISIONS

| Choice | Reason |
|--------|--------|
| Zustand | Minimal boilerplate for state |
| Emoji pets (🥚🐣🐥🦅) | No design assets needed |
| AsyncStorage | Simple token persistence |
| Axios | Auth interceptor support |
| Neon.tech | Free Postgres, zero ops |
| Railway/Render | Free tier, git push deploy |
| Mood computed on fetch | No background jobs needed |

---

## 10. COLOR PALETTE

```typescript
const colors = {
  primary: '#4CAF50',       // Green — volunteering = growth
  primaryDark: '#388E3C',
  primaryLight: '#C8E6C9',
  secondary: '#FF9800',     // Orange — energy, XP
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  error: '#F44336',
  // Categories
  ecology: '#4CAF50',
  social: '#2196F3',
  animals: '#FF9800',
  education: '#9C27B0',
  // Moods
  happy: '#4CAF50',
  neutral: '#FFC107',
  sad: '#F44336',
  sleeping: '#9E9E9E',
};
```

---

## 11. SEED EVENTS (Almaty)

```python
SEED_EVENTS = [
    {"title": "Очистка берега реки Есентай", "description": "Убираем мусор вдоль реки. Перчатки и мешки предоставляются.", "category": "ecology", "latitude": 43.2220, "longitude": 76.9455, "address": "Набережная Есентай, Алматы", "xp_reward": 75, "start_time": "2026-02-15T10:00:00+06:00"},
    {"title": "Помощь в приюте для животных", "description": "Выгул собак и уход за кошками.", "category": "animals", "latitude": 43.2567, "longitude": 76.9286, "address": "ул. Жандосова 58", "xp_reward": 60, "start_time": "2026-02-15T14:00:00+06:00"},
    {"title": "Посадка деревьев в парке Панфиловцев", "description": "Весенняя посадка. Саженцы предоставляются.", "category": "ecology", "latitude": 43.2580, "longitude": 76.9570, "address": "Парк 28 Панфиловцев", "xp_reward": 80, "start_time": "2026-02-16T09:00:00+06:00"},
    {"title": "Чтение книг детям в больнице", "description": "Волонтерское чтение в детском отделении.", "category": "education", "latitude": 43.2381, "longitude": 76.9456, "address": "Детская больница №2", "xp_reward": 65, "start_time": "2026-02-15T16:00:00+06:00"},
    {"title": "Раздача еды нуждающимся", "description": "Приготовление и раздача горячих обедов.", "category": "social", "latitude": 43.2400, "longitude": 76.9100, "address": "ул. Сейфуллина 412", "xp_reward": 70, "start_time": "2026-02-15T12:00:00+06:00"},
    {"title": "Уборка территории школы №35", "description": "Помогаем навести порядок на школьном дворе.", "category": "ecology", "latitude": 43.2350, "longitude": 76.9200, "address": "ул. Абая 100", "xp_reward": 55, "start_time": "2026-02-16T11:00:00+06:00"},
    {"title": "Мастер-класс по экологии для детей", "description": "Проводим увлекательный урок об экологии.", "category": "education", "latitude": 43.2450, "longitude": 76.9500, "address": "Дворец школьников", "xp_reward": 70, "start_time": "2026-02-16T15:00:00+06:00"},
    {"title": "Сбор вещей для малоимущих", "description": "Организация сбора одежды и бытовых товаров.", "category": "social", "latitude": 43.2300, "longitude": 76.9350, "address": "ул. Толе Би 59", "xp_reward": 50, "start_time": "2026-02-17T10:00:00+06:00"},
    {"title": "Выгул собак из приюта Добрые руки", "description": "Гуляем с собаками из городского приюта.", "category": "animals", "latitude": 43.2100, "longitude": 76.8900, "address": "мкр. Айнабулак", "xp_reward": 55, "start_time": "2026-02-17T09:00:00+06:00"},
    {"title": "Покраска забора детского сада", "description": "Обновляем забор детского сада к весне.", "category": "social", "latitude": 43.2500, "longitude": 76.9600, "address": "ул. Казыбек Би 40", "xp_reward": 60, "start_time": "2026-02-17T11:00:00+06:00"},
    {"title": "Посещение дома престарелых", "description": "Общение и помощь пожилым людям.", "category": "social", "latitude": 43.2650, "longitude": 76.9400, "address": "ул. Наурызбай батыра 17", "xp_reward": 65, "start_time": "2026-02-16T14:00:00+06:00"},
    {"title": "Кормление бездомных кошек", "description": "Раздаём корм по точкам скопления кошек.", "category": "animals", "latitude": 43.2420, "longitude": 76.9550, "address": "Центральный парк", "xp_reward": 45, "start_time": "2026-02-15T17:00:00+06:00"},
    {"title": "Репетиторство для детей из детдома", "description": "Помощь с уроками математики и английского.", "category": "education", "latitude": 43.2550, "longitude": 76.9150, "address": "Детский дом №1", "xp_reward": 80, "start_time": "2026-02-16T16:00:00+06:00"},
    {"title": "Высадка цветов на Аль-Фараби", "description": "Озеленение проспекта вместе с акиматом.", "category": "ecology", "latitude": 43.2180, "longitude": 76.9280, "address": "пр. Аль-Фараби", "xp_reward": 70, "start_time": "2026-02-17T08:00:00+06:00"},
    {"title": "Организация спортивного дня для детей", "description": "Проводим эстафеты и игры для детей из малообеспеченных семей.", "category": "education", "latitude": 43.2480, "longitude": 76.9320, "address": "Стадион Динамо", "xp_reward": 75, "start_time": "2026-02-17T10:00:00+06:00"},
]
```
