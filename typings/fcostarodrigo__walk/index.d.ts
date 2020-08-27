declare module '@fcostarodrigo/walk' {
  interface Walk {
    (path?: string, listFolders?: boolean, walkFolder?: (path: string) => boolean): AsyncIterable<string>;
  }

  const walk: Walk;

  export = walk;
}
