from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from .models import Playbook, PlaybookRule

class PlaybookTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(email="test@clausewise.com", name="Test User", password="TestPass123!", role="admin")
        self.client.force_authenticate(user=self.user)
        self.playbook = Playbook.objects.create(organization_id="org-1", name="Test Playbook", description="Test description")
    def test_create_playbook(self):
        response = self.client.post(reverse("playbook-list"), {"organization_id": "org-1", "name": "New Playbook", "description": "Test"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "New Playbook")
    def test_add_rule_to_playbook(self):
        response = self.client.post(reverse("playbook-add-rule", kwargs={"pk": self.playbook.id}), {"clause_type": "payment", "preferred_position": "Net 30", "severity": "high"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["clause_type"], "payment")