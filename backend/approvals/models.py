from django.db import models
from authentication.models import CustomUser
from contracts.models import Contract

class Approval(models.Model):
    class Status(models.TextChoices):
        UNDER_REVIEW = "under_review", "Under Review"
        LEGAL_REVIEW = "legal_review", "Legal Review"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
    id = models.AutoField(primary_key=True)
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="approvals")
    reviewer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, blank=True, null=True, related_name="approvals")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UNDER_REVIEW)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    class Meta:
        db_table = "approvals"
    def __str__(self):
        return f"{self.contract.title} - {self.status}"