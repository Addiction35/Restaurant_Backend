from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Reservation
from .serializers import (
    ReservationSerializer, ReservationCreateSerializer, 
    ReservationStatusUpdateSerializer
)
from users.permissions import IsAdminOrManagerOrStaff
from tables.models import Table

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all().order_by('date', 'time')
    permission_classes = [IsAdminOrManagerOrStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['date', 'status', 'table']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReservationCreateSerializer
        return ReservationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reservation = serializer.save()
        
        # Update table status to reserved
        table = reservation.table
        table.status = 'reserved'
        table.customer_name = reservation.customer_name
        table.save()
        
        return Response(ReservationSerializer(reservation).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        reservation = self.get_object()
        serializer = ReservationStatusUpdateSerializer(reservation, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_reservation = serializer.save()
            
            # Update table status based on reservation status
            table = updated_reservation.table
            if updated_reservation.status == 'cancelled':
                table.status = 'available'
                table.customer_name = ''
                table.save()
            elif updated_reservation.status == 'confirmed':
                table.status = 'reserved'
                table.customer_name = updated_reservation.customer_name
                table.save()
            
            return Response(ReservationSerializer(updated_reservation).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_date(self, request):
        date = request.query_params.get('date')
        if not date:
            return Response({"error": "Date parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        reservations = Reservation.objects.filter(date=date).order_by('time')
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available_tables(self, request):
        date = request.query_params.get('date')
        time = request.query_params.get('time')
        duration = request.query_params.get('duration', 120)
        party_size = request.query_params.get('party_size', 2)
        
        if not date or not time:
            return Response({"error": "Date and time parameters are required"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Get all tables with sufficient capacity
        tables = Table.objects.filter(
            capacity__gte=party_size,
            is_active=True
        )
        
        # Get all reservations for the given date
        reservations = Reservation.objects.filter(
            date=date,
            status__in=['confirmed', 'pending']
        )
        
        # Convert time to minutes since midnight
        hours, minutes = map(int, time.split(':'))
        req_start_minutes = hours * 60 + minutes
        req_end_minutes = req_start_minutes + int(duration)
        
        # Filter out tables with overlapping reservations
        available_tables = []
        for table in tables:
            is_available = True
            table_reservations = reservations.filter(table=table)
            
            for reservation in table_reservations:
                res_hours, res_minutes = reservation.time.hour, reservation.time.minute
                res_start_minutes = res_hours * 60 + res_minutes
                res_end_minutes = res_start_minutes + reservation.duration
                
                # Check for overlap
                if (req_start_minutes < res_end_minutes and req_end_minutes > res_start_minutes):
                    is_available = False
                    break
            
            if is_available and table.status != 'maintenance':
                available_tables.append(table)
        
        from tables.serializers import TableSerializer
        serializer = TableSerializer(available_tables, many=True)
        return Response(serializer.data)

