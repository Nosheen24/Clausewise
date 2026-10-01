"""
Tests for user management endpoints.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from authentication.models import CustomUser
from users.models import UserProfile, Organization


class UsersTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email="test@clausewise.com",
            name="Test User",
            password="TestPass123!",
            role="admin"
        )
        self.client.force_authenticate(user=self.user)

    def test_create_user_profile(self):
        url = reverse("user-profile-list")
        response = self.client.post(url, {"avatar_url": "avatar.jpg"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["avatar_url"], "avatar.jpg")

    def test_get_user_profile(self):
        profile = UserProfile.objects.create(
            user=self.user,
            avatar_url="test.jpg"
        )
        url = reverse("user-profile-detail", kwargs={"pk": profile.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["avatar_url"], "test.jpg")

    def test_create_organization(self):
        url = reverse("organization-list")
        data = {"name": "New Org", "industry": "Finance", "size": 500}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "New Org")