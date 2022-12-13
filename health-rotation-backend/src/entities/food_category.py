from marshmallow import Schema, fields
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from src.entities.entity import Base, Entity
from src.entities.food_item import FoodItemSchema


class FoodCategory(Entity, Base):
    __tablename__ = 'food_categories'

    name = Column(String, unique=True)
    food_items = relationship('FoodItem', back_populates='food_category')

    def __init__(self, name):
        Entity.__init__(self)
        self.name = name


class FoodCategorySchema(Schema):
    id = fields.Number()
    name = fields.Str()
    food_items = fields.Nested(FoodItemSchema, many=True)
