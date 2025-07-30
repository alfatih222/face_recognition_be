

export const pathToUrl = (src: string): string => {
  const baseUrl = process.env.ASSET_PATH_DEV || 'http://localhost:3000';
  return `${baseUrl}/${src}`.replace(/([^:]\/)\/+/g, '$1'); // Hapus double slash
};

export const removeSpecialChar = (str: string) =>
  str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

export const toSnakeWord = (word: string): string => {
  return word
    .toLowerCase()
    .replace(/dan/g, 'n')
    .replace(/and/g, 'n')
    .replace(/&/g, 'n')
    .replace(/\//g, ' or ')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/ /g, '_');
};

export const toDashWord = (word: string): string => {
  return word
    .toLowerCase()
    .replace(/dan/g, 'n')
    .replace(/and/g, 'n')
    .replace(/&/g, 'n')
    .replace(/\//g, ' or ')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/ /g, '-')
    .replace(/\s+/g, '_');
};

export const getMimeTypeFromBase64String = (base64) => {
  const signatures = {
    JVBERi0: 'application/pdf',
    R0lGODdh: 'image/gif',
    R0lGODlh: 'image/gif',
    iVBORw0KGgo: 'image/png',
    '/9j/': 'image/jpg',
  };

  for (let s in signatures) {
    if (base64.indexOf(s) === 0) {
      return signatures[s];
    }
  }

  return '';
};

export const setDescRequired = (field: string, dt: string[]) => {
  return (
    `required when the \`${field}\` value is ` +
    dt.reduce((prev, text, i) => {
      let resp = prev;

      resp += `\`${text}\``;

      if (dt.length == i + 1) return resp;

      resp += ' || ';
      return resp;
    }, '')
  );
};

export const setPointDB = (field: string, tableName: string): string => {
  return `it's reference from \`${field}\` on \`${tableName}\``;
};

export const setQueryWithParams = (
  query: string,
  params?: Record<string, string | undefined | boolean | number | null>,
): string => {
  let respons = query;

  Object.keys(params ?? {}).forEach((key) => {
    const value = params[key];
    const isString = typeof value == 'string';
    respons = respons.replace(
      `:${key}`,
      isString ? `'${value}'` : value == undefined ? null : value.toString(),
    );
  });
  return respons;
};

export const toSentenceCase = (input: string): string => {
  if (!input) return '';
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

export const toTitleCase = (input: string): string => {
  if (!input) return '';
  return input
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
