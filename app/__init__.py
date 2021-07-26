from flask import Flask

# from flask_bootstrap import Bootstrap
from flask_mail import Mail
from flask_migrate import Migrate

# from flask_moment import Moment
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from config import config
from flask_login import LoginManager
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import (
    JWTManager,
    get_jwt,
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    set_access_cookies,
)

login_manager = LoginManager()
login_manager.login_view = "auth.login"
mail = Mail()
db = SQLAlchemy()
migrate = Migrate()


def create_app(config_name):
    """App factory"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    with app.app_context():
        db.init_app(app)
        login_manager.init_app(app)
        db.create_all()
        mail.init_app(app)
        jwt = JWTManager(app)
        migrate.init_app(app, db)

    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                set_access_cookies(response, access_token)
            return response
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            return response

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint)

    from .auth import auth as auth_blueprint

    app.register_blueprint(auth_blueprint, url_prefix="/auth")

    from .api import api_bp as api_blueprint

    app.register_blueprint(api_blueprint, url_prefix="/api/v1")

    return app
