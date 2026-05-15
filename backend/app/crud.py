from sqlalchemy.orm import Session
import models

def get_events(db: Session):
    return db.query(models.Event).all()

def create_event(db: Session, event):
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def create_registration(db: Session, reg):
    db_reg = models.Registration(**reg.dict())
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    return db_reg

def get_event_by_id(db, event_id):
    return db.query(models.Event).filter(models.Event.id == event_id).first()