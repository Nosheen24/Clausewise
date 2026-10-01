from rest_framework import serializers
from .models import ReviewItem
class ReviewItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewItem
        fields = "__all__"
        read_only_fields = ("id", "created_at", "reviewed_at")