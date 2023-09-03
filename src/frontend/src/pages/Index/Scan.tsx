import { Trans, t } from '@lingui/macro';
import {
  ActionIcon,
  Button,
  Checkbox,
  Col,
  Grid,
  Group,
  ScrollArea,
  Select,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
  rem
} from '@mantine/core';
import { Badge, Container } from '@mantine/core';
import {
  getHotkeyHandler,
  randomId,
  useFullscreen,
  useListState,
  useLocalStorage
} from '@mantine/hooks';
import { useDocumentVisibility } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconLink,
  IconNumber,
  IconPlus,
  IconQuestionMark,
  IconSearch,
  IconTrash
} from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { Html5Qrcode } from 'html5-qrcode';
import { CameraDevice } from 'html5-qrcode/camera/core';
import { useEffect, useState } from 'react';

import { api } from '../../App';
import { DocInfo } from '../../components/items/DocInfo';
import { StylishText } from '../../components/items/StylishText';
import { TitleWithDoc } from '../../components/items/TitleWithDoc';
import { notYetImplemented } from '../../functions/notifications';
import { IS_DEV_OR_DEMO } from '../../main';

interface ScanItem {
  id: string;
  ref: string;
  data: any;
  timestamp: Date;
  source: string;
  link?: string;
  objectType?: string;
  objectPk?: string;
}

export default function Scan() {
  const { toggle: toggleFullscreen, fullscreen } = useFullscreen();
  const [history, historyHandlers] = useListState<ScanItem>([]);
  const [historyStorage, setHistoryStorage] = useLocalStorage<ScanItem[]>({
    key: 'scan-history',
    defaultValue: []
  });
  const [selection, setSelection] = useState<string[]>([]);
  const [value, setValue] = useState<string | null>(null);

  function runBarcode(value: string, id?: string) {
    api.post('/barcode/', { barcode: value }).then((response) => {
      showNotification({
        title: response.data?.success || t`Unknown response`,
        message: JSON.stringify(response.data),
        color: response.data?.success ? 'teal' : 'red'
      });

      // update item in history
      if (!id) return;
      const item = history.find((item) => item.id === id);
      if (!item) return;
      item.link = response.data?.url;

      if (response.data?.part) {
        item.objectType = 'part';
        item.objectPk = response.data?.part.pk;
      } else if (response.data?.stockitem) {
        item.objectType = 'stockitem';
        item.objectPk = response.data?.stockitem.pk;
      }

      console.log('saving item', item);
      historyHandlers.setState(history);
    });
  }

  function runSelectedBarcode() {
    if (selection.length === 0) return;
    // get item from history by selection id
    const item = history.find((item) => item.id === selection[0]);
    if (item?.ref === undefined) return;
    runBarcode(item?.ref, item?.id);
  }

  function openSelectedLink() {
    if (selection.length === 0) return;
    const item = history.find((item) => item.id === selection[0]);
    if (item?.ref === undefined) return;
    window.open(item.link, '_blank');
  }

  function notImplemented() {
    notYetImplemented();
  }

  function addItems(items: ScanItem[]) {
    for (const item of items) {
      historyHandlers.append(item);
      runBarcode(item.ref, item.id);
    }
    setSelection(items.map((item) => item.id));
  }

  function deleteFullHistory() {
    historyHandlers.setState([]);
    setHistoryStorage([]);
    setSelection([]);
  }

  function deleteHistory() {
    historyHandlers.setState(
      history.filter((item) => !selection.includes(item.id))
    );
    setSelection([]);
  }

  // save data to session storage
  useEffect(() => {
    if (history.length === 0) return;
    setHistoryStorage(history);
  }, [history]);

  // load data from session storage on mount
  if (history.length === 0 && historyStorage.length != 0) {
    historyHandlers.setState(historyStorage);
  }

  // input stuff
  const inputOptions = [
    { value: InputMethod.Manual, label: t`Manual input` },
    { value: InputMethod.ImageBarcode, label: t`Image Barcode` }
  ];

  const inp = (function () {
    switch (value) {
      case InputMethod.Manual:
        return <InputManual action={addItems} />;
      case InputMethod.ImageBarcode:
        return <InputImageBarcode action={addItems} />;
      default:
        return <Text>No input selected</Text>;
    }
  })();

  const SelectedActions = () => {
    const uniqueObjectTypes = [
      ...new Set(
        selection
          .map((id) => {
            return history.find((item) => item.id === id)?.objectType;
          })
          .filter((item) => item != undefined)
      )
    ];

    if (uniqueObjectTypes.length === 0) {
      return (
        <Group spacing={0}>
          <IconQuestionMark color="orange" />
          <Trans>Selected elements are not known</Trans>
        </Group>
      );
    } else if (uniqueObjectTypes.length > 1) {
      return (
        <Group spacing={0}>
          <IconAlertCircle color="orange" />
          <Trans>Multiple object types selected</Trans>
        </Group>
      );
    }
    return (
      <>
        <Text fz="sm" c="dimmed">
          <Trans>Actions for {uniqueObjectTypes[0]} </Trans>
        </Text>
        <Group>
          <ActionIcon onClick={notImplemented} title={t`Cound`}>
            <IconNumber />
          </ActionIcon>
        </Group>
      </>
    );
  };

  return (
    <>
      <Group position="apart">
        <Group position="left">
          <StylishText>
            <Trans>Scan Page</Trans>
          </StylishText>
          <DocInfo
            text={t`This page can be used for continuously scanning items and taking actions on them.`}
          />
        </Group>
        <Button onClick={toggleFullscreen} size="sm" variant="subtle">
          {fullscreen ? <IconArrowsMaximize /> : <IconArrowsMinimize />}
        </Button>
      </Group>
      <Space h={'md'} />
      <Grid maw={'100%'}>
        <Col span={4}>
          <Stack>
            <Stack>
              <Group position="apart">
                <TitleWithDoc
                  order={3}
                  text={t`Select the input method you want to use to scan items.`}
                >
                  <Trans>Input</Trans>
                </TitleWithDoc>
                <Select
                  value={value}
                  onChange={setValue}
                  data={inputOptions}
                  searchable
                  placeholder={t`Select input method`}
                  nothingFound={t`Nothing found`}
                />
              </Group>

              {inp}
            </Stack>
            <Stack spacing={0}>
              <TitleWithDoc
                order={3}
                text={t`Depending on the selected parts actions will be shown here. Not all barcode types are supported currently.`}
              >
                <Trans>Action</Trans>
              </TitleWithDoc>
              {selection.length === 0 ? (
                <Text>
                  <Trans>No selection</Trans>
                </Text>
              ) : (
                <>
                  <Text>
                    <Trans>{selection.length} items selected</Trans>
                  </Text>
                  <Text fz="sm" c="dimmed">
                    <Trans>General Actions</Trans>
                  </Text>
                  <Group>
                    <ActionIcon
                      color="red"
                      onClick={deleteHistory}
                      title={t`Delete`}
                    >
                      <IconTrash />
                    </ActionIcon>
                    <ActionIcon
                      onClick={runSelectedBarcode}
                      disabled={selection.length > 1}
                      title={t`Lookup`}
                    >
                      <IconSearch />
                    </ActionIcon>
                    <ActionIcon
                      onClick={openSelectedLink}
                      disabled={selection.length > 1}
                      title={t`Open Link`}
                    >
                      <IconLink />
                    </ActionIcon>
                  </Group>
                  <SelectedActions />
                </>
              )}
            </Stack>
          </Stack>
        </Col>
        <Col span={8}>
          <Group position="apart">
            <TitleWithDoc
              order={3}
              text={t`History is locally kept in this browser.`}
              detail={t`The history is kept in this browser's local storage. So it won't be shared with other users or other devices but is persistent through reloads. You can select items in the history to perform actions on them. To add items, scan/enter them in the Input area.`}
            >
              <Trans>History</Trans>
            </TitleWithDoc>
            <ActionIcon color="red" onClick={deleteFullHistory}>
              <IconTrash />
            </ActionIcon>
          </Group>
          <HistoryTable
            data={history}
            selection={selection}
            setSelection={setSelection}
          />
        </Col>
      </Grid>
    </>
  );
}

