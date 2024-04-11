from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.password_validation import validate_password
from users.validators import EgnValidator
from django.core.exceptions import ValidationError

from users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
            'egn',
            'address',
            'phone_number',
            'roles'
        ]
        extra_kwargs = {
            'password': { 'write_only': True },
        }
    
    def validate_password(self, value):
        validate_password(value)
        return value
    
    def validate_egn(self, value):
        if not EgnValidator.validate_egn(value):
            raise ValidationError('Egn is not valid')
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(UserTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['is_admin'] = user.role == 1
        return token
        