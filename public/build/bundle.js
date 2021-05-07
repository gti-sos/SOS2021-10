
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1, Object: Object_1, console: console_1$6 } = globals;

    // (209:0) {:else}
    function create_else_block$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (202:0) {#if componentParams}
    function create_if_block$a(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(202:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
<<<<<<< HEAD
    	const if_block_creators = [create_if_block$a, create_else_block$6];
=======
    	const if_block_creators = [create_if_block$9, create_else_block$6];
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn("Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading");

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    	try {
    		window.history.replaceState(undefined, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event("hashchange"));
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute: " + href);
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);

    	node.addEventListener("click", scrollstateHistoryHandler);
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {HTMLElementEventMap} event - an onclick event attached to an anchor tag
     */
    function scrollstateHistoryHandler(event) {
    	// Prevent default anchor onclick behaviour
    	event.preventDefault();

    	const href = event.currentTarget.getAttribute("href");

    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument - strings must start with / or *");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == "string") {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || "/";
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || "/";
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || "") || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	if (restoreScrollState) {
    		window.addEventListener("popstate", event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		});

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.scrollX, previousScrollState.scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick("conditionsFailed", detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoading", Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == "object" && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    	});

    	const writable_props = ["routes", "prefix", "restoreScrollState"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		scrollstateHistoryHandler,
    		createEventDispatcher,
    		afterUpdate,
    		regexparam,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		lastLoc,
    		componentObj
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("previousScrollState" in $$props) previousScrollState = $$props.previousScrollState;
    		if ("lastLoc" in $$props) lastLoc = $$props.lastLoc;
    		if ("componentObj" in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? "manual" : "auto";
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

<<<<<<< HEAD
    /* src/frontend/NotFound.svelte generated by Svelte v3.37.0 */

    const file$t = "src/frontend/NotFound.svelte";

    function create_fragment$t(ctx) {
    	let main;
    	let h3;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h3 = element("h3");
    			h3.textContent = "This view doesn't exist.";
    			add_location(h3, file$t, 1, 1, 8);
    			add_location(main, file$t, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$t.name
    		});
    	}
=======
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    }

    function getOriginalBodyPadding() {
      const style = window ? window.getComputedStyle(document.body, null) : {};

      return parseInt((style && style.getPropertyValue('padding-right')) || 0, 10);
    }

    function getScrollbarWidth() {
      let scrollDiv = document.createElement('div');
      // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    function setScrollbarWidth(padding) {
      document.body.style.paddingRight = padding > 0 ? `${padding}px` : null;
    }

    function isBodyOverflowing() {
      return window ? document.body.clientWidth < window.innerWidth : false;
    }

    function conditionallyUpdateScrollbar() {
      const scrollbarWidth = getScrollbarWidth();
      // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433
      const fixedContent = document.querySelectorAll(
        '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
      )[0];
      const bodyPadding = fixedContent
        ? parseInt(fixedContent.style.paddingRight || 0, 10)
        : 0;

      if (isBodyOverflowing()) {
        setScrollbarWidth(bodyPadding + scrollbarWidth);
      }
    }

    function browserEvent(target, ...args) {
      target.addEventListener(...args);

      return () => target.removeEventListener(...args);
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

<<<<<<< HEAD
    /* node_modules/sveltestrap/src/Table.svelte generated by Svelte v3.37.0 */
    const file$s = "node_modules/sveltestrap/src/Table.svelte";

    // (35:0) {:else}
    function create_else_block$5(ctx) {
    	let table;
=======
    /* node_modules/sveltestrap/src/Alert.svelte generated by Svelte v3.37.0 */
    const file$t = "node_modules/sveltestrap/src/Alert.svelte";

    // (22:0) {#if isOpen}
    function create_if_block$8(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let div_transition;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let current;
    	let if_block0 = /*toggle*/ ctx[3] && create_if_block_2$2(ctx);
    	const if_block_creators = [create_if_block_1$3, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let div_levels = [/*$$restProps*/ ctx[7], { class: /*classes*/ ctx[5] }, { role: "alert" }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
<<<<<<< HEAD
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$s, 35, 2, 861);
=======
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			set_attributes(div, div_data);
    			add_location(div, file$t, 22, 2, 637);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*toggle*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7],
    				(!current || dirty & /*classes*/ 32) && { class: /*classes*/ ctx[5] },
    				{ role: "alert" }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
<<<<<<< HEAD
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(35:0) {:else}",
=======
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(22:0) {#if isOpen}",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (29:0) {#if responsive}
    function create_if_block$9(ctx) {
    	let div;
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$s, 30, 4, 773);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$s, 29, 2, 735);
=======
    // (28:4) {#if toggle}
    function create_if_block_2$2(ctx) {
    	let button;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$t, 33, 8, 900);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$t, 28, 6, 767);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggle*/ ctx[3])) /*toggle*/ ctx[3].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*closeClassNames*/ 64) {
    				attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			}

    			if (dirty & /*closeAriaLabel*/ 2) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(28:4) {#if toggle}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
<<<<<<< HEAD
    		id: create_if_block$9.name,
=======
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if children}
    function create_if_block_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		type: "if",
    		source: "(37:4) {#if children}",
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
=======
    function create_fragment$t(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[2] && create_if_block$8(ctx);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
<<<<<<< HEAD
    		id: create_fragment$s.name,
=======
    		id: create_fragment$t.name,
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    function instance$s($$self, $$props, $$invalidate) {
=======
    function instance$t($$self, $$props, $$invalidate) {
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let classes;
    	let closeClassNames;

    	const omit_props_names = [
    		"class","children","color","closeClassName","closeAriaLabel","isOpen","toggle","fade","transition"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Alert", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { children = undefined } = $$props;
    	let { color = "success" } = $$props;
    	let { closeClassName = "" } = $$props;
    	let { closeAriaLabel = "Close" } = $$props;
    	let { isOpen = true } = $$props;
    	let { toggle = undefined } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { transition = { duration: fade$1 ? 400 : 0 } } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(8, className = $$new_props.class);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("color" in $$new_props) $$invalidate(9, color = $$new_props.color);
    		if ("closeClassName" in $$new_props) $$invalidate(10, closeClassName = $$new_props.closeClassName);
    		if ("closeAriaLabel" in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("isOpen" in $$new_props) $$invalidate(2, isOpen = $$new_props.isOpen);
    		if ("toggle" in $$new_props) $$invalidate(3, toggle = $$new_props.toggle);
    		if ("fade" in $$new_props) $$invalidate(11, fade$1 = $$new_props.fade);
    		if ("transition" in $$new_props) $$invalidate(4, transition = $$new_props.transition);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fadeTransition: fade,
    		classnames,
    		className,
    		children,
    		color,
    		closeClassName,
    		closeAriaLabel,
    		isOpen,
    		toggle,
    		fade: fade$1,
    		transition,
    		classes,
    		closeClassNames
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(8, className = $$new_props.className);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("color" in $$props) $$invalidate(9, color = $$new_props.color);
    		if ("closeClassName" in $$props) $$invalidate(10, closeClassName = $$new_props.closeClassName);
    		if ("closeAriaLabel" in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("isOpen" in $$props) $$invalidate(2, isOpen = $$new_props.isOpen);
    		if ("toggle" in $$props) $$invalidate(3, toggle = $$new_props.toggle);
    		if ("fade" in $$props) $$invalidate(11, fade$1 = $$new_props.fade);
    		if ("transition" in $$props) $$invalidate(4, transition = $$new_props.transition);
    		if ("classes" in $$props) $$invalidate(5, classes = $$new_props.classes);
    		if ("closeClassNames" in $$props) $$invalidate(6, closeClassNames = $$new_props.closeClassNames);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, color, toggle*/ 776) {
    			$$invalidate(5, classes = classnames(className, "alert", `alert-${color}`, { "alert-dismissible": toggle }));
    		}

    		if ($$self.$$.dirty & /*closeClassName*/ 1024) {
    			$$invalidate(6, closeClassNames = classnames("close", closeClassName));
    		}
    	};

    	return [
    		children,
    		closeAriaLabel,
    		isOpen,
    		toggle,
    		transition,
    		classes,
    		closeClassNames,
    		$$restProps,
    		className,
    		color,
    		closeClassName,
    		fade$1,
    		$$scope,
    		slots
    	];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

<<<<<<< HEAD
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0
=======
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			class: 8,
    			children: 0,
    			color: 9,
    			closeClassName: 10,
    			closeAriaLabel: 1,
    			isOpen: 2,
    			toggle: 3,
    			fade: 11,
    			transition: 4
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
<<<<<<< HEAD
    			id: create_fragment$s.name
=======
    			id: create_fragment$t.name
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		});
    	}

    	get class() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeClassName() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeClassName(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

<<<<<<< HEAD
    /* node_modules/sveltestrap/src/Button.svelte generated by Svelte v3.37.0 */
    const file$r = "node_modules/sveltestrap/src/Button.svelte";

    // (48:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);
=======
    	get transition() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	set transition(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Breadcrumb.svelte generated by Svelte v3.37.0 */
    const file$s = "node_modules/sveltestrap/src/Breadcrumb.svelte";

    // (17:4) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
<<<<<<< HEAD
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$r, 48, 2, 985);
=======
    			if (default_slot) default_slot.c();
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(17:4) {:else}",
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (33:0) {#if href}
    function create_if_block$8(ctx) {
    	let a;
=======
    // (15:4) {#if children}
    function create_if_block$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 4) set_data_dev(t, /*children*/ ctx[2]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(15:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let nav;
    	let ol;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let current_block_type_index;
    	let if_block;
    	let current;
<<<<<<< HEAD
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$4, create_else_block$4];
=======
    	const if_block_creators = [create_if_block$7, create_else_block$4];
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let nav_levels = [
    		/*$$restProps*/ ctx[4],
    		{ "aria-label": /*ariaLabel*/ ctx[1] },
    		{ class: /*className*/ ctx[0] }
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ol = element("ol");
    			if_block.c();
<<<<<<< HEAD
    			set_attributes(a, a_data);
    			add_location(a, file$r, 33, 2, 752);
=======
    			attr_dev(ol, "class", /*listClasses*/ ctx[3]);
    			add_location(ol, file$s, 13, 2, 346);
    			set_attributes(nav, nav_data);
    			add_location(nav, file$s, 12, 0, 280);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ol);
    			if_blocks[current_block_type_index].m(ol, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(ol, null);
    			}

    			if (!current || dirty & /*listClasses*/ 8) {
    				attr_dev(ol, "class", /*listClasses*/ ctx[3]);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
    				(!current || dirty & /*ariaLabel*/ 2) && { "aria-label": /*ariaLabel*/ ctx[1] },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
<<<<<<< HEAD
    		block: block_1,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(33:0) {#if href}",
=======
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let listClasses;
    	const omit_props_names = ["class","ariaLabel","children","listClassName"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Breadcrumb", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { ariaLabel = "breadcrumb" } = $$props;
    	let { children = undefined } = $$props;
    	let { listClassName = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("ariaLabel" in $$new_props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
    		if ("children" in $$new_props) $$invalidate(2, children = $$new_props.children);
    		if ("listClassName" in $$new_props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		ariaLabel,
    		children,
    		listClassName,
    		listClasses
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("ariaLabel" in $$props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
    		if ("children" in $$props) $$invalidate(2, children = $$new_props.children);
    		if ("listClassName" in $$props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("listClasses" in $$props) $$invalidate(3, listClasses = $$new_props.listClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*listClassName*/ 32) {
    			$$invalidate(3, listClasses = classnames("breadcrumb", listClassName));
    		}
    	};

    	return [
    		className,
    		ariaLabel,
    		children,
    		listClasses,
    		$$restProps,
    		listClassName,
    		$$scope,
    		slots
    	];
    }

    class Breadcrumb extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			class: 0,
    			ariaLabel: 1,
    			children: 2,
    			listClassName: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Breadcrumb",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get class() {
    		throw new Error("<Breadcrumb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Breadcrumb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Breadcrumb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Breadcrumb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Breadcrumb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Breadcrumb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listClassName() {
    		throw new Error("<Breadcrumb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listClassName(value) {
    		throw new Error("<Breadcrumb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/BreadcrumbItem.svelte generated by Svelte v3.37.0 */
    const file$r = "node_modules/sveltestrap/src/BreadcrumbItem.svelte";

    // (19:2) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(19:2) {:else}",
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (58:6) {#if close}
    function create_if_block_2$2(ctx) {
    	let span;
=======
    // (17:2) {#if children}
    function create_if_block$6(ctx) {
    	let t;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	const block = {
    		c: function create() {
<<<<<<< HEAD
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$r, 58, 8, 1171);
=======
    			t = text(/*children*/ ctx[1]);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
<<<<<<< HEAD
    		block: block_1,
    		id: create_if_block_2$2.name,
=======
    		block,
    		id: create_if_block$6.name,
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		type: "if",
    		source: "(17:2) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let li;
    	let current_block_type_index;
    	let if_block;
    	let li_aria_current_value;
    	let current;
<<<<<<< HEAD
    	const if_block_creators = [create_if_block_2$2, create_if_block_3, create_else_block_2];
=======
    	const if_block_creators = [create_if_block$6, create_else_block$3];
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let li_levels = [
    		/*$$restProps*/ ctx[3],
    		{ class: /*classes*/ ctx[2] },
    		{
    			"aria-current": li_aria_current_value = /*active*/ ctx[0] ? "page" : undefined
    		}
    	];

    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			set_attributes(li, li_data);
    			add_location(li, file$r, 15, 0, 277);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_blocks[current_block_type_index].m(li, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(li, null);
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] },
    				(!current || dirty & /*active*/ 1 && li_aria_current_value !== (li_aria_current_value = /*active*/ ctx[0] ? "page" : undefined)) && { "aria-current": li_aria_current_value }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (44:4) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
=======
    function instance$r($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active","children"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BreadcrumbItem", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { children = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(0, active = $$new_props.active);
    		if ("children" in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		children,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(0, active = $$new_props.active);
    		if ("children" in $$props) $$invalidate(1, children = $$new_props.children);
    		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active*/ 17) {
    			$$invalidate(2, classes = classnames(className, active ? "active" : false, "breadcrumb-item"));
    		}
    	};

    	return [active, children, classes, $$restProps, className, $$scope, slots];
    }

    class BreadcrumbItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { class: 4, active: 0, children: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BreadcrumbItem",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get class() {
    		throw new Error("<BreadcrumbItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<BreadcrumbItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<BreadcrumbItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<BreadcrumbItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<BreadcrumbItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<BreadcrumbItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Button.svelte generated by Svelte v3.37.0 */
    const file$q = "node_modules/sveltestrap/src/Button.svelte";

    // (48:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$q, 48, 2, 985);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*close, children, $$scope*/ 65539) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
<<<<<<< HEAD
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(44:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (42:4) {#if children}
    function create_if_block_1$4(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(42:4) {#if children}",
=======
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(48:0) {:else}",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block_1;
    }

<<<<<<< HEAD
    function create_fragment$r(ctx) {
=======
    // (33:0) {#if href}
    function create_if_block$5(ctx) {
    	let a;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
<<<<<<< HEAD
    	const if_block_creators = [create_if_block$8, create_else_block_1];
=======
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$q, 33, 2, 752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
<<<<<<< HEAD
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
=======
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(33:0) {#if href}",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block_1;
    }

<<<<<<< HEAD
    function instance$r($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","outline","size","style","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = "secondary" } = $$props;
    	let { disabled = false } = $$props;
    	let { href = "" } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = "" } = $$props;
    	let { value = "" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}
=======
    // (62:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(62:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (60:25) 
    function create_if_block_3(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(60:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (58:6) {#if close}
    function create_if_block_2$1(ctx) {
    	let span;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$q, 58, 8, 1171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(58:6) {#if close}",
    		ctx
    	});

    	return block_1;
    }

    // (57:10)        
    function fallback_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_if_block_3, create_else_block_2];
    	const if_blocks = [];

<<<<<<< HEAD
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 0,
    			close: 1,
    			color: 13,
    			disabled: 2,
    			href: 3,
    			outline: 14,
    			size: 15,
    			style: 4,
    			value: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
=======
    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

<<<<<<< HEAD
    const { console: console_1$5 } = globals;
    const file$q = "src/frontend/obesity/ObesitySv.svelte";
=======
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(57:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (44:4) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(44:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (42:4) {#if children}
    function create_if_block_1$2(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(42:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$q(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
<<<<<<< HEAD
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(122:8) <Button on:click={deleteObesity(obe.country,obe.year)}>",
    		ctx
    	});

    	return block;
    }

    // (114:3) {#each obesity as obe}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*obe*/ ctx[12].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*obe*/ ctx[12].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*obe*/ ctx[12].man_percent + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*obe*/ ctx[12].woman_percent + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*obe*/ ctx[12].total_population + "";
    	let t8;
    	let t9;
    	let td5;
    	let button;
    	let t10;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteObesity*/ ctx[4](/*obe*/ ctx[12].country, /*obe*/ ctx[12].year))) /*deleteObesity*/ ctx[4](/*obe*/ ctx[12].country, /*obe*/ ctx[12].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t10 = space();
    			attr_dev(a, "href", a_href_value = "#/obesity-stats/" + /*obe*/ ctx[12].country + "/" + /*obe*/ ctx[12].year);
    			add_location(a, file$q, 115, 8, 2727);
    			attr_dev(td0, "class", "svelte-1h2kj47");
    			add_location(td0, file$q, 115, 4, 2723);
    			attr_dev(td1, "class", "svelte-1h2kj47");
    			add_location(td1, file$q, 117, 4, 2806);
    			attr_dev(td2, "class", "svelte-1h2kj47");
    			add_location(td2, file$q, 118, 4, 2830);
    			attr_dev(td3, "class", "svelte-1h2kj47");
    			add_location(td3, file$q, 119, 4, 2861);
    			attr_dev(td4, "class", "svelte-1h2kj47");
    			add_location(td4, file$q, 120, 4, 2894);
    			attr_dev(td5, "class", "svelte-1h2kj47");
    			add_location(td5, file$q, 121, 4, 2930);
    			attr_dev(tr, "class", "svelte-1h2kj47");
    			add_location(tr, file$q, 114, 4, 2714);
=======
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","outline","size","style","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = "secondary" } = $$props;
    	let { disabled = false } = $$props;
    	let { href = "" } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = "" } = $$props;
    	let { value = "" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ("block" in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$new_props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$new_props) $$invalidate(13, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ("outline" in $$new_props) $$invalidate(14, outline = $$new_props.outline);
    		if ("size" in $$new_props) $$invalidate(15, size = $$new_props.size);
    		if ("style" in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ("value" in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ("$$scope" in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		outline,
    		size,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(10, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(11, active = $$new_props.active);
    		if ("block" in $$props) $$invalidate(12, block = $$new_props.block);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$props) $$invalidate(13, color = $$new_props.color);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$props) $$invalidate(3, href = $$new_props.href);
    		if ("outline" in $$props) $$invalidate(14, outline = $$new_props.outline);
    		if ("size" in $$props) $$invalidate(15, size = $$new_props.size);
    		if ("style" in $$props) $$invalidate(4, style = $$new_props.style);
    		if ("value" in $$props) $$invalidate(5, value = $$new_props.value);
    		if ("ariaLabel" in $$props) $$invalidate(6, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ("defaultAriaLabel" in $$props) $$invalidate(8, defaultAriaLabel = $$new_props.defaultAriaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(6, ariaLabel = $$props["aria-label"]);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 64514) {
    			$$invalidate(7, classes = classnames(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active }));
    		}

    		if ($$self.$$.dirty & /*close*/ 2) {
    			$$invalidate(8, defaultAriaLabel = close ? "Close" : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		children,
    		close,
    		disabled,
    		href,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		color,
    		outline,
    		size,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 0,
    			close: 1,
    			color: 13,
    			disabled: 2,
    			href: 3,
    			outline: 14,
    			size: 15,
    			style: 4,
    			value: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

<<<<<<< HEAD
    			attr_dev(td0, "class", "svelte-1h2kj47");
    			add_location(td0, file$q, 91, 4, 1933);
    			attr_dev(td1, "class", "svelte-1h2kj47");
    			add_location(td1, file$q, 92, 4, 1999);
    			attr_dev(tr0, "class", "svelte-1h2kj47");
    			add_location(tr0, file$q, 90, 3, 1924);
    			add_location(th0, file$q, 96, 4, 2086);
    			add_location(th1, file$q, 97, 4, 2104);
    			add_location(th2, file$q, 98, 4, 2121);
    			add_location(th3, file$q, 99, 4, 2156);
    			add_location(th4, file$q, 100, 4, 2189);
    			add_location(th5, file$q, 101, 4, 2218);
    			attr_dev(tr1, "class", "svelte-1h2kj47");
    			add_location(tr1, file$q, 95, 3, 2077);
    			add_location(thead, file$q, 89, 2, 1913);
    			attr_dev(input0, "class", "svelte-1h2kj47");
    			add_location(input0, file$q, 106, 8, 2280);
    			attr_dev(td2, "class", "svelte-1h2kj47");
    			add_location(td2, file$q, 106, 4, 2276);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-1h2kj47");
    			add_location(input1, file$q, 107, 8, 2335);
    			attr_dev(td3, "class", "svelte-1h2kj47");
    			add_location(td3, file$q, 107, 4, 2331);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "class", "svelte-1h2kj47");
    			add_location(input2, file$q, 108, 8, 2399);
    			attr_dev(td4, "class", "svelte-1h2kj47");
    			add_location(td4, file$q, 108, 4, 2395);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "class", "svelte-1h2kj47");
    			add_location(input3, file$q, 109, 8, 2470);
    			attr_dev(td5, "class", "svelte-1h2kj47");
    			add_location(td5, file$q, 109, 4, 2466);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "class", "svelte-1h2kj47");
    			add_location(input4, file$q, 110, 8, 2543);
    			attr_dev(td6, "class", "svelte-1h2kj47");
    			add_location(td6, file$q, 110, 4, 2539);
    			attr_dev(td7, "class", "svelte-1h2kj47");
    			add_location(td7, file$q, 111, 4, 2615);
    			attr_dev(tr2, "class", "svelte-1h2kj47");
    			add_location(tr2, file$q, 105, 3, 2267);
    			add_location(tbody, file$q, 104, 2, 2256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			mount_component(button0, td0, null);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			mount_component(button1, td1, null);
    			append_dev(thead, t1);
    			append_dev(thead, tr1);
    			append_dev(tr1, th0);
    			append_dev(tr1, t3);
    			append_dev(tr1, th1);
    			append_dev(tr1, t5);
    			append_dev(tr1, th2);
    			append_dev(tr1, t7);
    			append_dev(tr1, th3);
    			append_dev(tr1, t9);
    			append_dev(tr1, th4);
    			append_dev(tr1, t11);
    			append_dev(tr1, th5);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*newObesity*/ ctx[1].country);
    			append_dev(tr2, t14);
    			append_dev(tr2, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*newObesity*/ ctx[1].year);
    			append_dev(tr2, t15);
    			append_dev(tr2, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*newObesity*/ ctx[1].man_percent);
    			append_dev(tr2, t16);
    			append_dev(tr2, td5);
    			append_dev(td5, input3);
    			set_input_value(input3, /*newObesity*/ ctx[1].woman_percent);
    			append_dev(tr2, t17);
    			append_dev(tr2, td6);
    			append_dev(td6, input4);
    			set_input_value(input4, /*newObesity*/ ctx[1].total_population);
    			append_dev(tr2, t18);
    			append_dev(tr2, td7);
    			mount_component(button2, td7, null);
    			append_dev(tbody, t19);
=======
    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Collapse.svelte generated by Svelte v3.37.0 */
    const file$p = "node_modules/sveltestrap/src/Collapse.svelte";

    // (57:0) {#if isOpen}
    function create_if_block$4(ctx) {
    	let div;
    	let div_style_value;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	let div_levels = [
    		{
    			style: div_style_value = /*navbar*/ ctx[1] ? undefined : "overflow: hidden;"
    		},
    		/*$$restProps*/ ctx[8],
    		{ class: /*classes*/ ctx[7] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$p, 57, 2, 1231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "introstart", /*introstart_handler*/ ctx[15], false, false, false),
    					listen_dev(div, "introend", /*introend_handler*/ ctx[16], false, false, false),
    					listen_dev(div, "outrostart", /*outrostart_handler*/ ctx[17], false, false, false),
    					listen_dev(div, "outroend", /*outroend_handler*/ ctx[18], false, false, false),
    					listen_dev(
    						div,
    						"introstart",
    						function () {
    							if (is_function(/*onEntering*/ ctx[2])) /*onEntering*/ ctx[2].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div,
    						"introend",
    						function () {
    							if (is_function(/*onEntered*/ ctx[3])) /*onEntered*/ ctx[3].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div,
    						"outrostart",
    						function () {
    							if (is_function(/*onExiting*/ ctx[4])) /*onExiting*/ ctx[4].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div,
    						"outroend",
    						function () {
    							if (is_function(/*onExited*/ ctx[5])) /*onExited*/ ctx[5].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*navbar*/ 2 && div_style_value !== (div_style_value = /*navbar*/ ctx[1] ? undefined : "overflow: hidden;")) && { style: div_style_value },
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);

    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(57:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    function create_fragment$q(ctx) {
    	let main;
    	let table;
=======
    function create_fragment$p(ctx) {
    	let if_block_anchor;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[19]);
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
<<<<<<< HEAD
    			main = element("main");
    			create_component(table.$$.fragment);
    			add_location(main, file$q, 86, 0, 1882);
=======
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    const BASE_CONTACT_API_PATH$1 = "/api/v1";

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ObesitySv", slots, []);
    	let obesity = [];

    	let newObesity = {
    		country: "",
    		year: "",
    		man_percent: "",
    		woman_percent: "",
    		total_population: ""
    	};

    	async function ObesityData() {
    		console.log("Loading data...");

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats/loadInitialData").then(res => {
    			getObesity();
    		});
    	}

    	async function getObesity() {
    		console.log("Fetching data...");
    		const res = await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats");

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(0, obesity = json);
    			console.log(`We have ${obesity.length} obesity.`);
    		} else {
    			console.log("Error");
    		}
    	}

    	async function insertObesity() {
    		console.log("Inserting data " + JSON.stringify(newObesity));

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats", {
    			method: "POST",
    			body: JSON.stringify(newObesity),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			getObesity();
    		});
    	}

    	async function deleteObesity(country, year) {
    		console.log(`Deleting data with name ${country} and date ${year}`);

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			getObesity();
    		});
    	}

    	async function deleteAll(country, year) {
    		console.log("Deleting all data");

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats", { method: "DELETE" }).then(function (res) {
    			getObesity();
    		});
    	}

    	onMount(getObesity);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<ObesitySv> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		newObesity.country = this.value;
    		$$invalidate(1, newObesity);
    	}

    	function input1_input_handler() {
    		newObesity.year = to_number(this.value);
    		$$invalidate(1, newObesity);
    	}

    	function input2_input_handler() {
    		newObesity.man_percent = to_number(this.value);
    		$$invalidate(1, newObesity);
    	}

    	function input3_input_handler() {
    		newObesity.woman_percent = to_number(this.value);
    		$$invalidate(1, newObesity);
    	}

    	function input4_input_handler() {
    		newObesity.total_population = to_number(this.value);
    		$$invalidate(1, newObesity);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		obesity,
    		newObesity,
    		BASE_CONTACT_API_PATH: BASE_CONTACT_API_PATH$1,
    		ObesityData,
    		getObesity,
    		insertObesity,
    		deleteObesity,
    		deleteAll
    	});

    	$$self.$inject_state = $$props => {
    		if ("obesity" in $$props) $$invalidate(0, obesity = $$props.obesity);
    		if ("newObesity" in $$props) $$invalidate(1, newObesity = $$props.newObesity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		obesity,
    		newObesity,
    		ObesityData,
    		insertObesity,
    		deleteObesity,
    		deleteAll,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class ObesitySv extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ObesitySv",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* node_modules/sveltestrap/src/Alert.svelte generated by Svelte v3.37.0 */
    const file$p = "node_modules/sveltestrap/src/Alert.svelte";

    // (22:0) {#if isOpen}
    function create_if_block$7(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let div_transition;
    	let current;
    	let if_block0 = /*toggle*/ ctx[3] && create_if_block_2$1(ctx);
    	const if_block_creators = [create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let div_levels = [/*$$restProps*/ ctx[7], { class: /*classes*/ ctx[5] }, { role: "alert" }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			set_attributes(div, div_data);
    			add_location(div, file$p, 22, 2, 637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*toggle*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7],
    				(!current || dirty & /*classes*/ 32) && { class: /*classes*/ ctx[5] },
    				{ role: "alert" }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(22:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (28:4) {#if toggle}
    function create_if_block_2$1(ctx) {
    	let button;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$p, 33, 8, 900);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$p, 28, 6, 767);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggle*/ ctx[3])) /*toggle*/ ctx[3].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*closeClassNames*/ 64) {
    				attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			}

    			if (dirty & /*closeAriaLabel*/ 2) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(28:4) {#if toggle}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if children}
    function create_if_block_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(37:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[2] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let classes;
    	let closeClassNames;

    	const omit_props_names = [
    		"class","children","color","closeClassName","closeAriaLabel","isOpen","toggle","fade","transition"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Alert", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { children = undefined } = $$props;
    	let { color = "success" } = $$props;
    	let { closeClassName = "" } = $$props;
    	let { closeAriaLabel = "Close" } = $$props;
    	let { isOpen = true } = $$props;
    	let { toggle = undefined } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { transition = { duration: fade$1 ? 400 : 0 } } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(8, className = $$new_props.class);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("color" in $$new_props) $$invalidate(9, color = $$new_props.color);
    		if ("closeClassName" in $$new_props) $$invalidate(10, closeClassName = $$new_props.closeClassName);
    		if ("closeAriaLabel" in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("isOpen" in $$new_props) $$invalidate(2, isOpen = $$new_props.isOpen);
    		if ("toggle" in $$new_props) $$invalidate(3, toggle = $$new_props.toggle);
    		if ("fade" in $$new_props) $$invalidate(11, fade$1 = $$new_props.fade);
    		if ("transition" in $$new_props) $$invalidate(4, transition = $$new_props.transition);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fadeTransition: fade,
    		classnames,
    		className,
    		children,
    		color,
    		closeClassName,
    		closeAriaLabel,
    		isOpen,
    		toggle,
    		fade: fade$1,
    		transition,
    		classes,
    		closeClassNames
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(8, className = $$new_props.className);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("color" in $$props) $$invalidate(9, color = $$new_props.color);
    		if ("closeClassName" in $$props) $$invalidate(10, closeClassName = $$new_props.closeClassName);
    		if ("closeAriaLabel" in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("isOpen" in $$props) $$invalidate(2, isOpen = $$new_props.isOpen);
    		if ("toggle" in $$props) $$invalidate(3, toggle = $$new_props.toggle);
    		if ("fade" in $$props) $$invalidate(11, fade$1 = $$new_props.fade);
    		if ("transition" in $$props) $$invalidate(4, transition = $$new_props.transition);
    		if ("classes" in $$props) $$invalidate(5, classes = $$new_props.classes);
    		if ("closeClassNames" in $$props) $$invalidate(6, closeClassNames = $$new_props.closeClassNames);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, color, toggle*/ 776) {
    			$$invalidate(5, classes = classnames(className, "alert", `alert-${color}`, { "alert-dismissible": toggle }));
    		}

    		if ($$self.$$.dirty & /*closeClassName*/ 1024) {
    			$$invalidate(6, closeClassNames = classnames("close", closeClassName));
    		}
    	};

    	return [
    		children,
    		closeAriaLabel,
    		isOpen,
    		toggle,
    		transition,
    		classes,
    		closeClassNames,
    		$$restProps,
    		className,
    		color,
    		closeClassName,
    		fade$1,
    		$$scope,
    		slots
    	];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
    			class: 8,
    			children: 0,
    			color: 9,
    			closeClassName: 10,
    			closeAriaLabel: 1,
    			isOpen: 2,
    			toggle: 3,
    			fade: 11,
    			transition: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get class() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeClassName() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeClassName(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
=======
    function instance$p($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"isOpen","class","navbar","onEntering","onEntered","onExiting","onExited","expand"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Collapse", slots, ['default']);
    	const noop = () => undefined;
    	let { isOpen = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { navbar = false } = $$props;
    	let { onEntering = noop } = $$props;
    	let { onEntered = noop } = $$props;
    	let { onExiting = noop } = $$props;
    	let { onExited = noop } = $$props;
    	let { expand = false } = $$props;
    	let windowWidth = 0;
    	let _wasMaximazed = false;
    	const minWidth = {};
    	minWidth["xs"] = 0;
    	minWidth["sm"] = 576;
    	minWidth["md"] = 768;
    	minWidth["lg"] = 992;
    	minWidth["xl"] = 1200;
    	const dispatch = createEventDispatcher();

    	function notify() {
    		dispatch("update", { isOpen });
    	}

    	function introstart_handler(event) {
    		bubble($$self, event);
    	}

    	function introend_handler(event) {
    		bubble($$self, event);
    	}

    	function outrostart_handler(event) {
    		bubble($$self, event);
    	}

    	function outroend_handler(event) {
    		bubble($$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(6, windowWidth = window.innerWidth);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("isOpen" in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ("class" in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ("navbar" in $$new_props) $$invalidate(1, navbar = $$new_props.navbar);
    		if ("onEntering" in $$new_props) $$invalidate(2, onEntering = $$new_props.onEntering);
    		if ("onEntered" in $$new_props) $$invalidate(3, onEntered = $$new_props.onEntered);
    		if ("onExiting" in $$new_props) $$invalidate(4, onExiting = $$new_props.onExiting);
    		if ("onExited" in $$new_props) $$invalidate(5, onExited = $$new_props.onExited);
    		if ("expand" in $$new_props) $$invalidate(10, expand = $$new_props.expand);
    		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		createEventDispatcher,
    		slide,
    		noop,
    		isOpen,
    		className,
    		navbar,
    		onEntering,
    		onEntered,
    		onExiting,
    		onExited,
    		expand,
    		windowWidth,
    		_wasMaximazed,
    		minWidth,
    		dispatch,
    		notify,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ("className" in $$props) $$invalidate(9, className = $$new_props.className);
    		if ("navbar" in $$props) $$invalidate(1, navbar = $$new_props.navbar);
    		if ("onEntering" in $$props) $$invalidate(2, onEntering = $$new_props.onEntering);
    		if ("onEntered" in $$props) $$invalidate(3, onEntered = $$new_props.onEntered);
    		if ("onExiting" in $$props) $$invalidate(4, onExiting = $$new_props.onExiting);
    		if ("onExited" in $$props) $$invalidate(5, onExited = $$new_props.onExited);
    		if ("expand" in $$props) $$invalidate(10, expand = $$new_props.expand);
    		if ("windowWidth" in $$props) $$invalidate(6, windowWidth = $$new_props.windowWidth);
    		if ("_wasMaximazed" in $$props) $$invalidate(11, _wasMaximazed = $$new_props._wasMaximazed);
    		if ("classes" in $$props) $$invalidate(7, classes = $$new_props.classes);
    	};
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	get toggle() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

<<<<<<< HEAD
    	set toggle(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }
=======
    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, navbar*/ 514) {
    			$$invalidate(7, classes = classnames(className, // collapseClass,
    			navbar && "navbar-collapse"));
    		}

    		if ($$self.$$.dirty & /*navbar, expand, windowWidth, minWidth, isOpen, _wasMaximazed*/ 7235) {
    			if (navbar && expand) {
    				if (windowWidth >= minWidth[expand] && !isOpen) {
    					$$invalidate(0, isOpen = true);
    					$$invalidate(11, _wasMaximazed = true);
    					notify();
    				} else if (windowWidth < minWidth[expand] && _wasMaximazed) {
    					$$invalidate(0, isOpen = false);
    					$$invalidate(11, _wasMaximazed = false);
    					notify();
    				}
    			}
    		}
    	};

    	return [
    		isOpen,
    		navbar,
    		onEntering,
    		onEntered,
    		onExiting,
    		onExited,
    		windowWidth,
    		classes,
    		$$restProps,
    		className,
    		expand,
    		_wasMaximazed,
    		minWidth,
    		$$scope,
    		slots,
    		introstart_handler,
    		introend_handler,
    		outrostart_handler,
    		outroend_handler,
    		onwindowresize
    	];
    }

    class Collapse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
    			isOpen: 0,
    			class: 9,
    			navbar: 1,
    			onEntering: 2,
    			onEntered: 3,
    			onExiting: 4,
    			onExited: 5,
    			expand: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Collapse",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get isOpen() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	get class() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEntering() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEntering(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEntered() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEntered(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExiting() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExiting(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExited() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExited(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Modal.svelte generated by Svelte v3.37.0 */

    const file$o = "node_modules/sveltestrap/src/Modal.svelte";
    const get_external_slot_changes = dirty => ({});
    const get_external_slot_context = ctx => ({});

    // (217:0) {#if _isMounted}
    function create_if_block$3(ctx) {
    	let div;
    	let current;
    	let if_block = /*isOpen*/ ctx[1] && create_if_block_1$1(ctx);

    	let div_levels = [
    		{ class: /*wrapClassName*/ ctx[4] },
    		{ tabindex: "-1" },
    		/*$$restProps*/ ctx[18]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			set_attributes(div, div_data);
    			add_location(div, file$o, 217, 2, 4706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isOpen*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*isOpen*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*wrapClassName*/ 16) && { class: /*wrapClassName*/ ctx[4] },
    				{ tabindex: "-1" },
    				dirty[0] & /*$$restProps*/ 262144 && /*$$restProps*/ ctx[18]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(217:0) {#if _isMounted}",
    		ctx
    	});

    	return block;
    }

    // (222:4) {#if isOpen}
    function create_if_block_1$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let div0_class_value;
    	let div2_class_value;
    	let div2_transition;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const external_slot_template = /*#slots*/ ctx[33].external;
    	const external_slot = create_slot(external_slot_template, ctx, /*$$scope*/ ctx[32], get_external_slot_context);
    	const default_slot_template = /*#slots*/ ctx[33].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[32], null);
    	let if_block = /*backdrop*/ ctx[3] && !/*staticModal*/ ctx[0] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (external_slot) external_slot.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div0, "class", div0_class_value = classnames("modal-content", /*contentClassName*/ ctx[7]));
    			add_location(div0, file$o, 237, 10, 5340);
    			attr_dev(div1, "class", /*classes*/ ctx[13]);
    			attr_dev(div1, "role", "document");
    			add_location(div1, file$o, 236, 8, 5272);
    			attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[2]);

    			attr_dev(div2, "class", div2_class_value = classnames("modal", /*modalClassName*/ ctx[5], {
    				show: /*isOpen*/ ctx[1],
    				"d-block": /*isOpen*/ ctx[1],
    				"d-none": !/*isOpen*/ ctx[1],
    				"position-static": /*staticModal*/ ctx[0]
    			}));

    			attr_dev(div2, "role", "dialog");
    			add_location(div2, file$o, 222, 6, 4800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (external_slot) {
    				external_slot.m(div0, null);
    			}

    			append_dev(div0, t0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div1_binding*/ ctx[34](div1);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "introend", /*onModalOpened*/ ctx[15], false, false, false),
    					listen_dev(div2, "outroend", /*onModalClosed*/ ctx[16], false, false, false),
    					listen_dev(div2, "click", /*handleBackdropClick*/ ctx[14], false, false, false),
    					listen_dev(div2, "mousedown", /*handleBackdropMouseDown*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (external_slot) {
    				if (external_slot.p && dirty[1] & /*$$scope*/ 2) {
    					update_slot(external_slot, external_slot_template, ctx, /*$$scope*/ ctx[32], dirty, get_external_slot_changes, get_external_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[1] & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[32], dirty, null, null);
    				}
    			}

    			if (!current || dirty[0] & /*contentClassName*/ 128 && div0_class_value !== (div0_class_value = classnames("modal-content", /*contentClassName*/ ctx[7]))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*classes*/ 8192) {
    				attr_dev(div1, "class", /*classes*/ ctx[13]);
    			}

    			if (!current || dirty[0] & /*labelledBy*/ 4) {
    				attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*modalClassName, isOpen, staticModal*/ 35 && div2_class_value !== (div2_class_value = classnames("modal", /*modalClassName*/ ctx[5], {
    				show: /*isOpen*/ ctx[1],
    				"d-block": /*isOpen*/ ctx[1],
    				"d-none": !/*isOpen*/ ctx[1],
    				"position-static": /*staticModal*/ ctx[0]
    			}))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (/*backdrop*/ ctx[3] && !/*staticModal*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*backdrop, staticModal*/ 9) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(external_slot, local);
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[9], /*transitionOptions*/ ctx[10], true);
    				div2_transition.run(1);
    			});

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(external_slot, local);
    			transition_out(default_slot, local);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[9], /*transitionOptions*/ ctx[10], false);
    			div2_transition.run(0);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (external_slot) external_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[34](null);
    			if (detaching && div2_transition) div2_transition.end();
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(222:4) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (244:6) {#if backdrop && !staticModal}
    function create_if_block_2(ctx) {
    	let div;
    	let div_class_value;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = classnames("modal-backdrop", "show", /*backdropClassName*/ ctx[6]));
    			add_location(div, file$o, 244, 8, 5548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*backdropClassName*/ 64 && div_class_value !== (div_class_value = classnames("modal-backdrop", "show", /*backdropClassName*/ ctx[6]))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[8] }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[8] }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(244:6) {#if backdrop && !staticModal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*_isMounted*/ ctx[11] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*_isMounted*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*_isMounted*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let openCount = 0;
    const dialogBaseClass = "modal-dialog";

    function noop() {
    	
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","static","isOpen","autoFocus","centered","scrollable","size","toggle","labelledBy","backdrop","onEnter","onExit","onOpened","onClosed","wrapClassName","modalClassName","backdropClassName","contentClassName","fade","backdropDuration","unmountOnClose","returnFocusAfterClose","transitionType","transitionOptions"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Modal", slots, ['external','default']);
    	let { class: className = "" } = $$props;
    	let { static: staticModal = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { autoFocus = true } = $$props;
    	let { centered = false } = $$props;
    	let { scrollable = false } = $$props;
    	let { size = "" } = $$props;
    	let { toggle = undefined } = $$props;
    	let { labelledBy = "" } = $$props;
    	let { backdrop = true } = $$props;
    	let { onEnter = undefined } = $$props;
    	let { onExit = undefined } = $$props;
    	let { onOpened = noop } = $$props;
    	let { onClosed = noop } = $$props;
    	let { wrapClassName = "" } = $$props;
    	let { modalClassName = "" } = $$props;
    	let { backdropClassName = "" } = $$props;
    	let { contentClassName = "" } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { backdropDuration = fade$1 ? 150 : 0 } = $$props;
    	let { unmountOnClose = true } = $$props;
    	let { returnFocusAfterClose = true } = $$props;
    	let { transitionType = fade } = $$props;
    	let { transitionOptions = { duration: fade$1 ? 300 : 0 } } = $$props;
    	let hasOpened = false;
    	let _isMounted = false;
    	let _triggeringElement;
    	let _originalBodyPadding;
    	let _lastIsOpen = isOpen;
    	let _lastHasOpened = hasOpened;
    	let _dialog;
    	let _mouseDownElement;
    	let _removeEscListener;

    	onMount(() => {
    		if (isOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (typeof onEnter === "function") {
    			onEnter();
    		}

    		if (hasOpened && autoFocus) {
    			setFocus();
    		}
    	});

    	onDestroy(() => {
    		if (typeof onExit === "function") {
    			onExit();
    		}

    		destroy();

    		if (hasOpened) {
    			close();
    		}
    	});

    	afterUpdate(() => {
    		if (isOpen && !_lastIsOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (autoFocus && hasOpened && !_lastHasOpened) {
    			setFocus();
    		}

    		_lastIsOpen = isOpen;
    		_lastHasOpened = hasOpened;
    	});

    	function setFocus() {
    		if (_dialog && _dialog.parentNode && typeof _dialog.parentNode.focus === "function") {
    			_dialog.parentNode.focus();
    		}
    	}

    	function init() {
    		try {
    			_triggeringElement = document.activeElement;
    		} catch(err) {
    			_triggeringElement = null;
    		}

    		if (!staticModal) {
    			_originalBodyPadding = getOriginalBodyPadding();
    			conditionallyUpdateScrollbar();

    			if (openCount === 0) {
    				document.body.className = classnames(document.body.className, "modal-open");
    			}

    			++openCount;
    		}

    		$$invalidate(11, _isMounted = true);
    	}

    	function manageFocusAfterClose() {
    		if (_triggeringElement) {
    			if (typeof _triggeringElement.focus === "function" && returnFocusAfterClose) {
    				_triggeringElement.focus();
    			}

    			_triggeringElement = null;
    		}
    	}

    	function destroy() {
    		manageFocusAfterClose();
    	}

    	function close() {
    		if (openCount <= 1) {
    			const modalOpenClassName = "modal-open";
    			const modalOpenClassNameRegex = new RegExp(`(^| )${modalOpenClassName}( |$)`);
    			document.body.className = document.body.className.replace(modalOpenClassNameRegex, " ").trim();
    		}

    		manageFocusAfterClose();
    		openCount = Math.max(0, openCount - 1);
    		setScrollbarWidth(_originalBodyPadding);
    	}

    	function handleBackdropClick(e) {
    		if (e.target === _mouseDownElement) {
    			e.stopPropagation();

    			if (!isOpen || !backdrop) {
    				return;
    			}

    			const backdropElem = _dialog ? _dialog.parentNode : null;

    			if (backdropElem && e.target === backdropElem && toggle) {
    				toggle(e);
    			}
    		}
    	}

    	function onModalOpened() {
    		_removeEscListener = browserEvent(document, "keydown", event => {
    			if (event.key && event.key === "Escape") {
    				toggle(event);
    			}
    		});

    		onOpened();
    	}

    	function onModalClosed() {
    		onClosed();

    		if (_removeEscListener) {
    			_removeEscListener();
    		}

    		if (unmountOnClose) {
    			destroy();
    		}

    		close();

    		if (_isMounted) {
    			hasOpened = false;
    		}

    		$$invalidate(11, _isMounted = false);
    	}

    	function handleBackdropMouseDown(e) {
    		_mouseDownElement = e.target;
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			_dialog = $$value;
    			$$invalidate(12, _dialog);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(19, className = $$new_props.class);
    		if ("static" in $$new_props) $$invalidate(0, staticModal = $$new_props.static);
    		if ("isOpen" in $$new_props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ("autoFocus" in $$new_props) $$invalidate(20, autoFocus = $$new_props.autoFocus);
    		if ("centered" in $$new_props) $$invalidate(21, centered = $$new_props.centered);
    		if ("scrollable" in $$new_props) $$invalidate(22, scrollable = $$new_props.scrollable);
    		if ("size" in $$new_props) $$invalidate(23, size = $$new_props.size);
    		if ("toggle" in $$new_props) $$invalidate(24, toggle = $$new_props.toggle);
    		if ("labelledBy" in $$new_props) $$invalidate(2, labelledBy = $$new_props.labelledBy);
    		if ("backdrop" in $$new_props) $$invalidate(3, backdrop = $$new_props.backdrop);
    		if ("onEnter" in $$new_props) $$invalidate(25, onEnter = $$new_props.onEnter);
    		if ("onExit" in $$new_props) $$invalidate(26, onExit = $$new_props.onExit);
    		if ("onOpened" in $$new_props) $$invalidate(27, onOpened = $$new_props.onOpened);
    		if ("onClosed" in $$new_props) $$invalidate(28, onClosed = $$new_props.onClosed);
    		if ("wrapClassName" in $$new_props) $$invalidate(4, wrapClassName = $$new_props.wrapClassName);
    		if ("modalClassName" in $$new_props) $$invalidate(5, modalClassName = $$new_props.modalClassName);
    		if ("backdropClassName" in $$new_props) $$invalidate(6, backdropClassName = $$new_props.backdropClassName);
    		if ("contentClassName" in $$new_props) $$invalidate(7, contentClassName = $$new_props.contentClassName);
    		if ("fade" in $$new_props) $$invalidate(29, fade$1 = $$new_props.fade);
    		if ("backdropDuration" in $$new_props) $$invalidate(8, backdropDuration = $$new_props.backdropDuration);
    		if ("unmountOnClose" in $$new_props) $$invalidate(30, unmountOnClose = $$new_props.unmountOnClose);
    		if ("returnFocusAfterClose" in $$new_props) $$invalidate(31, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ("transitionType" in $$new_props) $$invalidate(9, transitionType = $$new_props.transitionType);
    		if ("transitionOptions" in $$new_props) $$invalidate(10, transitionOptions = $$new_props.transitionOptions);
    		if ("$$scope" in $$new_props) $$invalidate(32, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		openCount,
    		classnames,
    		browserEvent,
    		onDestroy,
    		onMount,
    		afterUpdate,
    		fadeTransition: fade,
    		conditionallyUpdateScrollbar,
    		getOriginalBodyPadding,
    		setScrollbarWidth,
    		noop,
    		className,
    		staticModal,
    		isOpen,
    		autoFocus,
    		centered,
    		scrollable,
    		size,
    		toggle,
    		labelledBy,
    		backdrop,
    		onEnter,
    		onExit,
    		onOpened,
    		onClosed,
    		wrapClassName,
    		modalClassName,
    		backdropClassName,
    		contentClassName,
    		fade: fade$1,
    		backdropDuration,
    		unmountOnClose,
    		returnFocusAfterClose,
    		transitionType,
    		transitionOptions,
    		hasOpened,
    		_isMounted,
    		_triggeringElement,
    		_originalBodyPadding,
    		_lastIsOpen,
    		_lastHasOpened,
    		_dialog,
    		_mouseDownElement,
    		_removeEscListener,
    		setFocus,
    		init,
    		manageFocusAfterClose,
    		destroy,
    		close,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosed,
    		handleBackdropMouseDown,
    		dialogBaseClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(19, className = $$new_props.className);
    		if ("staticModal" in $$props) $$invalidate(0, staticModal = $$new_props.staticModal);
    		if ("isOpen" in $$props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ("autoFocus" in $$props) $$invalidate(20, autoFocus = $$new_props.autoFocus);
    		if ("centered" in $$props) $$invalidate(21, centered = $$new_props.centered);
    		if ("scrollable" in $$props) $$invalidate(22, scrollable = $$new_props.scrollable);
    		if ("size" in $$props) $$invalidate(23, size = $$new_props.size);
    		if ("toggle" in $$props) $$invalidate(24, toggle = $$new_props.toggle);
    		if ("labelledBy" in $$props) $$invalidate(2, labelledBy = $$new_props.labelledBy);
    		if ("backdrop" in $$props) $$invalidate(3, backdrop = $$new_props.backdrop);
    		if ("onEnter" in $$props) $$invalidate(25, onEnter = $$new_props.onEnter);
    		if ("onExit" in $$props) $$invalidate(26, onExit = $$new_props.onExit);
    		if ("onOpened" in $$props) $$invalidate(27, onOpened = $$new_props.onOpened);
    		if ("onClosed" in $$props) $$invalidate(28, onClosed = $$new_props.onClosed);
    		if ("wrapClassName" in $$props) $$invalidate(4, wrapClassName = $$new_props.wrapClassName);
    		if ("modalClassName" in $$props) $$invalidate(5, modalClassName = $$new_props.modalClassName);
    		if ("backdropClassName" in $$props) $$invalidate(6, backdropClassName = $$new_props.backdropClassName);
    		if ("contentClassName" in $$props) $$invalidate(7, contentClassName = $$new_props.contentClassName);
    		if ("fade" in $$props) $$invalidate(29, fade$1 = $$new_props.fade);
    		if ("backdropDuration" in $$props) $$invalidate(8, backdropDuration = $$new_props.backdropDuration);
    		if ("unmountOnClose" in $$props) $$invalidate(30, unmountOnClose = $$new_props.unmountOnClose);
    		if ("returnFocusAfterClose" in $$props) $$invalidate(31, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ("transitionType" in $$props) $$invalidate(9, transitionType = $$new_props.transitionType);
    		if ("transitionOptions" in $$props) $$invalidate(10, transitionOptions = $$new_props.transitionOptions);
    		if ("hasOpened" in $$props) hasOpened = $$new_props.hasOpened;
    		if ("_isMounted" in $$props) $$invalidate(11, _isMounted = $$new_props._isMounted);
    		if ("_triggeringElement" in $$props) _triggeringElement = $$new_props._triggeringElement;
    		if ("_originalBodyPadding" in $$props) _originalBodyPadding = $$new_props._originalBodyPadding;
    		if ("_lastIsOpen" in $$props) _lastIsOpen = $$new_props._lastIsOpen;
    		if ("_lastHasOpened" in $$props) _lastHasOpened = $$new_props._lastHasOpened;
    		if ("_dialog" in $$props) $$invalidate(12, _dialog = $$new_props._dialog);
    		if ("_mouseDownElement" in $$props) _mouseDownElement = $$new_props._mouseDownElement;
    		if ("_removeEscListener" in $$props) _removeEscListener = $$new_props._removeEscListener;
    		if ("classes" in $$props) $$invalidate(13, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*className, size, centered, scrollable*/ 15204352) {
    			$$invalidate(13, classes = classnames(dialogBaseClass, className, {
    				[`modal-${size}`]: size,
    				[`${dialogBaseClass}-centered`]: centered,
    				[`${dialogBaseClass}-scrollable`]: scrollable
    			}));
    		}
    	};

    	return [
    		staticModal,
    		isOpen,
    		labelledBy,
    		backdrop,
    		wrapClassName,
    		modalClassName,
    		backdropClassName,
    		contentClassName,
    		backdropDuration,
    		transitionType,
    		transitionOptions,
    		_isMounted,
    		_dialog,
    		classes,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosed,
    		handleBackdropMouseDown,
    		$$restProps,
    		className,
    		autoFocus,
    		centered,
    		scrollable,
    		size,
    		toggle,
    		onEnter,
    		onExit,
    		onOpened,
    		onClosed,
    		fade$1,
    		unmountOnClose,
    		returnFocusAfterClose,
    		$$scope,
    		slots,
    		div1_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$o,
    			create_fragment$o,
    			safe_not_equal,
    			{
    				class: 19,
    				static: 0,
    				isOpen: 1,
    				autoFocus: 20,
    				centered: 21,
    				scrollable: 22,
    				size: 23,
    				toggle: 24,
    				labelledBy: 2,
    				backdrop: 3,
    				onEnter: 25,
    				onExit: 26,
    				onOpened: 27,
    				onClosed: 28,
    				wrapClassName: 4,
    				modalClassName: 5,
    				backdropClassName: 6,
    				contentClassName: 7,
    				fade: 29,
    				backdropDuration: 8,
    				unmountOnClose: 30,
    				returnFocusAfterClose: 31,
    				transitionType: 9,
    				transitionOptions: 10
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get class() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get static() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set static(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoFocus() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoFocus(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get centered() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set centered(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollable() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollable(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdrop() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdrop(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEnter() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEnter(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExit() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExit(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOpened() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOpened(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClosed() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClosed(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contentClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contentClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

<<<<<<< HEAD
    // (217:0) {#if _isMounted}
    function create_if_block$3(ctx) {
    	let div;
    	let current;
    	let if_block = /*isOpen*/ ctx[1] && create_if_block_1$2(ctx);
=======
    	get fade() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	set fade(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropDuration() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropDuration(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unmountOnClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

<<<<<<< HEAD
    					if (dirty[0] & /*isOpen*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();
=======
    	set unmountOnClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	get returnFocusAfterClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set returnFocusAfterClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionType() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionType(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionOptions() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionOptions(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

<<<<<<< HEAD
    // (222:4) {#if isOpen}
    function create_if_block_1$2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let div0_class_value;
    	let div2_class_value;
    	let div2_transition;
    	let t1;
    	let if_block_anchor;
=======
    /* node_modules/sveltestrap/src/ModalBody.svelte generated by Svelte v3.37.0 */
    const file$n = "node_modules/sveltestrap/src/ModalBody.svelte";

    function create_fragment$n(ctx) {
    	let div;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$n, 9, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
<<<<<<< HEAD
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(222:4) {#if isOpen}",
=======
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModalBody", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "modal-body"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalBody",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/ModalFooter.svelte generated by Svelte v3.37.0 */
    const file$m = "node_modules/sveltestrap/src/ModalFooter.svelte";

    function create_fragment$m(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$m, 9, 0, 167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModalFooter", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "modal-footer"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalFooter",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/ModalHeader.svelte generated by Svelte v3.37.0 */
    const file$l = "node_modules/sveltestrap/src/ModalHeader.svelte";
    const get_close_slot_changes = dirty => ({});
    const get_close_slot_context = ctx => ({});

    // (21:4) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(21:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if children}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 4) set_data_dev(t, /*children*/ ctx[2]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(19:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if typeof toggle === 'function'}
    function create_if_block$2(ctx) {
    	let button;
    	let span;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			t = text(/*closeIcon*/ ctx[3]);
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$l, 31, 8, 735);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "close");
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$l, 26, 6, 612);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggle*/ ctx[0])) /*toggle*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*closeIcon*/ 8) set_data_dev(t, /*closeIcon*/ ctx[3]);

    			if (dirty & /*closeAriaLabel*/ 2) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(26:4) {#if typeof toggle === 'function'}",
    		ctx
    	});

    	return block;
    }

    // (25:21)      
    function fallback_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = typeof /*toggle*/ ctx[0] === "function" && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (typeof /*toggle*/ ctx[0] === "function") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(25:21)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let h5;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const close_slot_template = /*#slots*/ ctx[9].close;
    	const close_slot = create_slot(close_slot_template, ctx, /*$$scope*/ ctx[8], get_close_slot_context);
    	const close_slot_or_fallback = close_slot || fallback_block$1(ctx);
    	let div_levels = [/*$$restProps*/ ctx[5], { class: /*classes*/ ctx[4] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			if_block.c();
    			t = space();
    			if (close_slot_or_fallback) close_slot_or_fallback.c();
    			attr_dev(h5, "class", "modal-title");
    			add_location(h5, file$l, 17, 2, 439);
    			set_attributes(div, div_data);
    			add_location(div, file$l, 16, 0, 398);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			if_blocks[current_block_type_index].m(h5, null);
    			append_dev(div, t);

    			if (close_slot_or_fallback) {
    				close_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(h5, null);
    			}

    			if (close_slot) {
    				if (close_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(close_slot, close_slot_template, ctx, /*$$scope*/ ctx[8], dirty, get_close_slot_changes, get_close_slot_context);
    				}
    			} else {
    				if (close_slot_or_fallback && close_slot_or_fallback.p && dirty & /*closeAriaLabel, toggle, closeIcon*/ 11) {
    					close_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(close_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(close_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (close_slot_or_fallback) close_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let closeIcon;
    	let classes;
    	const omit_props_names = ["class","toggle","closeAriaLabel","charCode","children"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModalHeader", slots, ['default','close']);
    	let { class: className = "" } = $$props;
    	let { toggle = undefined } = $$props;
    	let { closeAriaLabel = "Close" } = $$props;
    	let { charCode = 215 } = $$props;
    	let { children = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(6, className = $$new_props.class);
    		if ("toggle" in $$new_props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ("closeAriaLabel" in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("charCode" in $$new_props) $$invalidate(7, charCode = $$new_props.charCode);
    		if ("children" in $$new_props) $$invalidate(2, children = $$new_props.children);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		toggle,
    		closeAriaLabel,
    		charCode,
    		children,
    		closeIcon,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(6, className = $$new_props.className);
    		if ("toggle" in $$props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ("closeAriaLabel" in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("charCode" in $$props) $$invalidate(7, charCode = $$new_props.charCode);
    		if ("children" in $$props) $$invalidate(2, children = $$new_props.children);
    		if ("closeIcon" in $$props) $$invalidate(3, closeIcon = $$new_props.closeIcon);
    		if ("classes" in $$props) $$invalidate(4, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*charCode*/ 128) {
    			$$invalidate(3, closeIcon = typeof charCode === "number"
    			? String.fromCharCode(charCode)
    			: charCode);
    		}

    		if ($$self.$$.dirty & /*className*/ 64) {
    			$$invalidate(4, classes = classnames(className, "modal-header"));
    		}
    	};

    	return [
    		toggle,
    		closeAriaLabel,
    		children,
    		closeIcon,
    		classes,
    		$$restProps,
    		className,
    		charCode,
    		$$scope,
    		slots
    	];
    }

    class ModalHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			class: 6,
    			toggle: 0,
    			closeAriaLabel: 1,
    			charCode: 7,
    			children: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalHeader",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get charCode() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set charCode(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Nav.svelte generated by Svelte v3.37.0 */
    const file$k = "node_modules/sveltestrap/src/Nav.svelte";

    function create_fragment$k(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let ul_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			add_location(ul, file$k, 39, 0, 941);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2048) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getVerticalClass(vertical) {
    	if (vertical === false) {
    		return false;
    	} else if (vertical === true || vertical === "xs") {
    		return "flex-column";
    	}

    	return `flex-${vertical}-column`;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","tabs","pills","vertical","horizontal","justified","fill","navbar","card"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { tabs = false } = $$props;
    	let { pills = false } = $$props;
    	let { vertical = false } = $$props;
    	let { horizontal = "" } = $$props;
    	let { justified = false } = $$props;
    	let { fill = false } = $$props;
    	let { navbar = false } = $$props;
    	let { card = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("tabs" in $$new_props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ("pills" in $$new_props) $$invalidate(4, pills = $$new_props.pills);
    		if ("vertical" in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ("horizontal" in $$new_props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ("justified" in $$new_props) $$invalidate(7, justified = $$new_props.justified);
    		if ("fill" in $$new_props) $$invalidate(8, fill = $$new_props.fill);
    		if ("navbar" in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ("card" in $$new_props) $$invalidate(10, card = $$new_props.card);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		getVerticalClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("tabs" in $$props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ("pills" in $$props) $$invalidate(4, pills = $$new_props.pills);
    		if ("vertical" in $$props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ("horizontal" in $$props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ("justified" in $$props) $$invalidate(7, justified = $$new_props.justified);
    		if ("fill" in $$props) $$invalidate(8, fill = $$new_props.fill);
    		if ("navbar" in $$props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ("card" in $$props) $$invalidate(10, card = $$new_props.card);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, navbar, horizontal, vertical, tabs, card, pills, justified, fill*/ 2044) {
    			$$invalidate(0, classes = classnames(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    				"nav-tabs": tabs,
    				"card-header-tabs": card && tabs,
    				"nav-pills": pills,
    				"card-header-pills": card && pills,
    				"nav-justified": justified,
    				"nav-fill": fill
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		$$scope,
    		slots
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			class: 2,
    			tabs: 3,
    			pills: 4,
    			vertical: 5,
    			horizontal: 6,
    			justified: 7,
    			fill: 8,
    			navbar: 9,
    			card: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get class() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pills() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pills(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get justified() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justified(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Navbar.svelte generated by Svelte v3.37.0 */
    const file$j = "node_modules/sveltestrap/src/Navbar.svelte";

    function create_fragment$j(ctx) {
    	let nav;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let nav_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if (default_slot) default_slot.c();
    			set_attributes(nav, nav_data);
    			add_location(nav, file$j, 31, 0, 719);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);

    			if (default_slot) {
    				default_slot.m(nav, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 512) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, null, null);
    				}
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getExpandClass(expand) {
    	if (expand === false) {
    		return false;
    	} else if (expand === true || expand === "xs") {
    		return "navbar-expand";
    	}

    	return `navbar-expand-${expand}`;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","light","dark","fixed","sticky","color","expand"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { light = false } = $$props;
    	let { dark = false } = $$props;
    	let { fixed = "" } = $$props;
    	let { sticky = "" } = $$props;
    	let { color = "" } = $$props;
    	let { expand = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("light" in $$new_props) $$invalidate(3, light = $$new_props.light);
    		if ("dark" in $$new_props) $$invalidate(4, dark = $$new_props.dark);
    		if ("fixed" in $$new_props) $$invalidate(5, fixed = $$new_props.fixed);
    		if ("sticky" in $$new_props) $$invalidate(6, sticky = $$new_props.sticky);
    		if ("color" in $$new_props) $$invalidate(7, color = $$new_props.color);
    		if ("expand" in $$new_props) $$invalidate(8, expand = $$new_props.expand);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		light,
    		dark,
    		fixed,
    		sticky,
    		color,
    		expand,
    		getExpandClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("light" in $$props) $$invalidate(3, light = $$new_props.light);
    		if ("dark" in $$props) $$invalidate(4, dark = $$new_props.dark);
    		if ("fixed" in $$props) $$invalidate(5, fixed = $$new_props.fixed);
    		if ("sticky" in $$props) $$invalidate(6, sticky = $$new_props.sticky);
    		if ("color" in $$props) $$invalidate(7, color = $$new_props.color);
    		if ("expand" in $$props) $$invalidate(8, expand = $$new_props.expand);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, expand, light, dark, color, fixed, sticky*/ 508) {
    			$$invalidate(0, classes = classnames(className, "navbar", getExpandClass(expand), {
    				"navbar-light": light,
    				"navbar-dark": dark,
    				[`bg-${color}`]: color,
    				[`fixed-${fixed}`]: fixed,
    				[`sticky-${sticky}`]: sticky
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		light,
    		dark,
    		fixed,
    		sticky,
    		color,
    		expand,
    		$$scope,
    		slots
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			class: 2,
    			light: 3,
    			dark: 4,
    			fixed: 5,
    			sticky: 6,
    			color: 7,
    			expand: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixed() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sticky() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sticky(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavItem.svelte generated by Svelte v3.37.0 */
    const file$i = "node_modules/sveltestrap/src/NavItem.svelte";

    function create_fragment$i(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let li_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$i, 10, 0, 219);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavItem", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, active, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active*/ 12) {
    			$$invalidate(0, classes = classnames(className, "nav-item", active ? "active" : false));
    		}
    	};

    	return [classes, $$restProps, className, active, $$scope, slots];
    }

    class NavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { class: 2, active: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavItem",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavLink.svelte generated by Svelte v3.37.0 */
    const file$h = "node_modules/sveltestrap/src/NavLink.svelte";

    function create_fragment$h(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[3],
    		{ href: /*href*/ ctx[0] },
    		{ class: /*classes*/ ctx[1] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$h, 27, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "click", /*handleClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 128) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (19:4) {#if children}
    function create_if_block_1$1(ctx) {
    	let t;
=======
    function instance$h($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","disabled","active","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavLink", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { disabled = false } = $$props;
    	let { active = false } = $$props;
    	let { href = "#" } = $$props;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	function handleClick(e) {
    		if (disabled) {
    			e.preventDefault();
    			e.stopImmediatePropagation();
    			return;
    		}

    		if (href === "#") {
    			e.preventDefault();
    		}
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("disabled" in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("active" in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		disabled,
    		active,
    		href,
    		handleClick,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("disabled" in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("active" in $$props) $$invalidate(6, active = $$new_props.active);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, active*/ 112) {
    			$$invalidate(1, classes = classnames(className, "nav-link", { disabled, active }));
    		}
    	};

<<<<<<< HEAD
    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(19:4) {#if children}",
    		ctx
    	});

    	return block;
=======
    	return [
    		href,
    		classes,
    		handleClick,
    		$$restProps,
    		className,
    		disabled,
    		active,
    		$$scope,
    		slots,
    		click_handler
    	];
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			class: 4,
    			disabled: 5,
    			active: 6,
    			href: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get class() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavbarBrand.svelte generated by Svelte v3.37.0 */
    const file$g = "node_modules/sveltestrap/src/NavbarBrand.svelte";

    function create_fragment$g(ctx) {
    	let a;
    	let current;
<<<<<<< HEAD
    	const if_block_creators = [create_if_block_1$1, create_else_block];
    	const if_blocks = [];
=======
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	let a_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ href: /*href*/ ctx[0] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$g, 10, 0, 192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavbarBrand", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { href = "/" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, href, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 8) {
    			$$invalidate(1, classes = classnames(className, "navbar-brand"));
    		}
    	};

    	return [href, classes, $$restProps, className, $$scope, slots, click_handler];
    }

    class NavbarBrand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { class: 3, href: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarBrand",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavbarToggler.svelte generated by Svelte v3.37.0 */
    const file$f = "node_modules/sveltestrap/src/NavbarToggler.svelte";

    // (13:8)      
    function fallback_block(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file$f, 13, 4, 274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(13:8)      ",
    		ctx
    	});

    	return block;
    }

    // (12:0) <Button {...$$restProps} on:click class={classes}>
    function create_default_slot$b(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(12:0) <Button {...$$restProps} on:click class={classes}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let button;
    	let current;
    	const button_spread_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];

    	let button_props = {
    		$$slots: { default: [create_default_slot$b] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < button_spread_levels.length; i += 1) {
    		button_props = assign(button_props, button_spread_levels[i]);
    	}

    	button = new Button({ props: button_props, $$inline: true });
    	button.$on("click", /*click_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = (dirty & /*$$restProps, classes*/ 3)
    			? get_spread_update(button_spread_levels, [
    					dirty & /*$$restProps*/ 2 && get_spread_object(/*$$restProps*/ ctx[1]),
    					dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    				])
    			: {};

    			if (dirty & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavbarToggler", slots, ['default']);
    	let { class: className = "" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, Button, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "navbar-toggler"));
    		}
    	};

    	return [classes, $$restProps, className, slots, click_handler, $$scope];
    }

    class NavbarToggler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarToggler",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<NavbarToggler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavbarToggler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Table.svelte generated by Svelte v3.37.0 */
    const file$e = "node_modules/sveltestrap/src/Table.svelte";

    // (35:0) {:else}
    function create_else_block(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$e, 35, 2, 861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2048) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(35:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if responsive}
    function create_if_block$1(ctx) {
    	let div;
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$e, 30, 4, 773);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$e, 29, 2, 735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2048) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));

    			if (!current || dirty & /*responsiveClassName*/ 4) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(29:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let classes;
    	let responsiveClassName;
    	const omit_props_names = ["class","size","bordered","borderless","striped","dark","hover","responsive"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Table", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { size = "" } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("size" in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		classes,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("size" in $$props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("responsiveClassName" in $$props) $$invalidate(2, responsiveClassName = $$new_props.responsiveClassName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			$$invalidate(1, classes = classnames(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, dark ? "table-dark" : false, hover ? "table-hover" : false));
    		}

    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			$$invalidate(2, responsiveClassName = responsive === true
    			? "table-responsive"
    			: `table-responsive-${responsive}`);
    		}
    	};

    	return [
    		responsive,
    		classes,
    		responsiveClassName,
    		$$restProps,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		$$scope,
    		slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/frontend/Header.svelte generated by Svelte v3.37.0 */

    const file$d = "src/frontend/Header.svelte";

    // (21:2) <NavbarBrand href="/" class="mr-auto">
    function create_default_slot_9$4(ctx) {
    	let strong;

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			strong.textContent = "SOS2021-10";
    			add_location(strong, file$d, 20, 40, 321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$4.name,
    		type: "slot",
    		source: "(21:2) <NavbarBrand href=\\\"/\\\" class=\\\"mr-auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:8) <NavLink href="#/foodconsumption-stats">
    function create_default_slot_8$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadísticas de consumo de comida");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$4.name,
    		type: "slot",
    		source: "(26:8) <NavLink href=\\\"#/foodconsumption-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:6) <NavItem>
    function create_default_slot_7$4(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/foodconsumption-stats",
    				$$slots: { default: [create_default_slot_8$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$4.name,
    		type: "slot",
    		source: "(25:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (29:8) <NavLink href="#/obesity-stats">
    function create_default_slot_6$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadísticas de obesidad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$4.name,
    		type: "slot",
    		source: "(29:8) <NavLink href=\\\"#/obesity-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:6) <NavItem>
    function create_default_slot_5$6(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/obesity-stats",
    				$$slots: { default: [create_default_slot_6$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$6.name,
    		type: "slot",
    		source: "(28:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (32:8) <NavLink href="#/sanity-stats">
    function create_default_slot_4$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadísticas de sanidad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$7.name,
    		type: "slot",
    		source: "(32:8) <NavLink href=\\\"#/sanity-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:3) <NavItem>
    function create_default_slot_3$8(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/sanity-stats",
    				$$slots: { default: [create_default_slot_4$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$8.name,
    		type: "slot",
    		source: "(31:3) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (24:4) <Nav navbar>
    function create_default_slot_2$9(ctx) {
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_7$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_5$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_3$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				navitem0_changes.$$scope = { dirty, ctx };
    			}

    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				navitem1_changes.$$scope = { dirty, ctx };
    			}

    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				navitem2_changes.$$scope = { dirty, ctx };
    			}

    			navitem2.$set(navitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$9.name,
    		type: "slot",
    		source: "(24:4) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <Collapse {isOpen} navbar>
    function create_default_slot_1$9(ctx) {
    	let nav;
    	let current;

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_2$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(23:2) <Collapse {isOpen} navbar>",
    		ctx
    	});

    	return block;
    }

    // (19:0) <Navbar style="background-color:#24355C;" dark class="fixed-top">
    function create_default_slot$a(ctx) {
    	let navbarbrand;
    	let t0;
    	let navbartoggler;
    	let t1;
    	let collapse;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "/",
    				class: "mr-auto",
    				$$slots: { default: [create_default_slot_9$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navbartoggler = new NavbarToggler({
    			props: { className: "mr-2" },
    			$$inline: true
    		});

    	navbartoggler.$on("click", /*toggleNav*/ ctx[1]);

    	collapse = new Collapse({
    			props: {
    				isOpen: /*isOpen*/ ctx[0],
    				navbar: true,
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navbarbrand.$$.fragment);
    			t0 = space();
    			create_component(navbartoggler.$$.fragment);
    			t1 = space();
    			create_component(collapse.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navbartoggler, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(collapse, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const collapse_changes = {};
    			if (dirty & /*isOpen*/ 1) collapse_changes.isOpen = /*isOpen*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				collapse_changes.$$scope = { dirty, ctx };
    			}

    			collapse.$set(collapse_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbarbrand.$$.fragment, local);
    			transition_in(navbartoggler.$$.fragment, local);
    			transition_in(collapse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbarbrand.$$.fragment, local);
    			transition_out(navbartoggler.$$.fragment, local);
    			transition_out(collapse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbarbrand, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navbartoggler, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(collapse, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(19:0) <Navbar style=\\\"background-color:#24355C;\\\" dark class=\\\"fixed-top\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let main;
    	let navbar;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "background-color:#24355C;",
    				dark: true,
    				class: "fixed-top",
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			add_location(main, file$d, 16, 0, 207);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*$$scope, isOpen*/ 5) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	let isOpen = false;
    	const toggleNav = () => $$invalidate(0, isOpen = !isOpen);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Collapse,
    		Navbar,
    		NavbarToggler,
    		NavbarBrand,
    		Nav,
    		NavItem,
    		NavLink,
    		isOpen,
    		toggleNav
    	});

    	$$self.$inject_state = $$props => {
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isOpen, toggleNav];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/frontend/NotFound.svelte generated by Svelte v3.37.0 */
    const file$c = "src/frontend/NotFound.svelte";

<<<<<<< HEAD
    // (21:2) <NavbarBrand href="/" class="mr-auto">
    function create_default_slot_9$4(ctx) {
    	let strong;

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			strong.textContent = "SOS2021-10";
    			add_location(strong, file$b, 20, 40, 321);
=======
    function create_fragment$c(ctx) {
    	let main;
    	let header;
    	let t0;
    	let div;
    	let br;
    	let t1;
    	let h3;
    	let current;
    	header = new Header({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			div = element("div");
    			br = element("br");
    			t1 = space();
    			h3 = element("h3");
    			h3.textContent = "Este recurso no existe";
    			add_location(br, file$c, 8, 2, 159);
    			add_location(h3, file$c, 9, 2, 166);
    			set_style(div, "margin", "auto");
    			set_style(div, "width", "60%");
    			set_style(div, "text-align", "center");
    			set_style(div, "padding-top", "275px");
    			add_location(div, file$c, 7, 1, 79);
    			add_location(main, file$c, 5, 0, 60);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			append_dev(div, br);
    			append_dev(div, t1);
    			append_dev(div, h3);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
<<<<<<< HEAD
    		id: create_default_slot_9$4.name,
    		type: "slot",
    		source: "(21:2) <NavbarBrand href=\\\"/\\\" class=\\\"mr-auto\\\">",
=======
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (26:8) <NavLink href="#/foodconsumption-stats">
    function create_default_slot_8$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadísticas de consumo de comida");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$4.name,
    		type: "slot",
    		source: "(26:8) <NavLink href=\\\"#/foodconsumption-stats\\\">",
    		ctx
=======
    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	});

    	$$self.$capture_state = () => ({ Header });
    	return [];
    }

<<<<<<< HEAD
    // (25:6) <NavItem>
    function create_default_slot_7$4(ctx) {
    	let navlink;
    	let current;
=======
    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/frontend/obesity/ObesitySv.svelte generated by Svelte v3.37.0 */

    const { console: console_1$5 } = globals;
    const file$b = "src/frontend/obesity/ObesitySv.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (92:8) <Button on:click={ObesityData}>
    function create_default_slot_4$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$6.name,
    		type: "slot",
<<<<<<< HEAD
    		source: "(25:6) <NavItem>",
=======
    		source: "(92:8) <Button on:click={ObesityData}>",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (29:8) <NavLink href="#/obesity-stats">
    function create_default_slot_6$4(ctx) {
=======
    // (93:8) <Button on:click={deleteAll}>
    function create_default_slot_3$7(ctx) {
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$7.name,
    		type: "slot",
<<<<<<< HEAD
    		source: "(29:8) <NavLink href=\\\"#/obesity-stats\\\">",
=======
    		source: "(93:8) <Button on:click={deleteAll}>",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (28:6) <NavItem>
    function create_default_slot_5$5(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/obesity-stats",
    				$$slots: { default: [create_default_slot_6$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});
=======
    // (112:8) <Button on:click={insertObesity}>
    function create_default_slot_2$8(ctx) {
    	let t;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$8.name,
    		type: "slot",
<<<<<<< HEAD
    		source: "(28:6) <NavItem>",
=======
    		source: "(112:8) <Button on:click={insertObesity}>",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (32:8) <NavLink href="#/sanity-stats">
    function create_default_slot_4$6(ctx) {
=======
    // (122:8) <Button on:click={deleteObesity(obe.country,obe.year)}>
    function create_default_slot_1$8(ctx) {
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
<<<<<<< HEAD
    		source: "(32:8) <NavLink href=\\\"#/sanity-stats\\\">",
=======
    		source: "(122:8) <Button on:click={deleteObesity(obe.country,obe.year)}>",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (31:3) <NavItem>
    function create_default_slot_3$6(ctx) {
    	let navlink;
=======
    // (114:3) {#each obesity as obe}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*obe*/ ctx[12].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*obe*/ ctx[12].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*obe*/ ctx[12].man_percent + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*obe*/ ctx[12].woman_percent + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*obe*/ ctx[12].total_population + "";
    	let t8;
    	let t9;
    	let td5;
    	let button;
    	let t10;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteObesity*/ ctx[4](/*obe*/ ctx[12].country, /*obe*/ ctx[12].year))) /*deleteObesity*/ ctx[4](/*obe*/ ctx[12].country, /*obe*/ ctx[12].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t10 = space();
    			attr_dev(a, "href", a_href_value = "#/obesity-stats/" + /*obe*/ ctx[12].country + "/" + /*obe*/ ctx[12].year);
    			add_location(a, file$b, 115, 8, 2727);
    			attr_dev(td0, "class", "svelte-1h2kj47");
    			add_location(td0, file$b, 115, 4, 2723);
    			attr_dev(td1, "class", "svelte-1h2kj47");
    			add_location(td1, file$b, 117, 4, 2806);
    			attr_dev(td2, "class", "svelte-1h2kj47");
    			add_location(td2, file$b, 118, 4, 2830);
    			attr_dev(td3, "class", "svelte-1h2kj47");
    			add_location(td3, file$b, 119, 4, 2861);
    			attr_dev(td4, "class", "svelte-1h2kj47");
    			add_location(td4, file$b, 120, 4, 2894);
    			attr_dev(td5, "class", "svelte-1h2kj47");
    			add_location(td5, file$b, 121, 4, 2930);
    			attr_dev(tr, "class", "svelte-1h2kj47");
    			add_location(tr, file$b, 114, 4, 2714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			append_dev(tr, t10);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*obesity*/ 1) && t0_value !== (t0_value = /*obe*/ ctx[12].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*obesity*/ 1 && a_href_value !== (a_href_value = "#/obesity-stats/" + /*obe*/ ctx[12].country + "/" + /*obe*/ ctx[12].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*obesity*/ 1) && t2_value !== (t2_value = /*obe*/ ctx[12].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*obesity*/ 1) && t4_value !== (t4_value = /*obe*/ ctx[12].man_percent + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*obesity*/ 1) && t6_value !== (t6_value = /*obe*/ ctx[12].woman_percent + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*obesity*/ 1) && t8_value !== (t8_value = /*obe*/ ctx[12].total_population + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
<<<<<<< HEAD
    		id: create_default_slot_3$6.name,
    		type: "slot",
    		source: "(31:3) <NavItem>",
=======
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(114:3) {#each obesity as obe}",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (24:4) <Nav navbar>
    function create_default_slot_2$8(ctx) {
    	let navitem0;
=======
    // (88:1) <Table responsive>
    function create_default_slot$9(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let button0;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let t0;
    	let td1;
    	let button1;
    	let t1;
    	let tr1;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let th5;
    	let t13;
    	let tbody;
    	let tr2;
    	let td2;
    	let input0;
    	let t14;
    	let td3;
    	let input1;
    	let t15;
    	let td4;
    	let input2;
    	let t16;
    	let td5;
    	let input3;
    	let t17;
    	let td6;
    	let input4;
    	let t18;
    	let td7;
    	let button2;
    	let t19;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_4$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*ObesityData*/ ctx[2]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_3$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteAll*/ ctx[5]);

    	button2 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*insertObesity*/ ctx[3]);
    	let each_value = /*obesity*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			create_component(button0.$$.fragment);
    			t0 = space();
    			td1 = element("td");
    			create_component(button1.$$.fragment);
    			t1 = space();
    			tr1 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Pais";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Porcentaje de hombres";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Porcentaje de mujer";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Población total";
    			t11 = space();
    			th5 = element("th");
    			th5.textContent = "Acción";
    			t13 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td2 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td5 = element("td");
    			input3 = element("input");
    			t17 = space();
    			td6 = element("td");
    			input4 = element("input");
    			t18 = space();
    			td7 = element("td");
    			create_component(button2.$$.fragment);
    			t19 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td0, "class", "svelte-1h2kj47");
    			add_location(td0, file$b, 91, 4, 1933);
    			attr_dev(td1, "class", "svelte-1h2kj47");
    			add_location(td1, file$b, 92, 4, 1999);
    			attr_dev(tr0, "class", "svelte-1h2kj47");
    			add_location(tr0, file$b, 90, 3, 1924);
    			add_location(th0, file$b, 96, 4, 2086);
    			add_location(th1, file$b, 97, 4, 2104);
    			add_location(th2, file$b, 98, 4, 2121);
    			add_location(th3, file$b, 99, 4, 2156);
    			add_location(th4, file$b, 100, 4, 2189);
    			add_location(th5, file$b, 101, 4, 2218);
    			attr_dev(tr1, "class", "svelte-1h2kj47");
    			add_location(tr1, file$b, 95, 3, 2077);
    			add_location(thead, file$b, 89, 2, 1913);
    			attr_dev(input0, "class", "svelte-1h2kj47");
    			add_location(input0, file$b, 106, 8, 2280);
    			attr_dev(td2, "class", "svelte-1h2kj47");
    			add_location(td2, file$b, 106, 4, 2276);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-1h2kj47");
    			add_location(input1, file$b, 107, 8, 2335);
    			attr_dev(td3, "class", "svelte-1h2kj47");
    			add_location(td3, file$b, 107, 4, 2331);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "class", "svelte-1h2kj47");
    			add_location(input2, file$b, 108, 8, 2399);
    			attr_dev(td4, "class", "svelte-1h2kj47");
    			add_location(td4, file$b, 108, 4, 2395);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "class", "svelte-1h2kj47");
    			add_location(input3, file$b, 109, 8, 2470);
    			attr_dev(td5, "class", "svelte-1h2kj47");
    			add_location(td5, file$b, 109, 4, 2466);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "class", "svelte-1h2kj47");
    			add_location(input4, file$b, 110, 8, 2543);
    			attr_dev(td6, "class", "svelte-1h2kj47");
    			add_location(td6, file$b, 110, 4, 2539);
    			attr_dev(td7, "class", "svelte-1h2kj47");
    			add_location(td7, file$b, 111, 4, 2615);
    			attr_dev(tr2, "class", "svelte-1h2kj47");
    			add_location(tr2, file$b, 105, 3, 2267);
    			add_location(tbody, file$b, 104, 2, 2256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			mount_component(button0, td0, null);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			mount_component(button1, td1, null);
    			append_dev(thead, t1);
    			append_dev(thead, tr1);
    			append_dev(tr1, th0);
    			append_dev(tr1, t3);
    			append_dev(tr1, th1);
    			append_dev(tr1, t5);
    			append_dev(tr1, th2);
    			append_dev(tr1, t7);
    			append_dev(tr1, th3);
    			append_dev(tr1, t9);
    			append_dev(tr1, th4);
    			append_dev(tr1, t11);
    			append_dev(tr1, th5);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*newObesity*/ ctx[1].country);
    			append_dev(tr2, t14);
    			append_dev(tr2, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*newObesity*/ ctx[1].year);
    			append_dev(tr2, t15);
    			append_dev(tr2, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*newObesity*/ ctx[1].man_percent);
    			append_dev(tr2, t16);
    			append_dev(tr2, td5);
    			append_dev(td5, input3);
    			set_input_value(input3, /*newObesity*/ ctx[1].woman_percent);
    			append_dev(tr2, t17);
    			append_dev(tr2, td6);
    			append_dev(td6, input4);
    			set_input_value(input4, /*newObesity*/ ctx[1].total_population);
    			append_dev(tr2, t18);
    			append_dev(tr2, td7);
    			mount_component(button2, td7, null);
    			append_dev(tbody, t19);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[8]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[9]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty & /*newObesity*/ 2 && input0.value !== /*newObesity*/ ctx[1].country) {
    				set_input_value(input0, /*newObesity*/ ctx[1].country);
    			}

<<<<<<< HEAD
    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$8.name,
    		type: "slot",
    		source: "(24:4) <Nav navbar>",
    		ctx
    	});
=======
    			if (dirty & /*newObesity*/ 2 && to_number(input1.value) !== /*newObesity*/ ctx[1].year) {
    				set_input_value(input1, /*newObesity*/ ctx[1].year);
    			}
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    			if (dirty & /*newObesity*/ 2 && to_number(input2.value) !== /*newObesity*/ ctx[1].man_percent) {
    				set_input_value(input2, /*newObesity*/ ctx[1].man_percent);
    			}

<<<<<<< HEAD
    // (23:2) <Collapse {isOpen} navbar>
    function create_default_slot_1$8(ctx) {
    	let nav;
    	let current;
=======
    			if (dirty & /*newObesity*/ 2 && to_number(input3.value) !== /*newObesity*/ ctx[1].woman_percent) {
    				set_input_value(input3, /*newObesity*/ ctx[1].woman_percent);
    			}
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    			if (dirty & /*newObesity*/ 2 && to_number(input4.value) !== /*newObesity*/ ctx[1].total_population) {
    				set_input_value(input4, /*newObesity*/ ctx[1].total_population);
    			}

    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);

    			if (dirty & /*deleteObesity, obesity*/ 17) {
    				each_value = /*obesity*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
<<<<<<< HEAD
    		source: "(23:2) <Collapse {isOpen} navbar>",
=======
    		source: "(88:1) <Table responsive>",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (19:0) <Navbar style="background-color:#24355C;" dark class="fixed-top">
    function create_default_slot$9(ctx) {
    	let navbarbrand;
    	let t0;
    	let navbartoggler;
    	let t1;
    	let collapse;
=======
    function create_fragment$b(ctx) {
    	let main;
    	let table;
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let current;

    	table = new Table({
    			props: {
    				responsive: true,
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(table.$$.fragment);
    			add_location(main, file$b, 86, 0, 1882);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(table, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const table_changes = {};

    			if (dirty & /*$$scope, obesity, newObesity*/ 32771) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
<<<<<<< HEAD
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(19:0) <Navbar style=\\\"background-color:#24355C;\\\" dark class=\\\"fixed-top\\\">",
=======
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

    const BASE_CONTACT_API_PATH$1 = "/api/v1";

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ObesitySv", slots, []);
    	let obesity = [];

    	let newObesity = {
    		country: "",
    		year: "",
    		man_percent: "",
    		woman_percent: "",
    		total_population: ""
    	};

    	async function ObesityData() {
    		console.log("Loading data...");

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats/loadInitialData").then(res => {
    			getObesity();
    		});
    	}

<<<<<<< HEAD
    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			add_location(main, file$b, 16, 0, 207);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};
=======
    	async function getObesity() {
    		console.log("Fetching data...");
    		const res = await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats");

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(0, obesity = json);
    			console.log(`We have ${obesity.length} obesity.`);
    		} else {
    			console.log("Error");
    		}
    	}
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f

    	async function insertObesity() {
    		console.log("Inserting data " + JSON.stringify(newObesity));

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats", {
    			method: "POST",
    			body: JSON.stringify(newObesity),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			getObesity();
    		});
    	}

    	async function deleteObesity(country, year) {
    		console.log(`Deleting data with name ${country} and date ${year}`);

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			getObesity();
    		});
    	}

    	async function deleteAll(country, year) {
    		console.log("Deleting all data");

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats", { method: "DELETE" }).then(function (res) {
    			getObesity();
    		});
    	}

    	onMount(getObesity);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<ObesitySv> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		newObesity.country = this.value;
    		$$invalidate(1, newObesity);
    	}

    	function input1_input_handler() {
    		newObesity.year = to_number(this.value);
    		$$invalidate(1, newObesity);
    	}

    	function input2_input_handler() {
    		newObesity.man_percent = to_number(this.value);
    		$$invalidate(1, newObesity);
    	}

    	function input3_input_handler() {
    		newObesity.woman_percent = to_number(this.value);
    		$$invalidate(1, newObesity);
    	}

    	function input4_input_handler() {
    		newObesity.total_population = to_number(this.value);
    		$$invalidate(1, newObesity);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		obesity,
    		newObesity,
    		BASE_CONTACT_API_PATH: BASE_CONTACT_API_PATH$1,
    		ObesityData,
    		getObesity,
    		insertObesity,
    		deleteObesity,
    		deleteAll
    	});

    	$$self.$inject_state = $$props => {
    		if ("obesity" in $$props) $$invalidate(0, obesity = $$props.obesity);
    		if ("newObesity" in $$props) $$invalidate(1, newObesity = $$props.newObesity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		obesity,
    		newObesity,
    		ObesityData,
    		insertObesity,
    		deleteObesity,
    		deleteAll,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class ObesitySv extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ObesitySv",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/frontend/sanity/SanityAPI.svelte generated by Svelte v3.37.0 */

    const { console: console_1$4 } = globals;
    const file$a = "src/frontend/sanity/SanityAPI.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (89:8) <Button  on:click={SanityData}>
    function create_default_slot_5$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar Datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$5.name,
    		type: "slot",
    		source: "(89:8) <Button  on:click={SanityData}>",
    		ctx
    	});

    	return block;
    }

    // (90:8) <Button  on:click={Delete}>
    function create_default_slot_4$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar Datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$5.name,
    		type: "slot",
    		source: "(90:8) <Button  on:click={Delete}>",
    		ctx
    	});

    	return block;
    }

    // (108:8) <Button on:click={PostSanity(NewSanity)}>
    function create_default_slot_3$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Subir Dato");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$6.name,
    		type: "slot",
    		source: "(108:8) <Button on:click={PostSanity(NewSanity)}>",
    		ctx
    	});

    	return block;
    }

    // (109:8) <Button on:click={PutSanity(NewSanity)}>
    function create_default_slot_2$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Modificar Dato");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$7.name,
    		type: "slot",
    		source: "(109:8) <Button on:click={PutSanity(NewSanity)}>",
    		ctx
    	});

    	return block;
    }

    // (118:8) <Button Button color="secondary" on:click={DeleteContact(sani.country,sani.year)}>
    function create_default_slot_1$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar Datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(118:8) <Button Button color=\\\"secondary\\\" on:click={DeleteContact(sani.country,sani.year)}>",
    		ctx
    	});

    	return block;
    }

    // (111:3) {#each sanity as sani}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*sani*/ ctx[13].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*sani*/ ctx[13].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*sani*/ ctx[13].health_expenditure_in_percentage + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*sani*/ ctx[13].doctor_per_1000_habitant + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*sani*/ ctx[13].hospital_bed + "";
    	let t8;
    	let t9;
    	let td5;
    	let button;
    	let t10;
    	let current;

    	button = new Button({
    			props: {
    				Button: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*DeleteContact*/ ctx[4](/*sani*/ ctx[13].country, /*sani*/ ctx[13].year))) /*DeleteContact*/ ctx[4](/*sani*/ ctx[13].country, /*sani*/ ctx[13].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t10 = space();
    			attr_dev(a, "href", a_href_value = "#/sanity-stats/" + /*sani*/ ctx[13].country + "/" + /*sani*/ ctx[13].year);
    			add_location(a, file$a, 112, 8, 3018);
    			attr_dev(td0, "class", "svelte-ycj1m8");
    			add_location(td0, file$a, 112, 4, 3014);
    			attr_dev(td1, "class", "svelte-ycj1m8");
    			add_location(td1, file$a, 113, 4, 3094);
    			attr_dev(td2, "class", "svelte-ycj1m8");
    			add_location(td2, file$a, 114, 4, 3119);
    			attr_dev(td3, "class", "svelte-ycj1m8");
    			add_location(td3, file$a, 115, 4, 3172);
    			attr_dev(td4, "class", "svelte-ycj1m8");
    			add_location(td4, file$a, 116, 4, 3217);
    			attr_dev(td5, "class", "svelte-ycj1m8");
    			add_location(td5, file$a, 117, 4, 3250);
    			attr_dev(tr, "class", "svelte-ycj1m8");
    			add_location(tr, file$a, 111, 4, 3005);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			append_dev(tr, t10);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*sanity*/ 1) && t0_value !== (t0_value = /*sani*/ ctx[13].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*sanity*/ 1 && a_href_value !== (a_href_value = "#/sanity-stats/" + /*sani*/ ctx[13].country + "/" + /*sani*/ ctx[13].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*sanity*/ 1) && t2_value !== (t2_value = /*sani*/ ctx[13].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*sanity*/ 1) && t4_value !== (t4_value = /*sani*/ ctx[13].health_expenditure_in_percentage + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*sanity*/ 1) && t6_value !== (t6_value = /*sani*/ ctx[13].doctor_per_1000_habitant + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*sanity*/ 1) && t8_value !== (t8_value = /*sani*/ ctx[13].hospital_bed + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(111:3) {#each sanity as sani}",
    		ctx
    	});

    	return block;
    }

    // (86:1) <Table responsive>
    function create_default_slot$8(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let button0;
    	let t0;
    	let td1;
    	let button1;
    	let t1;
    	let tr1;
    	let td2;
    	let t3;
    	let td3;
    	let t5;
    	let td4;
    	let t7;
    	let td5;
    	let t9;
    	let td6;
    	let t11;
    	let tbody;
    	let tr2;
    	let td7;
    	let input0;
    	let t12;
    	let td8;
    	let input1;
    	let t13;
    	let td9;
    	let input2;
    	let t14;
    	let td10;
    	let input3;
    	let t15;
    	let td11;
    	let input4;
    	let t16;
    	let td12;
    	let button2;
    	let t17;
    	let td13;
    	let button3;
    	let t18;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_5$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*SanityData*/ ctx[2]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_4$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*Delete*/ ctx[3]);

    	button2 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_3$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", function () {
    		if (is_function(/*PostSanity*/ ctx[5](/*NewSanity*/ ctx[1]))) /*PostSanity*/ ctx[5](/*NewSanity*/ ctx[1]).apply(this, arguments);
    	});

    	button3 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", function () {
    		if (is_function(/*PutSanity*/ ctx[6](/*NewSanity*/ ctx[1]))) /*PutSanity*/ ctx[6](/*NewSanity*/ ctx[1]).apply(this, arguments);
    	});

    	let each_value = /*sanity*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			create_component(button0.$$.fragment);
    			t0 = space();
    			td1 = element("td");
    			create_component(button1.$$.fragment);
    			t1 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Pais";
    			t3 = space();
    			td3 = element("td");
    			td3.textContent = "Año";
    			t5 = space();
    			td4 = element("td");
    			td4.textContent = "Porcentaje de gasto en sanidad";
    			t7 = space();
    			td5 = element("td");
    			td5.textContent = "Doctores por cada 1000 habitantes";
    			t9 = space();
    			td6 = element("td");
    			td6.textContent = "Camas de hospital";
    			t11 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td7 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td8 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td9 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td10 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td11 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td12 = element("td");
    			create_component(button2.$$.fragment);
    			t17 = space();
    			td13 = element("td");
    			create_component(button3.$$.fragment);
    			t18 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td0, "class", "svelte-ycj1m8");
    			add_location(td0, file$a, 88, 4, 2121);
    			attr_dev(td1, "class", "svelte-ycj1m8");
    			add_location(td1, file$a, 89, 4, 2187);
    			attr_dev(tr0, "class", "svelte-ycj1m8");
    			add_location(tr0, file$a, 87, 3, 2112);
    			attr_dev(td2, "class", "svelte-ycj1m8");
    			add_location(td2, file$a, 92, 4, 2266);
    			attr_dev(td3, "class", "svelte-ycj1m8");
    			add_location(td3, file$a, 93, 4, 2284);
    			attr_dev(td4, "class", "svelte-ycj1m8");
    			add_location(td4, file$a, 94, 4, 2301);
    			attr_dev(td5, "class", "svelte-ycj1m8");
    			add_location(td5, file$a, 95, 4, 2345);
    			attr_dev(td6, "class", "svelte-ycj1m8");
    			add_location(td6, file$a, 96, 4, 2392);
    			attr_dev(tr1, "class", "svelte-ycj1m8");
    			add_location(tr1, file$a, 91, 3, 2257);
    			add_location(thead, file$a, 86, 2, 2101);
    			attr_dev(input0, "class", "svelte-ycj1m8");
    			add_location(input0, file$a, 102, 8, 2469);
    			attr_dev(td7, "class", "svelte-ycj1m8");
    			add_location(td7, file$a, 102, 4, 2465);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-ycj1m8");
    			add_location(input1, file$a, 103, 8, 2523);
    			attr_dev(td8, "class", "svelte-ycj1m8");
    			add_location(td8, file$a, 103, 4, 2519);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "class", "svelte-ycj1m8");
    			add_location(input2, file$a, 104, 8, 2584);
    			attr_dev(td9, "class", "svelte-ycj1m8");
    			add_location(td9, file$a, 104, 4, 2580);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "class", "svelte-ycj1m8");
    			add_location(input3, file$a, 105, 8, 2673);
    			attr_dev(td10, "class", "svelte-ycj1m8");
    			add_location(td10, file$a, 105, 4, 2669);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "class", "svelte-ycj1m8");
    			add_location(input4, file$a, 106, 8, 2754);
    			attr_dev(td11, "class", "svelte-ycj1m8");
    			add_location(td11, file$a, 106, 4, 2750);
    			attr_dev(td12, "class", "svelte-ycj1m8");
    			add_location(td12, file$a, 107, 4, 2819);
    			attr_dev(td13, "class", "svelte-ycj1m8");
    			add_location(td13, file$a, 108, 4, 2893);
    			attr_dev(tr2, "class", "svelte-ycj1m8");
    			add_location(tr2, file$a, 101, 3, 2456);
    			add_location(tbody, file$a, 99, 2, 2441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			mount_component(button0, td0, null);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			mount_component(button1, td1, null);
    			append_dev(thead, t1);
    			append_dev(thead, tr1);
    			append_dev(tr1, td2);
    			append_dev(tr1, t3);
    			append_dev(tr1, td3);
    			append_dev(tr1, t5);
    			append_dev(tr1, td4);
    			append_dev(tr1, t7);
    			append_dev(tr1, td5);
    			append_dev(tr1, t9);
    			append_dev(tr1, td6);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td7);
    			append_dev(td7, input0);
    			set_input_value(input0, /*NewSanity*/ ctx[1].country);
    			append_dev(tr2, t12);
    			append_dev(tr2, td8);
    			append_dev(td8, input1);
    			set_input_value(input1, /*NewSanity*/ ctx[1].year);
    			append_dev(tr2, t13);
    			append_dev(tr2, td9);
    			append_dev(td9, input2);
    			set_input_value(input2, /*NewSanity*/ ctx[1].health_expenditure_in_percentage);
    			append_dev(tr2, t14);
    			append_dev(tr2, td10);
    			append_dev(td10, input3);
    			set_input_value(input3, /*NewSanity*/ ctx[1].doctor_per_1000_habitant);
    			append_dev(tr2, t15);
    			append_dev(tr2, td11);
    			append_dev(td11, input4);
    			set_input_value(input4, /*NewSanity*/ ctx[1].hospital_bed);
    			append_dev(tr2, t16);
    			append_dev(tr2, td12);
    			mount_component(button2, td12, null);
    			append_dev(tr2, t17);
    			append_dev(tr2, td13);
    			mount_component(button3, td13, null);
    			append_dev(tbody, t18);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[9]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[10]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty & /*NewSanity*/ 2 && input0.value !== /*NewSanity*/ ctx[1].country) {
    				set_input_value(input0, /*NewSanity*/ ctx[1].country);
    			}

    			if (dirty & /*NewSanity*/ 2 && to_number(input1.value) !== /*NewSanity*/ ctx[1].year) {
    				set_input_value(input1, /*NewSanity*/ ctx[1].year);
    			}

    			if (dirty & /*NewSanity*/ 2 && to_number(input2.value) !== /*NewSanity*/ ctx[1].health_expenditure_in_percentage) {
    				set_input_value(input2, /*NewSanity*/ ctx[1].health_expenditure_in_percentage);
    			}

    			if (dirty & /*NewSanity*/ 2 && to_number(input3.value) !== /*NewSanity*/ ctx[1].doctor_per_1000_habitant) {
    				set_input_value(input3, /*NewSanity*/ ctx[1].doctor_per_1000_habitant);
    			}

    			if (dirty & /*NewSanity*/ 2 && to_number(input4.value) !== /*NewSanity*/ ctx[1].hospital_bed) {
    				set_input_value(input4, /*NewSanity*/ ctx[1].hospital_bed);
    			}

    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);

    			if (dirty & /*DeleteContact, sanity*/ 17) {
    				each_value = /*sanity*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button2);
    			destroy_component(button3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(86:1) <Table responsive>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let main;
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				responsive: true,
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(table.$$.fragment);
    			add_location(main, file$a, 84, 0, 2072);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(table, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const table_changes = {};

    			if (dirty & /*$$scope, sanity, NewSanity*/ 65539) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SanityAPI", slots, []);
    	let sanity = [];

    	let NewSanity = {
    		"country": "",
    		"year": 0,
    		"health_expenditure_in_percentage": 0,
    		"doctor_per_1000_habitant": 0,
    		"hospital_bed": 0
    	};

    	async function SanityData() {
    		console.log("Loading data...");
    		const res = await fetch("/api/v1/sanity-stats/loadInitialData");

    		if (res.ok) {
    			console.log("Ok.");
    			getSanity();
    		} else {
    			console.log("Error");
    		}
    	}

    	async function getSanity() {
    		console.log("Fetching data...");
    		const res = await fetch("/api/v1/sanity-stats");

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(0, sanity = json);
    			console.log(`We have ${sanity.length} Sanity.`);
    		} else {
    			console.log("Error");
    		}
    	}

    	async function Delete() {
    		console.log("Fetching data...");

    		await fetch("/api/v1/sanity-stats", { method: "Delete" }).then(res => {
    			getSanity();
    		});
    	}

    	async function DeleteContact(ContactName, ContactYear) {
    		console.log("Fetching data...");

    		await fetch("/api/v1/sanity-stats/" + ContactName + "/" + ContactYear, { method: "Delete" }).then(res => {
    			getSanity();
    		});

    		getSanity();
    	}

    	async function PostSanity() {
    		console.log("Fetching data...");

    		await fetch("/api/v1/sanity-stats", {
    			method: "POST",
    			body: JSON.stringify(NewSanity),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			getSanity();
    		});
    	}

    	async function PutSanity() {
    		console.log("Fetching data...");

    		await fetch("/api/v1/sanity-stats/" + NewSanity.country + "/" + NewSanity.year, {
    			method: "PUT",
    			body: JSON.stringify(NewSanity),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			getSanity();
    		});
    	}

    	onMount(getSanity);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<SanityAPI> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		NewSanity.country = this.value;
    		$$invalidate(1, NewSanity);
    	}

    	function input1_input_handler() {
    		NewSanity.year = to_number(this.value);
    		$$invalidate(1, NewSanity);
    	}

    	function input2_input_handler() {
    		NewSanity.health_expenditure_in_percentage = to_number(this.value);
    		$$invalidate(1, NewSanity);
    	}

    	function input3_input_handler() {
    		NewSanity.doctor_per_1000_habitant = to_number(this.value);
    		$$invalidate(1, NewSanity);
    	}

    	function input4_input_handler() {
    		NewSanity.hospital_bed = to_number(this.value);
    		$$invalidate(1, NewSanity);
    	}

    	$$self.$capture_state = () => ({
    		Header,
    		Button,
    		onMount,
    		Table,
    		sanity,
    		NewSanity,
    		SanityData,
    		getSanity,
    		Delete,
    		DeleteContact,
    		PostSanity,
    		PutSanity
    	});

    	$$self.$inject_state = $$props => {
    		if ("sanity" in $$props) $$invalidate(0, sanity = $$props.sanity);
    		if ("NewSanity" in $$props) $$invalidate(1, NewSanity = $$props.NewSanity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sanity,
    		NewSanity,
    		SanityData,
    		Delete,
    		DeleteContact,
    		PostSanity,
    		PutSanity,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class SanityAPI extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SanityAPI",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/frontend/sanity/HomeSanity.svelte generated by Svelte v3.37.0 */

    const file$9 = "src/frontend/sanity/HomeSanity.svelte";

    // (28:6) <BreadcrumbItem>
    function create_default_slot_11$3(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas de Sanidad";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/sanity-stats");
    			add_location(a, file$9, 27, 22, 395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$3.name,
    		type: "slot",
    		source: "(28:6) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (29:4) <BreadcrumbItem active>
    function create_default_slot_10$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Desarrollado por Antonio José Díaz González");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$3.name,
    		type: "slot",
    		source: "(29:4) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (27:1) <Breadcrumb>
    function create_default_slot_9$3(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_11$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_10$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$3.name,
    		type: "slot",
    		source: "(27:1) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (37:5) <Button outline color="warning" on:click={toggle}>
    function create_default_slot_8$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Abrir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$3.name,
    		type: "slot",
    		source: "(37:5) <Button outline color=\\\"warning\\\" on:click={toggle}>",
    		ctx
    	});

    	return block;
    }

    // (39:4) <ModalHeader {toggle}>
    function create_default_slot_7$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadísticas de sanidad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$3.name,
    		type: "slot",
    		source: "(39:4) <ModalHeader {toggle}>",
    		ctx
    	});

    	return block;
    }

    // (41:5) <ModalBody>
    function create_default_slot_6$3(ctx) {
    	let sanitytable;
    	let current;
    	sanitytable = new SanityAPI({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sanitytable.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sanitytable, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sanitytable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sanitytable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sanitytable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(41:5) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (46:6) <Button color="secondary" on:click={toggle}>
    function create_default_slot_5$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cerrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$4.name,
    		type: "slot",
    		source: "(46:6) <Button color=\\\"secondary\\\" on:click={toggle}>",
    		ctx
    	});

    	return block;
    }

    // (45:4) <ModalFooter>
    function create_default_slot_4$4(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_5$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toggle*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(45:4) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (38:5) <Modal isOpen={open} {toggle} size="xl">
    function create_default_slot_3$5(ctx) {
    	let modalheader;
    	let t0;
    	let modalbody;
    	let t1;
    	let modalfooter;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle: /*toggle*/ ctx[1],
    				$$slots: { default: [create_default_slot_7$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalfooter = new ModalFooter({
    			props: {
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t0 = space();
    			create_component(modalbody.$$.fragment);
    			t1 = space();
    			create_component(modalfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modalbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modalfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalheader_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalheader_changes.$$scope = { dirty, ctx };
    			}

    			modalheader.$set(modalheader_changes);
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    			const modalfooter_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalfooter_changes.$$scope = { dirty, ctx };
    			}

    			modalfooter.$set(modalfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			transition_in(modalfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			transition_out(modalfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modalbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modalfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(38:5) <Modal isOpen={open} {toggle} size=\\\"xl\\\">",
    		ctx
    	});

    	return block;
    }

    // (56:2) <BreadcrumbItem active>
    function create_default_slot_2$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estaditicas de Sanidad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(56:2) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (57:4) <BreadcrumbItem>
    function create_default_slot_1$6(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Sanity_postman";
    			attr_dev(a, "href", "https://documenter.getpostman.com/view/9683594/TzJoE1Qx");
    			add_location(a, file$9, 56, 20, 1243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(57:4) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (55:1) <Breadcrumb class="peque">
    function create_default_slot$7(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(55:1) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let header;
    	let t0;
    	let h20;
    	let strong0;
    	let t2;
    	let breadcrumb0;
    	let t3;
    	let h21;
    	let strong1;
    	let t5;
    	let h5;
    	let t7;
    	let button;
    	let t8;
    	let modal;
    	let t9;
    	let h22;
    	let strong2;
    	let t11;
    	let breadcrumb1;
    	let current;
    	header = new Header({ $$inline: true });

    	breadcrumb0 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_9$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_8$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toggle*/ ctx[1]);

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[0],
    				toggle: /*toggle*/ ctx[1],
    				size: "xl",
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb1 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			h20 = element("h2");
    			strong0 = element("strong");
    			strong0.textContent = "API";
    			t2 = space();
    			create_component(breadcrumb0.$$.fragment);
    			t3 = space();
    			h21 = element("h2");
    			strong1 = element("strong");
    			strong1.textContent = "Front-end Svelte:";
    			t5 = space();
    			h5 = element("h5");
    			h5.textContent = "Estaditicas de Sanidad:";
    			t7 = space();
    			create_component(button.$$.fragment);
    			t8 = space();
    			create_component(modal.$$.fragment);
    			t9 = space();
    			h22 = element("h2");
    			strong2 = element("strong");
    			strong2.textContent = "Documentación en Postman:";
    			t11 = space();
    			create_component(breadcrumb1.$$.fragment);
    			add_location(strong0, file$9, 24, 2, 331);
    			add_location(h20, file$9, 23, 1, 324);
    			add_location(strong1, file$9, 32, 2, 619);
    			add_location(h21, file$9, 31, 1, 612);
    			add_location(h5, file$9, 34, 1, 662);
    			add_location(strong2, file$9, 51, 2, 1078);
    			add_location(h22, file$9, 50, 1, 1071);
    			attr_dev(main, "class", "svelte-4fr9k");
    			add_location(main, file$9, 20, 0, 303);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, h20);
    			append_dev(h20, strong0);
    			append_dev(main, t2);
    			mount_component(breadcrumb0, main, null);
    			append_dev(main, t3);
    			append_dev(main, h21);
    			append_dev(h21, strong1);
    			append_dev(main, t5);
    			append_dev(main, h5);
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			append_dev(main, t8);
    			mount_component(modal, main, null);
    			append_dev(main, t9);
    			append_dev(main, h22);
    			append_dev(h22, strong2);
    			append_dev(main, t11);
    			mount_component(breadcrumb1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrumb0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumb0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb0.$set(breadcrumb0_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.isOpen = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    			const breadcrumb1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumb1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb1.$set(breadcrumb1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(breadcrumb0.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			transition_in(breadcrumb1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(breadcrumb0.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			transition_out(breadcrumb1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(breadcrumb0);
    			destroy_component(button);
    			destroy_component(modal);
    			destroy_component(breadcrumb1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HomeSanity", slots, []);
    	let open = false;

    	const toggle = () => {
    		$$invalidate(0, open = !open);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HomeSanity> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		SanityTable: SanityAPI,
    		Button,
    		Modal,
    		ModalBody,
    		ModalFooter,
    		ModalHeader,
    		Breadcrumb,
    		BreadcrumbItem,
    		open,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ("open" in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, toggle];
    }

    class HomeSanity extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeSanity",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/frontend/foodConsumption/EditFood.svelte generated by Svelte v3.37.0 */

    const { console: console_1$3 } = globals;
    const file$8 = "src/frontend/foodConsumption/EditFood.svelte";

    // (111:25) <Button outline  color="primary" on:click={updateFoodconsumption}>
    function create_default_slot_3$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(111:25) <Button outline  color=\\\"primary\\\" on:click={updateFoodconsumption}>",
    		ctx
    	});

    	return block;
    }

    // (89:8) <Table bordered>
    function create_default_slot_2$5(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let th7;
    	let t15;
    	let tbody;
    	let tr1;
    	let td0;
    	let t16;
    	let t17;
    	let td1;
    	let t18;
    	let t19;
    	let td2;
    	let t20;
    	let t21;
    	let td3;
    	let input0;
    	let t22;
    	let td4;
    	let input1;
    	let t23;
    	let td5;
    	let input2;
    	let t24;
    	let td6;
    	let input3;
    	let t25;
    	let td7;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateFoodconsumption*/ ctx[9]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Tipo de comida";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Calorías por persona";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Gramos por persona";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Gramos diarios";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Calorías diarias";
    			t13 = space();
    			th7 = element("th");
    			th7.textContent = "Actions";
    			t15 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t16 = text(/*updatedCountry*/ ctx[2]);
    			t17 = space();
    			td1 = element("td");
    			t18 = text(/*updatedyear*/ ctx[3]);
    			t19 = space();
    			td2 = element("td");
    			t20 = text(/*updatedFoodtype*/ ctx[4]);
    			t21 = space();
    			td3 = element("td");
    			input0 = element("input");
    			t22 = space();
    			td4 = element("td");
    			input1 = element("input");
    			t23 = space();
    			td5 = element("td");
    			input2 = element("input");
    			t24 = space();
    			td6 = element("td");
    			input3 = element("input");
    			t25 = space();
    			td7 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$8, 91, 20, 2787);
    			add_location(th1, file$8, 92, 20, 2821);
    			add_location(th2, file$8, 93, 5, 2839);
    			add_location(th3, file$8, 94, 5, 2868);
    			add_location(th4, file$8, 95, 5, 2903);
    			add_location(th5, file$8, 96, 5, 2936);
    			add_location(th6, file$8, 97, 5, 2965);
    			add_location(th7, file$8, 98, 20, 3011);
    			add_location(tr0, file$8, 90, 16, 2762);
    			add_location(thead, file$8, 89, 12, 2738);
    			add_location(td0, file$8, 103, 20, 3132);
    			add_location(td1, file$8, 104, 5, 3163);
    			add_location(td2, file$8, 105, 5, 3191);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$8, 106, 24, 3242);
    			add_location(td3, file$8, 106, 20, 3238);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$8, 107, 9, 3314);
    			add_location(td4, file$8, 107, 5, 3310);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$8, 108, 9, 3384);
    			add_location(td5, file$8, 108, 5, 3380);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$8, 109, 9, 3450);
    			add_location(td6, file$8, 109, 5, 3446);
    			add_location(td7, file$8, 110, 20, 3529);
    			add_location(tr1, file$8, 102, 16, 3107);
    			add_location(tbody, file$8, 101, 12, 3083);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			append_dev(tr0, t13);
    			append_dev(tr0, th7);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t16);
    			append_dev(tr1, t17);
    			append_dev(tr1, td1);
    			append_dev(td1, t18);
    			append_dev(tr1, t19);
    			append_dev(tr1, td2);
    			append_dev(td2, t20);
    			append_dev(tr1, t21);
    			append_dev(tr1, td3);
    			append_dev(td3, input0);
    			set_input_value(input0, /*updatedCaloryperperson*/ ctx[5]);
    			append_dev(tr1, t22);
    			append_dev(tr1, td4);
    			append_dev(td4, input1);
    			set_input_value(input1, /*updatedGramperperson*/ ctx[6]);
    			append_dev(tr1, t23);
    			append_dev(tr1, td5);
    			append_dev(td5, input2);
    			set_input_value(input2, /*updatedDailygram*/ ctx[7]);
    			append_dev(tr1, t24);
    			append_dev(tr1, td6);
    			append_dev(td6, input3);
    			set_input_value(input3, /*updatedDailycalory*/ ctx[8]);
    			append_dev(tr1, t25);
    			append_dev(tr1, td7);
    			mount_component(button, td7, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*updatedCountry*/ 4) set_data_dev(t16, /*updatedCountry*/ ctx[2]);
    			if (!current || dirty & /*updatedyear*/ 8) set_data_dev(t18, /*updatedyear*/ ctx[3]);
    			if (!current || dirty & /*updatedFoodtype*/ 16) set_data_dev(t20, /*updatedFoodtype*/ ctx[4]);

    			if (dirty & /*updatedCaloryperperson*/ 32 && to_number(input0.value) !== /*updatedCaloryperperson*/ ctx[5]) {
    				set_input_value(input0, /*updatedCaloryperperson*/ ctx[5]);
    			}

    			if (dirty & /*updatedGramperperson*/ 64 && to_number(input1.value) !== /*updatedGramperperson*/ ctx[6]) {
    				set_input_value(input1, /*updatedGramperperson*/ ctx[6]);
    			}

    			if (dirty & /*updatedDailygram*/ 128 && to_number(input2.value) !== /*updatedDailygram*/ ctx[7]) {
    				set_input_value(input2, /*updatedDailygram*/ ctx[7]);
    			}

    			if (dirty & /*updatedDailycalory*/ 256 && to_number(input3.value) !== /*updatedDailycalory*/ ctx[8]) {
    				set_input_value(input3, /*updatedDailycalory*/ ctx[8]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(89:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (116:7) <Alert    color="danger"    isOpen={visible}    >
    function create_default_slot_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("No se encuentra este dato.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(116:7) <Alert    color=\\\"danger\\\"    isOpen={visible}    >",
    		ctx
    	});

    	return block;
    }

    // (124:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Back");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(124:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let header;
    	let t0;
    	let br;
    	let t1;
    	let h3;
    	let t2;
    	let strong;
    	let t3_value = /*params*/ ctx[0].country + "";
    	let t3;
    	let t4;
    	let t5_value = /*params*/ ctx[0].year + "";
    	let t5;
    	let t6;
    	let t7_value = /*params*/ ctx[0].foodtype + "";
    	let t7;
    	let t8;
    	let table;
    	let t9;
    	let alert;
    	let t10;
    	let button;
    	let current;
    	header = new Header({ $$inline: true });

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	alert = new Alert({
    			props: {
    				color: "danger",
    				isOpen: /*visible*/ ctx[1],
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			br = element("br");
    			t1 = space();
    			h3 = element("h3");
    			t2 = text("Editar consumo de comida ");
    			strong = element("strong");
    			t3 = text(t3_value);
    			t4 = text(",");
    			t5 = text(t5_value);
    			t6 = text(",");
    			t7 = text(t7_value);
    			t8 = space();
    			create_component(table.$$.fragment);
    			t9 = space();
    			create_component(alert.$$.fragment);
    			t10 = space();
    			create_component(button.$$.fragment);
    			add_location(br, file$8, 86, 1, 2592);
    			add_location(strong, file$8, 87, 33, 2630);
    			add_location(h3, file$8, 87, 4, 2601);
    			add_location(main, file$8, 84, 0, 2570);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, br);
    			append_dev(main, t1);
    			append_dev(main, h3);
    			append_dev(h3, t2);
    			append_dev(h3, strong);
    			append_dev(strong, t3);
    			append_dev(strong, t4);
    			append_dev(strong, t5);
    			append_dev(strong, t6);
    			append_dev(strong, t7);
    			append_dev(main, t8);
    			mount_component(table, main, null);
    			append_dev(main, t9);
    			mount_component(alert, main, null);
    			append_dev(main, t10);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].country + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*params*/ 1) && t5_value !== (t5_value = /*params*/ ctx[0].year + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty & /*params*/ 1) && t7_value !== (t7_value = /*params*/ ctx[0].foodtype + "")) set_data_dev(t7, t7_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedDailycalory, updatedDailygram, updatedGramperperson, updatedCaloryperperson, updatedFoodtype, updatedyear, updatedCountry*/ 131580) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const alert_changes = {};
    			if (dirty & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];

    			if (dirty & /*$$scope*/ 131072) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(alert.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(alert.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(table);
    			destroy_component(alert);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditFood", slots, []);
    	let visible = false;
    	let { params = {} } = $$props;
    	let foodconsumption = {};
    	let updatedCountry = "XXXX";
    	let updatedyear = 12345;
    	let updatedFoodtype = "XXXX";
    	let updatedCaloryperperson = 12345;
    	let updatedGramperperson = 12345;
    	let updatedDailygram = 12345;
    	let updatedDailycalory = 12345;
    	let errorMsg = "";
    	onMount(getFoodconsumption);

    	async function getFoodconsumption() {
    		console.log("Fetching contact...");
    		const res = await fetch("/api/v1/foodconsumption-stats/" + params.country + "/" + params.year + "/" + params.foodtype);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			foodconsumption = json;
    			$$invalidate(2, updatedCountry = foodconsumption.country);
    			$$invalidate(3, updatedyear = parseInt(foodconsumption.year));
    			$$invalidate(4, updatedFoodtype = foodconsumption.foodtype);
    			$$invalidate(5, updatedCaloryperperson = parseInt(foodconsumption.caloryperperson));
    			$$invalidate(6, updatedGramperperson = parseInt(foodconsumption.gramperperson));
    			$$invalidate(7, updatedDailygram = parseInt(foodconsumption.dailygram));
    			$$invalidate(8, updatedDailycalory = parseInt(foodconsumption.dailycalory));
    			$$invalidate(1, visible = false);
    			console.log("Received foodconsumption.");
    		} else {
    			$$invalidate(1, visible = true);
    			errorMsg = res.status + ": " + res.statusText;
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function updateFoodconsumption() {
    		console.log("Updating foodconsumption..." + JSON.stringify(params.country) + ", " + JSON.stringify(params.year) + ", " + JSON.stringify(params.foodtype));
    		let year = parseInt(params.year);

    		await fetch("/api/v1/foodconsumption-stats/" + params.country + "/" + params.year + "/" + params.foodtype, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: params.country,
    				year,
    				foodtype: params.foodtype,
    				caloryperperson: updatedCaloryperperson,
    				gramperperson: updatedGramperperson,
    				dailygram: updatedDailygram,
    				dailycalory: updatedDailycalory
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			getFoodconsumption();
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<EditFood> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		updatedCaloryperperson = to_number(this.value);
    		$$invalidate(5, updatedCaloryperperson);
    	}

    	function input1_input_handler() {
    		updatedGramperperson = to_number(this.value);
    		$$invalidate(6, updatedGramperperson);
    	}

    	function input2_input_handler() {
    		updatedDailygram = to_number(this.value);
    		$$invalidate(7, updatedDailygram);
    	}

    	function input3_input_handler() {
    		updatedDailycalory = to_number(this.value);
    		$$invalidate(8, updatedDailycalory);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		Alert,
    		visible,
    		onMount,
    		pop,
    		Table,
    		Button,
    		params,
    		foodconsumption,
    		updatedCountry,
    		updatedyear,
    		updatedFoodtype,
    		updatedCaloryperperson,
    		updatedGramperperson,
    		updatedDailygram,
    		updatedDailycalory,
    		errorMsg,
    		getFoodconsumption,
    		updateFoodconsumption
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(1, visible = $$props.visible);
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("foodconsumption" in $$props) foodconsumption = $$props.foodconsumption;
    		if ("updatedCountry" in $$props) $$invalidate(2, updatedCountry = $$props.updatedCountry);
    		if ("updatedyear" in $$props) $$invalidate(3, updatedyear = $$props.updatedyear);
    		if ("updatedFoodtype" in $$props) $$invalidate(4, updatedFoodtype = $$props.updatedFoodtype);
    		if ("updatedCaloryperperson" in $$props) $$invalidate(5, updatedCaloryperperson = $$props.updatedCaloryperperson);
    		if ("updatedGramperperson" in $$props) $$invalidate(6, updatedGramperperson = $$props.updatedGramperperson);
    		if ("updatedDailygram" in $$props) $$invalidate(7, updatedDailygram = $$props.updatedDailygram);
    		if ("updatedDailycalory" in $$props) $$invalidate(8, updatedDailycalory = $$props.updatedDailycalory);
    		if ("errorMsg" in $$props) errorMsg = $$props.errorMsg;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		visible,
    		updatedCountry,
    		updatedyear,
    		updatedFoodtype,
    		updatedCaloryperperson,
    		updatedGramperperson,
    		updatedDailygram,
    		updatedDailycalory,
    		updateFoodconsumption,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class EditFood extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditFood",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get params() {
    		throw new Error("<EditFood>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditFood>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/frontend/Info.svelte generated by Svelte v3.37.0 */

    const file$7 = "src/frontend/Info.svelte";

    // (57:5) <BreadcrumbItem active>
    function create_default_slot_26(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Antonio José Díaz González");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(57:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (58:3) <BreadcrumbItem active>
    function create_default_slot_25(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Enlace a Github";
    			attr_dev(a, "href", "https://github.com/AntonioJoseDiaz");
    			add_location(a, file$7, 57, 26, 778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(58:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (56:2) <Breadcrumb class="peque">
    function create_default_slot_24(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(56:2) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    // (61:5) <BreadcrumbItem active>
    function create_default_slot_23(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Almudena González López de Letona");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(61:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (62:3) <BreadcrumbItem active>
    function create_default_slot_22(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Enlace a Github";
    			attr_dev(a, "href", "https://github.com/almgonlop");
    			add_location(a, file$7, 61, 26, 996);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(62:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (60:2) <Breadcrumb>
    function create_default_slot_21(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(60:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (65:5) <BreadcrumbItem active>
    function create_default_slot_20(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Alicia Pérez Bolaños");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(65:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (66:3) <BreadcrumbItem active>
    function create_default_slot_19(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Enlace a Github";
    			attr_dev(a, "href", "https://github.com/aliperbol");
    			add_location(a, file$7, 65, 26, 1195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(66:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (64:2) <Breadcrumb>
    function create_default_slot_18(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(64:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (88:5) <BreadcrumbItem>
    function create_default_slot_17(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas de Sanidad";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/sanity-stats");
    			add_location(a, file$7, 87, 21, 1863);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(88:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (89:3) <BreadcrumbItem active>
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Desarrollado por Antonio José Díaz González");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(89:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (87:2) <Breadcrumb class="peque">
    function create_default_slot_15(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(87:2) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    // (93:5) <BreadcrumbItem>
    function create_default_slot_14(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas de Obesidad";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/obesity-stats");
    			add_location(a, file$7, 92, 21, 2113);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(93:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (94:3) <BreadcrumbItem active>
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Desarrollado por Almudena González López de Letona");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(94:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (92:2) <Breadcrumb>
    function create_default_slot_12(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(92:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (97:5) <BreadcrumbItem>
    function create_default_slot_11$2(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas del Consumo de Comida";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/foodconsumption-stats");
    			add_location(a, file$7, 96, 21, 2368);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(97:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (98:3) <BreadcrumbItem active>
    function create_default_slot_10$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Desarrollado por Alicia Pérez Bolaños");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(98:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (96:2) <Breadcrumb>
    function create_default_slot_9$2(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(96:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (109:5) <BreadcrumbItem active>
    function create_default_slot_8$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estaditicas de Sanidad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(109:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (110:5) <BreadcrumbItem>
    function create_default_slot_7$2(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Sanity_postman";
    			attr_dev(a, "href", "https://documenter.getpostman.com/view/9683594/TzJoE1Qx");
    			add_location(a, file$7, 109, 21, 2773);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(110:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (108:2) <Breadcrumb class="peque">
    function create_default_slot_6$2(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(108:2) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    // (114:5) <BreadcrumbItem active>
    function create_default_slot_5$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estaditicas de Obesidad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(114:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (115:5) <BreadcrumbItem>
    function create_default_slot_4$3(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Obesity_postman";
    			attr_dev(a, "href", "https://documenter.getpostman.com/view/14950492/TzJoDfvw");
    			add_location(a, file$7, 114, 21, 3001);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(115:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (113:2) <Breadcrumb>
    function create_default_slot_3$3(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(113:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (118:5) <BreadcrumbItem active>
    function create_default_slot_2$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estaditicas del Consumo de Comida");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(118:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (119:5) <BreadcrumbItem>
    function create_default_slot_1$4(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Food_postman";
    			attr_dev(a, "href", "https://documenter.getpostman.com/view/14948248/TzJoDfvx");
    			add_location(a, file$7, 118, 21, 3237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(119:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (117:2) <Breadcrumb>
    function create_default_slot$5(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(117:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let header;
    	let t0;
    	let div;
    	let h1;
    	let strong0;
    	let t2;
    	let h20;
    	let t4;
    	let ul0;
    	let breadcrumb0;
    	let t5;
    	let breadcrumb1;
    	let t6;
    	let breadcrumb2;
    	let t7;
    	let h21;
    	let t9;
    	let p0;
    	let t11;
    	let p1;
    	let strong1;
    	let t13;
    	let a0;
    	let t15;
    	let p2;
    	let strong2;
    	let a1;
    	let t18;
    	let h22;
    	let t20;
    	let ul1;
    	let breadcrumb3;
    	let t21;
    	let breadcrumb4;
    	let t22;
    	let breadcrumb5;
    	let t23;
    	let h23;
    	let t25;
    	let ul2;
    	let breadcrumb6;
    	let t26;
    	let breadcrumb7;
    	let t27;
    	let breadcrumb8;
    	let current;
    	header = new Header({ $$inline: true });

    	breadcrumb0 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb1 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb2 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb3 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb4 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb5 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb6 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb7 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb8 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			div = element("div");
    			h1 = element("h1");
    			strong0 = element("strong");
    			strong0.textContent = "SOS2021-10";
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Integrantes:";
    			t4 = space();
    			ul0 = element("ul");
    			create_component(breadcrumb0.$$.fragment);
    			t5 = space();
    			create_component(breadcrumb1.$$.fragment);
    			t6 = space();
    			create_component(breadcrumb2.$$.fragment);
    			t7 = space();
    			h21 = element("h2");
    			h21.textContent = "Descripción del proyecto:";
    			t9 = space();
    			p0 = element("p");
    			p0.textContent = "Nuestras fuentes de información estan orientadas a analizar la relación que existe entre la obesidad, el consumo de distintos tipos de comida y la sanidad en el mundo.";
    			t11 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Repositorio:";
    			t13 = space();
    			a0 = element("a");
    			a0.textContent = "https://github.com/gti-sos/SOS2021-10";
    			t15 = space();
    			p2 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "URL: ";
    			a1 = element("a");
    			a1.textContent = "http://sos2021-10.herokuapp.com";
    			t18 = space();
    			h22 = element("h2");
    			h22.textContent = "APIs desarrolladas:";
    			t20 = space();
    			ul1 = element("ul");
    			create_component(breadcrumb3.$$.fragment);
    			t21 = space();
    			create_component(breadcrumb4.$$.fragment);
    			t22 = space();
    			create_component(breadcrumb5.$$.fragment);
    			t23 = space();
    			h23 = element("h2");
    			h23.textContent = "Documentación en Postman:";
    			t25 = space();
    			ul2 = element("ul");
    			create_component(breadcrumb6.$$.fragment);
    			t26 = space();
    			create_component(breadcrumb7.$$.fragment);
    			t27 = space();
    			create_component(breadcrumb8.$$.fragment);
    			add_location(strong0, file$7, 49, 2, 582);
    			attr_dev(h1, "class", "svelte-1ji5f57");
    			add_location(h1, file$7, 48, 1, 575);
    			add_location(h20, file$7, 51, 1, 618);
    			add_location(ul0, file$7, 54, 1, 646);
    			add_location(h21, file$7, 70, 1, 1302);
    			add_location(p0, file$7, 73, 1, 1343);
    			add_location(strong1, file$7, 77, 2, 1530);
    			attr_dev(a0, "href", "https://github.com/gti-sos/SOS2021-10");
    			add_location(a0, file$7, 77, 33, 1561);
    			add_location(p1, file$7, 76, 1, 1524);
    			add_location(strong2, file$7, 80, 2, 1665);
    			attr_dev(a1, "href", "http://sos2021-10.herokuapp.com");
    			add_location(a1, file$7, 80, 24, 1687);
    			add_location(p2, file$7, 79, 1, 1659);
    			add_location(h22, file$7, 82, 1, 1773);
    			add_location(ul1, file$7, 85, 1, 1808);
    			add_location(h23, file$7, 103, 1, 2609);
    			add_location(ul2, file$7, 106, 1, 2650);
    			attr_dev(div, "class", "position svelte-1ji5f57");
    			add_location(div, file$7, 47, 1, 551);
    			add_location(main, file$7, 41, 0, 528);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			append_dev(div, h1);
    			append_dev(h1, strong0);
    			append_dev(div, t2);
    			append_dev(div, h20);
    			append_dev(div, t4);
    			append_dev(div, ul0);
    			mount_component(breadcrumb0, ul0, null);
    			append_dev(ul0, t5);
    			mount_component(breadcrumb1, ul0, null);
    			append_dev(ul0, t6);
    			mount_component(breadcrumb2, ul0, null);
    			append_dev(div, t7);
    			append_dev(div, h21);
    			append_dev(div, t9);
    			append_dev(div, p0);
    			append_dev(div, t11);
    			append_dev(div, p1);
    			append_dev(p1, strong1);
    			append_dev(p1, t13);
    			append_dev(p1, a0);
    			append_dev(div, t15);
    			append_dev(div, p2);
    			append_dev(p2, strong2);
    			append_dev(p2, a1);
    			append_dev(div, t18);
    			append_dev(div, h22);
    			append_dev(div, t20);
    			append_dev(div, ul1);
    			mount_component(breadcrumb3, ul1, null);
    			append_dev(ul1, t21);
    			mount_component(breadcrumb4, ul1, null);
    			append_dev(ul1, t22);
    			mount_component(breadcrumb5, ul1, null);
    			append_dev(div, t23);
    			append_dev(div, h23);
    			append_dev(div, t25);
    			append_dev(div, ul2);
    			mount_component(breadcrumb6, ul2, null);
    			append_dev(ul2, t26);
    			mount_component(breadcrumb7, ul2, null);
    			append_dev(ul2, t27);
    			mount_component(breadcrumb8, ul2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrumb0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumb0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb0.$set(breadcrumb0_changes);
    			const breadcrumb1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumb1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb1.$set(breadcrumb1_changes);
    			const breadcrumb2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumb2_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb2.$set(breadcrumb2_changes);
    			const breadcrumb3_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumb3_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb3.$set(breadcrumb3_changes);
    			const breadcrumb4_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumb4_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb4.$set(breadcrumb4_changes);
    			const breadcrumb5_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumb5_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb5.$set(breadcrumb5_changes);
    			const breadcrumb6_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumb6_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb6.$set(breadcrumb6_changes);
    			const breadcrumb7_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumb7_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb7.$set(breadcrumb7_changes);
    			const breadcrumb8_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				breadcrumb8_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb8.$set(breadcrumb8_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(breadcrumb0.$$.fragment, local);
    			transition_in(breadcrumb1.$$.fragment, local);
    			transition_in(breadcrumb2.$$.fragment, local);
    			transition_in(breadcrumb3.$$.fragment, local);
    			transition_in(breadcrumb4.$$.fragment, local);
    			transition_in(breadcrumb5.$$.fragment, local);
    			transition_in(breadcrumb6.$$.fragment, local);
    			transition_in(breadcrumb7.$$.fragment, local);
    			transition_in(breadcrumb8.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(breadcrumb0.$$.fragment, local);
    			transition_out(breadcrumb1.$$.fragment, local);
    			transition_out(breadcrumb2.$$.fragment, local);
    			transition_out(breadcrumb3.$$.fragment, local);
    			transition_out(breadcrumb4.$$.fragment, local);
    			transition_out(breadcrumb5.$$.fragment, local);
    			transition_out(breadcrumb6.$$.fragment, local);
    			transition_out(breadcrumb7.$$.fragment, local);
    			transition_out(breadcrumb8.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(breadcrumb0);
    			destroy_component(breadcrumb1);
    			destroy_component(breadcrumb2);
    			destroy_component(breadcrumb3);
    			destroy_component(breadcrumb4);
    			destroy_component(breadcrumb5);
    			destroy_component(breadcrumb6);
    			destroy_component(breadcrumb7);
    			destroy_component(breadcrumb8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Info", slots, []);
    	let open = false;
    	let opensa = false;
    	let openob = false;

    	const toggle = () => {
    		open = !open;
    	};

    	const togglesa = () => {
    		opensa = !opensa;
    	};

    	const toggleob = () => {
    		openob = !openob;
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Button,
    		Modal,
    		ModalBody,
    		ModalFooter,
    		ModalHeader,
    		Breadcrumb,
    		BreadcrumbItem,
    		Collapse,
    		Navbar,
    		NavbarToggler,
    		NavbarBrand,
    		Nav,
    		NavItem,
    		NavLink,
    		open,
    		opensa,
    		openob,
    		toggle,
    		togglesa,
    		toggleob
    	});

    	$$self.$inject_state = $$props => {
    		if ("open" in $$props) open = $$props.open;
    		if ("opensa" in $$props) opensa = $$props.opensa;
    		if ("openob" in $$props) openob = $$props.openob;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/frontend/Landing.svelte generated by Svelte v3.37.0 */
    const file$6 = "src/frontend/Landing.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let header;
    	let t0;
    	let div2;
    	let div1;
    	let h2;
    	let t2;
    	let hr;
    	let t3;
    	let div0;
    	let h4;
    	let a;
    	let current;
    	header = new Header({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "SOS2021-10";
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			div0 = element("div");
    			h4 = element("h4");
    			a = element("a");
    			a.textContent = "Informacion";
    			attr_dev(h2, "class", "display-4 font-weight-bold white-text pt-5 mb-2");
    			set_style(h2, "color", "white");
    			add_location(h2, file$6, 13, 5, 205);
    			attr_dev(hr, "class", "hr-light");
    			add_location(hr, file$6, 16, 5, 331);
    			attr_dev(a, "href", "#/info");
    			add_location(a, file$6, 20, 10, 501);
    			add_location(h4, file$6, 20, 6, 497);
    			set_style(div0, "background-color", "white");
    			set_style(div0, "border-radius", "5px");
    			set_style(div0, "max-width", "180px");
    			set_style(div0, "max-height", "50px");
    			set_style(div0, "margin", "auto");
    			add_location(div0, file$6, 19, 5, 385);
    			attr_dev(div1, "class", "col-md-10");
    			add_location(div1, file$6, 10, 4, 153);
    			attr_dev(div2, "class", "row d-flex justify-content-center text-center");
    			add_location(div2, file$6, 8, 3, 88);
    			attr_dev(main, "class", "svelte-78my9w");
    			add_location(main, file$6, 4, 1, 60);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h2);
    			append_dev(div1, t2);
    			append_dev(div1, hr);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, h4);
    			append_dev(h4, a);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Landing", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Landing> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header });
    	return [];
    }

    class Landing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Landing",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/frontend/foodConsumption/TableFood.svelte generated by Svelte v3.37.0 */

    const { console: console_1$2 } = globals;
    const file$5 = "src/frontend/foodConsumption/TableFood.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (107:2) <Alert    color="danger"    isOpen={visible}    toggle={() => (visible = false)}>
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Error en los campos al añadir un dato.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(107:2) <Alert    color=\\\"danger\\\"    isOpen={visible}    toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (117:9) <Button on:click={loadInitialData}>
    function create_default_slot_4$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(117:9) <Button on:click={loadInitialData}>",
    		ctx
    	});

    	return block;
    }

    // (118:9) <Button on:click={deleteTodo}>
    function create_default_slot_3$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(118:9) <Button on:click={deleteTodo}>",
    		ctx
    	});

    	return block;
    }

    // (142:9) <Button on:click={insertFoodconsumption}>
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(142:9) <Button on:click={insertFoodconsumption}>",
    		ctx
    	});

    	return block;
    }

    // (155:9) <Button on:click={deleteFood(datafood.country,datafood.year, datafood.foodtype )}>
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(155:9) <Button on:click={deleteFood(datafood.country,datafood.year, datafood.foodtype )}>",
    		ctx
    	});

    	return block;
    }

    // (145:4) {#each foodconsumption as datafood}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*datafood*/ ctx[17].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*datafood*/ ctx[17].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*datafood*/ ctx[17].foodtype + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*datafood*/ ctx[17].caloryperperson + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*datafood*/ ctx[17].gramperperson + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*datafood*/ ctx[17].dailygram + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12_value = /*datafood*/ ctx[17].dailycalory + "";
    	let t12;
    	let t13;
    	let td7;
    	let button;
    	let t14;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteFood*/ ctx[5](/*datafood*/ ctx[17].country, /*datafood*/ ctx[17].year, /*datafood*/ ctx[17].foodtype))) /*deleteFood*/ ctx[5](/*datafood*/ ctx[17].country, /*datafood*/ ctx[17].year, /*datafood*/ ctx[17].foodtype).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td7 = element("td");
    			create_component(button.$$.fragment);
    			t14 = space();
    			attr_dev(a, "href", a_href_value = "#/foodconsumption-stats/" + /*datafood*/ ctx[17].country + "/" + /*datafood*/ ctx[17].year + "/" + /*datafood*/ ctx[17].foodtype);
    			add_location(a, file$5, 147, 9, 3585);
    			attr_dev(td0, "class", "svelte-ycj1m8");
    			add_location(td0, file$5, 147, 5, 3581);
    			attr_dev(td1, "class", "svelte-ycj1m8");
    			add_location(td1, file$5, 148, 5, 3703);
    			attr_dev(td2, "class", "svelte-ycj1m8");
    			add_location(td2, file$5, 149, 5, 3733);
    			attr_dev(td3, "class", "svelte-ycj1m8");
    			add_location(td3, file$5, 150, 5, 3767);
    			attr_dev(td4, "class", "svelte-ycj1m8");
    			add_location(td4, file$5, 151, 5, 3808);
    			attr_dev(td5, "class", "svelte-ycj1m8");
    			add_location(td5, file$5, 152, 5, 3847);
    			attr_dev(td6, "class", "svelte-ycj1m8");
    			add_location(td6, file$5, 153, 5, 3882);
    			attr_dev(td7, "class", "svelte-ycj1m8");
    			add_location(td7, file$5, 154, 5, 3919);
    			attr_dev(tr, "class", "svelte-ycj1m8");
    			add_location(tr, file$5, 145, 5, 3570);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			append_dev(td6, t12);
    			append_dev(tr, t13);
    			append_dev(tr, td7);
    			mount_component(button, td7, null);
    			append_dev(tr, t14);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*foodconsumption*/ 1) && t0_value !== (t0_value = /*datafood*/ ctx[17].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*foodconsumption*/ 1 && a_href_value !== (a_href_value = "#/foodconsumption-stats/" + /*datafood*/ ctx[17].country + "/" + /*datafood*/ ctx[17].year + "/" + /*datafood*/ ctx[17].foodtype)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*foodconsumption*/ 1) && t2_value !== (t2_value = /*datafood*/ ctx[17].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*foodconsumption*/ 1) && t4_value !== (t4_value = /*datafood*/ ctx[17].foodtype + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*foodconsumption*/ 1) && t6_value !== (t6_value = /*datafood*/ ctx[17].caloryperperson + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*foodconsumption*/ 1) && t8_value !== (t8_value = /*datafood*/ ctx[17].gramperperson + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*foodconsumption*/ 1) && t10_value !== (t10_value = /*datafood*/ ctx[17].dailygram + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*foodconsumption*/ 1) && t12_value !== (t12_value = /*datafood*/ ctx[17].dailycalory + "")) set_data_dev(t12, t12_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(145:4) {#each foodconsumption as datafood}",
    		ctx
    	});

    	return block;
    }

    // (114:2) <Table responsive>
    function create_default_slot$4(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let button0;
    	let t0;
    	let td1;
    	let button1;
    	let t1;
    	let tr1;
    	let td2;
    	let t3;
    	let td3;
    	let t5;
    	let td4;
    	let t7;
    	let td5;
    	let t9;
    	let td6;
    	let t11;
    	let td7;
    	let t13;
    	let td8;
    	let t15;
    	let tbody;
    	let tr2;
    	let td9;
    	let input0;
    	let t16;
    	let td10;
    	let input1;
    	let t17;
    	let td11;
    	let input2;
    	let t18;
    	let td12;
    	let input3;
    	let t19;
    	let td13;
    	let input4;
    	let t20;
    	let td14;
    	let input5;
    	let t21;
    	let td15;
    	let input6;
    	let t22;
    	let td16;
    	let button2;
    	let t23;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadInitialData*/ ctx[3]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteTodo*/ ctx[6]);

    	button2 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*insertFoodconsumption*/ ctx[4]);
    	let each_value = /*foodconsumption*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			create_component(button0.$$.fragment);
    			t0 = space();
    			td1 = element("td");
    			create_component(button1.$$.fragment);
    			t1 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = "País";
    			t3 = space();
    			td3 = element("td");
    			td3.textContent = "Año";
    			t5 = space();
    			td4 = element("td");
    			td4.textContent = "Tipo de comida";
    			t7 = space();
    			td5 = element("td");
    			td5.textContent = "Calorías por persona";
    			t9 = space();
    			td6 = element("td");
    			td6.textContent = "Gramos por persona";
    			t11 = space();
    			td7 = element("td");
    			td7.textContent = "Gramos diarios";
    			t13 = space();
    			td8 = element("td");
    			td8.textContent = "Calorías diarias";
    			t15 = space();
    			tbody = element("tbody");
    			tr2 = element("tr");
    			td9 = element("td");
    			input0 = element("input");
    			t16 = space();
    			td10 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td11 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td12 = element("td");
    			input3 = element("input");
    			t19 = space();
    			td13 = element("td");
    			input4 = element("input");
    			t20 = space();
    			td14 = element("td");
    			input5 = element("input");
    			t21 = space();
    			td15 = element("td");
    			input6 = element("input");
    			t22 = space();
    			td16 = element("td");
    			create_component(button2.$$.fragment);
    			t23 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td0, "class", "svelte-ycj1m8");
    			add_location(td0, file$5, 116, 5, 2522);
    			attr_dev(td1, "class", "svelte-ycj1m8");
    			add_location(td1, file$5, 117, 5, 2593);
    			attr_dev(tr0, "class", "svelte-ycj1m8");
    			add_location(tr0, file$5, 115, 4, 2512);
    			attr_dev(td2, "class", "svelte-ycj1m8");
    			add_location(td2, file$5, 121, 5, 2684);
    			attr_dev(td3, "class", "svelte-ycj1m8");
    			add_location(td3, file$5, 122, 5, 2703);
    			attr_dev(td4, "class", "svelte-ycj1m8");
    			add_location(td4, file$5, 123, 5, 2721);
    			attr_dev(td5, "class", "svelte-ycj1m8");
    			add_location(td5, file$5, 124, 5, 2750);
    			attr_dev(td6, "class", "svelte-ycj1m8");
    			add_location(td6, file$5, 125, 5, 2785);
    			attr_dev(td7, "class", "svelte-ycj1m8");
    			add_location(td7, file$5, 126, 5, 2818);
    			attr_dev(td8, "class", "svelte-ycj1m8");
    			add_location(td8, file$5, 127, 5, 2847);
    			attr_dev(tr1, "class", "svelte-ycj1m8");
    			add_location(tr1, file$5, 120, 4, 2674);
    			add_location(thead, file$5, 114, 3, 2500);
    			attr_dev(input0, "class", "svelte-ycj1m8");
    			add_location(input0, file$5, 134, 9, 2926);
    			attr_dev(td9, "class", "svelte-ycj1m8");
    			add_location(td9, file$5, 134, 5, 2922);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-ycj1m8");
    			add_location(input1, file$5, 135, 9, 2990);
    			attr_dev(td10, "class", "svelte-ycj1m8");
    			add_location(td10, file$5, 135, 5, 2986);
    			attr_dev(input2, "class", "svelte-ycj1m8");
    			add_location(input2, file$5, 136, 9, 3063);
    			attr_dev(td11, "class", "svelte-ycj1m8");
    			add_location(td11, file$5, 136, 5, 3059);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "class", "svelte-ycj1m8");
    			add_location(input3, file$5, 137, 9, 3128);
    			attr_dev(td12, "class", "svelte-ycj1m8");
    			add_location(td12, file$5, 137, 5, 3124);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "class", "svelte-ycj1m8");
    			add_location(input4, file$5, 138, 9, 3212);
    			attr_dev(td13, "class", "svelte-ycj1m8");
    			add_location(td13, file$5, 138, 5, 3208);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "class", "svelte-ycj1m8");
    			add_location(input5, file$5, 139, 9, 3294);
    			attr_dev(td14, "class", "svelte-ycj1m8");
    			add_location(td14, file$5, 139, 5, 3290);
    			attr_dev(input6, "type", "number");
    			attr_dev(input6, "class", "svelte-ycj1m8");
    			add_location(input6, file$5, 140, 9, 3372);
    			attr_dev(td15, "class", "svelte-ycj1m8");
    			add_location(td15, file$5, 140, 5, 3368);
    			attr_dev(td16, "class", "svelte-ycj1m8");
    			add_location(td16, file$5, 141, 5, 3448);
    			attr_dev(tr2, "class", "svelte-ycj1m8");
    			add_location(tr2, file$5, 133, 4, 2912);
    			add_location(tbody, file$5, 131, 3, 2899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			mount_component(button0, td0, null);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			mount_component(button1, td1, null);
    			append_dev(thead, t1);
    			append_dev(thead, tr1);
    			append_dev(tr1, td2);
    			append_dev(tr1, t3);
    			append_dev(tr1, td3);
    			append_dev(tr1, t5);
    			append_dev(tr1, td4);
    			append_dev(tr1, t7);
    			append_dev(tr1, td5);
    			append_dev(tr1, t9);
    			append_dev(tr1, td6);
    			append_dev(tr1, t11);
    			append_dev(tr1, td7);
    			append_dev(tr1, t13);
    			append_dev(tr1, td8);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td9);
    			append_dev(td9, input0);
    			set_input_value(input0, /*newFoodconsumption*/ ctx[2].country);
    			append_dev(tr2, t16);
    			append_dev(tr2, td10);
    			append_dev(td10, input1);
    			set_input_value(input1, /*newFoodconsumption*/ ctx[2].year);
    			append_dev(tr2, t17);
    			append_dev(tr2, td11);
    			append_dev(td11, input2);
    			set_input_value(input2, /*newFoodconsumption*/ ctx[2].foodtype);
    			append_dev(tr2, t18);
    			append_dev(tr2, td12);
    			append_dev(td12, input3);
    			set_input_value(input3, /*newFoodconsumption*/ ctx[2].caloryperperson);
    			append_dev(tr2, t19);
    			append_dev(tr2, td13);
    			append_dev(td13, input4);
    			set_input_value(input4, /*newFoodconsumption*/ ctx[2].gramperperson);
    			append_dev(tr2, t20);
    			append_dev(tr2, td14);
    			append_dev(td14, input5);
    			set_input_value(input5, /*newFoodconsumption*/ ctx[2].dailygram);
    			append_dev(tr2, t21);
    			append_dev(tr2, td15);
    			append_dev(td15, input6);
    			set_input_value(input6, /*newFoodconsumption*/ ctx[2].dailycalory);
    			append_dev(tr2, t22);
    			append_dev(tr2, td16);
    			mount_component(button2, td16, null);
    			append_dev(tbody, t23);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[8]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[9]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[10]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[11]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[12]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[13]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[14])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty & /*newFoodconsumption*/ 4 && input0.value !== /*newFoodconsumption*/ ctx[2].country) {
    				set_input_value(input0, /*newFoodconsumption*/ ctx[2].country);
    			}

    			if (dirty & /*newFoodconsumption*/ 4 && to_number(input1.value) !== /*newFoodconsumption*/ ctx[2].year) {
    				set_input_value(input1, /*newFoodconsumption*/ ctx[2].year);
    			}

    			if (dirty & /*newFoodconsumption*/ 4 && input2.value !== /*newFoodconsumption*/ ctx[2].foodtype) {
    				set_input_value(input2, /*newFoodconsumption*/ ctx[2].foodtype);
    			}

    			if (dirty & /*newFoodconsumption*/ 4 && to_number(input3.value) !== /*newFoodconsumption*/ ctx[2].caloryperperson) {
    				set_input_value(input3, /*newFoodconsumption*/ ctx[2].caloryperperson);
    			}

    			if (dirty & /*newFoodconsumption*/ 4 && to_number(input4.value) !== /*newFoodconsumption*/ ctx[2].gramperperson) {
    				set_input_value(input4, /*newFoodconsumption*/ ctx[2].gramperperson);
    			}

    			if (dirty & /*newFoodconsumption*/ 4 && to_number(input5.value) !== /*newFoodconsumption*/ ctx[2].dailygram) {
    				set_input_value(input5, /*newFoodconsumption*/ ctx[2].dailygram);
    			}

    			if (dirty & /*newFoodconsumption*/ 4 && to_number(input6.value) !== /*newFoodconsumption*/ ctx[2].dailycalory) {
    				set_input_value(input6, /*newFoodconsumption*/ ctx[2].dailycalory);
    			}

    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);

    			if (dirty & /*deleteFood, foodconsumption*/ 33) {
    				each_value = /*foodconsumption*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(114:2) <Table responsive>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let alert;
    	let t;
    	let table;
    	let current;

    	alert = new Alert({
    			props: {
    				color: "danger",
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[7],
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				responsive: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert.$$.fragment);
    			t = space();
    			create_component(table.$$.fragment);
    			add_location(main, file$5, 104, 0, 2326);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert, main, null);
    			append_dev(main, t);
    			mount_component(table, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const alert_changes = {};
    			if (dirty & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty & /*visible*/ 2) alert_changes.toggle = /*func*/ ctx[7];

    			if (dirty & /*$$scope*/ 1048576) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			const table_changes = {};

    			if (dirty & /*$$scope, foodconsumption, newFoodconsumption*/ 1048581) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert);
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TableFood", slots, []);
    	let foodconsumption = [];
    	let visible = false;

    	let newFoodconsumption = {
    		country: "",
    		year: 0,
    		foodtype: "",
    		caloryperperson: 0,
    		gramperperson: 0,
    		dailygram: 0,
    		dailycalory: 0
    	};

    	var BASE_CONTACT_API_PATH = "/api/v1";

    	async function getFoodconsumption() {
    		console.log("Fetching foodconsumption...");
    		const res = await fetch("/api/v1/foodconsumption-stats");

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(0, foodconsumption = json);
    			console.log(`We have ${foodconsumption.length} foodconsumption.`);
    			console.log(JSON.stringify(foodconsumption));
    		} else {
    			console.log("Error!");
    		}
    	}

    	async function loadInitialData() {
    		console.log("Fetching foodconsumption...");

    		await fetch("/api/v1/foodconsumption-stats/loadInitialData").then(res => {
    			getFoodconsumption();
    		});
    	}

    	async function insertFoodconsumption() {
    		console.log("Inserting foodconsumption " + JSON.stringify(newFoodconsumption));

    		await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats", {
    			method: "POST",
    			body: JSON.stringify(newFoodconsumption),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			getFoodconsumption();

    			if (res.status === 400) {
    				console.log("TAS EQUIVOCAO");
    				$$invalidate(1, visible = true);
    			}
    		});
    	}

    	async function deleteFood(country, year, foodtype) {
    		console.log("Deleting foodconsumption with country " + JSON.stringify(country) + " year " + JSON.stringify(year) + " and foodtype " + JSON.stringify(foodtype));

    		await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats/" + country + "/" + year + "/" + foodtype, { method: "DELETE" }).then(res => {
    			getFoodconsumption();
    		});
    	}

    	async function deleteTodo() {
    		await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats", { method: "DELETE" }).then(res => {
    			getFoodconsumption();
    		});
    	}

    	onMount(getFoodconsumption);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<TableFood> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input0_input_handler() {
    		newFoodconsumption.country = this.value;
    		$$invalidate(2, newFoodconsumption);
    	}

    	function input1_input_handler() {
    		newFoodconsumption.year = to_number(this.value);
    		$$invalidate(2, newFoodconsumption);
    	}

    	function input2_input_handler() {
    		newFoodconsumption.foodtype = this.value;
    		$$invalidate(2, newFoodconsumption);
    	}

    	function input3_input_handler() {
    		newFoodconsumption.caloryperperson = to_number(this.value);
    		$$invalidate(2, newFoodconsumption);
    	}

    	function input4_input_handler() {
    		newFoodconsumption.gramperperson = to_number(this.value);
    		$$invalidate(2, newFoodconsumption);
    	}

    	function input5_input_handler() {
    		newFoodconsumption.dailygram = to_number(this.value);
    		$$invalidate(2, newFoodconsumption);
    	}

    	function input6_input_handler() {
    		newFoodconsumption.dailycalory = to_number(this.value);
    		$$invalidate(2, newFoodconsumption);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		foodconsumption,
    		Button,
    		Alert,
    		visible,
    		newFoodconsumption,
    		BASE_CONTACT_API_PATH,
    		getFoodconsumption,
    		loadInitialData,
    		insertFoodconsumption,
    		deleteFood,
    		deleteTodo
    	});

    	$$self.$inject_state = $$props => {
    		if ("foodconsumption" in $$props) $$invalidate(0, foodconsumption = $$props.foodconsumption);
    		if ("visible" in $$props) $$invalidate(1, visible = $$props.visible);
    		if ("newFoodconsumption" in $$props) $$invalidate(2, newFoodconsumption = $$props.newFoodconsumption);
    		if ("BASE_CONTACT_API_PATH" in $$props) BASE_CONTACT_API_PATH = $$props.BASE_CONTACT_API_PATH;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		foodconsumption,
    		visible,
    		newFoodconsumption,
    		loadInitialData,
    		insertFoodconsumption,
    		deleteFood,
    		deleteTodo,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler
    	];
    }

    class TableFood extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableFood",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/frontend/foodConsumption/HomeFood.svelte generated by Svelte v3.37.0 */

    const file$4 = "src/frontend/foodConsumption/HomeFood.svelte";

    // (28:6) <BreadcrumbItem>
    function create_default_slot_11$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas del Consumo de Comida";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/foodconsumption-stats");
    			add_location(a, file$4, 27, 22, 393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(28:6) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (29:4) <BreadcrumbItem active>
    function create_default_slot_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Desarrollado por Alicia Pérez Bolaños");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(29:4) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (27:1) <Breadcrumb>
    function create_default_slot_9$1(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(27:1) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (37:5) <Button outline color="warning" on:click={toggle}>
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Abrir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(37:5) <Button outline color=\\\"warning\\\" on:click={toggle}>",
    		ctx
    	});

    	return block;
    }

    // (39:4) <ModalHeader {toggle}>
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadísticas de consumo de comida");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(39:4) <ModalHeader {toggle}>",
    		ctx
    	});

    	return block;
    }

    // (41:5) <ModalBody>
    function create_default_slot_6$1(ctx) {
    	let tablefood;
    	let current;
    	tablefood = new TableFood({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(tablefood.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablefood, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablefood.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablefood.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablefood, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(41:5) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (46:6) <Button color="secondary" on:click={toggle}>
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cerrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(46:6) <Button color=\\\"secondary\\\" on:click={toggle}>",
    		ctx
    	});

    	return block;
    }

    // (45:4) <ModalFooter>
    function create_default_slot_4$1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toggle*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(45:4) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (38:5) <Modal isOpen={open} {toggle} size="xl">
    function create_default_slot_3$1(ctx) {
    	let modalheader;
    	let t0;
    	let modalbody;
    	let t1;
    	let modalfooter;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle: /*toggle*/ ctx[1],
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalfooter = new ModalFooter({
    			props: {
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t0 = space();
    			create_component(modalbody.$$.fragment);
    			t1 = space();
    			create_component(modalfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modalbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modalfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalheader_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalheader_changes.$$scope = { dirty, ctx };
    			}

    			modalheader.$set(modalheader_changes);
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    			const modalfooter_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalfooter_changes.$$scope = { dirty, ctx };
    			}

    			modalfooter.$set(modalfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			transition_in(modalfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			transition_out(modalfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modalbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modalfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(38:5) <Modal isOpen={open} {toggle} size=\\\"xl\\\">",
    		ctx
    	});

    	return block;
    }

    // (56:2) <BreadcrumbItem active>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estaditicas del Consumo de Comida");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(56:2) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (57:4) <BreadcrumbItem>
    function create_default_slot_1$2(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Food_postman";
    			attr_dev(a, "href", "https://documenter.getpostman.com/view/14948248/TzJoDfvx");
    			add_location(a, file$4, 56, 20, 1286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(57:4) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (55:1) <Breadcrumb class="peque">
    function create_default_slot$3(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(55:1) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let header;
    	let t0;
    	let h20;
    	let strong0;
    	let t2;
    	let breadcrumb0;
    	let t3;
    	let h21;
    	let strong1;
    	let t5;
    	let h5;
    	let t7;
    	let button;
    	let t8;
    	let modal;
    	let t9;
    	let h22;
    	let strong2;
    	let t11;
    	let breadcrumb1;
    	let current;
    	header = new Header({ $$inline: true });

    	breadcrumb0 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toggle*/ ctx[1]);

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[0],
    				toggle: /*toggle*/ ctx[1],
    				size: "xl",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb1 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			h20 = element("h2");
    			strong0 = element("strong");
    			strong0.textContent = "API";
    			t2 = space();
    			create_component(breadcrumb0.$$.fragment);
    			t3 = space();
    			h21 = element("h2");
    			strong1 = element("strong");
    			strong1.textContent = "Front-end Svelte:";
    			t5 = space();
    			h5 = element("h5");
    			h5.textContent = "Estaditicas del Consumo de Comida:";
    			t7 = space();
    			create_component(button.$$.fragment);
    			t8 = space();
    			create_component(modal.$$.fragment);
    			t9 = space();
    			h22 = element("h2");
    			strong2 = element("strong");
    			strong2.textContent = "Documentación en Postman:";
    			t11 = space();
    			create_component(breadcrumb1.$$.fragment);
    			add_location(strong0, file$4, 24, 2, 329);
    			add_location(h20, file$4, 23, 1, 322);
    			add_location(strong1, file$4, 32, 2, 631);
    			add_location(h21, file$4, 31, 1, 624);
    			add_location(h5, file$4, 34, 1, 674);
    			add_location(strong2, file$4, 51, 2, 1109);
    			add_location(h22, file$4, 50, 1, 1102);
    			attr_dev(main, "class", "svelte-4fr9k");
    			add_location(main, file$4, 20, 0, 301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, h20);
    			append_dev(h20, strong0);
    			append_dev(main, t2);
    			mount_component(breadcrumb0, main, null);
    			append_dev(main, t3);
    			append_dev(main, h21);
    			append_dev(h21, strong1);
    			append_dev(main, t5);
    			append_dev(main, h5);
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			append_dev(main, t8);
    			mount_component(modal, main, null);
    			append_dev(main, t9);
    			append_dev(main, h22);
    			append_dev(h22, strong2);
    			append_dev(main, t11);
    			mount_component(breadcrumb1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrumb0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumb0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb0.$set(breadcrumb0_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.isOpen = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    			const breadcrumb1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumb1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb1.$set(breadcrumb1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(breadcrumb0.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			transition_in(breadcrumb1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(breadcrumb0.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			transition_out(breadcrumb1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(breadcrumb0);
    			destroy_component(button);
    			destroy_component(modal);
    			destroy_component(breadcrumb1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HomeFood", slots, []);
    	let open = false;

    	const toggle = () => {
    		$$invalidate(0, open = !open);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HomeFood> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		TableFood,
    		Button,
    		Modal,
    		ModalBody,
    		ModalFooter,
    		ModalHeader,
    		Breadcrumb,
    		BreadcrumbItem,
    		open,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ("open" in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, toggle];
    }

    class HomeFood extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeFood",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/frontend/obesity/HomeObesity.svelte generated by Svelte v3.37.0 */

    const file$3 = "src/frontend/obesity/HomeObesity.svelte";

    // (28:6) <BreadcrumbItem>
    function create_default_slot_11(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas de Obesidad";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/obesity-stats");
    			add_location(a, file$3, 27, 22, 401);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(28:6) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (29:4) <BreadcrumbItem active>
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Desarrollado por Almudena González López de Letona");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(29:4) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (27:1) <Breadcrumb>
    function create_default_slot_9(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(27:1) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (37:2) <Button outline color="warning" on:click={toggleob}>
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Abrir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(37:2) <Button outline color=\\\"warning\\\" on:click={toggleob}>",
    		ctx
    	});

    	return block;
    }

    // (39:3) <ModalHeader {toggleob}>
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estadísticas de obesidad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(39:3) <ModalHeader {toggleob}>",
    		ctx
    	});

    	return block;
    }

    // (40:3) <ModalBody>
    function create_default_slot_6(ctx) {
    	let obesitysv;
    	let current;
    	obesitysv = new ObesitySv({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(obesitysv.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(obesitysv, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(obesitysv.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(obesitysv.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(obesitysv, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(40:3) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (44:4) <Button color="secondary" on:click={toggleob}>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cerrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(44:4) <Button color=\\\"secondary\\\" on:click={toggleob}>",
    		ctx
    	});

    	return block;
    }

    // (43:3) <ModalFooter>
    function create_default_slot_4(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toggleob*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(43:3) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (38:2) <Modal isOpen={openob} {toggleob} size= 'xl'>
    function create_default_slot_3(ctx) {
    	let modalheader;
    	let t0;
    	let modalbody;
    	let t1;
    	let modalfooter;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggleob: /*toggleob*/ ctx[1],
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalfooter = new ModalFooter({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t0 = space();
    			create_component(modalbody.$$.fragment);
    			t1 = space();
    			create_component(modalfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modalbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modalfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalheader_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalheader_changes.$$scope = { dirty, ctx };
    			}

    			modalheader.$set(modalheader_changes);
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    			const modalfooter_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalfooter_changes.$$scope = { dirty, ctx };
    			}

    			modalfooter.$set(modalfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			transition_in(modalfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			transition_out(modalfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modalbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modalfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(38:2) <Modal isOpen={openob} {toggleob} size= 'xl'>",
    		ctx
    	});

    	return block;
    }

    // (54:2) <BreadcrumbItem active>
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Estaditicas de Obesidad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(54:2) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (55:4) <BreadcrumbItem>
    function create_default_slot_1$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Obesity_postman";
    			attr_dev(a, "href", "https://documenter.getpostman.com/view/14950492/TzJoDfvw");
    			add_location(a, file$3, 54, 20, 1239);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(55:4) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (53:1) <Breadcrumb class="peque">
    function create_default_slot$2(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrumbitem0.$$.fragment);
    			t = space();
    			create_component(breadcrumbitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrumbitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breadcrumbitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbitem0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem0.$set(breadcrumbitem0_changes);
    			const breadcrumbitem1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumbitem1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumbitem1.$set(breadcrumbitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbitem0.$$.fragment, local);
    			transition_in(breadcrumbitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbitem0.$$.fragment, local);
    			transition_out(breadcrumbitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrumbitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breadcrumbitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(53:1) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let header;
    	let t0;
    	let h20;
    	let strong0;
    	let t2;
    	let breadcrumb0;
    	let t3;
    	let h21;
    	let strong1;
    	let t5;
    	let h5;
    	let t7;
    	let button;
    	let t8;
    	let modal;
    	let t9;
    	let h22;
    	let strong2;
    	let t11;
    	let breadcrumb1;
    	let current;
    	header = new Header({ $$inline: true });

    	breadcrumb0 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toggleob*/ ctx[1]);

    	modal = new Modal({
    			props: {
    				isOpen: /*openob*/ ctx[0],
    				toggleob: /*toggleob*/ ctx[1],
    				size: "xl",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb1 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			h20 = element("h2");
    			strong0 = element("strong");
    			strong0.textContent = "API";
    			t2 = space();
    			create_component(breadcrumb0.$$.fragment);
    			t3 = space();
    			h21 = element("h2");
    			strong1 = element("strong");
    			strong1.textContent = "Front-end Svelte:";
    			t5 = space();
    			h5 = element("h5");
    			h5.textContent = "Estaditicas de Obesidad:";
    			t7 = space();
    			create_component(button.$$.fragment);
    			t8 = space();
    			create_component(modal.$$.fragment);
    			t9 = space();
    			h22 = element("h2");
    			strong2 = element("strong");
    			strong2.textContent = "Documentación en Postman:";
    			t11 = space();
    			create_component(breadcrumb1.$$.fragment);
    			add_location(strong0, file$3, 24, 2, 337);
    			add_location(h20, file$3, 23, 1, 330);
    			add_location(strong1, file$3, 32, 2, 634);
    			add_location(h21, file$3, 31, 1, 627);
    			add_location(h5, file$3, 34, 1, 677);
    			add_location(strong2, file$3, 49, 2, 1072);
    			add_location(h22, file$3, 48, 1, 1065);
    			attr_dev(main, "class", "svelte-1pldhn0");
    			add_location(main, file$3, 20, 0, 309);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, h20);
    			append_dev(h20, strong0);
    			append_dev(main, t2);
    			mount_component(breadcrumb0, main, null);
    			append_dev(main, t3);
    			append_dev(main, h21);
    			append_dev(h21, strong1);
    			append_dev(main, t5);
    			append_dev(main, h5);
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			append_dev(main, t8);
    			mount_component(modal, main, null);
    			append_dev(main, t9);
    			append_dev(main, h22);
    			append_dev(h22, strong2);
    			append_dev(main, t11);
    			mount_component(breadcrumb1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrumb0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumb0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb0.$set(breadcrumb0_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const modal_changes = {};
    			if (dirty & /*openob*/ 1) modal_changes.isOpen = /*openob*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    			const breadcrumb1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumb1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb1.$set(breadcrumb1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(breadcrumb0.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			transition_in(breadcrumb1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(breadcrumb0.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			transition_out(breadcrumb1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(breadcrumb0);
    			destroy_component(button);
    			destroy_component(modal);
    			destroy_component(breadcrumb1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HomeObesity", slots, []);
    	let openob = false;

    	const toggleob = () => {
    		$$invalidate(0, openob = !openob);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HomeObesity> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		ObesitySv,
    		Button,
    		Modal,
    		ModalBody,
    		ModalFooter,
    		ModalHeader,
    		Breadcrumb,
    		BreadcrumbItem,
    		openob,
    		toggleob
    	});

    	$$self.$inject_state = $$props => {
    		if ("openob" in $$props) $$invalidate(0, openob = $$props.openob);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [openob, toggleob];
    }

    class HomeObesity extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeObesity",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/frontend/obesity/EditObe.svelte generated by Svelte v3.37.0 */

    const { console: console_1$1 } = globals;
    const file$2 = "src/frontend/obesity/EditObe.svelte";

<<<<<<< HEAD
    // (132:9) <Button on:click={updateObesity}>
=======
    // (99:9) <Button on:click={updateObesity}>
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
<<<<<<< HEAD
    		source: "(132:9) <Button on:click={updateObesity}>",
=======
    		source: "(99:9) <Button on:click={updateObesity}>",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

    // (112:8) <Table bordered>
    function create_default_slot_1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let input0;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateObesity*/ ctx[8]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Pais";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Porcentaje de hombres";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Porcentaje de mujer";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Población total";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acción";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(/*upCountry*/ ctx[1]);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*upYear*/ ctx[2]);
    			t15 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
<<<<<<< HEAD
    			add_location(th0, file$2, 114, 20, 3035);
    			add_location(th1, file$2, 115, 5, 3054);
    			add_location(th2, file$2, 116, 5, 3072);
    			add_location(th3, file$2, 117, 5, 3108);
    			add_location(th4, file$2, 118, 5, 3142);
    			add_location(th5, file$2, 119, 5, 3172);
    			add_location(tr0, file$2, 113, 16, 3010);
    			add_location(thead, file$2, 112, 12, 2986);
    			add_location(td0, file$2, 126, 20, 3300);
    			add_location(td1, file$2, 127, 5, 3326);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$2, 128, 24, 3368);
    			add_location(td2, file$2, 128, 20, 3364);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$2, 129, 9, 3431);
    			add_location(td3, file$2, 129, 5, 3427);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$2, 130, 9, 3496);
    			add_location(td4, file$2, 130, 5, 3492);
    			add_location(td5, file$2, 131, 5, 3560);
    			add_location(tr1, file$2, 125, 16, 3275);
    			add_location(tbody, file$2, 123, 12, 3247);
=======
    			add_location(th0, file$2, 81, 20, 2325);
    			add_location(th1, file$2, 82, 5, 2344);
    			add_location(th2, file$2, 83, 5, 2362);
    			add_location(th3, file$2, 84, 5, 2398);
    			add_location(th4, file$2, 85, 5, 2432);
    			add_location(th5, file$2, 86, 5, 2462);
    			add_location(tr0, file$2, 80, 16, 2300);
    			add_location(thead, file$2, 79, 12, 2276);
    			add_location(td0, file$2, 93, 20, 2590);
    			add_location(td1, file$2, 94, 5, 2616);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$2, 95, 24, 2658);
    			add_location(td2, file$2, 95, 20, 2654);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$2, 96, 9, 2721);
    			add_location(td3, file$2, 96, 5, 2717);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$2, 97, 9, 2786);
    			add_location(td4, file$2, 97, 5, 2782);
    			add_location(td5, file$2, 98, 5, 2850);
    			add_location(tr1, file$2, 92, 16, 2565);
    			add_location(tbody, file$2, 90, 12, 2537);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*upMan_percent*/ ctx[3]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*upWoman_percent*/ ctx[4]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*upTotal_population*/ ctx[5]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*upCountry*/ 2) set_data_dev(t12, /*upCountry*/ ctx[1]);
    			if (!current || dirty & /*upYear*/ 4) set_data_dev(t14, /*upYear*/ ctx[2]);

    			if (dirty & /*upMan_percent*/ 8 && to_number(input0.value) !== /*upMan_percent*/ ctx[3]) {
    				set_input_value(input0, /*upMan_percent*/ ctx[3]);
    			}

    			if (dirty & /*upWoman_percent*/ 16 && to_number(input1.value) !== /*upWoman_percent*/ ctx[4]) {
    				set_input_value(input1, /*upWoman_percent*/ ctx[4]);
    			}

    			if (dirty & /*upTotal_population*/ 32 && to_number(input2.value) !== /*upTotal_population*/ ctx[5]) {
    				set_input_value(input2, /*upTotal_population*/ ctx[5]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(112:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (139:3) {#if errorMsg}
    function create_if_block_1(ctx) {
=======
    // (104:4) {#if errorMsg}
    function create_if_block(ctx) {
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[6]);
<<<<<<< HEAD
    			set_style(p, "color", "#9d1c24");
    			add_location(p, file$2, 139, 4, 3733);
=======
    			set_style(p, "color", "red");
    			add_location(p, file$2, 104, 8, 3016);
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 64) set_data_dev(t1, /*errorMsg*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(139:3) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (142:3) {#if okMsg}
    function create_if_block(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*okMsg*/ ctx[7]);
    			set_style(p, "color", "#155724");
    			add_location(p, file$2, 142, 4, 3812);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*okMsg*/ 128) set_data_dev(t, /*okMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
<<<<<<< HEAD
    		source: "(142:3) {#if okMsg}",
=======
    		source: "(104:4) {#if errorMsg}",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

<<<<<<< HEAD
    // (146:2) <Button outline color="secondary" on:click="{pop}">
=======
    // (107:4) <Button outline color="secondary" on:click="{pop}">
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
<<<<<<< HEAD
    		source: "(146:2) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
=======
    		source: "(107:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
>>>>>>> 98ce841ac8219fcdb7112a7dfe3d42be12c2681f
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let h3;
    	let t0;
    	let strong0;
    	let t1_value = /*params*/ ctx[0].country + "";
    	let t1;
    	let strong1;
    	let t2_value = /*params*/ ctx[0].year + "";
    	let t2;
    	let t3;
    	let table;
    	let t4;
    	let div1;
    	let t5;
    	let t6;
    	let button;
    	let t7;
    	let div0;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*errorMsg*/ ctx[6] && create_if_block_1(ctx);
    	let if_block1 = /*okMsg*/ ctx[7] && create_if_block(ctx);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h3 = element("h3");
    			t0 = text("Editar campos ");
    			strong0 = element("strong");
    			t1 = text(t1_value);
    			strong1 = element("strong");
    			t2 = text(t2_value);
    			t3 = space();
    			create_component(table.$$.fragment);
    			t4 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			create_component(button.$$.fragment);
    			t7 = space();
    			div0 = element("div");
    			add_location(strong0, file$2, 110, 22, 2880);
    			add_location(strong1, file$2, 110, 55, 2913);
    			add_location(h3, file$2, 110, 4, 2862);
    			add_location(div0, file$2, 146, 2, 3937);
    			add_location(div1, file$2, 136, 2, 3702);
    			attr_dev(main, "class", "svelte-qkkln6");
    			add_location(main, file$2, 109, 0, 2851);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			append_dev(h3, t0);
    			append_dev(h3, strong0);
    			append_dev(strong0, t1);
    			append_dev(h3, strong1);
    			append_dev(strong1, t2);
    			append_dev(main, t3);
    			mount_component(table, main, null);
    			append_dev(main, t4);
    			append_dev(main, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t5);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t6);
    			mount_component(button, div1, null);
    			append_dev(div1, t7);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].country + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].year + "")) set_data_dev(t2, t2_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, upTotal_population, upWoman_percent, upMan_percent, upYear, upCountry*/ 65598) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);

    			if (/*errorMsg*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*okMsg*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div1, t6);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(table);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_CONTACT_API_PATH = "/api/v1";

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditObe", slots, []);

    	const colors = [
    		"primary",
    		"secondary",
    		"success",
    		"danger",
    		"warning",
    		"info",
    		"light",
    		"dark"
    	];

    	let visible = false;
    	let { params = {} } = $$props;
    	let obesity = {};
    	let upCountry = "XXXX";
    	let upYear = 12345;
    	let upMan_percent = 123.4;
    	let upWoman_percent = 123.4;
    	let upTotal_population = 12345;
    	let errorMsg = "";
    	let okMsg = "";
    	onMount(getObesity);

    	async function getObesity() {
    		console.log("Fetching data..." + params.country + " " + params.year);
    		const res = await fetch(BASE_CONTACT_API_PATH + "/obesity-stats/" + params.country + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			obesity = json;
    			$$invalidate(1, upCountry = obesity.country);
    			$$invalidate(2, upYear = parseInt(obesity.year));
    			$$invalidate(3, upMan_percent = parseFloat(obesity.man_percent));
    			$$invalidate(4, upWoman_percent = parseFloat(obesity.woman_percent));
    			$$invalidate(5, upTotal_population = parseFloat(obesity.total_population));
    			console.log(JSON.stringify(obesity));
    			console.log("Received data.");
    		} else {
    			if (res - status === 404) {
    				$$invalidate(6, errorMsg = `No existe dato con pais: ${obesity.country} y fecha: ${obesity.year}`);
    				console.log("ERROR!" + errorMsg);
    			} else if (res.status === 500) {
    				$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    			}

    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function updateObesity() {
    		console.log("Updating data..." + JSON.stringify(params.country) + ", " + JSON.stringify(params.year));
    		let year = parseInt(params.year);

    		await fetch(BASE_CONTACT_API_PATH + "/obesity-stats/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: params.country,
    				year,
    				man_percent: parseFloat(upMan_percent),
    				woman_percent: parseFloat(upWoman_percent),
    				total_population: parseInt(upTotal_population)
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				console.log("Ok.");
    				getObesity();
    				$$invalidate(7, okMsg = "Actualización correcta");
    				$$invalidate(6, errorMsg = "");
    			} else {
    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "El dato solicitado no existe");
    				}
    			}

    			getObesity();
    			console.log("ERROR!" + errorMsg);
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<EditObe> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		upMan_percent = to_number(this.value);
    		$$invalidate(3, upMan_percent);
    	}

    	function input1_input_handler() {
    		upWoman_percent = to_number(this.value);
    		$$invalidate(4, upWoman_percent);
    	}

    	function input2_input_handler() {
    		upTotal_population = to_number(this.value);
    		$$invalidate(5, upTotal_population);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Alert,
    		Table,
    		Button,
    		colors,
    		visible,
    		BASE_CONTACT_API_PATH,
    		params,
    		obesity,
    		upCountry,
    		upYear,
    		upMan_percent,
    		upWoman_percent,
    		upTotal_population,
    		errorMsg,
    		okMsg,
    		getObesity,
    		updateObesity
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) visible = $$props.visible;
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("obesity" in $$props) obesity = $$props.obesity;
    		if ("upCountry" in $$props) $$invalidate(1, upCountry = $$props.upCountry);
    		if ("upYear" in $$props) $$invalidate(2, upYear = $$props.upYear);
    		if ("upMan_percent" in $$props) $$invalidate(3, upMan_percent = $$props.upMan_percent);
    		if ("upWoman_percent" in $$props) $$invalidate(4, upWoman_percent = $$props.upWoman_percent);
    		if ("upTotal_population" in $$props) $$invalidate(5, upTotal_population = $$props.upTotal_population);
    		if ("errorMsg" in $$props) $$invalidate(6, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(7, okMsg = $$props.okMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		upCountry,
    		upYear,
    		upMan_percent,
    		upWoman_percent,
    		upTotal_population,
    		errorMsg,
    		okMsg,
    		updateObesity,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditObe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditObe",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get params() {
    		throw new Error("<EditObe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditObe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/frontend/sanity/JustOneSanity.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/frontend/sanity/JustOneSanity.svelte";

    // (37:1) <Table bordered>
    function create_default_slot(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t7;
    	let td4;
    	let t9;
    	let tbody;
    	let tr1;
    	let td5;
    	let t10_value = /*sanity*/ ctx[0].country + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12_value = /*sanity*/ ctx[0].year + "";
    	let t12;
    	let t13;
    	let td7;
    	let t14_value = /*sanity*/ ctx[0].health_expenditure_in_percentage + "";
    	let t14;
    	let t15;
    	let td8;
    	let t16_value = /*sanity*/ ctx[0].doctor_per_1000_habitant + "";
    	let t16;
    	let t17;
    	let td9;
    	let t18_value = /*sanity*/ ctx[0].hospital_bed + "";
    	let t18;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Pais";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "Año";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "Porcentaje de gasto en sanidad";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "Doctores por cada 1000 habitantes";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "Camas de hospital";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td7 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			td8 = element("td");
    			t16 = text(t16_value);
    			t17 = space();
    			td9 = element("td");
    			t18 = text(t18_value);
    			attr_dev(td0, "class", "svelte-lohyvn");
    			add_location(td0, file$1, 39, 4, 843);
    			attr_dev(td1, "class", "svelte-lohyvn");
    			add_location(td1, file$1, 40, 4, 861);
    			attr_dev(td2, "class", "svelte-lohyvn");
    			add_location(td2, file$1, 41, 4, 878);
    			attr_dev(td3, "class", "svelte-lohyvn");
    			add_location(td3, file$1, 42, 4, 922);
    			attr_dev(td4, "class", "svelte-lohyvn");
    			add_location(td4, file$1, 43, 4, 969);
    			attr_dev(tr0, "class", "svelte-lohyvn");
    			add_location(tr0, file$1, 38, 3, 834);
    			add_location(thead, file$1, 37, 2, 823);
    			attr_dev(td5, "class", "svelte-lohyvn");
    			add_location(td5, file$1, 48, 3, 1037);
    			attr_dev(td6, "class", "svelte-lohyvn");
    			add_location(td6, file$1, 49, 3, 1066);
    			attr_dev(td7, "class", "svelte-lohyvn");
    			add_location(td7, file$1, 50, 3, 1092);
    			attr_dev(td8, "class", "svelte-lohyvn");
    			add_location(td8, file$1, 51, 3, 1146);
    			attr_dev(td9, "class", "svelte-lohyvn");
    			add_location(td9, file$1, 52, 3, 1192);
    			attr_dev(tr1, "class", "svelte-lohyvn");
    			add_location(tr1, file$1, 47, 3, 1029);
    			add_location(tbody, file$1, 46, 2, 1018);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(tr0, t3);
    			append_dev(tr0, td2);
    			append_dev(tr0, t5);
    			append_dev(tr0, td3);
    			append_dev(tr0, t7);
    			append_dev(tr0, td4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td5);
    			append_dev(td5, t10);
    			append_dev(tr1, t11);
    			append_dev(tr1, td6);
    			append_dev(td6, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td7);
    			append_dev(td7, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td8);
    			append_dev(td8, t16);
    			append_dev(tr1, t17);
    			append_dev(tr1, td9);
    			append_dev(td9, t18);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sanity*/ 1 && t10_value !== (t10_value = /*sanity*/ ctx[0].country + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*sanity*/ 1 && t12_value !== (t12_value = /*sanity*/ ctx[0].year + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*sanity*/ 1 && t14_value !== (t14_value = /*sanity*/ ctx[0].health_expenditure_in_percentage + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*sanity*/ 1 && t16_value !== (t16_value = /*sanity*/ ctx[0].doctor_per_1000_habitant + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*sanity*/ 1 && t18_value !== (t18_value = /*sanity*/ ctx[0].hospital_bed + "")) set_data_dev(t18, t18_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(37:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let header;
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let table;
    	let current;
    	header = new Header({ $$inline: true });

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			create_component(table.$$.fragment);
    			add_location(br0, file$1, 34, 4, 793);
    			add_location(br1, file$1, 34, 8, 797);
    			add_location(main, file$1, 32, 0, 768);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, br0);
    			append_dev(main, br1);
    			append_dev(main, t1);
    			mount_component(table, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const table_changes = {};

    			if (dirty & /*$$scope, sanity*/ 65) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("JustOneSanity", slots, []);
    	let sanity = {};
    	const url = window.location.hash;
    	console.log(url);
    	const param = url.split("/");
    	console.log(param);
    	const country = param[2];
    	const year = parseInt(param[3]);
    	console.log(country);
    	console.log(year);

    	async function getSanity() {
    		console.log("Fetching data...");
    		const res = await fetch("/api/v1/sanity-stats?country=" + country + "&year=" + year);
    		console.log(res);

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(0, sanity = json);
    		} else {
    			console.log("Error");
    		}
    	}

    	onMount(getSanity);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<JustOneSanity> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		onMount,
    		Table,
    		sanity,
    		url,
    		param,
    		country,
    		year,
    		getSanity
    	});

    	$$self.$inject_state = $$props => {
    		if ("sanity" in $$props) $$invalidate(0, sanity = $$props.sanity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sanity];
    }

    class JustOneSanity extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JustOneSanity",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/frontend/App.svelte generated by Svelte v3.37.0 */
    const file = "src/frontend/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(main, "class", "svelte-d68sj9");
    			add_location(main, file, 30, 0, 911);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	const routes = {
    		"/": Landing,
    		"/info": Info,
    		"/foodconsumption-stats": HomeFood,
    		"/foodconsumption-stats/:country/:year/:foodtype": EditFood,
    		"/obesity-stats": HomeObesity,
    		"/obesity-stats/:country/:year": EditObe,
    		"/sanity-stats": HomeSanity,
    		"/sanity-stats/:country/:year": JustOneSanity,
    		"*": NotFound
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		NotFound,
    		ObesitySv,
    		HomeSanity,
    		EditFood,
    		Info,
    		Landing,
    		HomeFood,
    		HomeObesity,
    		EditObe,
    		JustOneSanity,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
