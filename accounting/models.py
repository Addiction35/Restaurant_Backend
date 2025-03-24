from django.db import models
from django.conf import settings

class Transaction(models.Model):
    """Financial transaction model."""
    
    TYPE_CHOICES = (
        ('sale', 'Sale'),
        ('refund', 'Refund'),
        ('expense', 'Expense'),
        ('adjustment', 'Adjustment'),
    )
    
    METHOD_CHOICES = (
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('qr_code', 'QR Code'),
        ('other', 'Other'),
    )
    
    order = models.ForeignKey('orders.Order', related_name='transactions', 
                              on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, blank=True)
    staff = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='transactions', 
                              on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_type_display()} - ${self.amount} ({self.created_at.strftime('%Y-%m-%d')})"

