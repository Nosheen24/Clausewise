"""
Serializers for obligations endpoints.
"""
from rest_framework import serializers
from contracts.models import Obligation


class ObligationSerializer(serializers.ModelSerializer):
    """Serializer for obligations."""

    class Meta:
        model = Obligation
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")