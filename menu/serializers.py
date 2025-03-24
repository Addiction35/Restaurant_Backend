from rest_framework import serializers
from .models import Category, MenuItem, Modifier, ModifierOption

class ModifierOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModifierOption
        fields = ['id', 'name', 'price', 'is_default', 'is_available']

class ModifierSerializer(serializers.ModelSerializer):
    options = ModifierOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Modifier
        fields = ['id', 'name', 'description', 'is_required', 'min_selections', 
                  'max_selections', 'options']

class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    modifiers = ModifierSerializer(many=True, read_only=True)
    
    class Meta:
        model = MenuItem
        fields = ['id', 'category', 'category_name', 'name', 'slug', 'description', 
                  'price', 'discount_percentage', 'discounted_price', 'food_type', 
                  'image', 'ingredients', 'allergens', 'preparation_time', 
                  'is_available', 'is_featured', 'modifiers', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_at', 'updated_at']

class CategorySerializer(serializers.ModelSerializer):
    item_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'description', 'is_active', 
                  'item_count', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_at', 'updated_at']

class CategoryWithItemsSerializer(CategorySerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)
    
    class Meta(CategorySerializer.Meta):
        fields = CategorySerializer.Meta.fields + ['menu_items']

class ModifierOptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModifierOption
        fields = ['id', 'name', 'price', 'is_default', 'is_available']

class ModifierCreateSerializer(serializers.ModelSerializer):
    options = ModifierOptionCreateSerializer(many=True, required=False)
    
    class Meta:
        model = Modifier
        fields = ['id', 'name', 'description', 'is_required', 'min_selections', 
                  'max_selections', 'menu_items', 'options']
    
    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        menu_items = validated_data.pop('menu_items', [])
        
        modifier = Modifier.objects.create(**validated_data)
        
        if menu_items:
            modifier.menu_items.set(menu_items)
        
        for option_data in options_data:
            ModifierOption.objects.create(modifier=modifier, **option_data)
        
        return modifier
    
    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', None)
        menu_items = validated_data.pop('menu_items', None)
        
        # Update modifier fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update menu items if provided
        if menu_items is not None:
            instance.menu_items.set(menu_items)
        
        # Update options if provided
        if options_data is not None:
            instance.options.all().delete()
            for option_data in options_data:
                ModifierOption.objects.create(modifier=instance, **option_data)
        
        return instance

