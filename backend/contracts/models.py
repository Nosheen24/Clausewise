"""
Contract models for Clausewise backend.
"""
from django.db import models
from django.conf import settings
from django.utils import timezone


class Contract(models.Model):
    """Model representing a logical contract (not a specific uploaded file)."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        UNDER_REVIEW = "under_review", "Under Review"
        LEGAL_REVIEW = "legal_review", "Legal Review"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        EXPIRED = "expired", "Expired"
        RENEWED = "renewed", "Renewed"

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT
    )
    organization_id = models.CharField(max_length=100, blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="created_contracts",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "contracts"
        verbose_name = "Contract"
        verbose_name_plural = "Contracts"
        ordering = ["-created_at"]

    @property
    def current_version(self):
        """Return the latest version of the contract."""
        return self.versions.order_by("-version_number").first()

    def __str__(self):
        return self.title


class ContractVersion(models.Model):
    """Model representing a specific uploaded revision of a contract."""

    class ProcessingStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    class FileType(models.TextChoices):
        PDF = "pdf", "PDF"
        DOCX = "docx", "DOCX"
        OTHER = "other", "Other"

    id = models.AutoField(primary_key=True)
    contract = models.ForeignKey(
        Contract, on_delete=models.CASCADE, related_name="versions"
    )
    version_number = models.PositiveIntegerField(default=1)
    s3_key = models.CharField(max_length=512, blank=True, null=True)
    file_path = models.CharField(max_length=512, blank=True, null=True)
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(
        max_length=20, choices=FileType.choices, default=FileType.PDF
    )
    processing_status = models.CharField(
        max_length=20,
        choices=ProcessingStatus.choices,
        default=ProcessingStatus.PENDING,
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "contract_versions"
        verbose_name = "Contract Version"
        verbose_name_plural = "Contract Versions"
        ordering = ["version_number"]
        unique_together = ["contract", "version_number"]

    def __str__(self):
        return f"{self.contract.title} v{self.version_number}"


class Clause(models.Model):
    """Model representing a clause extracted from a contract version."""

    id = models.AutoField(primary_key=True)
    contract_version = models.ForeignKey(
        ContractVersion, on_delete=models.CASCADE, related_name="clauses"
    )
    clause_type = models.CharField(max_length=100)
    text = models.TextField()
    page_number = models.PositiveIntegerField(blank=True, null=True)
    similarity_score = models.FloatField(default=0)
    playbook_match = models.BooleanField(default=False)
    deviation_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "clauses"
        verbose_name = "Clause"
        verbose_name_plural = "Clauses"

    def __str__(self):
        return f"{self.contract_version.contract.title} - {self.clause_type}"


class ExtractedField(models.Model):
    """Model representing structured information extracted from a contract."""

    class FieldType(models.TextChoices):
        PARTIES = "parties", "Parties"
        EFFECTIVE_DATE = "effective_date", "Effective Date"
        EXPIRY_DATE = "expiry_date", "Expiry Date"
        PAYMENT_TERMS = "payment_terms", "Payment Terms"
        TERMINATION = "termination", "Termination"
        LIABILITY_CAP = "liability_cap", "Liability Cap"
        RENEWAL_WINDOW = "renewal_window", "Renewal Window"
        NOTICE_PERIOD = "notice_period", "Notice Period"
        OBLIGATION = "obligation", "Obligation"

    class ConfidenceLevel(models.TextChoices):
        HIGH = "high", "High"
        MEDIUM = "medium", "Medium"
        LOW = "low", "Low"

    class ReviewStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    id = models.AutoField(primary_key=True)
    contract_version = models.ForeignKey(
        ContractVersion, on_delete=models.CASCADE, related_name="extracted_fields"
    )
    field_type = models.CharField(max_length=100, choices=FieldType.choices)
    value = models.TextField()
    confidence_score = models.FloatField(default=0)
    confidence_level = models.CharField(
        max_length=10, choices=ConfidenceLevel.choices, default=ConfidenceLevel.HIGH
    )
    source_page = models.PositiveIntegerField(blank=True, null=True)
    source_text = models.TextField(blank=True)
    review_status = models.CharField(
        max_length=20, choices=ReviewStatus.choices, default=ReviewStatus.PENDING
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    reviewed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "extracted_fields"
        verbose_name = "Extracted Field"
        verbose_name_plural = "Extracted Fields"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.contract_version.contract.title} - {self.field_type}"


class Obligation(models.Model):
    """Model representing an important contract event."""

    class Status(models.TextChoices):
        UPCOMING = "upcoming", "Upcoming"
        PASSED = "passed", "Passed"
        COMPLETED = "completed", "Completed"
        OVERDUE = "overdue", "Overdue"

    class Type(models.TextChoices):
        EXPIRY = "expiry", "Expiry"
        RENEWAL = "renewal", "Renewal"
        PAYMENT = "payment", "Payment"
        TERMINATION = "termination", "Termination"
        NOTICE = "notice", "Notice"

    id = models.AutoField(primary_key=True)
    contract = models.ForeignKey(
        Contract, on_delete=models.CASCADE, related_name="obligations"
    )
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.PAYMENT)
    description = models.TextField()
    due_date = models.DateField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.UPCOMING
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="assigned_obligations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "obligations"
        ordering = ["due_date"]

    def __str__(self):
        return f"{self.contract.title} - {self.type} - {self.due_date}"