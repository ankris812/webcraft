declare module 'pug-plugin' {
    import {RuleSetUseItem, WebpackPluginInstance} from 'webpack';
    type PugPluginConstructor = new (
        ...param: unknown[]
    ) => WebpackPluginInstance;
    const PugPlugin: PugPluginConstructor & {
        loader: RuleSetUseItem;
    };
    export default PugPlugin;
}
