import { t } from '@lingui/macro';
import { Group, Text } from '@mantine/core';
import { useMemo } from 'react';

import { renderDate } from '../../../defaults/formatters';
import { useTableRefresh } from '../../../hooks/TableRefresh';
import { ApiPaths, apiUrl } from '../../../states/ApiState';
import { Thumbnail } from '../../images/Thumbnail';
import { InvenTreeTable } from '../InvenTreeTable';

export function SalesOrderTable({ params }: { params?: any }) {
  const { tableKey } = useTableRefresh('sales-order');

  // TODO: Custom filters

  // TODO: Row actions

  // TODO: Table actions (e.g. create new sales order)

  const tableColumns = useMemo(() => {
    return [
      {
        accessor: 'reference',
        title: t`Sales Order`,
        sortable: true,
        switchable: false
      },
      {
        accessor: 'description',
        title: t`Description`,
        switchable: true
      },
      {
        accessor: 'customer__name',
        title: t`Customer`,
        sortable: true,
        render: function (record: any) {
          let customer = record.customer_detail ?? {};

          return (
            <Group spacing="xs" noWrap={true}>
              <Thumbnail src={customer?.image} alt={customer.name} />
              <Text>{customer?.name}</Text>
            </Group>
          );
        }
      },
      {
        accessor: 'customer_reference',
        title: t`Customer Reference`,
        switchable: true
      },
      {
        accessor: 'project_code',
        title: t`Project Code`,
        switchable: true
        // TODO: Custom formatter
      },
      {
        accessor: 'status',
        title: t`Status`,
        sortable: true,
        switchable: true
        // TODO: Custom formatter
      },
      {
        accessor: 'creation_date',
        sortable: true,
        title: t`Created`,
        switchable: true,
        render: (record: any) => renderDate(record.creation_date)
      },
      {
        accessor: 'target_date',
        sortable: true,
        title: t`Target Date`,
        switchable: true,
        render: (record: any) => renderDate(record.target_date)
      },
      {
        accessor: 'shipment_date',
        sortable: true,
        title: t`Shipment Date`,
        switchable: true,
        render: (record: any) => renderDate(record.shipment_date)
      }
      // TODO: Line items
      // TODO: Total price
    ];
  }, []);

  return (
    <InvenTreeTable
      url={apiUrl(ApiPaths.sales_order_list)}
      tableKey={tableKey}
      columns={tableColumns}
      props={{
        params: {
          ...params,
          customer_detail: true
        }
      }}
    />
  );
}
