"""
Views for approval workflow endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Approval
from .serializers import ApprovalSerializer
from contracts.models import Contract
from authentication.models import CustomUser


class ApprovalViewSet(viewsets.ModelViewSet):
    """ViewSet for approval workflow."""

    serializer_class = ApprovalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return approvals."""
        return Approval.objects.all()

    @action(detail=True, methods=["post"], url_path="approve")
    def approve(self, request, pk=None):
        """Approve a contract."""
        approval = self.get_object()
        if approval.status not in ["under_review", "legal_review"]:
            return Response(
                {"error": "Cannot approve from current status."},
                status=status.HTTP_409_CONFLICT,
            )
        approval.status = Approval.Status.APPROVED
        approval.approved_at = timezone.now()
        approval.save()
        contract = approval.contract
        contract.status = Contract.Status.APPROVED
        contract.save()
        return Response(ApprovalSerializer(approval).data)

    @action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        """Reject a contract."""
        approval = self.get_object()
        if approval.status not in ["under_review", "legal_review"]:
            return Response(
                {"error": "Cannot reject from current status."},
                status=status.HTTP_409_CONFLICT,
            )
        approval.status = Approval.Status.REJECTED
        approval.comment = request.data.get("comment", "")
        approval.save()
        contract = approval.contract
        contract.status = Contract.Status.REJECTED
        contract.save()
        return Response(ApprovalSerializer(approval).data)

    @action(detail=False, methods=["get"], url_path="queue")
    def queue(self, request):
        """Get the approval queue."""
        queue = Approval.objects.filter(status__in=["under_review", "legal_review"])
        return Response(ApprovalSerializer(queue, many=True).data)