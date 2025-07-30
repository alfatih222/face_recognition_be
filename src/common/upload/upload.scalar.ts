import { GraphQLScalarType } from 'graphql';
import { createGraphQLError } from '@graphql-tools/utils';

export const ImageFile = new GraphQLScalarType({
  name: 'ImageFile',
  description:
    'An Image File, format includes .jpg, .jpeg & .png. maximum filesize is 2MB',
  parseValue: async (value: any) => {
    if (value != null && 'promise' in value) {
      // graphql-upload v10
      return value.promise;
    } else {
      // graphql-upload v9
      return value;
    }
  },
  serialize: (value) => value,
  parseLiteral: (ast) => {
    throw createGraphQLError('ImageFile scalar literal unsupported', {
      nodes: ast,
    });
  },
});

export const ArchiveFile = new GraphQLScalarType({
  name: 'PDFFileArchives',
  description:
    'format includes .pdf, .doc, pptx, ppt, docx, .xls,. and .xlsx. maximum filesize is 3MB',
  parseValue: async (value: any) => {
    if (value != null && 'promise' in value) {
      // graphql-upload v10
      return value.promise;
    } else {
      // graphql-upload v9
      return value;
    }
  },
  serialize: (value) => value,
  parseLiteral: (ast) => {
    throw createGraphQLError('PDFFileArchives scalar literal unsupported', {
      nodes: ast,
    });
  },
});

export const PDFFile = new GraphQLScalarType({
  name: 'PDFFile',
  description: 'A PDF File, maximum filesize is 3MB',
  parseValue: async (value: any) => {
    if (value != null && 'promise' in value) {
      // graphql-upload v10
      return value.promise;
    } else {
      // graphql-upload v9
      return value;
    }
  },
  serialize: (value) => value,
  parseLiteral: (ast) => {
    throw createGraphQLError('PDFFile scalar literal unsupported', {
      nodes: ast,
    });
  },
});
