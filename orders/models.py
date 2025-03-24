from django.db import models
from django.conf import settings
from menu.models import MenuItem, ModifierOption

class Order(models.Model):
    """Order model."""
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    DINING_MODE_CHOICES = (
        ('dine_in', 'Dine In'),
        ('take_away', 'Take Away'),
        ('delivery', 'Delivery'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
        ('partial', 'Partial'),
        ('refunded', 'Refunded'),
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('qr_code', 'QR Code'),
        ('other', 'Other'),
    )
    
    table = models.ForeignKey('tables.Table', related_name='orders', on_delete=models.SET_NULL, 
                              null=True, blank=True)
    server = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='served_orders', 
                               on_delete=models.SET_NULL, null=True, blank=True)
    dining_mode = models.CharField(max_length=10, choices=DINING_MODE_CHOICES, default='dine_in')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='unpaid')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.get_status_display()}"
    
    @property
    def item_count(self):
        return sum(item.quantity for item in self.items.all())
    
    def calculate_totals(self):
        """Calculate order totals."""
        items = self.items.all()
        self.subtotal = sum(item.total_price for item in items)
        self.tax = self.subtotal * 0.05  # 5% tax
        self.total = self.subtotal + self.tax - self.discount
        self.save()

class OrderItem(models.Model):
    """Order item model."""
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"
    
    @property
    def total_price(self):
        return self.unit_price * self.quantity
    
    def save(self, *args, **kwargs):
        # Set unit price from menu item if not provided
        if not self.unit_price:
            self.unit_price = self.menu_item.discounted_price
        super().save(*args, **kwargs)
        # Recalculate order totals
        self.order.calculate_totals()

class OrderItemModifier(models.Model):
    """Order item modifier model."""
    order_item = models.ForeignKey(OrderItem, related_name='modifiers', on_delete=models.CASCADE)
    modifier_option = models.ForeignKey(ModifierOption, related_name='order_item_modifiers', 
                                        on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.order_item} - {self.modifier_option.name}"
    
    @property
    def total_price(self):
        return self.price * self.quantity
    
    def save(self, *args, **kwargs):
        # Set price from modifier option if not provided
        if not self.price:
            self.price = self.modifier_option.price
        super().save(*args, **kwargs)
        # Recalculate order totals
        self.order_item.order.calculate_totals()

class DeliveryInfo(models.Model):
    """Delivery information for delivery orders."""
    order = models.OneToOneField(Order, related_name='delivery_info', on_delete=models.CASCADE)
    address = models.TextField()
    contact_name = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20)
    delivery_notes = models.TextField(blank=True)
    estimated_delivery_time = models.CharField(max_length=50, blank=True)
    driver = models.ForeignKey('delivery.Driver', related_name='deliveries', 
                               on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Delivery for Order #{self.order.id}"

