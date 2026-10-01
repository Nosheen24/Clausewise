"""
URL configuration for authentication endpoints.
"""
from django.urls import path
from .views import register, login, logout, profile, update_profile

app_name = "authentication"

urlpatterns = [
    path("auth/register/", register, name="register"),
    path("auth/login/", login, name="login"),
    path("auth/logout/", logout, name="logout"),
    path("auth/profile/", profile, name="profile"),
    path("auth/profile/update/", update_profile, name="profile-update"),
]