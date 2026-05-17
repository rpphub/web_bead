from flask import Flask, request, jsonify, render_template
import database
import models
import crud
import schemas
import time


app = Flask(__name__)

engine = database.init_db()
database.is_ready()

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.route("/")
def home():
    app.logger.info("Teszt Route.")
    return render_template("events.html")

@app.route("/create-event")
def create_event_page():
    return render_template("create_event.html")

@app.route("/register-page")
def register_page():
    return render_template("register.html")

@app.route("/eventssite")
def events_page():
    return render_template("events.html")

@app.route("/events", methods=["GET"])
def get_events():
    db = database.SessionLocal()

    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        offset = (page - 1) * limit

        events = db.query(models.Event)\
            .offset(offset)\
            .limit(limit)\
            .all()

        result = []
        for event in events:

            registrations = crud.get_registrations_by_event(
            db,
            event.id  # type: ignore
            )

            result.append({
                "id": event.id,
                "title": event.title,
                "description": event.description,
                "location": event.location,
                "date": event.date.isoformat() if event.date is not None else None,
                "registration_count": len(registrations)
            })
            
        total = db.query(models.Event).count()

        return jsonify({
            "data": result,
            "total": total
        })

    finally:
        db.close()

@app.route("/events/<int:event_id>/registrations", methods=["GET"])
def get_event_registrations(event_id):

    db = database.SessionLocal()

    try:

        registrations = crud.get_registrations_by_event(
            db,
            event_id
        )

        result = []

        for reg in registrations:

            result.append({
                "id": reg.id,
                "name": reg.name,
                "email": reg.email
            })

        return jsonify(result)

    finally:
        db.close()

@app.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    db = database.SessionLocal()
    try:
        event = crud.get_event_by_id(db, event_id)

        if event is None:
            return jsonify({"error": "Event not found"}), 404

        return jsonify({
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "location": event.location,
            "date": event.date.isoformat() if event.date is not None else None
        })
    finally:
        db.close()


@app.route("/events", methods=["POST"])
def create_event():
    app.logger.info("Teszt Add event.")

    db = database.SessionLocal()
    try:
        data = request.get_json()
        app.logger.info(data)

        event = schemas.EventCreate(**data)
        created_event = crud.create_event(db, event)

        return jsonify({
            "id": created_event.id,
            "title": created_event.title,
            "description": created_event.description,
            "location": created_event.location,
            "date": created_event.date.isoformat() if created_event.date is not None else None
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

    finally:
        db.close()


@app.route("/register", methods=["POST"])
def register():
    db = database.SessionLocal()
    try:
        data = request.get_json()

        registration = schemas.RegistrationCreate(**data)
        created_registration = crud.create_registration(db, registration)

        return jsonify({
            "message": "Registration successful",
            "registration_id": created_registration.id
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

    finally:
        db.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
    app.logger.info("Start App.")
