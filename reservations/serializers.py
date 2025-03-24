from rest_framework import serializers
from .models import Reservation
from tables.serializers import TableSerializer

class ReservationSerializer(serializers.ModelSerializer):
    table_details = TableSerializer(source='table', read_only=True)
    
    class Meta:
        model = Reservation
        fields = ['id', 'table', 'table_details', 'customer_name', 'contact_phone', 
                  'email', 'date', 'time', 'duration', 'party_size', 'status', 
                  'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ReservationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['table', 'customer_name', 'contact_phone', 'email', 'date', 
                  'time', 'duration', 'party_size', 'notes']
    
    def validate(self, attrs):
        # Check if table is available for the requested time
        table = attrs['table']
        date = attrs['date']
        time = attrs['time']
        duration = attrs['duration']
        
        # Check for overlapping reservations
        overlapping_reservations = Reservation.objects.filter(
            table=table,
            date=date,
            status__in=['confirmed', 'pending'],
        ).exclude(pk=self.instance.pk if self.instance else None)
        
        for reservation in overlapping_reservations:
            # Convert reservation time to minutes since midnight
            res_start_minutes = reservation.time.hour * 60 + reservation.time.minute
            res_end_minutes = res_start_minutes + reservation.duration
            
            # Convert requested time to minutes since midnight
            req_start_minutes = time.hour * 60 + time.minute
            req_end_minutes = req_start_minutes + duration
            
            # Check for overlap
            if (req_start_minutes < res_end_minutes and req_end_minutes > res_start_minutes):
                raise serializers.ValidationError(
                    f"Table is already reserved from {reservation.time} for {reservation.duration} minutes"
                )
        
        return attrs

class ReservationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['status']

