from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView

from users.views import Users, ObtainTokenPair, UserDetails

urlpatterns = [
    # Auth views
    path('token/', ObtainTokenPair.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    
    # Admins only
    path('users/', Users.as_view()),
    path('users/<int: id>/', UserDetails.as_view()),
]