from django.db import models
from django.core.validators import MinValueValidator

class Reservation(models.Model):
    """Reservation model."""
    
    STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('pending', 'Pending'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    table = models.ForeignKey('tables.Table', related_name='reservations', on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    duration = models.PositiveIntegerField(default=120, help_text="Duration in minutes")
    party_size = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date', 'time']
    
    def __str__(self):
        return f"{self.customer_name} - {self.date} {self.time}"

