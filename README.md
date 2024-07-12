# Rasa Chatbot Widget

This project is a Rasa chatbot widget designed to be easily embeddable into any web applications. It leverages Lerna for managing multiple packages within a single repository. The widget utilizes StencilJS for building efficient and reusable web components.

## Requirements

- Node version v20.11.1
- npm version 10.2.4

A .nvmrc file is provided for easily switching to the correct Node.js version using nvm.

## Installation

- Clone the repository
- Install dependencies `npm install`
- Start development server `npm run dev`

## Scripts

### dev

Concurrently runs the development servers for all packages managed by Lerna.

```bash
npm run dev
```

### storybook

Builds the packages in watch mode and starts Storybook, which serves as full documentation and allows for interactive component development.

```bash
npm run storybook
```

### test

Runs tests across all packages.

```bash
npm run test
```

### build

Builds all packages sequentially to ensure dependencies are built in the correct order.

```bash
npm run build
```

## GIT Convention

### Commit Message Format

We follow the Conventional Commits specification for our GIT commit messages. Each commit message consists of a header, body, and footer, structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

- **Type:** Specifies the kind of change being made, such as feat, fix, docs, style, refactor, test, chore, etc.
- **Scope:** Optional, describes the scope of the commit, e.g., component name, module affected.
- **Description:** A brief summary in the present tense, describing the change.

#### Examples

- **Feature:** `feat(image): add image component`
- **Bug Fix:** `fix(validation): handle empty inputs`
- **Documentation:** `docs(readme): update installation instructions`
- **Style:** `style(button): adjust padding for consistency`
- **Refactor:** `refactor(sdk): optimize database queries`
- **Test:** `test(image): add integration tests for image component`
- **Chore:** `chore(build): update dependencies`

#### Notes

- Always use imperative, present tense verbs (“add”, “fix”, “update”) rather than past tense (“added”, “fixed”, “updated”).
- Use the body to provide more details if the description alone is not enough to explain the changes.
- Use the footer for references to issues or breaking changes.

This convention helps maintain a clear and standardized format for our commit messages, aiding in changelog generation and automated release notes.
