import { siteSettings } from "./siteSettings";
import { homepage } from "./homepage";
import { service } from "./service";
import { project } from "./project";
import { mediaBlock } from "./mediaBlock";
import { contactPage } from "./contactPage";

export const schemaTypes = [
  // singletons
  siteSettings,
  homepage,
  contactPage,
  // collections
  service,
  project,
  // objects
  mediaBlock,
];
