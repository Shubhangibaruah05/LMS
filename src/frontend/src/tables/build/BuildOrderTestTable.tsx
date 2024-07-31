import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { api } from '../../App';
import { ApiEndpoints } from '../../enums/ApiEndpoints';
import { useTable } from '../../hooks/UseTable';
import { apiUrl } from '../../states/ApiState';
import { useUserState } from '../../states/UserState';
import { TableColumn } from '../Column';
import { TableFilter } from '../Filter';
import { InvenTreeTable } from '../InvenTreeTable';

/**
 * A table which displays all "test results" for the outputs generated by a build order.
 */
export default function BuildOrderTestTable({
  buildId,
  partId
}: {
  buildId: number;
  partId: number;
}) {
  const table = useTable('build-tests');
  const user = useUserState();

  // Fetch the test templates required for this build order
  const { data: testTemplates } = useQuery({
    queryKey: ['build-test-templates', partId, buildId],
    queryFn: async () => {
      if (!partId) {
        return [];
      }

      return await api
        .get(apiUrl(ApiEndpoints.part_test_template_list), {
          params: {
            part: partId,
            include_inherited: true,
            enabled: true,
            required: true
          }
        })
        .then((res) => res.data)
        .catch((err) => []);
    }
  });

  // Reload the table data whenever the set of templates changes
  useEffect(() => {
    table.refreshTable();
  }, [testTemplates]);

  const tableColumns: TableColumn[] = useMemo(() => {
    let columns: TableColumn[] = [
      {
        accessor: 'stock',
        title: t`Output`,
        render: (record: any) => record.serial || record.quantity // TODO: fix this
      }
    ];

    return columns;
  }, [testTemplates]);

  const tableFilters: TableFilter[] = useMemo(() => {
    return [
      {
        name: 'is_building',
        label: t`In Production`,
        description: t`Show build outputs currently in production`
      }
    ];
  }, []);

  const tableActions = useMemo(() => {
    return [];
  }, []);

  const rowActions = useCallback(
    (record: any) => {
      return [];
    },
    [user]
  );

  return (
    <>
      <InvenTreeTable
        url={apiUrl(ApiEndpoints.stock_item_list)}
        tableState={table}
        columns={tableColumns}
        props={{
          params: {
            part_detail: true,
            test_results: true,
            build: buildId
          },
          rowActions: rowActions,
          tableFilters: tableFilters,
          tableActions: tableActions
        }}
      />
    </>
  );
}
