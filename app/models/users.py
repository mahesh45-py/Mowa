from sqlalchemy import inspect

from app.database import db


class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    photo = db.Column(db.String)
    gender = db.Column(db.String(1))
    email = db.Column(db.String)
    phone = db.Column(db.String)
    password = db.Column(db.String)
    created_on = db.Column(db.DateTime)
    last_login = db.Column(db.DateTime)
    status = db.Column(db.String(2), default='AC')
    address = db.relationship('UserAddress', backref='users')
    def __init__(self,  first_name, last_name, photo, gender, email, phone, password, created_on, last_login, status):
        # self.id = 1
        self.first_name = first_name
        self.last_name = last_name
        self.photo = photo
        self.gender = gender
        self.email = email
        self.phone = phone
        self.password = password
        self.created_on = created_on
        self.last_login = last_login
        self.status = status


    def __repr__(self):
        return f'{self.name} : {self.id}'

    def toDict(self):
        obj = {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
        obj['last_login'] = obj['last_login'].strftime('%Y:%m:%d %H:%M:%S')
        obj['created_on'] = obj['created_on'].strftime('%Y:%m:%d %H:%M:%S')
        del obj['password']
        return obj


class UserAddress(db.Model):
    id = db.Column(db.Integer, primary_key=True,  autoincrement=True)
    landmark = db.Column(db.String)
    door_no = db.Column(db.String)
    street = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    pincode = db.Column(db.String)
    created_on = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __init__(self, id, landmark, door_no, street, city, state, pincode, created_on):
        # self.id = id
        self.landmark = landmark
        self.door_no = door_no
        self.street = street
        self.city = city
        self.state = state
        self.pincode = pincode
        self.created_on = created_on

    def __repr__(self):
        return f'{self.name} : {self.id}'

    def toDict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}

class UserOTPs(db.Model):
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    otp = db.Column(db.String)
    created_on = db.Column(db.DateTime)
    user_id = db.Column(db.Integer)

    def __init__(self, otp, created_on, user_id):
        # self.id = 1
        self.otp = otp
        self.created_on = created_on
        self.user_id = user_id
    
    def __repr__(self):
        return f'{self.name} : {self.id}'




