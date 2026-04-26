from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """Allows access only to users with the 'admin' CMS role."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return hasattr(request.user, "author") and request.user.author.role == "admin"


class IsManagerUser(permissions.BasePermission):
    """Allows access to users with 'admin' or 'manager' CMS roles."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return hasattr(request.user, "author") and request.user.author.role in [
            "admin",
            "manager",
        ]


class IsCmsRegularUser(permissions.BasePermission):
    """Allows access to any authenticated user with a CMS role (admin, manager, editor)."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return hasattr(request.user, "author") and request.user.author.role in [
            "admin",
            "manager",
            "editor",
            "author",
        ]
