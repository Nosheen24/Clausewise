from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from .models import OrganizationSettings

class SettingsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(email="test@clausewise.com", name="Test User", password="TestPass123!", role="admin")
        self.client.force_authenticate(user=self.user)
        self.settings = OrganizationSettings.objects.create(organization_id="org-1", confidence_threshold=0.9)
    def test_create_settings(self):
        response = self.client.post(reverse("settings-list"), {"organization_id": "org-2", "confidence_threshold": 0.85})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["confidence_threshold"], 0.85)
    def test_get_settings(self):
        response = self.client.get(reverse("settings-detail", kwargs={"pk": self.settings.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["confidence_threshold"], 0.9)