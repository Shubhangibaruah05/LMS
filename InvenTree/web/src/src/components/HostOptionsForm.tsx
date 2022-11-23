
import { useForm } from '@mantine/form';
import { TextInput, Group, ActionIcon, Box, Text, Button, Space, Divider } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { IconTrash, IconSquarePlus } from '@tabler/icons';
import { HostList } from '../contex/states';

export function HostOptionsForm({ data, saveOptions }: { data: HostList, saveOptions: (newData: HostList) => void }) {
    const form = useForm({ initialValues: data });
    const fields = Object.entries(form.values).map(([key]) => (
        <Group key={key} mt="xs">
            {form.values[key] !== undefined && (<>
                <TextInput placeholder="Host" withAsterisk sx={{ flex: 1 }} {...form.getInputProps(`${key}.host`)} />
                <TextInput placeholder="Host" withAsterisk sx={{ flex: 1 }} {...form.getInputProps(`${key}.name`)} />
                <ActionIcon color="red" onClick={() => (form.setValues({ ...form.values, [key]: undefined }))}><IconTrash size={16} /></ActionIcon>
            </>)}
        </Group >
    ));

    return (<form onSubmit={form.onSubmit(saveOptions)}>
        <Box sx={{ maxWidth: 500 }} mx="auto">
            {fields.length > 0 ? (
                <Group mb="xs">
                    <Text weight={500} size="sm" sx={{ flex: 1 }}>Host</Text>
                    <Text weight={500} size="sm" sx={{ flex: 1 }}>Name</Text>
                </Group>
            ) : (
                <Text color="dimmed" align="center">No one here...</Text>
            )}
            {fields}
            <Group mt="md">
                <Button onClick={() => form.setFieldValue(`${randomId()}`, { name: '', host: '' })}><IconSquarePlus size={16} /> Add Host</Button>
                <Space sx={{ flex: 1 }} />
                <Button type="submit">Save</Button>
            </Group>
        </Box>
        <Divider />
    </form>);
}
