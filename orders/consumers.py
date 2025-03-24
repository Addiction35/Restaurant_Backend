import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from django.core.serializers.json import DjangoJSONEncoder
from .models import Order
from .serializers import OrderSerializer

class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'orders'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        
        if message_type == 'get_orders':
            orders = await self.get_orders()
            await self.send(text_data=json.dumps({
                'type': 'orders_list',
                'orders': orders
            }, cls=DjangoJSONEncoder))
    
    async def order_update(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'order_update',
            'order': event['order']
        }, cls=DjangoJSONEncoder))
    
    @database_sync_to_async
    def get_orders(self):
        orders = Order.objects.filter(
            status__in=['pending', 'processing']
        ).order_by('created_at')
        
        serializer = OrderSerializer(orders, many=True)
        return serializer.data
    
    @classmethod
    def notify_order_update(cls, order):
        """Notify all clients about order update."""
        serializer = OrderSerializer(order)
        order_data = serializer.data
        
        # Use channel layer to send to group
        from channels.layers import get_channel_layer
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'orders',
            {
                'type': 'order_update',
                'order': order_data
            }
        )

