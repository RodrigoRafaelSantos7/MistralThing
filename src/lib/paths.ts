// Authentication paths (public)
export const loginPath = () => "/login";
export const magicLinkPath = () => "/magic-link";
export const loggedOutPath = () => "/logged-out";

// Protected paths (private)
export const indexPath = () => "/";
export const accountPath = () => "/account";
export const accountSubscriptionPath = () => "/account/subscription";
export const accountPreferencesPath = () => "/account/preferences";
export const accountModelsPath = () => "/account/models";
export const accountAppearancePath = () => "/account/appearance";
export const threadPath = (slug: string) => `/t/${slug}`;
