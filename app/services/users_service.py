import random
from datetime import datetime
from logging import getLogger

import jwt
from flask import current_app, jsonify, render_template

from app.database import baseUrl, db
from app.models.users import UserOTPs, Users
from app.utilities.common_utils import CommonUtils


class UsersService():
    def __init__(self):
        
        self.db = db
        self.utility = CommonUtils()
        self.log = getLogger()
    

    def create_user(self, payload):
        try:
            
            if not payload.get('first_name') or not payload.get('last_name') or not payload.get('gender') or not payload.get('email') or not payload.get('phone') or not payload.get('password'):
                return jsonify({
                'status': False,
                'message': 'Required fields are not provided'
            })
            
            if Users.query.filter_by(email=payload.get('email')).first():
                return jsonify({
                    'status': False,
                    'message': 'Email Already Exists'
                })
            if Users.query.filter_by(phone=payload.get('phone')).first():
                return jsonify({
                    'status': False,
                    'message': 'Phone Number Already Exists'
                })

            user = Users(first_name=payload.get('first_name'), last_name=payload.get('last_name'), photo=payload.get('photo') if payload.get('photo') else '',gender=payload.get('gender'),  email=payload.get('email'), phone=payload.get('phone'), password=payload.get('password'), created_on=self.utility.getCurrentDateTime(), last_login = self.utility.getCurrentDateTime(), status='NV')
            self.db.session.add(user)
            

            otp = random.randint(111111,999999)
            
            

            html = render_template("email_otp.html", otp=otp)
            if not self.utility.sendMail(subject='One Time Password for Account Creation', html=html, recipients=[payload.get('email')]):
                self.db.session.rollback()
                return jsonify({
                    'status': False,
                    'message': 'Unable to send Email'
                })
            self.db.session.commit()
            user_otp = UserOTPs(otp = otp, created_on =self.utility.getCurrentDateTime(), user_id = user.id )
            self.db.session.add(user_otp)
            self.db.session.commit()
            return jsonify({
                'status': True,
                'message': 'Account Created Successfully and OTP has been sent to your email address',
                'lastId': user.id
            })
            
        except Exception as err:
            self.db.session.rollback()
            self.log.error("users_service create_user exception: " + str(err))
            return jsonify({
                'status': False,
                'message': 'Unable to create account',
                'error': str(err)
            })
    def update(self, payload, current_user):
        try:
            print(payload)
            user = Users.query.filter_by(id = current_user['id']).first()
            first_name = payload.get('first_name')
            last_name = payload.get('last_name')
            gender = payload.get('gender')
            password = payload.get('password')
            phone = payload.get('phone')
            photo = payload.get('photo')

            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            if gender:
                user.gender = gender
            if password:
                user.password = password
            if phone:
                user.phone = phone
            if photo:
                user.photo = photo
            self.db.session.commit()
            return jsonify({
                'status': True,
                'message': 'Profile updated successfully',
                'user': user.toDict()
            })
        except Exception as err:
            return jsonify({
                'status': False,
                'message': 'Unable to Update Profile',
                'error': str(err)
            })
    def login(self, payload):
        try:
            
            if not payload.get("email") or not payload.get("password"):
                return jsonify({
                    'status': False,
                    'message': 'Required fields are not provided'
                })
            user = Users.query.filter_by(email=payload.get("email"), password = payload.get("password")).first()
            
            if not user:
                return jsonify({
                    'status': False,
                    'message': 'Invalid Credentials, Please try again later.'
                })
            user.last_login = self.utility.getCurrentDateTime()
            user_data = user.toDict()

            

            
            if user_data['status'] != 'AC':
                return jsonify({
                    'status': False,
                    'message': 'Your Account is not Verified',
                    'lastId': user_data['id']
                })
            
            
            user_data["token"] = jwt.encode(
                    {"user_id": user_data['id']},
                    current_app.config["SECRET_KEY"],
                    algorithm="HS256"
                )
            db.session.commit()
            return jsonify({
                    'status': True,
                    'message': 'Login Successful',
                    'user': user_data
                })

        except Exception as err:
            return jsonify({
                'status': False,
                'message': 'Unable to Login',
                'error': str(err)
            })

    def verify_otp(self, payload):
        try:
            entered_otp = payload.get('entered_otp')
            user_id = payload.get('user_id')
            user_otp = UserOTPs.query.filter_by(user_id=user_id, otp=entered_otp).first()
            if not user_otp:
                return jsonify({
                    'status': False,
                    'message': 'Invalid OTP, Please try again later'
                })
            db.session.delete(user_otp)
            
            user = Users.query.filter_by(id=user_id).first()
            user.status = 'AC'
            user_data = user.toDict()
            
            user_data["token"] = jwt.encode(
                    {"user_id": user_id},
                    current_app.config["SECRET_KEY"],
                    algorithm="HS256"
                )
            db.session.commit()
            return jsonify({
                    'status': True,
                    'message': 'Verification Successful',
                    'user': user_data
                })

        except Exception as err:
            return jsonify({
                'status': False,
                'message': 'Unable to Verify OTP',
                'error': str(err)
            })
    def resend_otp(self, payload):
        try:
            
            user_id = payload.get('user_id')
            user_otp = UserOTPs.query.filter_by(user_id=user_id).first()
            user = Users.query.filter_by(id=user_id).first()
            html = render_template("email_otp.html", otp=user_otp.otp)
            if not self.utility.sendMail(subject='One Time Password for Account Creation', html=html, recipients=[user.email]):
                
                return jsonify({
                    'status': False,
                    'message': 'Unable to send Email'
                })
            
            return jsonify({
                    'status': True,
                    'message': 'OTP Sent Successful'
                })

        except Exception as err:
            print(err)
            return jsonify({
                'status': False,
                'message': 'Unable to Re-Send OTP',
                'error': str(err)
            })

    


