"""
Serializers for extraction endpoints.
"""
from rest_framework import serializers
from contracts.models import ExtractedField


class ExtractedFieldSerializer(serializers.ModelSerializer):
    """Serializer for extracted fields."""

    class Meta:
        model = ExtractedField
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")