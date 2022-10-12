"""Sample plugin which demonstrates custom validation functionality"""

from django.core.exceptions import ValidationError

from plugin import InvenTreePlugin
from plugin.mixins import SettingsMixin, ValidationMixin


class CustomValidationMixin(SettingsMixin, ValidationMixin, InvenTreePlugin):
    """A sample plugin class for demonstrating custom validation functions"""

    NAME = "CustomValidator"
    SLUG = "validator"
    TITLE = "Custom Validator Plugin"
    DESCRIPTION = "A sample plugin for demonstrating custom validation functionality"
    VERSION = "0.1"

    SETTINGS = {
        'ILLEGAL_PART_CHARS': {
            'name': 'Illegal Part Characters',
            'description': 'Characters which are not allowed to appear in Part names',
            'default': '!@#$%^&*()~`'
        },
        'IPN_MUST_CONTAIN_Q': {
            'name': 'IPN Q Requirement',
            'description': 'Part IPN field must contain the character Q',
            'default': False,
            'validator': bool,
        }
    }

    def validate_part_name(self, name: str):
        """Validate part name"""

        illegal_chars = self.get_setting('ILLEGAL_PART_CHARS')

        for c in illegal_chars:
            if c in name:
                raise ValidationError(f"Illegal character in part name: '{c}'")

    def validate_part_ipn(self, ipn: str):
        """Validate part IPN"""

        if self.get_setting('IPN_MUST_CONTAIN_Q') and 'Q' not in ipn:
            raise ValidationError("IPN must contain 'Q'")
