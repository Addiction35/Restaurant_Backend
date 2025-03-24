from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserViewSet, LoginView, PinLoginView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('login/pin/', PinLoginView.as_view(), name='pin-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

