declare module 'rdf-loader-code/ecmaScript' {
    import LoaderRegistry from 'rdf-loaders-registry';

    class EcmaScriptLoader {
        static register(registry: LoaderRegistry): void
    }

    export = EcmaScriptLoader
}

declare module 'rdf-loader-code/ecmaScriptLiteral' {
    import LoaderRegistry from 'rdf-loaders-registry';

    class EcmaScriptLiteralLoader {
        static register(registry: LoaderRegistry): void
    }

    export = EcmaScriptLiteralLoader
}
