from datetime import date
from marshmallow import Schema, fields
from marshmallow.decorators import post_dump
from sqlalchemy import Column, String, Date, Integer, ForeignKey
from sqlalchemy.orm import relationship

from src.entities.eating_event import EatingEventSchema
from src.entities.entity import Base, Entity


class FoodItem(Entity, Base):
    __tablename__ = 'food_items'

    name = Column(String, unique=True)
    last_eaten = Column(Date)
    food_category_id = Column(Integer, ForeignKey('food_categories.id'), nullable=True)
    food_category = relationship('FoodCategory', back_populates='food_items')
    eaten = relationship('EatingEvent', back_populates='food_item')

    def __init__(self, name, food_category_id=None):
        Entity.__init__(self)
        self.name = name
        self.food_category_id = food_category_id


class FoodItemSchema(Schema):
    id = fields.Number()
    name = fields.Str()
    last_eaten = fields.Date()
    food_category_id = fields.Number()
    days_passed = fields.Method('get_days_since_last_eaten')
    eaten = fields.Pluck(EatingEventSchema, 'date', many=True)

    def get_days_since_last_eaten(self, obj):
        if obj.last_eaten:
            return (date.today() - obj.last_eaten).days
        return None

    @post_dump
    def sort_eaten(self, data, **kwargs):
        if 'eaten' in data:
            data['eaten'] = sorted(data['eaten'])
        return data