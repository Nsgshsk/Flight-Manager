from django.core.paginator import Paginator, EmptyPage, InvalidPage, PageNotAnInteger

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import UsersPermissions, UserDetailsPermissions

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
    serializer_class = UserSerializer
    
    # Retrieve all users without admin
    def get(self, request):
        params = self.request.query_params
        
        users = User.objects.exclude(role=1)
        
        sort_field = params.get('sortField', None)
        sort_order = params.get('sortOrder', 1)
        
        if sort_field is not None:
            if sort_order == 1:
                users.order_by(sort_field)
            elif sort_order == -1:
                users.order_by(f'-{sort_field}')

        page_number = params.get('page', 1)
        page_size = params.get('results', 10)

        paginator = Paginator(users , page_size)
        try:
            page = paginator.page(page_number)
        except(EmptyPage, InvalidPage, PageNotAnInteger):
            page = paginator.page(1)
        
        serializer = UserSerializer(page, many=True, context={'request':request})
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
    permission_classes = [IsAuthenticated, UserDetailsPermissions]
    serializer_class = UserSerializer
    
    def get(self, request, id):
        try:
            user = User.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserSerializer(user)
        return Response(data=serializer.data, status=status.HTTP_202_ACCEPTED) 
        
    # Edit user information (partial)
    def patch(self, request, id):
        try:
            user = User.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete user
    def delete(self, request, id):
        try:
            user = User.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({'message': 'Account deleted!'}, status=status.HTTP_204_NO_CONTENT)