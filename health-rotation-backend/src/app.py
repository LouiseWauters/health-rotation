from flask import Flask
from flask_cors import CORS

from src.entities.entity import engine, Base
from src.services.food_service import food_blueprint

# Creating the Flask application
app = Flask(__name__)
CORS(app)

# Generate database schema
Base.metadata.create_all(engine)

# Add food blueprint to flask app
app.register_blueprint(food_blueprint)