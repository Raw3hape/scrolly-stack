/**
 * Opt-in page loading skeleton — replaces the root Spinner
 * to prevent jarring flash during client-side navigation.
 *
 * Renders an invisible placeholder that matches the page's
 * grid layout, so the transition from loading → loaded is seamless.
 */
export default function OptInLoading() {
  return <div className="v2-content-wrapper" data-content-wrapper />;
}
