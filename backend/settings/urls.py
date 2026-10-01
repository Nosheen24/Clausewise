from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationSettingsViewSet
router = DefaultRouter()
router.register(r'settings', OrganizationSettingsViewSet, basename='settings')
urlpatterns = [path('', include(router.urls))]