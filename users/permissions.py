from rest_framework import permissions

class IsAdminOrManager(permissions.BasePermission):
    """
    Allow access only to admin or manager users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'manager']

class IsAdminOrManagerOrReadOnly(permissions.BasePermission):
    """
    Allow read access to all authenticated users, but write access only to admin or manager users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role in ['admin', 'manager']

class IsAdminOrManagerOrStaff(permissions.BasePermission):
    """
    Allow access to admin, manager, or staff users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'manager', 'server', 'kitchen', 'cashier']

class IsAdminOrManagerOrCashier(permissions.BasePermission):
    """
    Allow access to admin, manager, or cashier users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'manager', 'cashier']

class IsSelfOrAdminOrManager(permissions.BasePermission):
    """
    Allow users to access their own resources, and admin/managers to access all resources.
    """
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated and 
            (request.user.role in ['admin', 'manager'] or obj.id == request.user.id)
        )

