"""
Review queue models for Clausewise backend.
"""
from django.db import models
from django.conf import settings
from contracts.models import Contract, ExtractedField


class ReviewItem(models.Model):
    """Model representing a field or clause that requires human review."""

    id = models.AutoField(primary_key=True)
    contract = models.ForeignKey(
        Contract, on_delete=models.CASCADE, related_name="review_items"
    )
    contract_version = models.ForeignKey(
        "contracts.ContractVersion",
        on_delete=models.CASCADE,
        related_name="review_items",
    )
    field = models.ForeignKey(
        ExtractedField,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="review_items",
    )
    reason = models.TextField()
    confidence_score = models.FloatField(default=0)
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("in_progress", "In Progress"),
            ("completed", "Completed"),
        ],
        default="pending",
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="reviewed_items",
    )
    reviewed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "review_items"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.contract.title} - {self.reason}"