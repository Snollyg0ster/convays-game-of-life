import { bind } from "./utils/decorators";

class Input {
    private aliases = {
        toggleStop: ['Space']
    }
    private listeners: Indexed<Set<VoidFn>> = {}

    constructor() {
        this.listeners = this.initListeners;
    }

    get initListeners() {
        return Object.values(this.aliases).flat().reduce<Indexed<Set<VoidFn>>>((acc, key) => {
            acc[key] = new Set()
            return acc;
        }, {});
    }

    @bind
    private onKeyDown(e: KeyboardEvent) {
        const code = e.code;
        
        if (this.listeners[code]) {
            this.listeners[code].forEach(cb => cb());
        }
    }

    public startListening() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    public stopListening() {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    public addListener(name: keyof typeof this.aliases, cb: VoidFn) {
        this.aliases[name].forEach(code => {
            this.listeners[code].add(cb);
        })
    }

    public deleteListener(name: keyof typeof this.aliases, cb: VoidFn) {
        this.aliases[name].forEach(code => {
            this.listeners[code].delete(cb);
        })
    }

    public deleteListeners() {
        this.listeners = this.initListeners;
    }
}

export const input = new Input();
