from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import time

DATABASE_URL = "mysql+pymysql://db_bead:db_pass@mysqldb:3306/userdb"

engine = None
SessionLocal = None
Base = declarative_base()


def init_db():
    global engine, SessionLocal
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    return engine


def is_ready() -> bool:
    for i in range(30):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("DB ready")
            return True
        except Exception as e:
            print(f"waiting DB... {e}")
            time.sleep(2)

    raise Exception("DB never started")