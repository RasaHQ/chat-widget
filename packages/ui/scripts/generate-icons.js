#!/usr/bin / env node

const path = require('path');
const fg = require('fast-glob');
const fs = require('fs-extra');
const Handlebars = require('handlebars');
const { camelCase, upperFirst } = require('lodash');
const { parse } = require('svg-parser');

const INPUT_GLOB = './src/icons/*.svg';
const OUTPUT_PATH = './src/components/icons';
const ICON_TEMPLATE_PATH = './scripts/icon-component.hbs';

main();

async function main() {
  const { toHtml } = await import('hast-util-to-html');

  const entries = await fg(INPUT_GLOB);

  const files = await Promise.all(
    entries.map(async filepath => {
      const file = await fs.readFile(filepath, { encoding: 'utf-8' });
      const itemPath = filepath.split('/');
      const name = itemPath[itemPath.length - 1].split('.')[0];

      return {
        filepath,
        name,
        file,
      };
    }),
  );

  const components = files.map(item => {
    const tagName = 'rasa-icon-' + item.name;
    const className = `${upperFirst(camelCase(item.name))}Icon`;

    return {
      name: `${item.name}-icon`,
      className,
      tagName,
      markup: {
        default: JSXify(toHtml(adaptTree(parse(item.file)))),
      },
      viewBox: getViewBox(parse(item.file)),
    };
  });

  function JSXify(html) {
    if (html.indexOf('xlink:href')) {
      return html.replace(/xlink:href/g, 'xlinkHref');
    }
    return html;
  }

  function getViewBox(tree) {
    return tree.children[0].properties.viewBox || '0 0 24 24';
  }

  function adaptTree(tree) {
    const { children } = tree.children[0];
    const removeFillAttr = node => {
      if (node.tagName === 'path' && node.properties.fill != null && node.properties.fill !== 'none') {
        delete node.properties.fill;
      }
      return node;
    };

    return {
      type: 'root',
      children: children.map(removeFillAttr),
    };
  }

  const iconTemplateText = fs.readFileSync(ICON_TEMPLATE_PATH, {
    encoding: 'utf-8',
  });
  const templateIcon = Handlebars.compile(iconTemplateText);

  try {
    await fs.emptyDir(OUTPUT_PATH);
    await Promise.all(
      components.map(async component => {
        const dir = path.join(OUTPUT_PATH, component.name);
        await fs.mkdirp(dir);
        return fs.writeFile(path.join(dir, component.name + '.tsx'), templateIcon(component));
      }),
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
