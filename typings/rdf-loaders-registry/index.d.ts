declare module 'rdf-loaders-registry' {
    import {Clownface} from 'clownface';

    namespace LoaderRegistry {
        interface Loader {
        }
    }

    class LoaderRegistry {
        load<T extends any = any>(pointer: Clownface, options?: { basePath?: string }): T;
    }

    export = LoaderRegistry
}
