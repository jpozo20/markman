const UiRequest = {} as const;
const UiResponse = {} as const;

export const ExtensionRequest = {
    PGLite:{
        PGLiteRequest: 'pglite_request',
        ImportBookmarks: 'import_bookmarks',
    }
} as const;

export const WorkerResponse = {
    PGLite:{
        PGLiteResponse: 'pglite_response',
        ImportBookmarks: 'import_postgres',
        ImportFinished: 'import_finished',
    }
} as const;