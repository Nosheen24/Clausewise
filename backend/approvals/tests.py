"""
Tests for approval endpoints.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from contracts.models import Contract
from approvals.models import Approval


class ApprovalTests(TestCase):
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
        self.approval = Approval.objects.create(
            contract=self.contract,
            status=Approval.Status.UNDER_REVIEW,
            reviewer=self.user
        )

    def test_approve_contract(self):
        url = reverse("approval-approve", kwargs={"pk": self.approval.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.approval.refresh_from_db()
        self.contract.refresh_from_db()
        self.assertEqual(self.approval.status, "approved")
        self.assertEqual(self.contract.status, "approved")

    def test_reject_contract(self):
        url = reverse("approval-reject", kwargs={"pk": self.approval.id})
        response = self.client.post(url, {"comment": "Needs changes"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.approval.refresh_from_db()
        self.contract.refresh_from_db()
        self.assertEqual(self.approval.status, "rejected")
        self.assertEqual(self.contract.status, "rejected")

    def test_approve_from_invalid_status(self):
        # First approve
        url = reverse("approval-approve", kwargs={"pk": self.approval.id})
        self.client.post(url)
        # Now try to approve again - should fail
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)