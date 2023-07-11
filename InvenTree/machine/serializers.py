from typing import List

from rest_framework import serializers

from common.serializers import GenericReferencedSettingSerializer
from InvenTree.helpers_mixin import ClassProviderMixin
from machine.models import MachineConfig, MachineSetting


class MachineConfigSerializer(serializers.ModelSerializer):
    """Serializer for a MachineConfig."""

    class Meta:
        """Meta for serializer."""
        model = MachineConfig
        fields = [
            "pk",
            "name",
            "machine_type",
            "driver",
            "initialized",
            "active",
            "status",
            "status_text",
            "machine_errors",
            "is_driver_available",
        ]

        read_only_fields = [
            "machine_type",
            "driver",
        ]

    initialized = serializers.SerializerMethodField("get_initialized")
    status = serializers.SerializerMethodField("get_status")
    status_text = serializers.SerializerMethodField("get_status_text")
    machine_errors = serializers.SerializerMethodField("get_errors")
    is_driver_available = serializers.SerializerMethodField("get_is_driver_available")

    def get_initialized(self, obj: MachineConfig) -> bool:
        if obj.machine:
            return obj.machine.initialized
        return False

    def get_status(self, obj: MachineConfig) -> int:
        if obj.machine:
            return obj.machine.status
        return -1

    def get_status_text(self, obj: MachineConfig) -> str:
        if obj.machine:
            return obj.machine.status_text
        return ""

    def get_errors(self, obj: MachineConfig) -> List[str]:
        return obj.errors

    def get_is_driver_available(self, obj: MachineConfig) -> bool:
        return obj.is_driver_available()


class MachineConfigCreateSerializer(MachineConfigSerializer):
    """Serializer for creating a MachineConfig."""

    class Meta(MachineConfigSerializer.Meta):
        """Meta for serializer."""
        read_only_fields = []


class MachineSettingSerializer(GenericReferencedSettingSerializer):
    """Serializer for the MachineSetting model."""

    MODEL = MachineSetting
    EXTRA_FIELDS = [
        "config_type",
    ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # remove unwanted fields
        unwanted_fields = ["pk", "model_name", "api_url", "typ"]
        for f in unwanted_fields:
            if f in self.Meta.fields:
                self.Meta.fields.remove(f)

        setattr(self.Meta, "read_only_fields", ["config_type"])


class BaseMachineClassSerializer(serializers.Serializer):
    """Serializer for a BaseClass."""

    class Meta:
        """Meta for a serializer."""
        fields = [
            "slug",
            "name",
            "description",
            "provider_file",
            "provider_plugin",
            "is_builtin",
        ]

        read_only_fields = fields

    slug = serializers.SlugField(source="SLUG")
    name = serializers.CharField(source="NAME")
    description = serializers.CharField(source="DESCRIPTION")
    provider_file = serializers.SerializerMethodField("get_provider_file")
    provider_plugin = serializers.SerializerMethodField("get_provider_plugin")
    is_builtin = serializers.SerializerMethodField("get_is_builtin")

    def get_provider_file(self, obj: ClassProviderMixin) -> str:
        return obj.get_provider_file()

    def get_provider_plugin(self, obj: ClassProviderMixin) -> str | None:
        plugin = obj.get_provider_plugin()
        if plugin:
            return plugin.slug
        return None

    def get_is_builtin(self, obj: ClassProviderMixin) -> bool:
        return obj.get_is_builtin()


class MachineTypeSerializer(BaseMachineClassSerializer):
    """Serializer for a BaseMachineType class."""

    class Meta(BaseMachineClassSerializer.Meta):
        """Meta for a serializer."""
        fields = [
            *BaseMachineClassSerializer.Meta.fields
        ]


class MachineDriverSerializer(BaseMachineClassSerializer):
    """Serializer for a BaseMachineDriver class."""

    class Meta(BaseMachineClassSerializer.Meta):
        """Meta for a serializer."""
        fields = [
            *BaseMachineClassSerializer.Meta.fields,
            "machine_type",
        ]

    machine_type = serializers.SlugField(read_only=True)


class MachineRegistryStatusSerializer(serializers.Serializer):
    """Serializer for machine registry status."""

    class Meta:
        fields = [
            "registry_errors",
        ]

    registry_errors = serializers.ListField(child=serializers.CharField())
