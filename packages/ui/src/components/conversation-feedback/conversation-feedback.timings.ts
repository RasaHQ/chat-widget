/**
 * Timing knobs for the dismissal of the conversation-feedback popup after a
 * rating is submitted. Kept in a sibling file (not inside the @Component
 * module) because Stencil requires component files to export only their
 * component class.
 *
 * Total time the popup stays on screen after the click =
 *   THANK_YOU_HOLD_MS + FADE_OUT_MS
 *
 * The visual fade-out is driven by CSS now (see the `&__thank-you` rule in
 * conversation-feedback.scss): a chained `fadeIn` + delayed `fadeOut`
 * animation on the thank-you element. These constants exist only so the
 * parent widget can compute when to unmount the popup after the animation
 * has settled - they must stay in sync with the SCSS hold / fade durations.
 *
 * Kept intentionally short (~2s) so the popup feels snappy and so a refresh
 * shortly after rating cannot show it again.
 */
export const THANK_YOU_HOLD_MS = 1500;
export const FADE_OUT_MS = 600;

export const CONVERSATION_FEEDBACK_TIMINGS = {
  THANK_YOU_HOLD_MS,
  FADE_OUT_MS,
  TOTAL_DISMISS_MS: THANK_YOU_HOLD_MS + FADE_OUT_MS,
};
