import { bind } from "./utils/decorators";

class Input {
    private aliases = {
        toggleStop: ['Space'],
        select: ['MetaLeft']
    }
    private keyAliases: Indexed<string> = {}
    private listeners: Indexed<Set<VoidFn>> = {}
    private pressed: Indexed<boolean>;

    constructor() {
        this.listeners = this.initListeners;
        this.keyAliases = this.initKeyAliases;
        this.pressed = this.initPressed;
    }

    get initPressed() {
        return Object.keys(this.aliases).reduce<Indexed<boolean>>((acc, key) => {
            acc[key] = false;
            return acc;
        }, {})
    }

    get initListeners() {
        return Object.values(this.aliases).flat().reduce<Indexed<Set<VoidFn>>>((acc, key) => {
            acc[key] = new Set()
            return acc;
        }, {});
    }

    get initKeyAliases() {
        return Object.entries(this.aliases).reduce<Indexed<string>>((acc, [alias, keys]) => {
            keys.forEach(key => {
                acc[key] = alias;
            })

            return acc;
        }, {});
    }

    @bind
    private onKeyDown(e: KeyboardEvent) {
        const code = e.code;
        
        if (this.listeners[code]) {
            this.listeners[code].forEach(cb => cb());
        }

        if(this.keyAliases[code]) {
            this.pressed[this.keyAliases[code]] = true;
        }
    }

    @bind
    private onKeyUp(e: KeyboardEvent) {
        const code = e.code;
        
        if(this.keyAliases[code]) {
            this.pressed[this.keyAliases[code]] = false;
        }
    }

    public startListening() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    public stopListening() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
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

    public getPressed(name: keyof typeof this.aliases) {
        return this.pressed[name];
    }
}

export const input = new Input();
