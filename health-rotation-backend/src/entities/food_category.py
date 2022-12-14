from marshmallow import Schema, fields
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from src.entities.entity import Base, Entity
from src.entities.food_item import FoodItemSchema

from statistics import mean, stdev


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
    mean = fields.Method('get_mean')
    std = fields.Method('get_std')

    def get_mean(self, obj):
        return self.get_statistics(obj)[0]

    def get_std(self, obj):
        return self.get_statistics(obj)[1]

    def get_statistics(self, obj):
        eaten_numbers = [len(food_item.eaten) for food_item in obj.food_items]
        if sum(eaten_numbers) == 0:
            return 0, 0
        calculated_mean = mean(eaten_numbers)
        return calculated_mean, stdev(eaten_numbers, calculated_mean) if calculated_mean != 0 else 0
