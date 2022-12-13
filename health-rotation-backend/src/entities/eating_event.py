from marshmallow import Schema, fields
from sqlalchemy import Column, Date, Integer, ForeignKey
from sqlalchemy.orm import relationship

from src.entities.entity import Base, Entity


class EatingEvent(Entity, Base):
    __tablename__ = 'eating_events'

    date = Column(Date)
    food_item_id = Column(Integer, ForeignKey('food_items.id'), nullable=False)
    food_item = relationship('FoodItem', back_populates='eaten')

    def __init__(self, date, food_item_id):
        Entity.__init__(self)
        self.date = date
        self.food_item_id = food_item_id


class EatingEventSchema(Schema):
    id = fields.Number()
    date = fields.Date()
    food_item_id = fields.Number()
    food_item = fields.Nested('FoodItemSchema', only=('id', 'name', 'last_eaten'))
