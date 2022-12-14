from functools import wraps
from sqlalchemy.exc import IntegrityError, NoResultFound
from flask import make_response


def handle_crud(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError:
            error_message = "Rating must fall in range [0, 10]."
        except (NoResultFound, KeyError):
            error_message = "Object does not exist."
        except (NameError, IntegrityError):
            error_message = "Ingredient name already exists."
        except Exception:
            error_message = "Something went wrong."
        return make_response(error_message, 400)

    return decorated