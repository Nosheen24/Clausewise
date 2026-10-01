"""
Serializers for user management endpoints.
"""
from rest_framework import serializers
from .models import UserProfile, Organization


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profiles."""

    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "user")

    def create(self, validated_data):
        """Set user from request if not provided."""
        if "user" not in validated_data:
            request = self.context.get("request")
            if request:
                validated_data["user"] = request.user
        return super().create(validated_data)


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for organizations."""

    class Meta:
        model = Organization
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")