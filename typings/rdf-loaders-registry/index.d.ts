declare module 'rdf-loaders-registry' {
    import {AnyPointer} from 'clownface';

    namespace LoaderRegistry {
        interface Loader {
        }
    }

    class LoaderRegistry {
        load<T extends any = any>(pointer: AnyPointer, options?: { basePath?: string }): T;
    }

    export = LoaderRegistry
}
