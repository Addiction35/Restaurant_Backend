from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from .models import Order, OrderItem, DeliveryInfo
from .serializers import (
    OrderSerializer, OrderCreateSerializer, OrderItemCreateSerializer,
    OrderStatusUpdateSerializer, OrderPaymentUpdateSerializer,
    DeliveryInfoSerializer, DeliveryInfoCreateSerializer
)
from users.permissions import IsAdminOrManagerOrStaff
from .consumers import OrderConsumer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    permission_classes = [IsAdminOrManagerOrStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'payment_status', 'dining_mode', 'table']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Create order items if provided
        items_data = request.data.get('items', [])
        for item_data in items_data:
            item_serializer = OrderItemCreateSerializer(data={**item_data, 'order': order.id})
            item_serializer.is_valid(raise_exception=True)
            item_serializer.save(order=order)
        
        # Create delivery info if it's a delivery order
        if order.dining_mode == 'delivery' and request.data.get('delivery_info'):
            delivery_serializer = DeliveryInfoCreateSerializer(
                data=request.data.get('delivery_info')
            )
            delivery_serializer.is_valid(raise_exception=True)
            delivery_serializer.save(order=order)
        
        # Recalculate order totals
        order.calculate_totals()
        
        # Notify via websocket
        OrderConsumer.notify_order_update(order)
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_order = serializer.save()
            
            # Notify via websocket
            OrderConsumer.notify_order_update(updated_order)
            
            return Response(OrderSerializer(updated_order).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def update_payment(self, request, pk=None):
        order = self.get_object()
        serializer = OrderPaymentUpdateSerializer(order, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_order = serializer.save()
            return Response(OrderSerializer(updated_order).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def kitchen_display(self, request):
        """Get orders for kitchen display system."""
        orders = Order.objects.filter(
            status__in=['pending', 'processing']
        ).order_by('created_at')
        
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_table(self, request):
        """Get active orders grouped by table."""
        table_id = request.query_params.get('table_id')
        if table_id:
            orders = Order.objects.filter(
                table_id=table_id,
                status__in=['pending', 'processing']
            ).order_by('-created_at')
        else:
            orders = Order.objects.filter(
                status__in=['pending', 'processing'],
                dining_mode='dine_in'
            ).order_by('-created_at')
        
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemCreateSerializer
    permission_classes = [IsAdminOrManagerOrStaff]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_item = serializer.save()
        
        # Recalculate order totals
        order_item.order.calculate_totals()
        
        # Notify via websocket
        OrderConsumer.notify_order_update(order_item.order)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        order_item = self.get_object()
        order = order_item.order
        
        response = super().destroy(request, *args, **kwargs)
        
        # Recalculate order totals
        order.calculate_totals()
        
        # Notify via websocket
        OrderConsumer.notify_order_update(order)
        
        return response

class DeliveryInfoViewSet(viewsets.ModelViewSet):
    queryset = DeliveryInfo.objects.all()
    serializer_class = DeliveryInfoSerializer
    permission_classes = [IsAdminOrManagerOrStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order', 'driver']

