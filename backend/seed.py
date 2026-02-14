"""Seed database with events and achievements for Almaty."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, timedelta
from app.database import engine, Base, SessionLocal
from app.models import Event, Achievement, User, Pet
from app.services.auth_service import hash_password

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data
    db.query(Achievement).delete()
    db.query(Event).delete()
    db.commit()

    # === EVENTS IN ALMATY ===
    now = datetime.utcnow()
    events = [
        Event(title="Очистка парка Панфилова", description="Совместная уборка территории парка им. 28 Панфиловцев. Мешки и перчатки предоставляются.", category="ecology", latitude=43.2580, longitude=76.9438, address="Парк им. 28 Панфиловцев", start_time=now + timedelta(hours=2), xp_reward=60, max_participants=30),
        Event(title="Посадка деревьев в Ботаническом саду", description="Высадка саженцев в Главном ботаническом саду. Приходите в удобной одежде!", category="ecology", latitude=43.2324, longitude=76.9397, address="Ботанический сад, ул. Тимирязева 36", start_time=now + timedelta(hours=5), xp_reward=80, max_participants=20),
        Event(title="Сортировка мусора на Медеу", description="Обучение правильной сортировке отходов и уборка территории у катка Медеу.", category="ecology", latitude=43.1560, longitude=77.0586, address="Каток Медеу", start_time=now + timedelta(hours=8), xp_reward=70, max_participants=25),
        Event(title="Помощь в приюте для животных", description="Выгул собак и уборка вольеров в приюте. Хвостатые ждут вас!", category="animals", latitude=43.2100, longitude=76.8500, address="Приют 'Добрые руки', ул. Жандосова 58", start_time=now + timedelta(hours=3), xp_reward=65, max_participants=15),
        Event(title="Кормление бездомных кошек", description="Совместный рейд по кормлению бездомных кошек в микрорайоне Орбита.", category="animals", latitude=43.2148, longitude=76.8966, address="м-н Орбита-2", start_time=now + timedelta(hours=4), xp_reward=40, max_participants=10),
        Event(title="Ветеринарный осмотр в приюте", description="Помощь ветеринарам в осмотре животных. Нужны добровольцы для фиксации животных.", category="animals", latitude=43.2500, longitude=76.9200, address="Приют 'Шанс', Талгарский тракт", start_time=now + timedelta(days=1), xp_reward=90, max_participants=8),
        Event(title="Репетиторство для детей из детдома", description="Помощь с домашним заданием детям 8-12 лет. Нужны знания математики и русского.", category="education", latitude=43.2367, longitude=76.9458, address="Детский дом №1, ул. Абая 45", start_time=now + timedelta(hours=6), xp_reward=75, max_participants=12),
        Event(title="Мастер-класс по программированию", description="Обучение основам Python для подростков. Ноутбуки предоставляются.", category="education", latitude=43.2389, longitude=76.9556, address="Библиотека им. Пушкина, ул. Гоголя 39", start_time=now + timedelta(hours=10), xp_reward=85, max_participants=20),
        Event(title="Чтение книг пожилым", description="Посещение дома престарелых и чтение книг пожилым людям.", category="education", latitude=43.2700, longitude=76.9700, address="Дом престарелых, ул. Сейфуллина 120", start_time=now + timedelta(days=1, hours=3), xp_reward=55, max_participants=10),
        Event(title="Благотворительный забег", description="Забег на 5 км в поддержку детей с особенностями развития. Регистрация бесплатная.", category="social", latitude=43.2220, longitude=76.9512, address="Центральный стадион, ул. Абая", start_time=now + timedelta(hours=12), xp_reward=70, max_participants=100),
        Event(title="Помощь в столовой для нуждающихся", description="Раздача еды в благотворительной столовой. Фартуки предоставляются.", category="social", latitude=43.2650, longitude=76.9350, address="Столовая 'Дастархан добра', ул. Толе би 80", start_time=now + timedelta(hours=1), xp_reward=50, max_participants=15),
        Event(title="Сбор вещей для нуждающихся", description="Организация пункта приема одежды и предметов первой необходимости.", category="social", latitude=43.2400, longitude=76.9250, address="ТРЦ Мега Парк, ул. Розыбакиева 247", start_time=now + timedelta(hours=7), xp_reward=45, max_participants=20),
        Event(title="Очистка русла реки Алматинки", description="Уборка мусора вдоль русла реки Малая Алматинка в центре города.", category="ecology", latitude=43.2310, longitude=76.9480, address="Набережная р. Алматинки", start_time=now + timedelta(days=2), xp_reward=75, max_participants=40),
        Event(title="Игры с детьми в больнице", description="Развлекательная программа для детей, находящихся на лечении.", category="social", latitude=43.2450, longitude=76.9600, address="Детская больница №2, ул. Жамбыла 10", start_time=now + timedelta(hours=9), xp_reward=65, max_participants=8),
        Event(title="Уроки английского для мигрантов", description="Бесплатные уроки английского языка для трудовых мигрантов.", category="education", latitude=43.2550, longitude=76.9300, address="Общественный центр, ул. Курмангазы 61", start_time=now + timedelta(days=1, hours=6), xp_reward=70, max_participants=25),
        Event(title="Покраска забора школы", description="Совместное обновление забора школы-интерната. Краска и кисти предоставляются.", category="social", latitude=43.2020, longitude=76.8900, address="Школа-интернат №7, м-н Аксай-3", start_time=now + timedelta(days=2, hours=2), xp_reward=55, max_participants=30),
        Event(title="Выгул собак из приюта", description="Прогулка с собаками из приюта в парке. Поводки предоставляются.", category="animals", latitude=43.2180, longitude=76.9650, address="Парк Горького, ул. Гоголя", start_time=now + timedelta(hours=11), xp_reward=50, max_participants=12),
        Event(title="Раздельный сбор вторсырья", description="Мастер-класс по раздельному сбору и организация пункта приема.", category="ecology", latitude=43.2480, longitude=76.9150, address="Экоцентр, ул. Тимирязева 42", start_time=now + timedelta(days=1, hours=2), xp_reward=60, max_participants=20),
    ]

    db.add_all(events)

    # === ACHIEVEMENTS ===
    achievements = [
        Achievement(key="first_event", title="Первый шаг", description="Завершите первое мероприятие", icon="🌱", xp_bonus=20, condition_type="events_completed", condition_value=1),
        Achievement(key="five_events", title="Активист", description="Завершите 5 мероприятий", icon="⭐", xp_bonus=50, condition_type="events_completed", condition_value=5),
        Achievement(key="ten_events", title="Герой города", description="Завершите 10 мероприятий", icon="🏆", xp_bonus=100, condition_type="events_completed", condition_value=10),
        Achievement(key="streak_3", title="3 дня подряд", description="Поддерживайте серию 3 дня", icon="🔥", xp_bonus=30, condition_type="streak", condition_value=3),
        Achievement(key="streak_7", title="Неделя добра", description="Поддерживайте серию 7 дней", icon="💪", xp_bonus=70, condition_type="streak", condition_value=7),
        Achievement(key="level_3", title="Подрастающий дух", description="Достигните 3 уровня", icon="🐣", xp_bonus=25, condition_type="level", condition_value=3),
        Achievement(key="level_6", title="Молодой дух", description="Достигните 6 уровня", icon="🐥", xp_bonus=50, condition_type="level", condition_value=6),
        Achievement(key="level_10", title="Дух города", description="Достигните 10 уровня", icon="🦅", xp_bonus=100, condition_type="level", condition_value=10),
        Achievement(key="eco_3", title="Эколог", description="Завершите 3 экологических мероприятия", icon="🌍", xp_bonus=40, condition_type="category_ecology", condition_value=3),
        Achievement(key="animals_3", title="Друг животных", description="Завершите 3 мероприятия с животными", icon="🐾", xp_bonus=40, condition_type="category_animals", condition_value=3),
        Achievement(key="education_3", title="Наставник", description="Завершите 3 образовательных мероприятия", icon="📚", xp_bonus=40, condition_type="category_education", condition_value=3),
    ]

    db.add_all(achievements)

    # === DEMO ACCOUNTS ===
    demo_users = [
        {"email": "demo@example.com", "username": "demo_user", "password": "demo123", "pet_name": "Искра", "level": 5, "xp": 80, "evolution_stage": 2, "streak_days": 3},
        {"email": "aidar@example.com", "username": "Aidar", "password": "demo123", "pet_name": "Жулдыз", "level": 8, "xp": 200, "evolution_stage": 3, "streak_days": 7},
        {"email": "dana@example.com", "username": "Dana", "password": "demo123", "pet_name": "Алтын", "level": 3, "xp": 50, "evolution_stage": 2, "streak_days": 1},
    ]

    for data in demo_users:
        existing = db.query(User).filter(User.email == data["email"]).first()
        if not existing:
            user = User(email=data["email"], username=data["username"], password_hash=hash_password(data["password"]))
            db.add(user)
            db.flush()
            pet = Pet(
                user_id=user.id, name=data["pet_name"], mood="happy",
                level=data["level"], xp=data["xp"],
                xp_to_next_level=data["level"] * 100,
                evolution_stage=data["evolution_stage"],
                streak_days=data["streak_days"],
                streak_last_date=datetime.utcnow().strftime("%Y-%m-%d"),
                last_fed_at=datetime.utcnow(),
            )
            db.add(pet)

    db.commit()
    db.close()
    print("✅ Database seeded successfully!")
    print(f"  - {len(events)} events")
    print(f"  - {len(achievements)} achievements")
    print(f"  - {len(demo_users)} demo users")


if __name__ == "__main__":
    seed()
