from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, MenuItem, Modifier, ModifierOption
from .serializers import (
    CategorySerializer, CategoryWithItemsSerializer, MenuItemSerializer,
    ModifierSerializer, ModifierOptionSerializer, ModifierCreateSerializer
)
from users.permissions import IsAdminOrManagerOrReadOnly

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    
    @action(detail=True, methods=['get'])
    def items(self, request, pk=None):
        category = self.get_object()
        serializer = CategoryWithItemsSerializer(category)
        return Response(serializer.data)

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAdminOrManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'food_type', 'is_available', 'is_featured']
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        categories = Category.objects.filter(is_active=True)
        serializer = CategoryWithItemsSerializer(categories, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def toggle_availability(self, request, pk=None):
        menu_item = self.get_object()
        menu_item.is_available = not menu_item.is_available
        menu_item.save()
        return Response({'status': 'success', 'is_available': menu_item.is_available})

class ModifierViewSet(viewsets.ModelViewSet):
    queryset = Modifier.objects.all()
    permission_classes = [IsAdminOrManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['menu_items']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ModifierCreateSerializer
        return ModifierSerializer
    
    @action(detail=True, methods=['get'])
    def options(self, request, pk=None):
        modifier = self.get_object()
        options = modifier.options.all()
        serializer = ModifierOptionSerializer(options, many=True)
        return Response(serializer.data)

class ModifierOptionViewSet(viewsets.ModelViewSet):
    queryset = ModifierOption.objects.all()
    serializer_class = ModifierOptionSerializer
    permission_classes = [IsAdminOrManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['modifier', 'is_available']

