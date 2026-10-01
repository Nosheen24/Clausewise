from django.db import models

class OrganizationSettings(models.Model):
    id = models.AutoField(primary_key=True)
    organization_id = models.CharField(max_length=100, unique=True)
    confidence_threshold = models.FloatField(default=0.9)
    notification_enabled = models.BooleanField(default=True)
    notification_email = models.EmailField(blank=True, null=True)
    max_upload_size_mb = models.IntegerField(default=50)
    allowed_file_types = models.JSONField(default=list)
    retention_days = models.IntegerField(default=365)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = "organization_settings"
    def __str__(self):
        return f"Settings for {self.organization_id}"