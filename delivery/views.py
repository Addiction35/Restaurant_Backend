from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Driver
from .serializers import (
    DriverSerializer, DriverStatusUpdateSerializer, DriverAssignmentSerializer
)
from users.permissions import IsAdminOrManagerOrStaff
from orders.models import Order, DeliveryInfo

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [IsAdminOrManagerOrStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'is_active']
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        driver = self.get_object()
        serializer = DriverStatusUpdateSerializer(driver, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_driver = serializer.save()
            return Response(DriverSerializer(updated_driver).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def assign_order(self, request, pk=None):
        driver = self.get_object()
        order_id = request.data.get('order_id')
        
        if not order_id:
            return Response({"error": "order_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if driver is available
        if driver.status != 'available':
            return Response({"error": "Driver is not available"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if order is a delivery order
        if order.dining_mode != 'delivery':
            return Response({"error": "Order is not a delivery order"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update driver status and assign order
        driver.status = 'on_delivery'
        driver.current_order = order
        driver.save()
        
        # Update delivery info
        try:
            delivery_info = DeliveryInfo.objects.get(order=order)
            delivery_info.driver = driver
            delivery_info.save()
        except DeliveryInfo.DoesNotExist:
            # Create delivery info if it doesn't exist
            DeliveryInfo.objects.create(
                order=order,
                driver=driver,
                address=request.data.get('address', ''),
                contact_name=request.data.get('contact_name', ''),
                contact_phone=request.data.get('contact_phone', '')
            )
        
        return Response(DriverSerializer(driver).data)
    
    @action(detail=True, methods=['post'])
    def complete_delivery(self, request, pk=None):
        driver = self.get_object()
        
        if not driver.current_order:
            return Response({"error": "Driver has no current order"}, status=status.HTTP_400_BAD_REQUEST)
        
        order = driver.current_order
        
        # Update order status
        order.status = 'completed'
        order.save()
        
        # Update driver status
        driver.status = 'available'
        driver.current_order = None
        driver.save()
        
        return Response(DriverSerializer(driver).data)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        drivers = Driver.objects.filter(status='available', is_active=True)
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data)

