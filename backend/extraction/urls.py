"""
URL configuration for extraction endpoints.
"""
from django.urls import path
from .views import ExtractedFieldViewSet

router = None  # No router - we define manually

# List and create (create not typically needed for extracted fields - they're generated)
field_list = ExtractedFieldViewSet.as_view({"get": "list"})
field_detail = ExtractedFieldViewSet.as_view({"get": "retrieve"})
field_review = ExtractedFieldViewSet.as_view({"patch": "review"})

urlpatterns = [
    path(
        "contracts/<int:contract_pk>/fields/",
        field_list,
        name="extracted-field-list",
    ),
    path(
        "contracts/<int:contract_pk>/fields/<int:pk>/",
        field_detail,
        name="extracted-field-detail",
    ),
    path(
        "contracts/<int:contract_pk>/fields/<int:pk>/review/",
        field_review,
        name="extracted-field-review",
    ),
]