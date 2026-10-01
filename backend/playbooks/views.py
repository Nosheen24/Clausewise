"""
Views for playbook endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Playbook, PlaybookRule
from .serializers import PlaybookSerializer, PlaybookRuleSerializer


class PlaybookViewSet(viewsets.ModelViewSet):
    """ViewSet for playbooks."""

    serializer_class = PlaybookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return playbooks."""
        return Playbook.objects.all()

    @action(detail=True, methods=["post"], url_path="rules")
    def add_rule(self, request, pk=None):
        """Add a rule to a playbook."""
        playbook = self.get_object()
        serializer = PlaybookRuleSerializer(
            data={**request.data, "playbook": playbook.id}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"], url_path="rules")
    def list_rules(self, request, pk=None):
        """List rules for a playbook."""
        playbook = self.get_object()
        rules = playbook.rules.all()
        return Response(PlaybookRuleSerializer(rules, many=True).data)


class PlaybookRuleViewSet(viewsets.ModelViewSet):
    """ViewSet for playbook rules."""

    serializer_class = PlaybookRuleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return playbook rules."""
        return PlaybookRule.objects.all()