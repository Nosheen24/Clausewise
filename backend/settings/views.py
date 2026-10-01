from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import OrganizationSettings
from .serializers import OrganizationSettingsSerializer
from rest_framework.permissions import IsAuthenticated

class OrganizationSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSettingsSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        organization_id = self.request.query_params.get("organization_id", None)
        if organization_id:
            return OrganizationSettings.objects.filter(organization_id=organization_id)
        return OrganizationSettings.objects.all()