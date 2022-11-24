import { Text } from '@mantine/core';
import { InvenTreeStyle } from '../../globalStyle';

export function StylishText({ children }: { children: JSX.Element | string }) {
  const { classes } = InvenTreeStyle();
  return (
    <Text
      className={classes.signText}
      variant="gradient"
      gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
    >
      {children}
    </Text>
  );
}
