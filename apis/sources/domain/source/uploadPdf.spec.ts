import { namedNode } from '@rdfjs/data-model'
import { Readable } from 'stream'
import { uploadPdf } from './uploadPdf'
import { Source } from '..'
import { FileStorage } from '../../services/files'

describe('domain/Source', () => {
  describe('uploadPdf', () => {
    let storage: FileStorage

    beforeEach(() => {
      storage = {
        upload: jest.fn(),
      }
    })

    it('should create file with id from source resource', async () => {
      // given
      const source: Partial<Source> = {
        file: namedNode('/brochure/foo/file'),
      }
      const command = {
        contents: new Readable(),
        name: 'file',
        byteSize: 1024,
        storage,
      }

      // when
      const { state } = await uploadPdf(source as Source, command)
      const file = (await state)!

      // then
      expect(file.id).toStrictEqual(namedNode('/brochure/foo/file'))
    })

    it('should save file contents', async () => {
      // given
      const source: Partial<Source> = {
        file: namedNode('/brochure/foo/file'),
        identifier: '1234-foo',
      }
      const command = {
        contents: new Readable(),
        name: 'foobar.pdf',
        byteSize: 1024,
        storage,
      }

      // when
      await uploadPdf(source as Source, command)

      // then
      expect(storage.upload).toHaveBeenCalledWith(
        'foobar.pdf',
        'source_1234-foo',
        'application/pdf',
        command.contents)
    })

    it('should emit event', async () => {
      // given
      const source: Partial<Source> = {
        file: namedNode('/brochure/foo/file'),
      }
      const command = {
        contents: new Readable(),
        name: 'file',
        byteSize: 1024,
        storage,
      }

      // when
      const { events } = await uploadPdf(source as Source, command)
      const [pdfUploaded] = await events

      // then
      expect(pdfUploaded).toMatchObject(
        {
          name: 'pdfUploaded',
          data: {
            fileId: namedNode('/brochure/foo/file'),
          },
        },
      )
    })
  })
})
