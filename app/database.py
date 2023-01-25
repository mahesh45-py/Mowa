from flask_mail import Mail
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jsglue import JSGlue
from flask_socketio import SocketIO
from flask_oauthlib.client import OAuth

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()
jsglue = JSGlue()
socketio = SocketIO()
oAuth = OAuth()

google_clientid = '342411463967-32od2l2nevkm6u8bnsnio6dch0rlfg6d.apps.googleusercontent.com'
google_secret = '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'

google = oAuth.remote_app(
    'google',
    consumer_key=google_clientid,
    consumer_secret=google_secret,
    request_token_params={
        'scope': 'email profile'
    },
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)
baseUrl = "http://localhost:8080"
# baseUrl = "http://192.168.41.230:5000"
# baseUrl = "https://mahesh54.pythonanywhere.com"
