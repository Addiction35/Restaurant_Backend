from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, MenuItemViewSet, ModifierViewSet, ModifierOptionViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'items', MenuItemViewSet)
router.register(r'modifiers', ModifierViewSet)
router.register(r'modifier-options', ModifierOptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

