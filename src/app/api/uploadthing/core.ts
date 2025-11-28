import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const FileUploadRouter = {
  resumeUploader: f({
    pdf: {
      maxFileSize: '16MB',
    },
  }).onUploadComplete(async ({ file }) => {
    console.log('upload complete', file.name, file.url, file.size);
  }),
} satisfies FileRouter;

export type FileUploadRouter = typeof FileUploadRouter;
