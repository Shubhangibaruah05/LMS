import { t } from '@lingui/macro';
import { useCallback, useMemo, useState } from 'react';

import { AddItemButton } from '../../components/buttons/AddItemButton';
import { ApiFormFieldSet } from '../../components/forms/fields/ApiFormField';
import { ApiEndpoints } from '../../enums/ApiEndpoints';
import { UserRoles } from '../../enums/Roles';
import {
  useCreateApiFormModal,
  useDeleteApiFormModal,
  useEditApiFormModal
} from '../../hooks/UseForm';
import { useTable } from '../../hooks/UseTable';
import { apiUrl } from '../../states/ApiState';
import { useUserState } from '../../states/UserState';
import { TableColumn } from '../Column';
import { InvenTreeTable } from '../InvenTreeTable';
import { RowDeleteAction, RowEditAction } from '../RowActions';

export function ContactTable({
  companyId,
  params
}: {
  companyId: number;
  params?: any;
}) {
  const user = useUserState();

  const table = useTable('contact');

  const columns: TableColumn[] = useMemo(() => {
    return [
      {
        accessor: 'name',
        sortable: true,
        switchable: false
      },
      {
        accessor: 'phone',
        switchable: true,
        sortable: false
      },
      {
        accessor: 'email',
        switchable: true,
        sortable: false
      },
      {
        accessor: 'role',
        switchable: true,
        sortable: false
      }
    ];
  }, []);

  const contactFields: ApiFormFieldSet = useMemo(() => {
    return {
      company: {},
      name: {},
      phone: {},
      email: {},
      role: {}
    };
  }, []);

  const [selectedContact, setSelectedContact] = useState<number | undefined>(
    undefined
  );

  const editContact = useEditApiFormModal({
    url: ApiEndpoints.contact_list,
    pk: selectedContact,
    title: t`Edit Contact`,
    fields: contactFields,
    onFormSuccess: table.refreshTable
  });

  const newContact = useCreateApiFormModal({
    url: ApiEndpoints.contact_list,
    title: t`Add Contact`,
    initialData: {
      company: companyId
    },
    fields: contactFields,
    onFormSuccess: table.refreshTable
  });

  const deleteContact = useDeleteApiFormModal({
    url: ApiEndpoints.contact_list,
    pk: selectedContact,
    title: t`Delete Contact`,
    onFormSuccess: table.refreshTable
  });

  const rowActions = useCallback(
    (record: any) => {
      let can_edit =
        user.hasChangeRole(UserRoles.purchase_order) ||
        user.hasChangeRole(UserRoles.sales_order);
      let can_delete =
        user.hasDeleteRole(UserRoles.purchase_order) ||
        user.hasDeleteRole(UserRoles.sales_order);

      return [
        RowEditAction({
          hidden: !can_edit,
          onClick: () => {
            setSelectedContact(record.pk);
            editContact.open();
          }
        }),
        RowDeleteAction({
          hidden: !can_delete,
          onClick: () => {
            setSelectedContact(record.pk);
            deleteContact.open();
          }
        })
      ];
    },
    [user]
  );

  const tableActions = useMemo(() => {
    let can_add =
      user.hasAddRole(UserRoles.purchase_order) ||
      user.hasAddRole(UserRoles.sales_order);

    return [
      <AddItemButton
        tooltip={t`Add contact`}
        onClick={() => newContact.open()}
        disabled={!can_add}
      />
    ];
  }, [user]);

  return (
    <>
      {newContact.modal}
      {editContact.modal}
      {deleteContact.modal}
      <InvenTreeTable
        url={apiUrl(ApiEndpoints.contact_list)}
        tableState={table}
        columns={columns}
        props={{
          rowActions: rowActions,
          tableActions: tableActions,
          params: {
            ...params,
            company: companyId
          }
        }}
      />
    </>
  );
}
