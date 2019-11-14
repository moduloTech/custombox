declare namespace Custombox {
    interface OptionsSchema {
        overlay: OverlaySchema;
        content: ContentSchema;
        loader: LoaderSchema;
    }
    interface OverlaySchema extends Speed, Callback {
        color: string;
        opacity: number;
        close: boolean;
        active: boolean;
    }
    interface ContentSchema extends Speed, Callback {
        target: string;
        animateFrom: string;
        animateTo: string;
        positionX: string;
        positionY: string;
        width: string;
        effect: string;
        fullscreen: boolean;
        clone: boolean;
        delay: number;
        id: string;
        container: string;
        close: boolean;
    }
    interface LoaderSchema {
        active: boolean;
        color: string;
        background: string;
        speed: number;
    }
    interface Speed {
        speedIn: number;
        speedOut: number;
    }
    interface Callback {
        onOpen: Function;
        onComplete: Function;
        onClose: Function;
    }
    class modal {
        private options;
        private container;
        private content;
        private overlay;
        private scroll;
        private loader;
        private action;
        constructor(options: OptionsSchema);
        open(): void;
        build(): void;
        static close(id?: string): void;
        static closeAll(): void;
        private _close;
        private dispatchEvent;
        private listeners;
    }
}
