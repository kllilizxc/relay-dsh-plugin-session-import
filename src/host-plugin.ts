/** Package identity used by DSH Loader rows contributed by provider bundles. */
export const name = 'relay-dsh-plugin-session-import'

/**
 * The host half is intentionally empty. Provider bundles may mount this row
 * more than once; DSH deduplicates the browser client module by package name.
 */
export function apply(): void {}
