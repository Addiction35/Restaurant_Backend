from rest_framework import serializers
from .models import Order, OrderItem, OrderItemModifier, DeliveryInfo
from menu.serializers import MenuItemSerializer
from tables.serializers import TableSerializer
from delivery.serializers import DriverSerializer

class OrderItemModifierSerializer(serializers.ModelSerializer):
    modifier_name = serializers.ReadOnlyField(source='modifier_option.modifier.name')
    option_name = serializers.ReadOnlyField(source='modifier_option.name')
    
    class Meta:
        model = OrderItemModifier
        fields = ['id', 'modifier_name', 'option_name', 'quantity', 'price', 'total_price']

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_details = MenuItemSerializer(source='menu_item', read_only=True)
    modifiers = OrderItemModifierSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_details', 'quantity', 'unit_price', 
                  'total_price', 'notes', 'modifiers', 'created_at']
        read_only_fields = ['created_at']

class DeliveryInfoSerializer(serializers.ModelSerializer):
    driver_details = DriverSerializer(source='driver', read_only=True)
    
    class Meta:
        model = DeliveryInfo
        fields = ['id', 'address', 'contact_name', 'contact_phone', 'delivery_notes', 
                  'estimated_delivery_time', 'driver', 'driver_details', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    table_details = TableSerializer(source='table', read_only=True)
    server_name = serializers.ReadOnlyField(source='server.name')
    delivery_info = DeliveryInfoSerializer(read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'table', 'table_details', 'server', 'server_name', 'dining_mode', 
                  'status', 'payment_status', 'payment_method', 'subtotal', 'tax', 
                  'discount', 'total', 'notes', 'items', 'item_count', 'delivery_info', 
                  'created_at', 'updated_at']
        read_only_fields = ['subtotal', 'tax', 'total', 'created_at', 'updated_at']

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['table', 'server', 'dining_mode', 'notes']

class OrderItemCreateSerializer(serializers.ModelSerializer):
    modifiers = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = OrderItem
        fields = ['menu_item', 'quantity', 'unit_price', 'notes', 'modifiers']
        extra_kwargs = {
            'unit_price': {'required': False}
        }
    
    def create(self, validated_data):
        modifiers_data = validated_data.pop('modifiers', [])
        order_item = OrderItem.objects.create(**validated_data)
        
        for modifier_data in modifiers_data:
            OrderItemModifier.objects.create(
                order_item=order_item,
                modifier_option_id=modifier_data['modifier_option'],
                quantity=modifier_data.get('quantity', 1),
                price=modifier_data.get('price')
            )
        
        return order_item

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']

class OrderPaymentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['payment_status', 'payment_method']

class DeliveryInfoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryInfo
        fields = ['address', 'contact_name', 'contact_phone', 'delivery_notes', 
                  'estimated_delivery_time', 'driver']

