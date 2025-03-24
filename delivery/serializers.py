from rest_framework import serializers
from .models import Driver

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id', 'name', 'phone', 'email', 'vehicle', 'status', 
                  'current_order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class DriverStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['status']

class DriverAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['current_order']

