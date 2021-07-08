from . import db
from werkzeug import check_password_hash, generate_password_hash


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128),nullable=False)
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User %r>' % self.username

    # role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    # def __repr__(self):
    #     return '<User %r>' % self.username
    #     return '<User %r>' % self.username