import { t } from '@lingui/macro';
import {
  Container,
  Flex,
  FocusTrap,
  Group,
  Modal,
  NumberInput,
  Table,
  TextInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAddressBook,
  IconCalendar,
  IconCoins,
  IconCurrencyDollar,
  IconHash,
  IconLink,
  IconList,
  IconNotes,
  IconSitemap,
  IconUser,
  IconUsers
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { api } from '../App';
import { ActionButton } from '../components/buttons/ActionButton';
import RemoveRowButton from '../components/buttons/RemoveRowButton';
import { StandaloneField } from '../components/forms/StandaloneField';
import {
  ApiFormAdjustFilterType,
  ApiFormFieldSet
} from '../components/forms/fields/ApiFormField';
import { TableFieldExtraRow } from '../components/forms/fields/TableField';
import { Thumbnail } from '../components/images/Thumbnail';
import { ProgressBar } from '../components/items/ProgressBar';
import { StylishText } from '../components/items/StylishText';
import { ApiEndpoints } from '../enums/ApiEndpoints';
import { ModelType } from '../enums/ModelType';
import { InvenTreeIcon } from '../functions/icons';
import { useCreateApiFormModal } from '../hooks/UseForm';
import {
  useBatchCodeGenerator,
  useSerialNumberGenerator
} from '../hooks/UseGenerator';
import { apiUrl } from '../states/ApiState';

/*
 * Construct a set of fields for creating / editing a PurchaseOrderLineItem instance
 */
export function usePurchaseOrderLineItemFields({
  supplierId,
  orderId,
  create
}: {
  supplierId?: number;
  orderId?: number;
  create?: boolean;
}) {
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [autoPricing, setAutoPricing] = useState(true);

  useEffect(() => {
    if (autoPricing) {
      setPurchasePrice('');
    }
  }, [autoPricing]);

  useEffect(() => {
    setAutoPricing(purchasePrice === '');
  }, [purchasePrice]);

  const fields = useMemo(() => {
    const fields: ApiFormFieldSet = {
      order: {
        filters: {
          supplier_detail: true
        },
        disabled: true
      },
      part: {
        filters: {
          part_detail: true,
          supplier_detail: true,
          active: true,
          part_active: true
        },
        adjustFilters: (adjust: ApiFormAdjustFilterType) => {
          return {
            ...adjust.filters,
            supplier: supplierId
          };
        }
      },
      quantity: {},
      reference: {},
      purchase_price: {
        icon: <IconCurrencyDollar />,
        value: purchasePrice,
        onValueChange: setPurchasePrice
      },
      purchase_price_currency: {
        icon: <IconCoins />
      },
      auto_pricing: {
        value: autoPricing,
        onValueChange: setAutoPricing
      },
      target_date: {
        icon: <IconCalendar />
      },
      destination: {
        icon: <IconSitemap />
      },
      notes: {
        icon: <IconNotes />
      },
      link: {
        icon: <IconLink />
      }
    };

    if (create) {
      fields['merge_items'] = {};
    }

    return fields;
  }, [create, orderId, supplierId, autoPricing, purchasePrice]);

  return fields;
}

/**
 * Construct a set of fields for creating / editing a PurchaseOrder instance
 */
export function usePurchaseOrderFields(): ApiFormFieldSet {
  return useMemo(() => {
    return {
      reference: {
        icon: <IconHash />
      },
      description: {},
      supplier: {
        filters: {
          is_supplier: true,
          active: true
        }
      },
      supplier_reference: {},
      project_code: {
        icon: <IconList />
      },
      order_currency: {
        icon: <IconCoins />
      },
      target_date: {
        icon: <IconCalendar />
      },
      link: {},
      contact: {
        icon: <IconUser />,
        adjustFilters: (value: ApiFormAdjustFilterType) => {
          return {
            ...value.filters,
            company: value.data.supplier
          };
        }
      },
      address: {
        icon: <IconAddressBook />,
        adjustFilters: (value: ApiFormAdjustFilterType) => {
          return {
            ...value.filters,
            company: value.data.supplier
          };
        }
      },
      responsible: {
        filters: {
          is_active: true
        },
        icon: <IconUsers />
      }
    };
  }, []);
}

/**
 * Render a table row for a single TableField entry
 */
function LineItemFormRow({
  input,
  record,
  statuses
}: {
  input: any;
  record: any;
  statuses: any;
}) {
  // Barcode Modal state
  const [opened, { open, close }] = useDisclosure(false);

  // Location value
  const [location, setLocation] = useState(
    input.item.location ??
      record.part_detail.default_location ??
      record.part_detail.category_default_location
  );
  const [locationOpen, locationHandlers] = useDisclosure(
    location ? true : false,
    {
      onClose: () => input.changeFn(input.idx, 'location', null),
      onOpen: () => input.changeFn(input.idx, 'location', location)
    }
  );

  // Change form value when state is altered
  useEffect(() => {
    input.changeFn(input.idx, 'location', location);
  }, [location]);

  const batchCodeGenerator = useBatchCodeGenerator((value: any) => {
    if (!batchCode) {
      setBatchCode(value);
    }
  });

  const serialNumberGenerator = useSerialNumberGenerator((value: any) => {
    if (!serials) {
      setSerials(value);
    }
  });

  const [packagingOpen, packagingHandlers] = useDisclosure(false, {
    onClose: () => {
      input.changeFn(input.idx, 'packaging', undefined);
    }
  });

  const [noteOpen, noteHandlers] = useDisclosure(false, {
    onClose: () => {
      input.changeFn(input.idx, 'note', undefined);
    }
  });

  // State for serializing
  const [batchCode, setBatchCode] = useState<string>('');
  const [serials, setSerials] = useState<string>('');
  const [batchOpen, batchHandlers] = useDisclosure(false, {
    onClose: () => {
      input.changeFn(input.idx, 'batch_code', undefined);
      input.changeFn(input.idx, 'serial_numbers', '');
    },
    onOpen: () => {
      // Generate a new batch code
      batchCodeGenerator.update({
        part: record?.supplier_part_detail?.part,
        order: record?.order
      });
      // Generate new serial numbers
      serialNumberGenerator.update({
        part: record?.supplier_part_detail?.part,
        quantity: input.item.quantity
      });
    }
  });

  // Status value
  const [statusOpen, statusHandlers] = useDisclosure(false, {
    onClose: () => input.changeFn(input.idx, 'status', 10)
  });

  // Barcode value
  const [barcodeInput, setBarcodeInput] = useState<any>('');
  const [barcode, setBarcode] = useState(null);

  // Change form value when state is altered
  useEffect(() => {
    input.changeFn(input.idx, 'barcode', barcode);
  }, [barcode]);

  // Update location field description on state change
  useEffect(() => {
    if (!opened) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setBarcode(barcodeInput.length ? barcodeInput : null);
      close();
      setBarcodeInput('');
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [barcodeInput]);

  // Info string with details about certain selected locations
  const locationDescription = useMemo(() => {
    let text = t`Choose Location`;

    if (location === null) {
      return text;
    }

    // Selected location is order line destination
    if (location === record.destination) {
      return t`Item Destination selected`;
    }

    // Selected location is base part's category default location
    if (
      !record.destination &&
      !record.destination_detail &&
      location === record.part_detail.category_default_location
    ) {
      return t`Part category default location selected`;
    }

    // Selected location is identical to already received stock for this line
    if (
      !record.destination &&
      record.destination_detail &&
      location === record.destination_detail.pk &&
      record.received > 0
    ) {
      return t`Received stock location selected`;
    }

    // Selected location is base part's default location
    if (location === record.part_detail.default_location) {
      return t`Default location selected`;
    }

    return text;
  }, [location]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={<StylishText children={t`Scan Barcode`} />}
      >
        <FocusTrap>
          <TextInput
            label="Barcode data"
            data-autofocus
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
          />
        </FocusTrap>
      </Modal>
      <Table.Tr>
        <Table.Td>
          <Flex gap="sm" align="center">
            <Thumbnail
              size={40}
              src={record.part_detail.thumbnail}
              align="center"
            />
            <div>{record.part_detail.name}</div>
          </Flex>
        </Table.Td>
        <Table.Td>{record.supplier_part_detail.SKU}</Table.Td>
        <Table.Td>
          <ProgressBar
            value={record.received}
            maximum={record.quantity}
            progressLabel
          />
        </Table.Td>
        <Table.Td style={{ width: '1%', whiteSpace: 'nowrap' }}>
          <NumberInput
            value={input.item.quantity}
            style={{ width: '100px' }}
            max={input.item.quantity}
            min={0}
            onChange={(value) => input.changeFn(input.idx, 'quantity', value)}
          />
        </Table.Td>
        <Table.Td style={{ width: '1%', whiteSpace: 'nowrap' }}>
          <Flex gap="1px">
            <ActionButton
              size="sm"
              onClick={() => locationHandlers.toggle()}
              icon={<InvenTreeIcon icon="location" />}
              tooltip={t`Set Location`}
              tooltipAlignment="top"
              variant={locationOpen ? 'filled' : 'transparent'}
            />
            <ActionButton
              size="sm"
              onClick={() => batchHandlers.toggle()}
              icon={<InvenTreeIcon icon="batch_code" />}
              tooltip={t`Assign Batch Code${
                record.trackable && ' and Serial Numbers'
              }`}
              tooltipAlignment="top"
              variant={batchOpen ? 'filled' : 'transparent'}
            />
            <ActionButton
              size="sm"
              icon={<InvenTreeIcon icon="packaging" />}
              tooltip={t`Adjust Packaging`}
              onClick={() => packagingHandlers.toggle()}
              variant={packagingOpen ? 'filled' : 'transparent'}
            />
            <ActionButton
              onClick={() => statusHandlers.toggle()}
              icon={<InvenTreeIcon icon="status" />}
              tooltip={t`Change Status`}
              tooltipAlignment="top"
              variant={statusOpen ? 'filled' : 'transparent'}
            />
            <ActionButton
              icon={<InvenTreeIcon icon="note" />}
              tooltip={t`Add Note`}
              tooltipAlignment="top"
              variant={noteOpen ? 'filled' : 'transparent'}
              onClick={() => noteHandlers.toggle()}
            />
            {barcode ? (
              <ActionButton
                icon={<InvenTreeIcon icon="unlink" />}
                tooltip={t`Unlink Barcode`}
                tooltipAlignment="top"
                variant="filled"
                color="red"
                onClick={() => setBarcode(null)}
              />
            ) : (
              <ActionButton
                icon={<InvenTreeIcon icon="barcode" />}
                tooltip={t`Scan Barcode`}
                tooltipAlignment="top"
                variant="transparent"
                onClick={() => open()}
              />
            )}
            <RemoveRowButton onClick={() => input.removeFn(input.idx)} />
          </Flex>
        </Table.Td>
      </Table.Tr>
      {locationOpen && (
        <Table.Tr>
          <Table.Td colSpan={10}>
            <Group grow preventGrowOverflow={false} justify="flex-apart" p="xs">
              <Container flex={0} p="xs">
                <InvenTreeIcon icon="downright" />
              </Container>
              <StandaloneField
                fieldDefinition={{
                  field_type: 'related field',
                  model: ModelType.stocklocation,
                  api_url: apiUrl(ApiEndpoints.stock_location_list),
                  filters: {
                    structural: false
                  },
                  onValueChange: (value) => {
                    setLocation(value);
                  },
                  description: locationDescription,
                  value: location,
                  label: t`Location`,
                  icon: <InvenTreeIcon icon="location" />
                }}
                defaultValue={
                  record.destination ??
                  (record.destination_detail
                    ? record.destination_detail.pk
                    : null)
                }
              />
              <Flex style={{ marginBottom: '7px' }}>
                {(record.part_detail.default_location ||
                  record.part_detail.category_default_location) && (
                  <ActionButton
                    icon={<InvenTreeIcon icon="default_location" />}
                    tooltip={t`Store at default location`}
                    onClick={() =>
                      setLocation(
                        record.part_detail.default_location ??
                          record.part_detail.category_default_location
                      )
                    }
                    tooltipAlignment="top"
                  />
                )}
                {record.destination && (
                  <ActionButton
                    icon={<InvenTreeIcon icon="destination" />}
                    tooltip={t`Store at line item destination `}
                    onClick={() => setLocation(record.destination)}
                    tooltipAlignment="top"
                  />
                )}
                {!record.destination &&
                  record.destination_detail &&
                  record.received > 0 && (
                    <ActionButton
                      icon={<InvenTreeIcon icon="repeat_destination" />}
                      tooltip={t`Store with already received stock`}
                      onClick={() => setLocation(record.destination_detail.pk)}
                      tooltipAlignment="top"
                    />
                  )}
              </Flex>
            </Group>
          </Table.Td>
        </Table.Tr>
      )}
      <TableFieldExtraRow
        visible={batchOpen}
        onValueChange={(value) => input.changeFn(input.idx, 'batch', value)}
        fieldDefinition={{
          field_type: 'string',
          label: t`Batch Code`,
          value: batchCode
        }}
      />
      <TableFieldExtraRow
        visible={batchOpen && record.trackable}
        onValueChange={(value) =>
          input.changeFn(input.idx, 'serial_numbers', value)
        }
        fieldDefinition={{
          field_type: 'string',
          label: t`Serial numbers`,
          value: serials
        }}
      />
      <TableFieldExtraRow
        visible={packagingOpen}
        onValueChange={(value) => input.changeFn(input.idx, 'packaging', value)}
        fieldDefinition={{
          field_type: 'string',
          label: t`Packaging`
        }}
        defaultValue={record?.supplier_part_detail?.packaging}
      />
      <TableFieldExtraRow
        visible={statusOpen}
        defaultValue={10}
        onValueChange={(value) => input.changeFn(input.idx, 'status', value)}
        fieldDefinition={{
          field_type: 'choice',
          api_url: apiUrl(ApiEndpoints.stock_status),
          choices: statuses,
          label: t`Status`
        }}
      />
      <TableFieldExtraRow
        visible={noteOpen}
        onValueChange={(value) => input.changeFn(input.idx, 'note', value)}
        fieldDefinition={{
          field_type: 'string',
          label: t`Note`
        }}
      />
    </>
  );
}

type LineFormHandlers = {
  onOpen?: () => void;
  onClose?: () => void;
};

type LineItemsForm = {
  items: any[];
  orderPk: number;
  formProps?: LineFormHandlers;
};

export function useReceiveLineItems(props: LineItemsForm) {
  const { data } = useQuery({
    queryKey: ['stock', 'status'],
    queryFn: async () => {
      return api.get(apiUrl(ApiEndpoints.stock_status)).then((response) => {
        if (response.status === 200) {
          const entries = Object.values(response.data.values);
          const mapped = entries.map((item: any) => {
            return {
              value: item.key,
              display_name: item.label
            };
          });
          return mapped;
        }
      });
    }
  });

  const records = Object.fromEntries(
    props.items.map((item) => [item.pk, item])
  );

  const filteredItems = props.items.filter(
    (elem) => elem.quantity !== elem.received
  );

  const fields: ApiFormFieldSet = {
    id: {
      value: props.orderPk,
      hidden: true
    },
    items: {
      field_type: 'table',
      value: filteredItems.map((elem, idx) => {
        return {
          line_item: elem.pk,
          location: elem.destination ?? elem.destination_detail?.pk ?? null,
          quantity: elem.quantity - elem.received,
          batch_code: '',
          serial_numbers: '',
          status: 10,
          barcode: null
        };
      }),
      modelRenderer: (instance) => {
        const record = records[instance.item.line_item];

        return (
          <LineItemFormRow
            input={instance}
            record={record}
            statuses={data}
            key={record.pk}
          />
        );
      },
      headers: [t`Part`, t`SKU`, t`Received`, t`Quantity`, t`Actions`]
    },
    location: {
      filters: {
        structural: false
      }
    }
  };

  const url = apiUrl(ApiEndpoints.purchase_order_receive, null, {
    id: props.orderPk
  });

  return useCreateApiFormModal({
    ...props.formProps,
    url: url,
    title: t`Receive Line Items`,
    fields: fields,
    initialData: {
      location: null
    },
    size: 'xl'
  });
}
