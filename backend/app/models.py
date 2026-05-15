from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    description = Column(String(500))
    location = Column(String(255))
    date = Column(DateTime)

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    name = Column(String(255))
    email = Column(String(255))