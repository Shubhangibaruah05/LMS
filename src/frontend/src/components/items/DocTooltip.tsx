import { Trans } from '@lingui/macro';
import { Anchor, Container, HoverCard, ScrollArea, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

import { InvenTreeStyle } from '../../globalStyle';

export function DocTooltip({
  children,
  text,
  detail,
  link,
  docchildren
}: {
  children: React.ReactNode;
  text: string;
  detail?: string;
  link?: string;
  docchildren: React.ReactNode;
}) {
  const { classes, theme } = InvenTreeStyle();

  function ConstBody({ text, detail }: { text: string; detail?: string }) {
    const [height, setHeight] = useState(0);
    const ref = useRef(null);

    // dynamically set height of scroll area based on content to remove unnecessary scroll bar
    useEffect(() => {
      let tmp_ref = ref.current?.clientHeight;
      if (tmp_ref > 250) {
        setHeight(250);
      } else {
        setHeight(tmp_ref + 1);
      }
    });

    return (
      <Container maw={400} p={0}>
        <Text>{text}</Text>
        {(detail || docchildren) && (
          <ScrollArea h={height} mah={250}>
            <div ref={ref}>
              {detail && (
                <Text size="xs" color="dimmed">
                  {detail}
                </Text>
              )}
              {docchildren}
            </div>
          </ScrollArea>
        )}
        {link && (
          <Anchor href={link} target="_blank">
            <Text size={'sm'}>
              <Trans>Read More</Trans>
            </Text>
          </Anchor>
        )}
      </Container>
    );
  }

  return (
    <HoverCard
      shadow="md"
      openDelay={200}
      closeDelay={200}
      withinPortal={true}
      classNames={{ dropdown: classes.docHover }}
    >
      <HoverCard.Target>
        <div>{children}</div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <ConstBody text={text} detail={detail} />
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
