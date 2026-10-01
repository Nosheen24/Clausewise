"""
URL configuration for review endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewItemViewSet

app_name = "review"

router = DefaultRouter()
router.register(r"review-items", ReviewItemViewSet, basename="review-item")

urlpatterns = [
    path("", include(router.urls)),
]