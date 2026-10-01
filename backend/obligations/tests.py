"""
Tests for obligation endpoints.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from contracts.models import Contract
from contracts.models import Obligation


class ObligationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email="test@clausewise.com",
            name="Test User",
            password="TestPass123!",
            role="reviewer"
        )
        self.client.force_authenticate(user=self.user)
        self.contract = Contract.objects.create(
            title="Test Contract",
            status="draft",
            created_by=self.user
        )
        self.obligation = Obligation.objects.create(
            contract=self.contract,
            type=Obligation.Type.RENEWAL,
            description="Renewal due",
            due_date="2025-12-31"
        )

    def test_complete_obligation(self):
        url = reverse("obligation-complete", kwargs={"pk": self.obligation.id})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.obligation.refresh_from_db()
        self.assertEqual(self.obligation.status, "completed")

    def test_upcoming_obligations(self):
        url = reverse("obligation-upcoming")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)