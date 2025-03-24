from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet, DeliveryInfoViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'items', OrderItemViewSet)
router.register(r'delivery-info', DeliveryInfoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

