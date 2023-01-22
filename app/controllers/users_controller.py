from flask import request
from flask_restful import Resource

from app.services.users_service import UsersService
from app.utilities.session_handler import token_required


class UsersController(Resource):
    def __init__(self):
        self.name = 'Mahesh'
        self.service = UsersService()
    

    def post(self,version):

        return self.service.create_user(request.get_json())
    def patch(self,version):
        
        if request.args.get("verify") == "Y":
            return self.service.verify_otp(request.get_json())
        elif request.args.get("resend") == "Y":
            return self.service.resend_otp(request.get_json())
        return self.service.login(request.get_json())
   
    @token_required
    def put(current_user,self, version):
        
        return self.service.update(request.get_json(), current_user)
