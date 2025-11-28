import { createRouteHandler } from 'uploadthing/next';

import { FileUploadRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: FileUploadRouter,
});
