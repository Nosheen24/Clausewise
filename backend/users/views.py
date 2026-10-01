"""
Views for user management endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import UserProfile, Organization
from .serializers import UserProfileSerializer, OrganizationSerializer
from authentication.models import CustomUser


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profiles."""

    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return profiles for the current user."""
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set user on profile creation."""
        serializer.save(user=self.request.user)


class OrganizationViewSet(viewsets.ModelViewSet):
    """ViewSet for organizations."""

    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return organizations."""
        return Organization.objects.all()


class UserManagementViewSet(viewsets.ModelViewSet):
    """ViewSet for user management (admin only)."""

    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        """Return all users."""
        return CustomUser.objects.all()