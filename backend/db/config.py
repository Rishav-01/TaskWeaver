from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.database import Database, Collection
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

def get_db_connection() -> Database:
    """Establishes a connection to MongoDB and returns the database object."""
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
    try:
        # Send a ping to confirm a successful connection
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client.TaskWeaverDB
    except Exception as e:
        print(e)
        return None

def create_database(db):
    """Creates the database by creating a dummy collection and inserting a document."""
    if db is not None:
        # This will create the 'TaskWeaverDB' database and collections if they don't already exist.
        if "User" not in db.list_collection_names():
            db.create_collection("User")
        if "Meeting" not in db.list_collection_names():
            db.create_collection("Meeting")

db: Database = get_db_connection()
if db:
    create_database(db)
    # Create typed collection objects for better autocompletion
    user_collection: Collection = db.get_collection("User")
    meeting_collection: Collection = db.get_collection("Meeting")
else:
    user_collection = None
    meeting_collection = None