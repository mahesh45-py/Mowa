import os
from flask import Flask, jsonify, request, url_for
from app.api import api_bp
from app.chat import chat
from app.database import db, mail, migrate, jsglue, socketio
import logging.handlers


basedir = os.path.abspath(os.path.dirname(__file__))
file_path = os.path.join(basedir, 'files')
database_path = os.path.join(basedir, 'data-dev.sqlite')

app = Flask(__name__, static_folder='files')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mowa.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.secret_key = '@Mahesh2085'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'srikakulammahesh2085@gmail.com'
app.config['MAIL_DEFAULT_SENDER'] = 'srikakulammahesh2085@gmail.com'
app.config['MAIL_PASSWORD'] = 'lhtlnrbkmenpgdcd'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['SECRET_KEY'] = 'secret!'


db.init_app(app)
migrate.init_app(app,db)
mail.init_app(app)
jsglue.init_app(app)
socketio.init_app(app)

app.register_blueprint(api_bp)
app.register_blueprint(chat)


@app.before_first_request
def create_table():
    db.create_all()
    



def setup_logger():
    root = logging.getLogger()
    root.setLevel(logging.INFO)
    
    file_name = os.path.join("logs", 'MOWA_{}.log'.format("api_log"))
    file_handler = logging.handlers.TimedRotatingFileHandler(file_name, when='d', backupCount=7)
    
    root.addHandler(file_handler)


setup_logger()


if __name__ == '__main__':
    # app.run(debug=True,host='0.0.0.0')
    socketio.run(app)