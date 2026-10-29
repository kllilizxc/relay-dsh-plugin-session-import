//#region src/host-plugin.d.ts
/** Package identity used by DSH Loader rows contributed by provider bundles. */
declare const name = "relay-dsh-plugin-session-import";
/**
 * The host half is intentionally empty. Provider bundles may mount this row
 * more than once; DSH deduplicates the browser client module by package name.
 */
declare function apply(): void;
//#endregion
export { apply, name };