from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Section, Table
from .serializers import SectionSerializer, TableSerializer, TableStatusUpdateSerializer
from users.permissions import IsAdminOrManagerOrStaff

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAdminOrManagerOrStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    
    @action(detail=True, methods=['get'])
    def tables(self, request, pk=None):
        section = self.get_object()
        tables = section.tables.all()
        serializer = TableSerializer(tables, many=True)
        return Response(serializer.data)

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [IsAdminOrManagerOrStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['section', 'status', 'is_active']
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        table = self.get_object()
        serializer = TableStatusUpdateSerializer(table, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(TableSerializer(table).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        tables = Table.objects.filter(status='available', is_active=True)
        serializer = TableSerializer(tables, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_section(self, request):
        sections = Section.objects.filter(is_active=True)
        result = []
        
        for section in sections:
            tables = section.tables.all()
            result.append({
                'section': SectionSerializer(section).data,
                'tables': TableSerializer(tables, many=True).data
            })
        
        return Response(result)

