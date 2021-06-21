import os

# from flask.config import ConfigAttribute


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    # TWITTER_OAUTH_CLIENT_KEY = os.environ.get("TWITTER_OAUTH_CLIENT_KEY")
    # TWITTER_OAUTH_CLIENT_SECRET = os.environ.get("TWITTER_OAUTH_CLIENT_SECRET")
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

    # MAIL_SERVER = 'smtp.gmail.com'
    # MAIL_PORT = 465
    # MAIL_USE_TLS = False
    # MAIL_USE_SSL = True
    # MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    # MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")


class ProductionConfig(Config):
    DEBUG = False
    SECRET_KEY = os.environ.get("SECRET_KEY")
    CSRF_SECRET = os.environ.get("CSRF_SECRET")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    ENV = "development"
    DEVELOPMENT = True
    SECRET_KEY = os.environ.get("SECRET_KEY")
    CSRF_SECRET = os.environ.get("CSRF_SECRET")
    OAUTHLIB_INSECURE_TRANSPORT = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True
