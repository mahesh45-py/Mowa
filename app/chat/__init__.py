from flask import Blueprint, render_template
from flask_restful import Resource, Api
from app.database import socketio,oAuth

chat = Blueprint('chat',__name__,static_folder='static',template_folder='templates')

chat_bp = Api(chat)
@chat.route('/')
def index():
    return render_template('login.html')

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)
# api.add_resource(ProductsController,'/products')