function HistoryTable({
  data,
  selection,
  setSelection
}: {
  data: ScanItem[];
  selection: string[];
  setSelection: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((item) => item.id)
    );

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id}>
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
            transitionDuration={0}
          />
        </td>
        <td>{item.ref}</td>
        <td>{item.link}</td>
        <td>{item.source}</td>
        <td>{item.timestamp?.toString()}</td>
      </tr>
    );
  });

  // rendering
  if (data.length === 0)
    return (
      <Text>
        <Trans>No history</Trans>
      </Text>
    );
  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm">
        <thead>
          <tr>
            <th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={
                  selection.length > 0 && selection.length !== data.length
                }
                transitionDuration={0}
              />
            </th>

            <th>
              <Trans>Name</Trans>
            </th>
            <th>
              <Trans>Link</Trans>
            </th>
            <th>
              <Trans>Source</Trans>
            </th>
            <th>
              <Trans>Scanned at</Trans>
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}

// region input stuff
enum InputMethod {
  Manual = 'manually',
  ImageBarcode = 'imageBarcode'
}

interface inputProps {
  action: (items: ScanItem[]) => void;
}

function InputManual({ action }: inputProps) {
  const [value, setValue] = useState<string>('');

  function addItem() {
    if (value === '') return;

    const new_item: ScanItem = {
      id: randomId(),
      ref: value,
      data: { item: value },
      timestamp: new Date(),
      source: InputMethod.Manual
    };
    action([new_item]);
    setValue('');
  }

  function addDummyItem() {
    const new_item: ScanItem = {
      id: randomId(),
      ref: 'Test item',
      data: {},
      timestamp: new Date(),
      source: InputMethod.Manual
    };
    action([new_item]);
  }

  return (
    <>
      <Group>
        <TextInput
          placeholder={t`Enter item serial or data`}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          onKeyDown={getHotkeyHandler([['Enter', addItem]])}
        />
        <ActionIcon onClick={addItem} w={16}>
          <IconPlus />
        </ActionIcon>
      </Group>

      {IS_DEV_OR_DEMO && (
        <Button onClick={addDummyItem} variant="outline">
          <Trans>Add dummy item</Trans>
        </Button>
      )}
    </>
  );
}

