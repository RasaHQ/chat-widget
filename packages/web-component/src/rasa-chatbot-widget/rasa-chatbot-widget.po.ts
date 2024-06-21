import { newSpecPage } from '@stencil/core/testing';
import { RasaChatbotWidget } from './rasa-chatbot-widget';
import { renderWithAttributes } from '../test-utils/renderWithAttributes';

export default class RasaChatbotPage {
  private page: any;

  async initPage(args?: Partial<RasaChatbotWidget>) {
    this.page = await newSpecPage({
      components: [RasaChatbotWidget],
      html: renderWithAttributes('rasa-chatbot-widget', args || {}),
    });
  }

  async toggleLauncher() {
    const launcher = this.page.root.shadowRoot.querySelector('.rasa-chatbot-widget__launcher');
    launcher.click();
    await this.page.waitForChanges();
  }

  getFullScreenToggleButton() {
    return this.page.root.shadowRoot.querySelector('.messenger__header__icon');
  }

  async toggleFullScreen() {
    const icon = this.getFullScreenToggleButton();
    icon.click();
    await this.page.waitForChanges();
  }

  isLauncherOpen() {
    return this.page.rootInstance.isOpen;
  }

  isFullScreen() {
    return this.page.rootInstance.isFullScreen;
  }
}
