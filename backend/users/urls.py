"""
URL configuration for user management endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, OrganizationViewSet, UserManagementViewSet

router = DefaultRouter()
router.register(r"user-profiles", UserProfileViewSet, basename="user-profile")
router.register(r"organizations", OrganizationViewSet, basename="organization")
router.register(r"users", UserManagementViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),
]