/* Input that uses QR code detection from images */
function InputImageBarcode({ action }: inputProps) {
  const [qrCodeScanner, setQrCodeScanner] = useState<Html5Qrcode | null>(null);
  const [camId, setCamId] = useLocalStorage<CameraDevice | null>({
    key: 'camId',
    defaultValue: null
  });
  const [cameras, setCameras] = useState<any[]>([]);
  const [ScanningEnabled, setIsScanning] = useState<boolean>(false);
  const [wasAutoPaused, setWasAutoPaused] = useState<boolean>(false);
  const documentState = useDocumentVisibility();
  const [value, setValue] = useState<string | null>(null);

  let lastValue: string = '';

  // Mount QR code once we are loaded
  useEffect(() => {
    setQrCodeScanner(new Html5Qrcode('reader'));

    // load cameras
    Html5Qrcode.getCameras().then((devices) => {
      if (devices?.length) {
        setCameras(devices);
      }
    });
  }, []);

  // Stop/start when leaving or reentering page
  useEffect(() => {
    if (ScanningEnabled && documentState === 'hidden') {
      stopScanning();
      setWasAutoPaused(true);
    } else if (wasAutoPaused && documentState === 'visible') {
      startScanning();
      setWasAutoPaused(false);
    }
  }, [documentState]);

  // Scanner functions
  function onScanSuccess(decodedText: string) {
    qrCodeScanner?.pause();

    // dedouplication
    if (decodedText === lastValue) {
      qrCodeScanner?.resume();
      return;
    }
    lastValue = decodedText;

    // submit value upstream
    action([
      {
        id: randomId(),
        ref: decodedText,
        data: decodedText,
        timestamp: new Date(),
        source: InputMethod.ImageBarcode
      }
    ]);

    qrCodeScanner?.resume();
  }

  function onScanFailure(error: string) {
    if (
      error !=
      'QR code parse error, error = NotFoundException: No MultiFormat Readers were able to detect the code.'
    ) {
      console.warn(`Code scan error = ${error}`);
    }
  }

  function selectCamera() {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices?.length) {
          setCamId(devices[0]);
        }
      })
      .catch((err) => {
        showNotification({
          title: t`Error while getting camera`,
          message: err,
          color: 'red',
          icon: <IconX />
        });
      });
  }

  function startScanning() {
    if (camId && qrCodeScanner && !ScanningEnabled) {
      qrCodeScanner
        .start(
          camId.id,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            onScanFailure(errorMessage);
          }
        )
        .catch((err: string) => {
          showNotification({
            title: t`Error while scanning`,
            message: err,
            color: 'red',
            icon: <IconX />
          });
        });
      setIsScanning(true);
    }
  }

  function stopScanning() {
    if (qrCodeScanner && ScanningEnabled) {
      qrCodeScanner.stop().catch((err: string) => {
        showNotification({
          title: t`Error while stopping`,
          message: err,
          color: 'red',
          icon: <IconX />
        });
      });
      setIsScanning(false);
    }
  }

  // on value change
  useEffect(() => {
    if (value === null) return;

    const cam = cameras.find((cam) => cam.id === value);

    // stop scanning if cam changed while scanning
    if (qrCodeScanner && ScanningEnabled) {
      // stop scanning
      qrCodeScanner.stop().then(() => {
        // change ID
        setCamId(cam);
        // start scanning
        qrCodeScanner.start(
          cam.id,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            onScanFailure(errorMessage);
          }
        );
      });
    } else {
      setCamId(cam);
    }
  }, [value]);

  return (
    <Stack>
      <Group>
        <Select
          value={value}
          onChange={setValue}
          data={cameras.map((device) => {
            return { value: device.id, label: device.label };
          })}
        />
        <Text>{camId?.label}</Text>
        <Space sx={{ flex: 1 }} />
        <Badge>{ScanningEnabled ? t`Scanning` : t`Not scanning`}</Badge>
      </Group>
      <Container px={0} id="reader" w={'100%'} mih="300px" />
      {!camId ? (
        <Button onClick={() => selectCamera()}>
          <Trans>Select Camera</Trans>
        </Button>
      ) : (
        <>
          <Group>
            <Button
              sx={{ flex: 1 }}
              onClick={() => startScanning()}
              disabled={camId != undefined && ScanningEnabled}
            >
              <Trans>Start scanning</Trans>
            </Button>
            <Button
              sx={{ flex: 1 }}
              onClick={() => stopScanning()}
              disabled={!ScanningEnabled}
            >
              <Trans>Stop scanning</Trans>
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
}

// endregion
