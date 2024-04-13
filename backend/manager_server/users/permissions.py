from rest_framework.permissions import BasePermission

SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

class UsersPermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 1

class FlightsPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.role == 1

class AnnoFlightsPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return False

class ReservationsPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        elif request.user.role == 1:
            return True
        else:
            return False

class AnnoReservationsPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method not in SAFE_METHODS:
            return request.method not in ['PATCH', 'DELETE']
        return False