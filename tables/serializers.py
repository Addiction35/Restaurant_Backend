from rest_framework import serializers
from .models import Section, Table

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TableSerializer(serializers.ModelSerializer):
    section_name = serializers.ReadOnlyField(source='section.name')
    
    class Meta:
        model = Table
        fields = ['id', 'number', 'section', 'section_name', 'capacity', 'status', 
                  'customer_name', 'current_order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TableStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['status', 'customer_name']

