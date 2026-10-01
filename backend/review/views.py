"""
Views for review queue endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ReviewItem
from .serializers import ReviewItemSerializer
from contracts.models import Contract
from authentication.models import CustomUser


class ReviewItemViewSet(viewsets.ModelViewSet):
    """ViewSet for review queue items."""

    serializer_class = ReviewItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return review items, optionally filtered by contract."""
        queryset = ReviewItem.objects.all()
        contract_id = self.request.query_params.get("contract_id", None)
        if contract_id:
            queryset = queryset.filter(contract_id=contract_id)
        return queryset

    @action(detail=True, methods=["patch"], url_path="resolve")
    def resolve(self, request, pk=None):
        """Resolve a review item."""
        review_item = self.get_object()
        serializer = ReviewItemSerializer(
            review_item, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save(reviewed_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["patch"], url_path="skip")
    def skip(self, request, pk=None):
        """Skip a review item."""
        review_item = self.get_object()
        serializer = ReviewItemSerializer(
            review_item,
            data={"status": "completed", "reviewed_by": request.user.id},
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="queue")
    def queue(self, request):
        """Get the review queue with low and medium confidence items."""
        low_confidence = self.get_queryset().filter(
            confidence_score__lt=70, status="pending"
        )
        medium_confidence = self.get_queryset().filter(
            confidence_score__gte=70,
            confidence_score__lt=90,
            status="pending",
        )
        return Response(
            {
                "low_confidence": ReviewItemSerializer(
                    low_confidence, many=True
                ).data,
                "medium_confidence": ReviewItemSerializer(
                    medium_confidence, many=True
                ).data,
            }
        )