from django.db import models

class Driver(models.Model):
    """Delivery driver model."""
    
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('on_delivery', 'On Delivery'),
        ('off_duty', 'Off Duty'),
    )
    
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    vehicle = models.CharField(max_length=100)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    current_order = models.OneToOneField('orders.Order', related_name='assigned_driver', 
                                         on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"

