from pydantic import BaseModel
from datetime import datetime
class EventCreate(BaseModel):
    title: str
    description: str
    location: str
    date: datetime

class EventResponse(EventCreate):
    id: int

    class Config:
        orm_mode = True


class RegistrationCreate(BaseModel):
    event_id: int
    name: str
    email: str