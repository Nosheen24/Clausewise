from django.db import models
from authentication.models import CustomUser

class Playbook(models.Model):
    id = models.AutoField(primary_key=True)
    organization_id = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = "playbooks"
    def __str__(self):
        return self.name

class PlaybookRule(models.Model):
    class Severity(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
    id = models.AutoField(primary_key=True)
    playbook = models.ForeignKey(Playbook, on_delete=models.CASCADE, related_name="rules")
    clause_type = models.CharField(max_length=100)
    preferred_position = models.TextField()
    severity = models.CharField(max_length=10, choices=Severity.choices, default=Severity.MEDIUM)
    embedding = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = "playbook_rules"
    def __str__(self):
        return f"{self.playbook.name} - {self.clause_type}"