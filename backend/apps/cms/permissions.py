from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and 
                    hasattr(request.user, 'author_profile') and 
                    request.user.author_profile.role == 'admin')

class IsManagerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and 
                    hasattr(request.user, 'author_profile') and 
                    request.user.author_profile.role in ['admin', 'manager'])

class IsEditorUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and 
                    hasattr(request.user, 'author_profile') and 
                    request.user.author_profile.role in ['admin', 'manager', 'editor'])
