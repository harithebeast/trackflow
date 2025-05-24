from app.database import engine, Base
from app.models.lead import Lead
from app.models.order import Order

def init_db():
    # Drop all tables first
    Base.metadata.drop_all(bind=engine)
    print("Dropped existing tables...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Created new tables...")

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization completed!") 