from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from rest_framework.filters import SearchFilter, OrderingFilter

from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import UsersPermissions, UserDetailsPermissions

from rest_framework_simplejwt.views import TokenObtainPairView

from users.models import User
from users.serializers import UserSerializer, UserTokenObtainPairSerializer
from manager_server.paginators import ResultsSetPagination

# Create your views here.
class ObtainTokenPair(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = UserTokenObtainPairSerializer

class Users(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, UsersPermissions]
    pagination_class = ResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = [
        'username',
        'first_name',
        'last_name',
        'email',
        'egn',
        'address',
        'phone_number',
    ]
    ordering_fields = [
        'username',
        'first_name',
        'last_name',
        'email',
        'egn',
        'address',
        'phone_number',
    ]
    ordering = ['id']
    
    def list(self, request):
        self.queryset = self.queryset.exclude(pk=1)
        
        return super().list(request)
    
    def create(self, request):
        request.data['role'] = 1 if User.objects.count() == 0 else 2
        return super().create(request)