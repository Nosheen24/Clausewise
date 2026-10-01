"""
Serializers for authentication endpoints.
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ("email", "name", "password", "password_confirm", "role", "organization_id")
        extra_kwargs = {
            "email": {"required": True},
            "name": {"required": True},
        }

    def validate(self, attrs):
        """Validate password confirmation matches."""
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        """Create a new user with hashed password."""
        validated_data.pop("password_confirm")
        user = CustomUser.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""

    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        """Validate email and password."""
        from django.contrib.auth import authenticate

        email = attrs.get("email")
        password = attrs.get("password")
        if email and password:
            user = authenticate(
                request=self.context.get("request"), email=email, password=password
            )
            if not user:
                raise serializers.ValidationError(
                    {"error": "Invalid credentials."}, code="authentication"
                )
            if not user.is_active:
                raise serializers.ValidationError(
                    {"error": "User account is disabled."}, code="authentication"
                )
            attrs["user"] = user
        else:
            raise serializers.ValidationError(
                {"error": "Must include 'email' and 'password'."}, code="authorization"
            )
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data."""

    class Meta:
        model = CustomUser
        fields = ("id", "email", "name", "role", "organization_id", "created_at", "updated_at")
        read_only_fields = ("id", "email", "created_at", "updated_at")


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""

    class Meta:
        model = CustomUser
        fields = ("name", "role", "organization_id")
        read_only_fields = ("id", "email", "created_at", "updated_at")