from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlaybookViewSet, PlaybookRuleViewSet

router = DefaultRouter()
router.register(r'playbooks', PlaybookViewSet, basename='playbook')
router.register(r'playbook-rules', PlaybookRuleViewSet, basename='playbook-rule')

urlpatterns = [
    path('', include(router.urls)),
]