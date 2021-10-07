import { BUILDER_PAGE_URL } from "constants/routes";
import history from "utils/history";

export const navigateToCanvas = (
  currentPath: string,
  widgetPageId: string,
  widgetId: string,
  applicationId: string,
) => {
  const canvasEditorURL = `${BUILDER_PAGE_URL({
    applicationId,
    pageId: widgetPageId,
    hash: widgetId,
  })}`;
  if (currentPath !== canvasEditorURL) {
    history.push(canvasEditorURL);
  }
};
