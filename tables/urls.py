from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SectionViewSet, TableViewSet

router = DefaultRouter()
router.register(r'sections', SectionViewSet)
router.register(r'tables', TableViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

