from flask import Blueprint, jsonify, request, make_response
from sqlalchemy import desc, extract, func, or_, asc, nullslast, nullsfirst

from src.entities.entity import Session
from src.entities.food_item import FoodItem, FoodItemSchema
from src.entities.food_category import FoodCategory, FoodCategorySchema
from src.entities.eating_event import EatingEvent, EatingEventSchema
from src.services.utils import handle_crud

import random

food_blueprint = Blueprint('food_blueprint', __name__)


@food_blueprint.route('/food-items')
@handle_crud
def get_items_by_category():
    # Fetching food categories with associated food items from the database
    session = Session()
    food_category_objects = session.query(FoodCategory).all()

    # Transforming into JSON-serializable objects
    schema = FoodCategorySchema(many=True)
    food_categories = schema.dump(food_category_objects)

    session.close()
    # Serializing as JSON
    return jsonify(food_categories), 200


@food_blueprint.route('/food-items', methods=['POST'])
@handle_crud
def add_food_item():
    posted_food_item = FoodItemSchema(only=('name', 'food_category_id')).load(
        request.get_json()
    )
    session = Session()
    food_item = FoodItem(**posted_food_item)
    session.add(food_item)
    session.commit()

    # Return created food item
    new_food_item = FoodItemSchema().dump(food_item)

    session.close()
    # Serializing as JSON
    return jsonify(new_food_item), 201


@food_blueprint.route('/food-categories', methods=['POST'])
@handle_crud
def add_food_category():
    posted_food_category = FoodCategorySchema(only=['name']).load(
        request.get_json()
    )
    session = Session()
    food_category = FoodCategory(**posted_food_category)
    session.add(food_category)
    session.commit()

    # Return created food category
    new_food_category = FoodCategorySchema().dump(food_category)

    session.close()
    # Serializing as JSON
    return jsonify(new_food_category), 201


@food_blueprint.route('/recommendations')
@handle_crud
def get_recommendations():
    limit = request.args.get('limit')
    limit = int(limit) if limit is not None else 3
    limit = min(15, limit)
    excluded = request.args.get('excluded')
    if excluded is None:
        excluded = []
    else:
        excluded = [int(item_id) for item_id in excluded.split(',')]
    print(excluded)

    session = Session()

    food_item_objects = session.query(FoodItem)\
        .filter(~FoodItem.id.in_(excluded))\
        .filter(or_(extract('days', func.age(FoodItem.last_eaten)) > 14,
                    extract('months', func.age(FoodItem.last_eaten)) > 0,
                    extract('year', func.age(FoodItem.last_eaten)) > 0,
                    FoodItem.last_eaten == None))\
        .order_by(nullsfirst(desc(FoodItem.last_eaten)))\
        .limit(limit*30)

    schema = FoodItemSchema(many=True)
    food_items = schema.dump(food_item_objects)
    random.shuffle(food_items)

    session.close()
    # Serializing as JSON
    return jsonify(food_items[:limit]), 200


@food_blueprint.route('/eating-events')
@handle_crud
def get_eating_events():
    date = request.args['date']
    session = Session()
    eating_event_objects = session.query(EatingEvent)\
        .filter(EatingEvent.date == date)\
        .all()

    schema = EatingEventSchema(many=True)
    eating_events = schema.dump(eating_event_objects)

    session.close()
    return jsonify(eating_events), 200


@food_blueprint.route('/eating-events', methods=['POST'])
@handle_crud
def add_eating_events():
    date = request.get_json()['date']
    food_item_ids = request.get_json()['food_item_ids']
    session = Session()
    for i in food_item_ids:
        eating_event = EatingEvent(date=date, food_item_id=i)
        session.add(eating_event)
        session.query(FoodItem)\
            .filter(FoodItem.id == i)\
            .filter(or_(FoodItem.last_eaten < date, FoodItem.last_eaten == None))\
            .update({FoodItem.last_eaten: date}, synchronize_session=False)
    session.commit()
    return jsonify({'message': f'Added {date} for {food_item_ids}.'}), 201


@food_blueprint.route('/eating-events', methods=['DELETE'])
@handle_crud
def remove_eating_events():
    date = request.get_json()['date']
    food_item_ids = request.get_json()['food_item_ids']
    session = Session()
    events_to_delete = session.query(EatingEvent)\
        .filter(EatingEvent.date == date)\
        .filter(EatingEvent.food_item_id.in_(food_item_ids))\
        .delete()

    food_items_to_fix = session.query(FoodItem)\
        .filter(FoodItem.id.in_(food_item_ids))\
        .filter(FoodItem.last_eaten == date)\
        .all()

    for item in food_items_to_fix:
        if len(item.eaten) > 0:
            item.eaten.sort(key=lambda x: x.date, reverse=True)
            item.last_eaten = item.eaten[0].date
        else:
            item.last_eaten = None
    session.commit()
    session.close()
    return jsonify({'message': f'Deleted {date} for {food_item_ids}.'}), 204


