"""
Serializers for contract endpoints.
"""
from rest_framework import serializers
from .models import Contract, ContractVersion, ExtractedField, Clause, Obligation


class ExtractedFieldSerializer(serializers.ModelSerializer):
    """Serializer for extracted fields."""

    class Meta:
        model = ExtractedField
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


class ClauseSerializer(serializers.ModelSerializer):
    """Serializer for clauses."""

    class Meta:
        model = Clause
        fields = "__all__"
        read_only_fields = ("id", "created_at")


class ObligationSerializer(serializers.ModelSerializer):
    """Serializer for obligations."""

    class Meta:
        model = Obligation
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


class ContractVersionSerializer(serializers.ModelSerializer):
    """Serializer for contract versions."""

    class Meta:
        model = ContractVersion
        fields = "__all__"
        read_only_fields = ("id", "created_at")


class ContractSerializer(serializers.ModelSerializer):
    """Serializer for contracts."""

    versions = ContractVersionSerializer(many=True, read_only=True)
    extractedFields = ExtractedFieldSerializer(
        many=True, read_only=True, source="extracted_fields"
    )
    clauses = ClauseSerializer(many=True, read_only=True)
    obligations = ObligationSerializer(many=True, read_only=True)
    currentVersion = ContractVersionSerializer(
        read_only=True, source="current_version"
    )

    class Meta:
        model = Contract
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


class ContractCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating contracts."""

    class Meta:
        model = Contract
        fields = ("title", "description", "status", "organization_id")
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_title(self, value):
        """Validate contract title."""
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Contract title must be at least 3 characters long."
            )
        return value.strip()

    def validate_status(self, value):
        """Validate contract status."""
        valid_statuses = [
            "draft",
            "under_review",
            "legal_review",
            "approved",
            "rejected",
            "expired",
            "renewed",
        ]
        if value not in valid_statuses:
            raise serializers.ValidationError("Invalid contract status.")
        return value


class ContractDetailSerializer(serializers.ModelSerializer):
    """Serializer for contract details."""

    versions = ContractVersionSerializer(many=True, read_only=True)
    extractedFields = ExtractedFieldSerializer(
        many=True, read_only=True, source="extracted_fields"
    )
    clauses = ClauseSerializer(many=True, read_only=True)
    obligations = ObligationSerializer(many=True, read_only=True)
    currentVersion = ContractVersionSerializer(
        read_only=True, source="current_version"
    )

    class Meta:
        model = Contract
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")