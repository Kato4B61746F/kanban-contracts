import { registerActivityPaths } from './activities.js';
import { registerAuthPaths } from './auth.js';
import { registerBoardPaths } from './boards.js';
import { registerCardPaths } from './cards.js';
import { registerCommentPaths } from './comments.js';
import { registerLabelPaths } from './labels.js';
import { registerListPaths } from './lists.js';
import { registry } from './registry.js';
import { registerWorkspacePaths } from './workspaces.js';

export { registry };

export function registerAllPaths(): void {
  registerAuthPaths();
  registerWorkspacePaths();
  registerBoardPaths();
  registerListPaths();
  registerCardPaths();
  registerLabelPaths();
  registerCommentPaths();
  registerActivityPaths();
}
