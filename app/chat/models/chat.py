from app.database import db
from datetime import datetime
import json

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80))
    message = db.Column(db.String)
    messaged_at = db.Column(db.DateTime, default=datetime.utcnow)
    

    def __repr__(self):
        return '<User %r>' % self.username

    
    def to_json(self):
        return {
            "id":self.id,
            "username":self.username,
            "message":self.message,
            "messaged_at":self.messaged_at.strftime("%m/%d/%Y %H:%M:%S")
        }