import { Trans } from '@lingui/macro';
import {
  Badge,
  Group,
  HoverCard,
  List,
  SimpleGrid,
  Text,
  ThemeIcon,
  Tooltip
} from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { forwardRef } from 'react';

import { useApiState } from '../../../states/ApiState';
import { UserRenderer } from '../../renderer/UserRenderer';
import { ApprovalAddComponent } from './ApprovalAddComponent';

function DecisionComponent({ decision }: { decision: any }) {
  const icon = decision.decision ? (
    <IconCircleCheck size="1rem" />
  ) : (
    <IconCircleX size="1rem" />
  );
  const icon_color = decision.decision ? 'green' : 'red';
  return (
    <List.Item
      icon={
        <ThemeIcon color={icon_color} size={24} radius="xl">
          {icon}
        </ThemeIcon>
      }
    >
      <Tooltip label={decision.date}>
        <Group>
          <UserRenderer user={decision.user} /> {decision.comment}
        </Group>
      </Tooltip>
    </List.Item>
  );
}

export function ExistingApprovalComponent({
  refetch,
  data
}: {
  refetch: () => void;
  data: any;
}) {
  const user_id = useApiState((state) => state.user?.id);
  const obj = data[0];

  const FinalState = () => {
    if (obj.finalised == true)
      return (
        <Badge color="green" variant="outline">
          <Trans>Finalised</Trans>
        </Badge>
      );
    return (
      <Badge color="yellow" variant="outline">
        <Trans>Not finalised</Trans>
      </Badge>
    );
  };
  let status_color = 'yellow';
  switch (obj.status) {
    case 20:
      status_color = 'green';
      break;
    case 30:
      status_color = 'red';
      break;
    default:
      break;
  }
  const my_decision = obj.decisions.find(
    (decision: any) => decision.user == user_id
  );

  const MainApprovalComponent = forwardRef((props, ref) => (
    <div ref={ref} {...props}>
      <Badge color={status_color} variant="light">
        {obj.status_text}
      </Badge>{' '}
      <FinalState />
      {obj.decisions.length == 0 ? (
        <Text>
          <Trans>No Decisions yes</Trans>
        </Text>
      ) : (
        <List>
          {obj.decisions.map((decision: any) => (
            <DecisionComponent key={decision.id} decision={decision} />
          ))}
        </List>
      )}
      {obj.finalised == false && my_decision === undefined && (
        <ApprovalAddComponent approvalPK={obj.id} refetch={refetch} />
      )}
    </div>
  ));

  const DetailApprovalComponent = () => (
    <Text size="sm">
      <SimpleGrid cols={2} spacing="xs">
        <div>
          <Trans>Name</Trans>
        </div>
        <div>
          <Text>{obj.name}</Text>
        </div>

        {obj.description && (
          <>
            <div>
              <Trans>Description</Trans>
            </div>
            <div>{obj.description}</div>
          </>
        )}

        {obj.reference && (
          <>
            <div>
              <Trans>Reference</Trans>
            </div>
            <div>{obj.reference}</div>
          </>
        )}

        <div>
          <Trans>Creation date</Trans>
        </div>
        <div>{obj.creation_date}</div>

        <div>
          <Trans>Created by</Trans>
        </div>
        <div>
          <UserRenderer user={obj.created_by} />
        </div>

        <div>
          <Trans>Modification date</Trans>
        </div>
        <div>{obj.modified_date}</div>

        <div>
          <Trans>Modified by</Trans>
        </div>
        <div>
          <UserRenderer user={obj.modified_by} />
        </div>

        {obj.finalised == true && (
          <>
            <div>
              <Trans>Finalisation date</Trans>
            </div>
            <div>{obj.finalised_date}</div>

            <div>
              <Trans>Finalised by</Trans>
            </div>
            <div>
              <UserRenderer user={obj.finalised_by} />
            </div>
          </>
        )}
      </SimpleGrid>
    </Text>
  );

  return (
    <HoverCard shadow="md" withArrow openDelay={200} closeDelay={400}>
      <HoverCard.Target>
        <MainApprovalComponent />
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <DetailApprovalComponent />
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
