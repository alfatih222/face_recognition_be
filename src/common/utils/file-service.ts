import {
  createWriteStream,
  ReadStream,
  unlink,
  existsSync,
  mkdirSync,
} from 'fs';
import { FileUpload } from 'graphql-upload';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { Log } from './log';
import { toSnakeWord } from './string-helpers';
import { getRandomInt } from '@/src/common/utils/number-helpers';
import { nanoid } from 'nanoid';

export enum UploadType {
  IMAGE,
  PDF,
  PDF_DOC_XLS,
  PPTX,
  PPT,
}

export async function storeFile(
  folderPath: string,
  file: FileUpload,
  type: UploadType,
  i18n: I18nService,
) {
  const { createReadStream, filename, mimetype }: any = file;
console.log('sdsd', mimetype)
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true });
  }

  const _buffer: ReadStream = createReadStream();
  let buffers: Buffer[] = [];
  let byteLength = 0;
  for await (const uploadChunk of _buffer) {
    byteLength += (uploadChunk as Buffer).byteLength;
    buffers.push(uploadChunk as Buffer);
  }
console.log('byteLength', byteLength)
  if (type === UploadType.IMAGE) {
    if (!['image/jpeg', 'image/png'].includes(mimetype))
      throw new Error(`${i18n.t('upload.FILE_NOT_IMAGE')}`);
    if (byteLength > 2 * 5024 * 5024)
      throw new Error(`${i18n.t('upload.FILE_TOO_BIG', { args: { limit: '2MB' } })}`);
  }

  if (type === UploadType.PDF) {
    if (!['application/pdf'].includes(mimetype))
      throw new Error(`${i18n.t('upload.FILE_NOT_PDF')}`);
    if (byteLength > 10 * 1024 * 1024)
      throw new Error(`${i18n.t('upload.FILE_TOO_BIG', { args: { limit: '10MB' } })}`);
  }

  const ext = filename.split('.').pop();
  const stream: ReadStream = createReadStream();
  const storedFileName = `${nanoid(64)}.${ext}`;
  const storedFileUrl = `${folderPath}/${storedFileName}`;

  await new Promise((resolve, reject) => {
    const writeStream = createWriteStream(storedFileUrl);
    writeStream.on('finish', resolve);
    writeStream.on('error', (error) => {
      unlink(storedFileUrl, () => reject(error));
    });
    stream.on('error', (error) => writeStream.destroy(error));
    stream.pipe(writeStream);
  });

  return { filename: storedFileName };
}

export async function deleteFile(folderPath: string, storedFilename: string) {
  if (folderPath.includes('./public/uploads/dummies')) return;

  const storedFileUrl = `${folderPath}/${storedFilename}`;

  if (existsSync(storedFileUrl)) {
    unlink(storedFileUrl, (err) => {
      if (err) console.log(err);
      else console.log(`Deleted file: ${storedFilename}`);
    });
  }
}

export async function newStoreFile(
  folderPath: string,
  file: FileUpload | any[],
  type: UploadType,
  i18n: I18nService,
  current_src?: string[],
) {
  let filenames: string[] = [];
  let urlTemps: string[] = [];
  let index: number = 0;
  const isIterate = Array.isArray(file);

  while (!isIterate ? !index : index < file.length) {
    const { createReadStream, filename, mimetype }: any = isIterate
      ? typeof file[index] == 'object'
        ? file[index].file
        : {}
      : file;

    const _buffer: ReadStream = createReadStream();
    let buffers: Buffer[] = [];
    let byteLength = 0;
    for await (const uploadChunk of _buffer) {
      byteLength += (uploadChunk as Buffer).byteLength;
      buffers.push(uploadChunk as Buffer);
    }

    if (type === UploadType.IMAGE) {
      if (!['image/jpeg', 'image/png'].includes(mimetype)) {
        await unlinkFile(urlTemps);
        throw new Error(`${i18n.t('upload.FILE_NOT_IMAGE')}`);
      }
      if (byteLength > 10 * 1024 * 1024) {
        await unlinkFile(urlTemps);
        throw new Error(`${i18n.t('upload.FILE_TOO_BIG', { args: { limit: '10MB' } })}`);
      }
    }

    if (type === UploadType.PDF || type === UploadType.PDF_DOC_XLS) {
      const mimetypeList = [
        'application/pdf',
        'text/csv',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
      ];
      if (!mimetypeList.includes(mimetype) && type == UploadType.PDF_DOC_XLS) {
        await unlinkFile(urlTemps);
        throw new Error(`${i18n.t('upload.FILE_NOT_PDF_DOCX_XLSX')}`);
      }
      if (!['application/pdf'].includes(mimetype) && type !== UploadType.PDF_DOC_XLS) {
        await unlinkFile(urlTemps);
        throw new Error(`${i18n.t('upload.FILE_NOT_PDF')}`);
      }
      if (byteLength > 10 * 1024 * 1024) {
        await unlinkFile(urlTemps);
        throw new Error(`${i18n.t('upload.FILE_TOO_BIG', { args: { limit: '3MB' } })}`);
      }
    }

    const dateNow = moment().format('YYYYMMDD');
    const fileNameWithoutExt = toSnakeWord(
      filename.split('.').slice(0, -1).join('.').substring(0, 150),
    );
    const ext = filename.split('.').pop();
    const stream: ReadStream = createReadStream();
    const storedFileName = `${fileNameWithoutExt}_${nanoid(getRandomInt(6, 25))}.${ext}`;
    const storedFileUrl = `${folderPath}/${dateNow}/${storedFileName}`;

    if (!existsSync(`${folderPath}/${dateNow}`)) {
      mkdirSync(`${folderPath}/${dateNow}`, { recursive: true });
    }

    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(storedFileUrl);
      writeStream.on('finish', resolve);
      writeStream.on('error', (error) => {
        unlink(storedFileUrl, () => reject(error));
      });
      stream.on('error', (error) => writeStream.destroy(error));
      stream.pipe(writeStream);
    });

    filenames.push(storedFileUrl.replace('./public/uploads/', ''));
    urlTemps.push(storedFileUrl);

    index++;
  }

  if (Array.isArray(current_src)) await unlinkFile(current_src);

  return { filenames };
}

const unlinkFile = async (data: string[]) => {
  for (const src of data.filter(
    (e) =>
      !e.includes('./public/uploads/dummies') &&
      !e.includes('./public/uploads/initials') &&
      !e.includes('./public/uploads/signatures'),
  )) {
    unlink(src, (err) => {
      if (err) console.log(err);
      else Log({ message: `Deleted file: ${src}` });
    });
  }
};

export async function toBuffer(file: FileUpload): Promise<Buffer> {
    const chunks = [];
    return new Promise((resolve, reject) => {
      file.createReadStream()
        .on('data', (chunk) => chunks.push(chunk))
        .on('end', () => resolve(Buffer.concat(chunks)))
        .on('error', reject);
    });
}
