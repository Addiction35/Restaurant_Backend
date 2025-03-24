from django.db import models

class Section(models.Model):
    """Restaurant section model."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Table(models.Model):
    """Restaurant table model."""
    
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('reserved', 'Reserved'),
        ('maintenance', 'Maintenance'),
    )
    
    number = models.CharField(max_length=10)
    section = models.ForeignKey(Section, related_name='tables', on_delete=models.CASCADE)
    capacity = models.PositiveIntegerField(default=4)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    customer_name = models.CharField(max_length=100, blank=True)
    current_order = models.OneToOneField('orders.Order', related_name='table_order', 
                                         on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('number', 'section')
        ordering = ['section', 'number']
    
    def __str__(self):
        return f"Table {self.number} ({self.section.name})"

