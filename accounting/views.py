from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Transaction
from .serializers import TransactionSerializer, TransactionCreateSerializer
from users.permissions import IsAdminOrManagerOrCashier
from orders.models import Order
from datetime import datetime, timedelta

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')
    permission_classes = [IsAdminOrManagerOrCashier]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'method', 'category', 'staff']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        return TransactionSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        transaction = serializer.save()
        
        # If it's a sale transaction, update the order payment status
        if transaction.type == 'sale' and transaction.order:
            order = transaction.order
            order.payment_status = 'paid'
            order.payment_method = transaction.method
            order.save()
        
        return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def by_date_range(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response({"error": "start_date and end_date parameters are required"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
            # Add one day to end_date to include the entire day
            end_date = end_date + timedelta(days=1)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        transactions = Transaction.objects.filter(
            created_at__gte=start_date,
            created_at__lt=end_date
        ).order_by('-created_at')
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def sales_report(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response({"error": "start_date and end_date parameters are required"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
            # Add one day to end_date to include the entire day
            end_date = end_date + timedelta(days=1)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Get sales transactions
        sales = Transaction.objects.filter(
            type='sale',
            created_at__gte=start_date,
            created_at__lt=end_date
        )
        
        # Get refunds
        refunds = Transaction.objects.filter(
            type='refund',
            created_at__gte=start_date,
            created_at__lt=end_date
        )
        
        # Calculate totals
        total_sales = sum(sale.amount for sale in sales)
        total_refunds = sum(refund.amount for refund in refunds)
        net_sales = total_sales - total_refunds
        
        # Group by payment method
        sales_by_method = {}
        for sale in sales:
            method = sale.method
            if method not in sales_by_method:
                sales_by_method[method] = 0
            sales_by_method[method] += sale.amount
        
        # Group by day
        sales_by_day = {}
        current_date = start_date
        while current_date < end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            next_date = current_date + timedelta(days=1)
            
            day_sales = Transaction.objects.filter(
                type='sale',
                created_at__gte=current_date,
                created_at__lt=next_date
            )
            
            sales_by_day[date_str] = sum(sale.amount for sale in day_sales)
            current_date = next_date
        
        return Response({
            'total_sales': total_sales,
            'total_refunds': total_refunds,
            'net_sales': net_sales,
            'transaction_count': sales.count(),
            'sales_by_method': sales_by_method,
            'sales_by_day': sales_by_day
        })

