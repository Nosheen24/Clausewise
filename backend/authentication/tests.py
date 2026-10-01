"""
Tests for authentication endpoints.
"""
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser


class AuthenticationTests(TestCase):
    """Test authentication endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("authentication:register")
        self.login_url = reverse("authentication:login")
        self.profile_url = reverse("authentication:profile")
        self.user_data = {
            "email": "test@clausewise.com",
            "name": "Test User",
            "password": "TestPass123!",
            "password_confirm": "TestPass123!",
            "role": "reviewer",
        }

    def test_register_valid_user(self):
        """Test user registration with valid data."""
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tokens", response.data)
        self.assertEqual(response.data["user"]["email"], self.user_data["email"])
        self.assertEqual(response.data["user"]["role"], self.user_data["role"])

    def test_register_password_mismatch(self):
        """Test registration fails when passwords don't match."""
        data = self.user_data.copy()
        data["password_confirm"] = "DifferentPass123!"
        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_valid_credentials(self):
        """Test login with valid credentials."""
        self.client.post(self.register_url, self.user_data, format="json")
        response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)

    def test_login_invalid_credentials(self):
        """Test login fails with invalid credentials."""
        response = self.client.post(
            self.login_url,
            {"email": "wrong@email.com", "password": "WrongPass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_profile_requires_authentication(self):
        """Test profile endpoint requires authentication."""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)