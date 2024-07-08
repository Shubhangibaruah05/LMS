import { t } from '@lingui/macro';
import { Badge } from '@mantine/core';
import { ReactNode } from 'react';

import { ModelType } from '../../enums/ModelType';
import { getDetailUrl } from '../../functions/urls';
import { InstanceRenderInterface, RenderInlineModel } from './Instance';

/**
 * Inline rendering of a single Part instance
 */
export function RenderPart(
  props: Readonly<InstanceRenderInterface>
): ReactNode {
  const { instance } = props;

  let badgeText = '';
  let badgeColor = 'green';

  if (instance.active == false) {
    badgeColor = 'red';
    badgeText = t`Inactive`;
  } else if (instance.in_stock <= 0) {
    badgeColor = 'orange';
    badgeText = t`No stock`;
  } else {
    badgeText = t`Stock` + `: ${instance.in_stock}`;
    badgeColor =
      instance.minimum_stock > instance.in_stock ? 'yellow' : 'green';
  }

  const badge = (
    <Badge size="xs" color={badgeColor}>
      {badgeText}
    </Badge>
  );

  return (
    <RenderInlineModel
      {...props}
      primary={instance.full_name ?? instance.name}
      secondary={instance.description}
      suffix={badge}
      image={instance.thumnbnail || instance.image}
      url={props.link ? getDetailUrl(ModelType.part, instance.pk) : undefined}
    />
  );
}

/**
 * Inline rendering of a PartCategory instance
 */
export function RenderPartCategory(
  props: Readonly<InstanceRenderInterface>
): ReactNode {
  const { instance } = props;
  const lvl = '-'.repeat(instance.level || 0);

  return (
    <RenderInlineModel
      {...props}
      primary={`${lvl} ${instance.name}`}
      secondary={instance.description}
      url={
        props.link
          ? getDetailUrl(ModelType.partcategory, instance.pk)
          : undefined
      }
    />
  );
}

/**
 * Inline rendering of a PartParameterTemplate instance
 */
export function RenderPartParameterTemplate({
  instance
}: {
  instance: any;
}): ReactNode {
  return (
    <RenderInlineModel
      primary={instance.name}
      secondary={instance.description}
      suffix={instance.units}
    />
  );
}

export function RenderPartTestTemplate({
  instance
}: {
  instance: any;
}): ReactNode {
  return (
    <RenderInlineModel
      primary={instance.test_name}
      secondary={instance.description}
    />
  );
}
