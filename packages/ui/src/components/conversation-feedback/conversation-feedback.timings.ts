/**
 * Timing knobs for the dismissal of the conversation-feedback popup after a
 * rating is submitted. Kept in a sibling file (not inside the @Component
 * module) because Stencil requires component files to export only their
 * component class.
 *
 * Total time the popup stays on screen after the click =
 *   THANK_YOU_HOLD_MS + FADE_OUT_MS
 *
 * Kept intentionally short (~2s) so the popup feels snappy and so a refresh
 * shortly after rating cannot show it again. FADE_OUT_MS must stay in sync
 * with the `--fading-out` rule in conversation-feedback.scss.
 */
export const THANK_YOU_HOLD_MS = 1500;
export const FADE_OUT_MS = 600;

export const CONVERSATION_FEEDBACK_TIMINGS = {
  THANK_YOU_HOLD_MS,
  FADE_OUT_MS,
  TOTAL_DISMISS_MS: THANK_YOU_HOLD_MS + FADE_OUT_MS,
};
