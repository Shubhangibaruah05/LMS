import { t } from '@lingui/macro';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { AxiosResponse } from 'axios';

import { api } from '../App';
import { ApiForm, ApiFormProps } from '../components/forms/ApiForm';
import { ApiFormFieldType } from '../components/forms/ApiFormField';
import { invalidResponse } from './notifications';

/**
 * Construct an API url from the provided ApiFormProps object
 */
export function constructFormUrl(props: ApiFormProps): string {
  let url = props.url;

  if (!url.endsWith('/')) {
    url += '/';
  }

  if (props.pk && props.pk > 0) {
    url += `${props.pk}/`;
  }

  return url;
}

/**
 * Extract the available fields (for a given method) from the response object
 *
 * @returns - A list of field definitions, or null if there was an error
 */
export function extractAvailableFields(
  response: AxiosResponse,
  method?: string
): ApiFormFieldType[] | null {
  // OPTIONS request *must* return 200 status
  if (response.status != 200) {
    invalidResponse(response.status);
    return null;
  }

  let actions: any = response.data?.actions ?? null;

  if (!method) {
    notifications.show({
      title: 'INVALID FORM',
      message: 'METHOD not provided',
      color: 'red'
    });
    return null;
  }

  if (!actions) {
    notifications.show({
      title: 'INVALID FORM',
      message: 'Response did not contain an ACTIONS object',
      color: 'red'
    });
    return null;
  }

  method = method.toUpperCase();

  if (!(method in actions)) {
    notifications.show({
      title: 'INVALID FORM',
      message: `Method ${method} not found in available actions`,
      color: 'red'
    });
    return null;
  }

  let fields: ApiFormFieldType[] = [];

  // TODO: Instead of copying these individually,
  // is there a better way?

  for (const fieldName in actions[method]) {
    const field = actions[method][fieldName];
    fields.push({
      name: fieldName,
      label: field.label,
      description: field.help_text,
      value: field.value || field.default,
      fieldType: field.type,
      required: field.required,
      placeholder: field.placeholder,
      api_url: field.api_url,
      model: field.model,
      filters: field.filters,
      read_only: field.read_only
    });
  }

  return fields;
}

/*
 * Construct and open a modal form
 * @param title :
 */
export function openModalApiForm(props: ApiFormProps) {
  // method property *must* be supplied
  if (!props.method) {
    notifications.show({
      title: t`Invalid Form`,
      message: t`method parameter not supplied`,
      color: 'red'
    });
    return;
  }

  let url = constructFormUrl(props);

  // Make OPTIONS request first
  api
    .options(url)
    .then((response) => {
      // Extract available fields from the OPTIONS response (and handle any errors)
      let fields: ApiFormFieldType[] | null = extractAvailableFields(
        response,
        props.method
      );

      if (fields == null) {
        return;
      }

      let modalId: string = `modal-${props.title}-${url}`;

      modals.open({
        title: props.title,
        modalId: modalId,
        onClose: () => {
          props.onClose ? props.onClose() : null;
        },
        children: (
          <ApiForm modalId={modalId} props={props} fieldDefinitions={fields} />
        )
      });
    })
    .catch((error) => {
      console.log('Error:', error);
      if (error.response) {
        invalidResponse(error.response.status);
      } else {
        notifications.show({
          title: t`Form Error`,
          message: error.message,
          color: 'red'
        });
      }
    });
}

/**
 * Opens a modal form to create a new model instance
 */
export function openCreateApiForm(props: ApiFormProps) {
  let createProps: ApiFormProps = {
    ...props,
    method: 'POST'
  };

  openModalApiForm(createProps);
}

/**
 * Open a modal form to edit a model instance
 */
export function openEditApiForm(props: ApiFormProps) {
  let editProps: ApiFormProps = {
    ...props,
    fetchInitialData: props.fetchInitialData ?? true,
    method: 'PUT'
  };

  openModalApiForm(editProps);
}

/**
 * Open a modal form to delete a model instancel
 */
export function openDeleteApiForm(props: ApiFormProps) {
  let deleteProps: ApiFormProps = {
    ...props,
    method: 'DELETE',
    submitText: t`Delete`,
    submitColor: 'red'
  };

  openModalApiForm(deleteProps);
}
