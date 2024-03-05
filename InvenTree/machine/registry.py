"""Machine registry."""

import logging
from typing import Union
from uuid import UUID

from machine.machine_type import BaseDriver, BaseMachineType

logger = logging.getLogger('inventree')


class MachineRegistry:
    """Machine registry class."""

    def __init__(self) -> None:
        """Initialize machine registry.

        Set up all needed references for internal and external states.
        """
        self.machine_types: dict[str, type[BaseMachineType]] = {}
        self.drivers: dict[str, type[BaseDriver]] = {}
        self.driver_instances: dict[str, BaseDriver] = {}
        self.machines: dict[str, BaseMachineType] = {}

        self.base_drivers: list[type[BaseDriver]] = []
        self.errors: list[Union[str, Exception]] = []

    def handle_error(self, error: Union[Exception, str]):
        """Helper function for capturing errors with the machine registry."""
        self.errors.append(error)

    def initialize(self):
        """Initialize the machine registry."""
        self.discover_machine_types()
        self.discover_drivers()
        self.load_machines()

    def discover_machine_types(self):
        """Discovers all machine types by inferring all classes that inherit the BaseMachineType class."""
        import InvenTree.helpers

        logger.debug('Collecting machine types')

        machine_types: dict[str, type[BaseMachineType]] = {}
        base_drivers: list[type[BaseDriver]] = []

        discovered_machine_types: set[type[BaseMachineType]] = (
            InvenTree.helpers.inheritors(BaseMachineType)
        )
        for machine_type in discovered_machine_types:
            try:
                machine_type.validate()
            except NotImplementedError as error:
                self.handle_error(error)
                continue

            if machine_type.SLUG in machine_types:
                self.handle_error(
                    ValueError(f"Cannot re-register machine type '{machine_type.SLUG}'")
                )
                continue

            machine_types[machine_type.SLUG] = machine_type
            base_drivers.append(machine_type.base_driver)

        self.machine_types = machine_types
        self.base_drivers = base_drivers

        logger.debug('Found %s machine types', len(self.machine_types.keys()))

    def discover_drivers(self):
        """Discovers all machine drivers by inferring all classes that inherit the BaseDriver class."""
        import InvenTree.helpers

        logger.debug('Collecting machine drivers')

        drivers: dict[str, type[BaseDriver]] = {}

        discovered_drivers: set[type[BaseDriver]] = InvenTree.helpers.inheritors(
            BaseDriver
        )
        for driver in discovered_drivers:
            # skip discovered drivers that define a base driver for a machine type
            if driver in self.base_drivers:
                continue

            try:
                driver.validate()
            except NotImplementedError as error:
                self.handle_error(error)
                continue

            if driver.SLUG in drivers:
                self.handle_error(
                    ValueError(f"Cannot re-register driver '{driver.SLUG}'")
                )
                continue

            drivers[driver.SLUG] = driver

        self.drivers = drivers

        logger.debug('Found %s machine drivers', len(self.drivers.keys()))

    def get_driver_instance(self, slug: str):
        """Return or create a driver instance if needed."""
        if slug not in self.driver_instances:
            driver = self.drivers.get(slug, None)
            if driver is None:
                return None

            self.driver_instances[slug] = driver()

        return self.driver_instances.get(slug, None)

    def load_machines(self):
        """Load all machines defined in the database into the machine registry."""
        # Imports need to be in this level to prevent early db model imports
        from machine.models import MachineConfig

        for machine_config in MachineConfig.objects.all():
            self.add_machine(machine_config, initialize=False)

        # initialize drivers
        for driver in self.driver_instances.values():
            driver.init_driver()

        # initialize machines after all machine instances were created
        for machine in self.machines.values():
            if machine.active:
                machine.initialize()

        logger.info('Initialized %s machines', len(self.machines.keys()))

    def add_machine(self, machine_config, initialize=True):
        """Add a machine to the machine registry."""
        machine_type = self.machine_types.get(machine_config.machine_type, None)
        if machine_type is None:
            self.handle_error(f"Machine type '{machine_config.machine_type}' not found")
            return

        machine: BaseMachineType = machine_type(machine_config)
        self.machines[str(machine.pk)] = machine

        if initialize and machine.active:
            machine.initialize()

    def update_machine(self, old_machine_state, machine_config):
        """Notify the machine about an update."""
        if machine := machine_config.machine:
            machine.update(old_machine_state)

    def restart_machine(self, machine):
        """Restart a machine."""
        machine.restart()

    def remove_machine(self, machine: BaseMachineType):
        """Remove a machine from the registry."""
        self.machines.pop(str(machine.pk), None)

    def get_machines(self, **kwargs):
        """Get loaded machines from registry (By default only initialized machines).

        Kwargs:
            name: Machine name
            machine_type: Machine type definition (class)
            driver: Machine driver (class)
            initialized (bool | None): use None to get all machines (default: True)
            active: (bool)
            base_driver: base driver (class)
        """
        allowed_fields = [
            'name',
            'machine_type',
            'driver',
            'initialized',
            'active',
            'base_driver',
        ]

        if 'initialized' not in kwargs:
            kwargs['initialized'] = True
        if kwargs['initialized'] is None:
            del kwargs['initialized']

        def filter_machine(machine: BaseMachineType):
            for key, value in kwargs.items():
                if key not in allowed_fields:
                    raise ValueError(
                        f"'{key}' is not a valid filter field for registry.get_machines."
                    )

                # check if current driver is subclass from base_driver
                if key == 'base_driver':
                    if machine.driver and not issubclass(
                        machine.driver.__class__, value
                    ):
                        return False

                # check if current machine is subclass from machine_type
                elif key == 'machine_type':
                    if issubclass(machine.__class__, value):
                        return False

                # check attributes of machine
                elif value != getattr(machine, key, None):
                    return False

            return True

        return list(filter(filter_machine, self.machines.values()))

    def get_machine(self, pk: Union[str, UUID]):
        """Get machine from registry by pk."""
        return self.machines.get(str(pk), None)

    def get_drivers(self, machine_type: str):
        """Get all drivers for a specific machine type."""
        return [
            driver
            for driver in self.driver_instances.values()
            if driver.machine_type == machine_type
        ]


registry: MachineRegistry = MachineRegistry()
