from database import SessionLocal, engine
import models
import random

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

if db.query(models.Event).count() == 0:
    event_titles = [
        "Budapesti Tech Konferencia",
        "Szegedi Nyári Fesztivál",
        "Debreceni Startup Nap",
        "Balatoni Sporthétvége",
        "Pécsi Kulturális Est"
    ]

    event_locations = [
        "Budapest",
        "Szeged",
        "Debrecen",
        "Balatonfüred",
        "Pécs"
    ]

    first_names = [
        "Kovács", "Nagy", "Szabó", "Tóth", "Horváth",
        "Varga", "Kiss", "Molnár", "Farkas", "Balogh"
    ]

    domains = [
        "gmail.com", "yahoo.com", "freemail.hu", "outlook.com"
    ]

    # 5 event
    events = []

    for i in range(5):
        event = models.Event(
            title=event_titles[i],
            description=f"{event_titles[i]} hivatalos esemény leírása.",
            location=event_locations[i],
            date=None
        )
        db.add(event)
        db.flush()
        events.append(event)

    # 10-20 registration
    for i in range(random.randint(10, 20)):
        name = random.choice(first_names) + " " + random.choice(first_names)
        email = f"{name.lower().replace(' ', '')}@{random.choice(domains)}"

        reg = models.Registration(
            event_id=random.choice(events).id,
            name=name,
            email=email
        )
        db.add(reg)

    db.commit()
    db.close()

    print("Seed completed")