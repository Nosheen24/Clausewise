"""
Views for extraction endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from contracts.models import ExtractedField, Contract


class ExtractedFieldViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for extracted fields, contract-nested."""

    serializer_class = None  # Set dynamically
    queryset = ExtractedField.objects.select_related("contract_version")

    def get_serializer_class(self):
        """Return serializer class."""
        from contracts.serializers import ExtractedFieldSerializer
        return ExtractedFieldSerializer

    def get_queryset(self):
        """Return fields filtered by contract."""
        contract_id = self.kwargs.get("contract_pk")
        if contract_id:
            return ExtractedField.objects.filter(
                contract_version__contract_id=contract_id
            )
        return ExtractedField.objects.none()

    @action(detail=True, methods=["patch"], url_path="review")
    def review(self, request, pk=None, contract_pk=None):
        """Review an extracted field."""
        field = self.get_object()
        if contract_pk and str(field.contract_version.contract_id) != str(contract_pk):
            return Response(
                {"error": "Field does not belong to this contract."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = self.get_serializer(field, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(reviewed_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)