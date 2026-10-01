"""
Tests for contract endpoints.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from .models import Contract, ContractVersion


class ContractTests(TestCase):
    """Test contract endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email="test@clausewise.com",
            name="Test User",
            password="TestPass123!",
            role="reviewer",
        )
        self.client.force_authenticate(user=self.user)
        self.contract = Contract.objects.create(
            title="Test Contract",
            description="Test description",
            status="draft",
            created_by=self.user,
        )
        self.contract_url = reverse("contract-detail", kwargs={"pk": self.contract.pk})
        self.contracts_url = reverse("contract-list")

    def test_list_contracts(self):
        """Test listing contracts."""
        response = self.client.get(self.contracts_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_create_contract(self):
        """Test creating a contract."""
        data = {
            "title": "New Contract",
            "description": "New description",
            "status": "draft",
        }
        response = self.client.post(self.contracts_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], data["title"])

    def test_retrieve_contract(self):
        """Test retrieving a contract."""
        response = self.client.get(self.contract_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.contract.title)

    def test_update_contract(self):
        """Test updating a contract."""
        data = {"status": "under_review"}
        response = self.client.patch(self.contract_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.contract.refresh_from_db()
        self.assertEqual(self.contract.status, "under_review")

    def test_delete_contract(self):
        """Test deleting a contract."""
        response = self.client.delete(self.contract_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Contract.objects.filter(pk=self.contract.pk).exists())

    def test_upload_pdf(self):
        """Test uploading a PDF document."""
        from django.core.files.uploadedfile import SimpleUploadedFile
        pdf_file = SimpleUploadedFile(
            "test.pdf", b"PDF content", content_type="application/pdf"
        )
        response = self.client.post(
            self.contract_url + "upload/", {"file": pdf_file}, format="multipart"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["file_name"], "test.pdf")

    def test_upload_non_pdf(self):
        """Test rejecting non-PDF uploads."""
        from django.core.files.uploadedfile import SimpleUploadedFile
        txt_file = SimpleUploadedFile(
            "test.txt", b"Text content", content_type="text/plain"
        )
        response = self.client.post(
            self.contract_url + "upload/", {"file": txt_file}, format="multipart"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)