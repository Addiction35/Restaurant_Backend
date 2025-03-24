from rest_framework import serializers
from .models import Transaction
from orders.serializers import OrderSerializer

class TransactionSerializer(serializers.ModelSerializer):
    order_details = OrderSerializer(source='order', read_only=True)
    staff_name = serializers.ReadOnlyField(source='staff.name')
    
    class Meta:
        model = Transaction
        fields = ['id', 'order', 'order_details', 'type', 'amount', 'method', 
                  'description', 'category', 'staff', 'staff_name', 'created_at']
        read_only_fields = ['created_at']

class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['order', 'type', 'amount', 'method', 'description', 'category', 'staff']

