"""
Tests for extraction endpoints.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from contracts.models import Contract, ContractVersion, ExtractedField


class ExtractionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email="test@clausewise.com",
            name="Test",
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
            value="Party A | Party B",
            confidence_score=95
        )

    def test_list_fields(self):
        url = reverse('extracted-field-list', kwargs={'contract_pk': self.contract.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_review_field(self):
        url = reverse('extracted-field-detail', kwargs={
            'contract_pk': self.contract.id,
            'pk': self.field.id
        })
        review_url = f"{url}review/"
        response = self.client.patch(review_url,
            {"review_status": "approved"},
            format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)