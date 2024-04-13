from django.core.paginator import Paginator

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import UsersPermissions

from rest_framework_simplejwt.views import TokenObtainPairView

from users.models import User
from users.serializers import UserSerializer, UserTokenObtainPairSerializer

# Create your views here.
class ObtainTokenPair(TokenObtainPairView):
    permission_classes = [AllowAny,]
    serializer_class = UserTokenObtainPairSerializer
    
class Users(APIView):
    """
    This view handles requests about users.
    It only accepts users with UsersPermissions.
    """
    permission_classes = [IsAuthenticated, UsersPermissions]
    
    # Retrieve all users without admin
    def get(self, request):
        users = User.objects.exclude(role=1)

        page_number = self.request.query_params.get('page_number ', 1)
        page_size = self.request.query_params.get('page_size ', 10)

        paginator = Paginator(users , page_size)
        
        serializer = UserSerializer(paginator.page(page_number), many=True, context={'request':request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    # Create new user
    def post(self, request):
        request.data['role'] = 1 if User.objects.count() == 0 else 2
        
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Account created succesfully!'}, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetails(APIView):
    permission_classes = [IsAuthenticated, UsersPermissions]
    
    def get(self, request, id):
        user = User.objects.get(pk=id)
        
        if user is not None:
            serializer = UserSerializer(user)
            return Response(data=serializer.data, status=status.HTTP_202_ACCEPTED) 
        else:
            return Response({'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)
        
    # Edit user information (partial)
    def patch(self, request, id):
        user = User.objects.get(pk=id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete user
    def delete(self, request, id):
        if User.objects.contains(pk=id):
            User.objects.get(pk=id).delete()
            return Response({'message': 'Account deleted!'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)