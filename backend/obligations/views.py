"""
Views for obligation endpoints.
"""
from datetime import timedelta
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from contracts.models import Obligation
from contracts.serializers import ObligationSerializer
from authentication.models import CustomUser


class ObligationViewSet(viewsets.ModelViewSet):
    """ViewSet for obligations."""

    serializer_class = ObligationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return obligations."""
        return Obligation.objects.all()

    @action(detail=True, methods=["patch"], url_path="complete")
    def complete(self, request, pk=None):
        """Mark an obligation as completed."""
        obligation = self.get_object()
        obligation.status = Obligation.Status.COMPLETED
        obligation.save()
        return Response(ObligationSerializer(obligation).data)

    @action(detail=True, methods=["patch"], url_path="reopen")
    def reopen(self, request, pk=None):
        """Reopen an obligation (mark as upcoming)."""
        obligation = self.get_object()
        obligation.status = Obligation.Status.UPCOMING
        obligation.save()
        return Response(ObligationSerializer(obligation).data)

    @action(detail=False, methods=["get"], url_path="upcoming")
    def upcoming(self, request):
        """Get upcoming obligations within a number of days."""
        days = int(request.query_params.get("days", 30))
        upcoming_obligations = Obligation.objects.filter(
            due_date__lte=timezone.now().date() + timedelta(days=days),
            status=Obligation.Status.UPCOMING,
        )
        return Response(ObligationSerializer(upcoming_obligations, many=True).data)

    @action(detail=False, methods=["get"], url_path="by-contract")
    def by_contract(self, request):
        """Get obligations for a specific contract."""
        contract_id = request.query_params.get("contract_id")
        if contract_id:
            obligations = Obligation.objects.filter(contract_id=contract_id)
            return Response(ObligationSerializer(obligations, many=True).data)
        return Response(
            {"error": "contract_id required"}, status=status.HTTP_400_BAD_REQUEST
        )