import React from "react";
import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";

import { RasaChatbotWidget } from "../lib/components/stencil-generated";

describe("Rasa React Wrapper", () => {
  test("it renders web component", async () => {
    const { container } = render(
      <RasaChatbotWidget serverUrl="https://pro.example.com" />
    );

    const chatbotElement = container.querySelector("rasa-chatbot-widget");

    await waitFor(() => {
      expect(chatbotElement).toHaveClass("hydrated");
      expect(chatbotElement).toHaveAttribute(
        "server-url",
        "https://pro.example.com"
      );
      expect(chatbotElement).toMatchSnapshot();
    });
  });
});
