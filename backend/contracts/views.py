"""
Views for contract endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Contract, ContractVersion, ExtractedField, Clause, Obligation
from .serializers import (
    ContractSerializer,
    ContractCreateUpdateSerializer,
    ContractDetailSerializer,
    ExtractedFieldSerializer,
    ClauseSerializer,
    ObligationSerializer,
    ContractVersionSerializer,
)


class ContractViewSet(viewsets.ModelViewSet):
    """ViewSet for contract CRUD operations."""

    queryset = Contract.objects.all()
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):
        """Return serializer class based on action."""
        if self.action in ["create", "update", "partial_update"]:
            return ContractCreateUpdateSerializer
        return ContractSerializer

    def get_queryset(self):
        """Return contracts filtered by organization."""
        queryset = Contract.objects.all()
        organization_id = self.request.query_params.get("organization_id", None)
        search = self.request.query_params.get("search", None)
        if organization_id:
            queryset = queryset.filter(organization_id=organization_id)
        if search:
            queryset = queryset.filter(title__icontains=search)
        return queryset

    def perform_create(self, serializer):
        """Set created_by on contract creation."""
        serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        """Create a new contract."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve contract details."""
        instance = self.get_object()
        serializer = ContractDetailSerializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Update an existing contract."""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Delete a contract."""
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path="upload")
    def upload(self, request, pk=None):
        """Upload a contract document."""
        contract = self.get_object()
        if "file" not in request.FILES:
            return Response(
                {"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST
            )
        uploaded_file = request.FILES["file"]
        file_ext = uploaded_file.name.lower().split(".")[-1]
        if file_ext not in ["pdf", "docx", "doc"]:
            return Response(
                {"error": "Only PDF, DOCX, and DOC files are allowed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        version_number = contract.versions.count() + 1
        version = ContractVersion.objects.create(
            contract=contract,
            version_number=version_number,
            file_name=uploaded_file.name,
            file_type=file_ext,
            processing_status="pending",
            uploaded_by=request.user,
        )
        return Response(
            ContractVersionSerializer(version).data, status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["get"], url_path="extraction")
    def extraction(self, request, pk=None):
        """Get extracted fields for a contract."""
        contract = self.get_object()
        fields = contract.extracted_fields.all()
        return Response(ExtractedFieldSerializer(fields, many=True).data)

    @action(detail=True, methods=["get"], url_path="versions")
    def versions(self, request, pk=None):
        """Get version history for a contract."""
        contract = self.get_object()
        versions = contract.versions.all()
        return Response(ContractVersionSerializer(versions, many=True).data)

    @action(detail=True, methods=["get"], url_path="clauses")
    def clauses(self, request, pk=None):
        """Get clauses for a contract."""
        contract = self.get_object()
        latest_version = contract.current_version
        if latest_version:
            clauses = latest_version.clauses.all()
        else:
            clauses = Clause.objects.none()
        return Response(ClauseSerializer(clauses, many=True).data)

    @action(detail=True, methods=["get"], url_path="obligations")
    def obligations(self, request, pk=None):
        """Get obligations for a contract."""
        contract = self.get_object()
        obligations = contract.obligations.all()
        return Response(ObligationSerializer(obligations, many=True).data)

    @action(detail=True, methods=["get"], url_path="field-values")
    def field_values(self, request, pk=None):
        """Get all extracted field values organized by field type."""
        contract = self.get_object()
        fields = contract.extracted_fields.all()
        return Response(ExtractedFieldSerializer(fields, many=True).data)
