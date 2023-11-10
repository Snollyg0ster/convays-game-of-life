import { PartialRecord } from "./types";
import { append } from "./utils/common";
import { bind } from "./utils/decorators";

type Aliases = Indexed<string[]>;
type Shortcuts = Indexed<(string | string[])[]>;

class Input<A extends Aliases, S extends Shortcuts>{
    private listeners: Indexed<Set<VoidFn>> = {}
    private shortcutListeners: PartialRecord<keyof S, Set<VoidFn>> = {}
    private pressed: Indexed<boolean> = {};
    private aliasesPressed: PartialRecord<keyof A, boolean> = {};
    private codeAliases: Indexed<keyof A>;
    private codeShortcuts: Indexed<string[]>;

    constructor(private aliases: A, private shortcuts: S) {
        this.codeAliases = this.initKeyAliases;
        this.codeShortcuts = this.initCodeShortcuts;
    }

    get initKeyAliases() {
        return Object.entries(this.aliases).reduce<Indexed<string>>((acc, [alias, keys]) => {
            keys.forEach(key => {
                acc[key] = alias;
            })

            return acc;
        }, {});
    }

    get initCodeShortcuts() {
        return Object.entries(this.shortcuts).reduce<Indexed<string[]>>((acc, [shortcut, keys]) => {
            keys.forEach(key => {
                if (typeof key === 'string') {
                    acc[key] = append(acc[key], shortcut);
                } else {
                    key.forEach(k => {
                        acc[k] = append(acc[k], shortcut);
                    })
                }
            })

            return acc;
        }, {})
    }

    @bind
    private onKeyDown(e: KeyboardEvent) {
        const code = e.code;
        
        this.pressed[code] = true;
        
        if (this.listeners[code]) {
            this.listeners[code].forEach(cb => cb());
        }

        if(this.codeAliases[code]) {
            this.aliasesPressed[this.codeAliases[code]] = true;
        }

        this.runShortcutsListener(code);
    }

    private runShortcutsListener(code: string) {
        if (!this.codeShortcuts[code]) {
            return
        }

        this.codeShortcuts[code].every(shortcut => {
            const listeners = this.shortcutListeners[shortcut];

            if (!listeners) {
                return;
            }

            const shortcutCodes = this.shortcuts as Indexed<(string | string[])[]>;
            const isPressed = shortcutCodes[shortcut]
                .every(key => typeof key === 'string' 
                    ? this.pressed[key] 
                    : key.some(k => this.pressed[k])
                )

            if (isPressed) {
                listeners.forEach(cb => cb());
            }
        })
    }

    @bind
    private onKeyUp(e: KeyboardEvent) {
        const code = e.code;
        
        delete this.pressed[code];

        if(this.codeAliases[code]) {
            this.aliasesPressed[this.codeAliases[code]] = false;
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

    public addAliasListener(name: keyof typeof this.aliases, cb: VoidFn) {
        this.aliases[name].forEach(code => {
            (this.listeners[code] || (this.listeners[code] = new Set())).add(cb);
        })
    }

    public deleteAliasListener(name: keyof typeof this.aliases, cb: VoidFn) {
        this.aliases[name].forEach(code => {
            this.listeners[code].delete(cb);
        })
    }

    public deleteShortcutListener(name: keyof typeof this.shortcuts, cb: VoidFn) {
        (this.shortcutListeners[name] || (this.shortcutListeners[name] = new Set())).delete(cb);
    }

    public addShortcutListener(name: keyof typeof this.shortcuts, cb: VoidFn) {
        (this.shortcutListeners[name] || (this.shortcutListeners[name] = new Set())).add(cb);
    }

    public deleteListeners() {
        this.listeners = {};
    }

    public deleteShortcutListeners() {
        this.shortcutListeners = {};
    }

    public isAliasPressed(name: keyof typeof this.aliases) {
        return !!this.aliasesPressed[name];
    }
}

// TODO visualize aliases and shortcuts for better UX
const aliases = {
    toggleStop: ['Space'],
    select: ['MetaLeft', 'ControlLeft']
} satisfies Aliases;
const shortcuts = {
    copy: [['MetaLeft', 'ControlLeft'], 'KeyC'],
    paste: [['MetaLeft', 'ControlLeft'], 'KeyV'],
    cut: [['MetaLeft', 'ControlLeft'], 'KeyX'],
    clear: [['MetaLeft', 'ControlLeft'], 'KeyE'],
} satisfies Shortcuts;

export const input = new Input(aliases, shortcuts);
