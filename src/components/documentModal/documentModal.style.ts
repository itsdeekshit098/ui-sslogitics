// Strict extraction of styling properties per architectural rules.
// Since the project natively utilizes TailwindCSS and Shadcn UI logic,
// styles are isolated as string constants here instead of forced styled-components.

export const DM_DIALOG_CONTENT =
  "w-[95vw] max-w-175 max-h-[85vh] overflow-y-auto";
export const DM_GRID_CONTAINER =
  "grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 py-4";
export const DM_CARD_CONTAINER =
  "border rounded-lg p-3 md:p-4 flex flex-col justify-between space-y-3 shadow-sm bg-card";
export const DM_CARD_HEADER =
  "font-medium text-sm md:text-base flex items-center justify-between";

// Active Document View Styles
export const DM_ACTIVE_DOC_WRAPPER =
  "flex bg-green-50/50 dark:bg-green-950/20 p-2 rounded items-center gap-2 mt-auto";
export const DM_BUTTON_VIEW =
  "flex-1 text-green-700 bg-white dark:bg-black hover:bg-green-100";
export const DM_BUTTON_DELETE =
  "text-red-500 hover:text-red-600 hover:bg-red-50";

// Upload Missing State Styles
export const DM_UPLOAD_WRAPPER = "mt-auto";
export const DM_UPLOAD_DROPZONE =
  "relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:bg-muted/50 transition-colors text-center cursor-pointer";
export const DM_UPLOAD_INPUT_FIELD =
  "absolute inset-0 w-full h-full opacity-0 cursor-pointer";
export const DM_UPLOAD_ICON_CONTAINER =
  "h-6 w-6 text-muted-foreground mx-auto mb-2";
export const DM_UPLOAD_SUBTITLE = "text-xs text-muted-foreground";

export const DM_LOADER_ICON = "h-4 w-4 animate-spin text-muted-foreground";
