/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { logger } from '@storybook/client-logger';

import {
  StencilJsonDocs,
  StencilJsonDocsEvent,
  StencilJsonDocsMethod,
  StencilJsonDocsPart,
  StencilJsonDocsProp,
  StencilJsonDocsSlot,
  StencilJsonDocsStyle,
} from './types';

/**
 * @param stencilDocJson stencil json doc
 */
export const setStencilDocJson = (stencilDocJson: StencilJsonDocs): void => {
  if (!setStencilDocJson) {
    console.warn('Stencil JSON Doc not provided');
    return;
  }
  // @ts-ignore
  window.__STORYBOOK_STENCIL_DOC_JSON__ = stencilDocJson;
};

const isValidComponent = (tagName: string) => {
  if (!tagName) {
    return false;
  }
  if (typeof tagName === 'string') {
    return true;
  }
  throw new Error('Provided component needs to be a string. e.g. component: "my-element"');
};

const isValidMetaData = (stencilDocJson: StencilJsonDocs) => {
  if (!stencilDocJson) {
    return false;
  }
  if (stencilDocJson.components && Array.isArray(stencilDocJson.components)) {
    return true;
  }
  throw new Error(`You need to setup valid meta data in your preview.js via setStencilDocJson().
    The meta data can be generated with the stencil output target 'docs-json'.`);
};

const getMetaData = (tagName: string, stencilDocJson: StencilJsonDocs) => {
  if (!isValidComponent(tagName) || !isValidMetaData(stencilDocJson)) {
    return null;
  }

  const metaData = stencilDocJson.components.find(
    (component) => component.tag.toUpperCase() === tagName.toUpperCase()
  );
  if (!metaData) {
    logger.warn(`Component not found in stencil doc json: ${tagName}`);
  }
  return metaData;
};

const mapItemValuesToOptions = (item: StencilJsonDocsProp) => {
  return item.values
    .filter((value) => ['string', 'number'].includes(value.type))
    .map((value) => value.value);
};

const mapPropTypeToControl = (
  item: StencilJsonDocsProp
): { control: { type: string }; options: (string | number)[] | null } => {
  let control: any;
  let options: (string | number)[] | null = null;

  switch (item.type) {
    case 'string':
      control = { type: 'text' };
      break;
    case 'number':
      control = { type: 'number' };
      break;
    case 'boolean':
      control = { type: 'boolean' };
      break;
    case 'function':
    case 'void':
      control = null;
      break;
    default:
      // @ts-ignore
      options = mapItemValuesToOptions(item);

      // @ts-ignore
      if (options.length === 0) {
        control = { type: 'object' };
        // @ts-ignore
      } else if (options.length < 5) {
        control = { type: 'radio' };
      } else {
        control = { type: 'select' };
      }
  }

  return { control, options };
};

const getPropName = (item: StencilJsonDocsProp) => {
  return item.name || item.attr;
};

const mapPropsData = (data: StencilJsonDocsProp[], options: any): any => {
  const { dashCase } = options;
  return (
    data &&
    data.reduce((acc, item) => {
      const { control, options } = mapPropTypeToControl(item);
      const key = dashCase === true ? item.attr || item.name : item.name;

      acc[key] = {
        name: getPropName(item),
        description: item.docs,
        type: { required: item.required },
        control: control,
        table: {
          category: 'props',
          type: { summary: item.type },
          defaultValue: { summary: item.default },
        },
      };

      if (options !== null) acc[key].options = options;

      return acc;
    }, {})
  );
};

const mapEventsData = (data: StencilJsonDocsEvent[]) => {
  return (
    data &&
    data.reduce((acc, item) => {
      acc[item.event] = {
        name: item.event,
        description: item.docs,
        type: { name: 'void' },
        control: null,
        table: {
          category: 'events',
          type: { summary: item.detail },
        },
      };
      return acc;
    }, {})
  );
};

const mapMethodsData = (data: StencilJsonDocsMethod[]) => {
  return (
    data &&
    data.reduce((acc, item) => {
      acc[`method-${item.name}`] = {
        name: item.name,
        description: item.docs,
        type: { name: 'void' },
        control: null,
        table: {
          category: 'methods',
          type: { summary: item.signature },
        },
      };
      return acc;
    }, {})
  );
};

const mapGenericData = <T extends { name: string; docs: string }>(data: T[], category: string) => {
  return (
    data &&
    data.reduce((acc, item) => {
      const type = { name: 'void' };
      acc[`${category.replace(/\s/g, '-').toLowerCase()}-${item.name}`] = {
        name: item.name,
        required: false,
        description: item.docs,
        control: null,
        type,
        table: {
          category,
          type,
        },
      };
      return acc;
    }, {})
  );
};

export const getStencilDocJson = (): StencilJsonDocs => {
  // @ts-ignore
  return window.__STORYBOOK_STENCIL_DOC_JSON__;
};

/**
 * @param {string} tagName - stencil component for which to extract ArgTypes
 * @param {StencilJsonDocs} stencilDocJson - Stencil meta data from `docs-json` output target
 */
export const extractArgTypesFromElements = (
  tagName: string,
  stencilDocJson: StencilJsonDocs,
  options: any
) => {
  const metaData = getMetaData(tagName, stencilDocJson);

  return (
    metaData && {
      ...mapPropsData(metaData.props, options),
      ...mapEventsData(metaData.events),
      ...mapMethodsData(metaData.methods),
      ...mapGenericData<StencilJsonDocsSlot>(metaData.slots, 'slots'),
      ...mapGenericData<StencilJsonDocsStyle>(metaData.styles, 'css custom properties'),
      ...mapGenericData<StencilJsonDocsPart>(metaData.parts, 'css shadow parts'),
    }
  );
};

/**
 * @param {Partial<ExtractArgTypesOptions>} options - options for extractArgTypes
 */
export const extractArgTypesFactory = (options: Partial<any> = {}): ((tagName: string) => any) => {
  return (tagName: string) => {
    return extractArgTypesFromElements(tagName, getStencilDocJson(), {
      dashCase: false,
      ...options,
    });
  };
};

/**
 * @param {string} tagName - stencil component for which to extract ArgTypes
 */
export const extractArgTypes = extractArgTypesFactory();

/**
 * @param {string} tagName - stencil component for which to extract description
 */
export const extractComponentDescription = (tagName: string): string | undefined => {
  const metaData = getMetaData(tagName, getStencilDocJson());
  return metaData?.docs;
};
