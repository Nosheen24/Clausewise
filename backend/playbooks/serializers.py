from rest_framework import serializers
from .models import Playbook, PlaybookRule

class PlaybookRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaybookRule
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")

class PlaybookSerializer(serializers.ModelSerializer):
    rules = PlaybookRuleSerializer(many=True, read_only=True)
    class Meta:
        model = Playbook
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")