"""Plugin mixin classes for barcode plugin."""

import logging

from django.contrib.auth.models import User
from django.db.models import F
from django.utils.translation import gettext_lazy as _

from company.models import Company, ManufacturerPart, SupplierPart
from order.models import PurchaseOrder, PurchaseOrderStatus
from stock.models import StockLocation

logger = logging.getLogger('inventree')


class BarcodeMixin:
    """Mixin that enables barcode handling.

    Custom barcode plugins should use and extend this mixin as necessary.
    """

    ACTION_NAME = ""

    class MixinMeta:
        """Meta options for this mixin."""

        MIXIN_NAME = 'Barcode'

    def __init__(self):
        """Register mixin."""
        super().__init__()
        self.add_mixin('barcode', 'has_barcode', __class__)

    @property
    def has_barcode(self):
        """Does this plugin have everything needed to process a barcode."""
        return True

    def scan(self, barcode_data):
        """Scan a barcode against this plugin.

        This method is explicitly called from the /scan/ API endpoint,
        and thus it is expected that any barcode which matches this barcode will return a result.

        If this plugin finds a match against the provided barcode, it should return a dict object
        with the intended result.

        Default return value is None
        """

        return None

    def scan_receive_item(self, barcode_data, user, purchase_order=None, location=None):
        """Scan a barcode to receive a purchase order item.

        Default return value is None
        """

        return None

    @staticmethod
    def get_supplier_part(sku: str, supplier: Company = None, mpn: str = None):
        """Get a supplier part from SKU or by supplier and MPN."""
        if sku:
            supplier_parts = SupplierPart.objects.filter(SKU__iexact=sku)
            if not supplier_parts or len(supplier_parts) > 1:
                logger.warning(
                    f"Found {len(supplier_parts)} supplier parts for SKU {sku}"
                )
                return None
            return supplier_parts[0]

        if not supplier or not mpn:
            return None

        manufacturer_parts = ManufacturerPart.objects.filter(MPN__iexact=mpn)
        if not manufacturer_parts or len(manufacturer_parts) > 1:
            logger.warning(
                f"Found {len(manufacturer_parts)} manufacturer parts for MPN {mpn}"
            )
            return None
        manufacturer_part = manufacturer_parts[0]

        supplier_parts = SupplierPart.objects.filter(
            manufacturer_part=manufacturer_part.pk, supplier=supplier.pk)
        if not supplier_parts or len(supplier_parts) > 1:
            logger.warning(
                f"Found {len(supplier_parts)} supplier parts for MPN {mpn} and "
                f"supplier '{supplier.name}'"
            )
            return None
        return supplier_parts[0]

    @staticmethod
    def parse_ecia_barcode2d(barcode_data: str) -> dict[str, str]:
        """Parse a standard ECIA 2D barcode, according to https://www.ecianow.org/assets/docs/ECIA_Specifications.pdf"""

        if not (data_split := BarcodeMixin.parse_isoiec_15434_barcode2d(barcode_data)):
            return None

        barcode_fields = {}
        for entry in data_split:
            for identifier, field_name in ECIA_DATA_IDENTIFIER_MAP.items():
                if entry.startswith(identifier):
                    barcode_fields[field_name] = entry[len(identifier):]
                    break

        return barcode_fields

    @staticmethod
    def parse_isoiec_15434_barcode2d(barcode_data: str) -> list[str]:
        """Parse a ISO/IEC 15434 bardode, returning the split data section."""
        HEADER = "[)>\x1E06\x1D"
        TRAILER = "\x1E\x04"

        # some old mouser barcodes start with this messed up header
        OLD_MOUSER_HEADER = ">[)>06\x1D"
        if barcode_data.startswith(OLD_MOUSER_HEADER):
            barcode_data = barcode_data.replace(OLD_MOUSER_HEADER, HEADER, 1)

        # most barcodes don't include the trailer, because "why would you stick to
        # the standard, right?" so we only check for the header here
        if not barcode_data.startswith(HEADER):
            return

        actual_data = barcode_data.split(HEADER, 1)[1].rsplit(TRAILER, 1)[0]

        return actual_data.split("\x1D")

    @staticmethod
    def receive_purchase_order_item(
            supplier_part: SupplierPart,
            user: User,
            quantity: int | str = None,
            order_number: str = None,
            purchase_order: PurchaseOrder = None,
            location: StockLocation = None,
            barcode: str = None,
    ) -> dict:
        """Try to receive a purchase order item.

        Returns a dict object containing:
            - on success: a "success" message
            - on partial success: the "lineitem" with quantity and location (both can be None)
            - on failure: an "error" message
        """

        if not purchase_order:
            # try to find a purchase order with either reference or name matching
            # the provided order_number
            if not order_number:
                return {"error": _("Supplier barcode doesn't contain order number")}

            purchase_orders = (
                PurchaseOrder.objects.filter(
                    supplier_reference__iexact=order_number,
                    status=PurchaseOrderStatus.PLACED.value,
                ) | PurchaseOrder.objects.filter(
                    reference__iexact=order_number,
                    status=PurchaseOrderStatus.PLACED.value,
                )
            )

            if len(purchase_orders) == 0:
                return {"error": _(f"Failed to find placed purchase order for '{order_number}'")}
            elif len(purchase_orders) > 1:
                return {"error": _(f"Found multiple placed purchase orders for '{order_number}'")}

            purchase_order = purchase_orders[0]

        #  find the first incomplete line_item that matches the supplier_part
        line_items = purchase_order.lines.filter(
            part=supplier_part.pk, quantity__gt=F("received"))
        if not line_items:
            return {"error": _("Failed to find pending line item for supplier part")}

        line_item = line_items[0]

        no_stock_locations = False
        if not location:
            # try to guess the destination were the stock_part should go
            # 1. check if it's defined on the line_item
            # 2. check if it's defined on the part
            # 3. check if there's 1 or 0 stock locations defined in InvenTree
            #    -> assume all stock is going into that location (or no location)

            if line_item.destination:
                location = line_item.destination
            elif supplier_part.part.default_location:
                location = supplier_part.part.default_location
            elif StockLocation.objects.count() <= 1:
                if stock_locations := StockLocation.objects.all():
                    location = stock_locations[0]
                else:
                    no_stock_locations = True

        response = {
            "lineitem": {
                "pk": line_item.pk,
                "purchase_order": purchase_order.pk,
            }
        }

        if quantity and type(quantity) != int:
            try:
                quantity = int(quantity)
                response["quantity"] = quantity
            except ValueError:
                logger.warning(f"Failed to parse quantity '{quantity}'")
                quantity = None

        if location:
            response["location"] = location.pk

        # if either the quantity is missing or no location is defined/found
        # -> return the line_item found, so the client can gather the missing
        #    information and complete the action with an 'api-po-receive' call
        if not quantity or (not location and not no_stock_locations):
            response["action_required"] = _("Further information required to receive line item")
            return response

        purchase_order.receive_line_item(
            line_item,
            location,
            quantity,
            user,
            barcode=barcode,
        )

        response["success"] = _("Received purchase order line item")
        return response


# Map ECIA Data Identifier to human readable identifier
# The following identifiers haven't been implemented: 3S, 4S, 5S, S
ECIA_DATA_IDENTIFIER_MAP = {
    "K":   "purchase_order_number",     # noqa: E241
    "1K":  "purchase_order_number",     # noqa: E241  DigiKey uses 1K instead of K
    "11K": "packing_list_number",       # noqa: E241
    "6D":  "ship_date",                 # noqa: E241
    "P":   "supplier_part_number",      # noqa: E241  "Customer Part Number"
    "1P":  "manufacturer_part_number",  # noqa: E241  "Supplier Part Number"
    "4K":  "purchase_order_line",       # noqa: E241
    "14K": "purchase_order_line",       # noqa: E241  Mouser uses 14K instead of 4K
    "Q":   "quantity",                  # noqa: E241
    "9D":  "date_yyww",                 # noqa: E241
    "10D": "date_yyww",                 # noqa: E241
    "1T":  "lot_code",                  # noqa: E241
    "4L":  "country_of_origin",         # noqa: E241
    "1V":  "manufacturer"               # noqa: E241
}
