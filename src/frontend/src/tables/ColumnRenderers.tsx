/**
 * Common rendering functions for table column data.
 */
import { t } from '@lingui/macro';
import { Anchor, Skeleton, Text } from '@mantine/core';

import { YesNoButton } from '../components/buttons/YesNoButton';
import { Thumbnail } from '../components/images/Thumbnail';
import { ProgressBar } from '../components/items/ProgressBar';
import { TableStatusRenderer } from '../components/render/StatusRenderer';
import { RenderOwner } from '../components/render/User';
import { formatCurrency, formatDate } from '../defaults/formatters';
import { ModelType } from '../enums/ModelType';
import { resolveItem } from '../functions/conversion';
import { cancelEvent } from '../functions/events';
import { TableColumn, TableColumnProps } from './Column';
import { ProjectCodeHoverCard } from './TableHoverCard';

// Render a Part instance within a table
export function PartColumn(part: any, full_name?: boolean) {
  return part ? (
    <Thumbnail
      src={part?.thumbnail ?? part?.image}
      text={full_name ? part?.full_name : part?.name}
    />
  ) : (
    <Skeleton />
  );
}

export function LocationColumn(props: TableColumnProps): TableColumn {
  return {
    accessor: 'location',
    title: t`Location`,
    sortable: true,
    ordering: 'location',
    render: (record: any) => {
      let location = resolveItem(record, props.accessor ?? '');

      if (!location) {
        return (
          <Text style={{ fontStyle: 'italic' }}>{t`No location set`}</Text>
        );
      }

      return <Text>{location.name}</Text>;
    },
    ...props
  };
}

export function BooleanColumn(props: TableColumn): TableColumn {
  return {
    sortable: true,
    switchable: true,
    render: (record: any) => (
      <YesNoButton value={resolveItem(record, props.accessor ?? '')} />
    ),
    ...props
  };
}

export function DescriptionColumn(props: TableColumnProps): TableColumn {
  return {
    accessor: 'description',
    title: t`Description`,
    sortable: false,
    switchable: true,
    ...props
  };
}

export function LinkColumn(props: TableColumnProps): TableColumn {
  return {
    accessor: 'link',
    sortable: false,
    render: (record: any) => {
      let url = resolveItem(record, props.accessor ?? 'link');

      if (!url) {
        return '-';
      }

      return (
        <Anchor
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={(event: any) => {
            cancelEvent(event);

            window.open(url, '_blank', 'noopener,noreferrer');
          }}
        >
          {url}
        </Anchor>
      );
    },
    ...props
  };
}

export function ReferenceColumn(props: TableColumnProps): TableColumn {
  return {
    accessor: 'reference',
    title: t`Reference`,
    sortable: true,
    switchable: true,
    ...props
  };
}

export function NoteColumn(props: TableColumnProps): TableColumn {
  return {
    accessor: 'note',
    sortable: false,
    title: t`Note`,
    render: (record: any) => record.note ?? record.notes,
    ...props
  };
}

export function LineItemsProgressColumn(): TableColumn {
  return {
    accessor: 'line_items',
    sortable: true,
    render: (record: any) => (
      <ProgressBar
        progressLabel={true}
        value={record.completed_lines}
        maximum={record.line_items}
      />
    )
  };
}

export function ProjectCodeColumn(props: TableColumnProps): TableColumn {
  return {
    accessor: 'project_code',
    sortable: true,
    render: (record: any) => (
      <ProjectCodeHoverCard projectCode={record.project_code_detail} />
    ),
    ...props
  };
}

export function StatusColumn({
  model,
  sortable,
  accessor
}: {
  model: ModelType;
  sortable?: boolean;
  accessor?: string;
}) {
  return {
    accessor: accessor ?? 'status',
    sortable: sortable ?? true,
    render: TableStatusRenderer(model)
  };
}

export function ResponsibleColumn(props: TableColumnProps): TableColumn {
  return {
    accessor: 'responsible',
    sortable: true,
    switchable: true,
    render: (record: any) =>
      record.responsible &&
      RenderOwner({ instance: record.responsible_detail }),
    ...props
  };
}

export function DateColumn(props: TableColumnProps): TableColumn {
  return {
    accessor: 'date',
    sortable: true,
    title: t`Date`,
    switchable: true,
    render: (record: any) =>
      formatDate(resolveItem(record, props.accessor ?? 'date')),
    ...props
  };
}

export function TargetDateColumn(props: TableColumnProps): TableColumn {
  return DateColumn({
    accessor: 'target_date',
    title: t`Target Date`,
    ...props
  });
}

export function CreationDateColumn(props: TableColumnProps): TableColumn {
  return DateColumn({
    accessor: 'creation_date',
    title: t`Creation Date`,
    ...props
  });
}

export function ShipmentDateColumn(props: TableColumnProps): TableColumn {
  return DateColumn({
    accessor: 'shipment_date',
    title: t`Shipment Date`,
    ...props
  });
}

export function CurrencyColumn({
  accessor,
  title,
  currency,
  currency_accessor,
  sortable
}: {
  accessor: string;
  title?: string;
  currency?: string;
  currency_accessor?: string;
  sortable?: boolean;
}): TableColumn {
  return {
    accessor: accessor,
    title: title ?? t`Currency`,
    sortable: sortable ?? true,
    render: (record: any) => {
      let currency_key = currency_accessor ?? `${accessor}_currency`;
      return formatCurrency(resolveItem(record, accessor), {
        currency: currency ?? resolveItem(record, currency_key)
      });
    }
  };
}

export function TotalPriceColumn(): TableColumn {
  return CurrencyColumn({
    accessor: 'total_price',
    title: t`Total Price`
  });
}
