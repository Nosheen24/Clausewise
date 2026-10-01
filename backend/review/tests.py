"""
Tests for review queue endpoints.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from contracts.models import Contract, ContractVersion
from contracts.models import ExtractedField
from review.models import ReviewItem


class ReviewTests(TestCase):
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
        version = ContractVersion.objects.create(
            contract=self.contract,
            version_number=1,
            file_name="test.pdf",
            file_type="pdf",
            processing_status="completed",
            uploaded_by=self.user
        )
        self.field = ExtractedField.objects.create(
            contract_version=version,
            field_type="parties",
            value="A | B",
            confidence_score=60
        )
        self.review_item = ReviewItem.objects.create(
            contract=self.contract,
            contract_version=version,
            field=self.field,
            reason="Low confidence",
            confidence_score=60,
            status="pending"
        )

    def test_list_review_items(self):
        url = reverse("review:review-item-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_review_queue_endpoint(self):
        url = reverse("review:review-item-queue")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("low_confidence", response.data)
        self.assertIn("medium_confidence", response.data)

    def test_resolve_review_item(self):
        url = reverse("review:review-item-detail", kwargs={"pk": self.review_item.id})
        response = self.client.patch(url, {"status": "completed"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.review_item.refresh_from_db()
        self.assertEqual(self.review_item.status, "completed")