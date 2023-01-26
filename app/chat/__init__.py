from flask import Blueprint, render_template, Response, jsonify, request
from app.chat.models.chat import Chat
from flask_restful import Resource, Api
from app.database import socketio,oAuth, db, app
import time
from app.database import media_folder_path
import base64
from PIL import Image
from io import BytesIO
import cv2

chat = Blueprint('chat',__name__,static_folder='static',template_folder='templates')

chat_bp = Api(chat)
@chat.route('/')
def index():
    return render_template('login.html')

@chat.route('/video')
def video():
    return render_template('player.html')

@chat.route('/getNewMessages')
def getNewMessages():
    print(request.args.get('lastid'))
    def event_stream():
        with app.app_context():
            
            while True:
                chats = Chat.query.order_by(Chat.id.desc()).limit(10).all()
                data = list(map(lambda x: x.to_json(), chats))
                yield f'data: {data}\n\n'
                time.sleep(1) 
    return Response(event_stream(), mimetype='text/event-stream')


@chat.route('/stream')
def stream():
    def event_stream():
        video = cv2.VideoCapture(media_folder_path+'\\videos\\video.mp4')
        while True:
            success, frame = video.read()
            if not success:
                video.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            ret, jpeg = cv2.imencode('.jpg', frame)
            img_str = base64.b64encode(jpeg.tobytes()).decode()
            yield f'data: {img_str}\n\n'
            time.sleep(1/30)
    return Response(event_stream(), mimetype='text/event-stream')

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)


@chat.route('/record',methods=['GET', 'POST'])
def record():
    if request.method == 'POST':
        data = request.get_json()
        new_user = Chat(username=data.get('username'), message=data.get('message'))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            'message':'message recorded',
            'status':True
        })
    elif request.method == 'GET':
        try:
            chats = Chat.query.all()
            # print(chats.to_json())
            data = list(map(lambda x: x.to_json(), chats))
            return jsonify({
                'message':'messages',
                'data':data,
                'status':True
            })
        except Exception as err:
            return jsonify({
                'message':'an error occured',
                'data':[],
                'status':False,
                'devMsg':str(err)
            })
    
# api.add_resource(ProductsController,'/products')
