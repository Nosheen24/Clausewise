"""
URL configuration for Clausewise backend project.
"""
from django.contrib import admin
from django.urls import include, path
from django.http import HttpResponse

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("authentication.urls")),
    path("api/", include("contracts.urls")),
    path("api/", include("extraction.urls")),
    path("api/", include("review.urls")),
    path("api/", include("approvals.urls")),
    path("api/", include("playbooks.urls")),
    path("api/", include("obligations.urls")),
    path("api/", include("users.urls")),
    path("api/", include("settings.urls")),
]


def health_check(request):
    return HttpResponse("OK")


urlpatterns.append(path("health/", health_check))