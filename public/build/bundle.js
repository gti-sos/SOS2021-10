
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
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash$2(str) {
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
        const name = `__svelte_${hash$2(rule)}_${uid}`;
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

    const { Error: Error_1$1, Object: Object_1, console: console_1$7 } = globals;

    // (209:0) {:else}
    function create_else_block$a(ctx) {
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
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (202:0) {#if componentParams}
    function create_if_block$g(ctx) {
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
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(202:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$g, create_else_block$a];
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
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    		id: create_fragment$D.name,
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

    function instance$D($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$7.warn(`<Router> was created with unknown prop '${key}'`);
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

    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$D.name
    		});
    	}

    	get routes() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
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

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
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

    /* node_modules/sveltestrap/src/Alert.svelte generated by Svelte v3.37.0 */
    const file$C = "node_modules/sveltestrap/src/Alert.svelte";

    // (22:0) {#if isOpen}
    function create_if_block$f(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let div_transition;
    	let current;
    	let if_block0 = /*toggle*/ ctx[3] && create_if_block_2$4(ctx);
    	const if_block_creators = [create_if_block_1$9, create_else_block$9];
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
    			add_location(div, file$C, 22, 2, 637);
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
    					if_block0 = create_if_block_2$4(ctx);
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
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(22:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (28:4) {#if toggle}
    function create_if_block_2$4(ctx) {
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
    			add_location(span, file$C, 33, 8, 900);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$C, 28, 6, 767);
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
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(28:4) {#if toggle}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {:else}
    function create_else_block$9(ctx) {
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
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if children}
    function create_if_block_1$9(ctx) {
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
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(37:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[2] && create_if_block$f(ctx);

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
    					if_block = create_if_block$f(ctx);
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
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {
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
    			id: create_fragment$C.name
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

    	get transition() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Breadcrumb.svelte generated by Svelte v3.37.0 */
    const file$B = "node_modules/sveltestrap/src/Breadcrumb.svelte";

    // (17:4) {:else}
    function create_else_block$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

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
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(17:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#if children}
    function create_if_block$e(ctx) {
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
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(15:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let nav;
    	let ol;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$e, create_else_block$8];
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
    			attr_dev(ol, "class", /*listClasses*/ ctx[3]);
    			add_location(ol, file$B, 13, 2, 346);
    			set_attributes(nav, nav_data);
    			add_location(nav, file$B, 12, 0, 280);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {
    			class: 0,
    			ariaLabel: 1,
    			children: 2,
    			listClassName: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Breadcrumb",
    			options,
    			id: create_fragment$B.name
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
    const file$A = "node_modules/sveltestrap/src/BreadcrumbItem.svelte";

    // (19:2) {:else}
    function create_else_block$7(ctx) {
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
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(19:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#if children}
    function create_if_block$d(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
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
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(17:2) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let li;
    	let current_block_type_index;
    	let if_block;
    	let li_aria_current_value;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block$7];
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
    			add_location(li, file$A, 15, 0, 277);
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
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { class: 4, active: 0, children: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BreadcrumbItem",
    			options,
    			id: create_fragment$A.name
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
    const file$z = "node_modules/sveltestrap/src/Button.svelte";

    // (48:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block$4(ctx);

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
    			add_location(button, file$z, 48, 2, 985);
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
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(48:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (33:0) {#if href}
    function create_if_block$c(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$8, create_else_block$6];
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
    			add_location(a, file$z, 33, 2, 752);
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
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(33:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (62:6) {:else}
    function create_else_block_2(ctx) {
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
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(62:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (60:25) 
    function create_if_block_3$1(ctx) {
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
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(60:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (58:6) {#if close}
    function create_if_block_2$3(ctx) {
    	let span;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$z, 58, 8, 1171);
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
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(58:6) {#if close}",
    		ctx
    	});

    	return block_1;
    }

    // (57:10)        
    function fallback_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$3, create_if_block_3$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

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
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(57:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (44:4) {:else}
    function create_else_block$6(ctx) {
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
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(44:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (42:4) {#if children}
    function create_if_block_1$8(ctx) {
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
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(42:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$z(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$c, create_else_block_1];
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
    		block: block_1,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$z($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {
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
    			id: create_fragment$z.name
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

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Collapse.svelte generated by Svelte v3.37.0 */
    const file$y = "node_modules/sveltestrap/src/Collapse.svelte";

    // (57:0) {#if isOpen}
    function create_if_block$b(ctx) {
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
    			add_location(div, file$y, 57, 2, 1231);
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
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(57:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[19]);
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$b(ctx);

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
    					if_block = create_if_block$b(ctx);
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
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
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

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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

    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {
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
    			id: create_fragment$y.name
    		});
    	}

    	get isOpen() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

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

    /* node_modules/sveltestrap/src/CustomInput.svelte generated by Svelte v3.37.0 */
    const file$x = "node_modules/sveltestrap/src/CustomInput.svelte";

    // (116:0) {:else}
    function create_else_block$5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[14],
    		{ type: /*type*/ ctx[4] },
    		{ id: /*id*/ ctx[3] },
    		{ class: /*combinedClasses*/ ctx[9] },
    		{ name: /*name*/ ctx[2] },
    		{ disabled: /*disabled*/ ctx[6] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$x, 116, 2, 2501);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_4*/ ctx[40], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_4*/ ctx[41], false, false, false),
    					listen_dev(input, "change", /*change_handler_4*/ ctx[42], false, false, false),
    					listen_dev(input, "input", /*input_handler_4*/ ctx[43], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 16384 && /*$$restProps*/ ctx[14],
    				dirty[0] & /*type*/ 16 && { type: /*type*/ ctx[4] },
    				dirty[0] & /*id*/ 8 && { id: /*id*/ ctx[3] },
    				dirty[0] & /*combinedClasses*/ 512 && { class: /*combinedClasses*/ ctx[9] },
    				dirty[0] & /*name*/ 4 && { name: /*name*/ ctx[2] },
    				dirty[0] & /*disabled*/ 64 && { disabled: /*disabled*/ ctx[6] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(116:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:27) 
    function create_if_block_3(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label_1;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[14],
    		{ id: /*id*/ ctx[3] },
    		{ type: "radio" },
    		{ class: /*customControlClasses*/ ctx[12] },
    		{ name: /*name*/ ctx[2] },
    		{ disabled: /*disabled*/ ctx[6] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label_1 = element("label");
    			t1 = text(/*label*/ ctx[5]);
    			t2 = space();
    			if (default_slot) default_slot.c();
    			set_attributes(input, input_data);
    			add_location(input, file$x, 100, 4, 2186);
    			attr_dev(label_1, "class", "custom-control-label");
    			attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
    			add_location(label_1, file$x, 112, 4, 2398);
    			attr_dev(div, "class", /*wrapperClasses*/ ctx[11]);
    			add_location(div, file$x, 99, 2, 2153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			append_dev(div, t0);
    			append_dev(div, label_1);
    			append_dev(label_1, t1);
    			append_dev(div, t2);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_3*/ ctx[36], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_3*/ ctx[37], false, false, false),
    					listen_dev(input, "change", /*change_handler_3*/ ctx[38], false, false, false),
    					listen_dev(input, "input", /*input_handler_3*/ ctx[39], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 16384 && /*$$restProps*/ ctx[14],
    				(!current || dirty[0] & /*id*/ 8) && { id: /*id*/ ctx[3] },
    				{ type: "radio" },
    				(!current || dirty[0] & /*customControlClasses*/ 4096) && { class: /*customControlClasses*/ ctx[12] },
    				(!current || dirty[0] & /*name*/ 4) && { name: /*name*/ ctx[2] },
    				(!current || dirty[0] & /*disabled*/ 64) && { disabled: /*disabled*/ ctx[6] },
    				(!current || dirty[0] & /*placeholder*/ 128) && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (!current || dirty[0] & /*label*/ 32) set_data_dev(t1, /*label*/ ctx[5]);

    			if (!current || dirty[0] & /*labelHtmlFor*/ 8192) {
    				attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 4194304) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[22], dirty, null, null);
    				}
    			}

    			if (!current || dirty[0] & /*wrapperClasses*/ 2048) {
    				attr_dev(div, "class", /*wrapperClasses*/ ctx[11]);
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
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(99:27) ",
    		ctx
    	});

    	return block;
    }

    // (81:51) 
    function create_if_block_2$2(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label_1;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[14],
    		{ id: /*id*/ ctx[3] },
    		{ type: "checkbox" },
    		{ class: /*customControlClasses*/ ctx[12] },
    		{ name: /*name*/ ctx[2] },
    		{ disabled: /*disabled*/ ctx[6] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label_1 = element("label");
    			t1 = text(/*label*/ ctx[5]);
    			t2 = space();
    			if (default_slot) default_slot.c();
    			set_attributes(input, input_data);
    			add_location(input, file$x, 82, 4, 1796);
    			attr_dev(label_1, "class", "custom-control-label");
    			attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
    			add_location(label_1, file$x, 95, 4, 2030);
    			attr_dev(div, "class", /*wrapperClasses*/ ctx[11]);
    			add_location(div, file$x, 81, 2, 1763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = /*checked*/ ctx[0];
    			append_dev(div, t0);
    			append_dev(div, label_1);
    			append_dev(label_1, t1);
    			append_dev(div, t2);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[45]),
    					listen_dev(input, "blur", /*blur_handler_2*/ ctx[32], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_2*/ ctx[33], false, false, false),
    					listen_dev(input, "change", /*change_handler_2*/ ctx[34], false, false, false),
    					listen_dev(input, "input", /*input_handler_2*/ ctx[35], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 16384 && /*$$restProps*/ ctx[14],
    				(!current || dirty[0] & /*id*/ 8) && { id: /*id*/ ctx[3] },
    				{ type: "checkbox" },
    				(!current || dirty[0] & /*customControlClasses*/ 4096) && { class: /*customControlClasses*/ ctx[12] },
    				(!current || dirty[0] & /*name*/ 4) && { name: /*name*/ ctx[2] },
    				(!current || dirty[0] & /*disabled*/ 64) && { disabled: /*disabled*/ ctx[6] },
    				(!current || dirty[0] & /*placeholder*/ 128) && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (!current || dirty[0] & /*label*/ 32) set_data_dev(t1, /*label*/ ctx[5]);

    			if (!current || dirty[0] & /*labelHtmlFor*/ 8192) {
    				attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 4194304) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[22], dirty, null, null);
    				}
    			}

    			if (!current || dirty[0] & /*wrapperClasses*/ 2048) {
    				attr_dev(div, "class", /*wrapperClasses*/ ctx[11]);
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
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(81:51) ",
    		ctx
    	});

    	return block;
    }

    // (63:26) 
    function create_if_block_1$7(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label_1;
    	let t1_value = (/*label*/ ctx[5] || "Choose file") + "";
    	let t1;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[14],
    		{ id: /*id*/ ctx[3] },
    		{ type: "file" },
    		{ class: /*fileClasses*/ ctx[10] },
    		{ name: /*name*/ ctx[2] },
    		{ disabled: /*disabled*/ ctx[6] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label_1 = element("label");
    			t1 = text(t1_value);
    			set_attributes(input, input_data);
    			add_location(input, file$x, 64, 4, 1401);
    			attr_dev(label_1, "class", "custom-file-label");
    			attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
    			add_location(label_1, file$x, 76, 4, 1603);
    			attr_dev(div, "class", /*customClass*/ ctx[8]);
    			add_location(div, file$x, 63, 2, 1371);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			append_dev(div, t0);
    			append_dev(div, label_1);
    			append_dev(label_1, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[28], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_1*/ ctx[29], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[30], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[31], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 16384 && /*$$restProps*/ ctx[14],
    				dirty[0] & /*id*/ 8 && { id: /*id*/ ctx[3] },
    				{ type: "file" },
    				dirty[0] & /*fileClasses*/ 1024 && { class: /*fileClasses*/ ctx[10] },
    				dirty[0] & /*name*/ 4 && { name: /*name*/ ctx[2] },
    				dirty[0] & /*disabled*/ 64 && { disabled: /*disabled*/ ctx[6] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*label*/ 32 && t1_value !== (t1_value = (/*label*/ ctx[5] || "Choose file") + "")) set_data_dev(t1, t1_value);

    			if (dirty[0] & /*labelHtmlFor*/ 8192) {
    				attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
    			}

    			if (dirty[0] & /*customClass*/ 256) {
    				attr_dev(div, "class", /*customClass*/ ctx[8]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(63:26) ",
    		ctx
    	});

    	return block;
    }

    // (48:0) {#if type === 'select'}
    function create_if_block$a(ctx) {
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	let select_levels = [
    		/*$$restProps*/ ctx[14],
    		{ id: /*id*/ ctx[3] },
    		{ class: /*combinedClasses*/ ctx[9] },
    		{ name: /*name*/ ctx[2] },
    		{ disabled: /*disabled*/ ctx[6] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[44].call(select));
    			add_location(select, file$x, 48, 2, 1139);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			if (select_data.multiple) select_options(select, select_data.value);
    			select_option(select, /*value*/ ctx[1]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "blur", /*blur_handler*/ ctx[24], false, false, false),
    					listen_dev(select, "focus", /*focus_handler*/ ctx[25], false, false, false),
    					listen_dev(select, "change", /*change_handler*/ ctx[26], false, false, false),
    					listen_dev(select, "input", /*input_handler*/ ctx[27], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[44])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 4194304) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[22], dirty, null, null);
    				}
    			}

    			set_attributes(select, select_data = get_spread_update(select_levels, [
    				dirty[0] & /*$$restProps*/ 16384 && /*$$restProps*/ ctx[14],
    				(!current || dirty[0] & /*id*/ 8) && { id: /*id*/ ctx[3] },
    				(!current || dirty[0] & /*combinedClasses*/ 512) && { class: /*combinedClasses*/ ctx[9] },
    				(!current || dirty[0] & /*name*/ 4) && { name: /*name*/ ctx[2] },
    				(!current || dirty[0] & /*disabled*/ 64) && { disabled: /*disabled*/ ctx[6] },
    				(!current || dirty[0] & /*placeholder*/ 128) && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*$$restProps, id, combinedClasses, name, disabled, placeholder*/ 17100 && select_data.multiple) select_options(select, select_data.value);

    			if (dirty[0] & /*value*/ 2) {
    				select_option(select, /*value*/ ctx[1]);
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
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(48:0) {#if type === 'select'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block$a,
    		create_if_block_1$7,
    		create_if_block_2$2,
    		create_if_block_3,
    		create_else_block$5
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[4] === "select") return 0;
    		if (/*type*/ ctx[4] === "file") return 1;
    		if (/*type*/ ctx[4] === "switch" || /*type*/ ctx[4] === "checkbox") return 2;
    		if (/*type*/ ctx[4] === "radio") return 3;
    		return 4;
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
    		p: function update(ctx, dirty) {
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
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let customClass;
    	let validationClassNames;
    	let combinedClasses;
    	let fileClasses;
    	let wrapperClasses;
    	let customControlClasses;
    	let labelHtmlFor;

    	const omit_props_names = [
    		"class","name","id","type","label","checked","disabled","inline","valid","value","invalid","bsSize","placeholder","for"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CustomInput", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { name = "" } = $$props;
    	let { id = undefined } = $$props;
    	let { type = null } = $$props;
    	let { label = "" } = $$props;
    	let { checked = false } = $$props;
    	let { disabled = false } = $$props;
    	let { inline = false } = $$props;
    	let { valid = false } = $$props;
    	let { value = "" } = $$props;
    	let { invalid = false } = $$props;
    	let { bsSize = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { for: htmlFor = "" } = $$props;

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble($$self, event);
    	}

    	function change_handler_1(event) {
    		bubble($$self, event);
    	}

    	function input_handler_1(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble($$self, event);
    	}

    	function change_handler_2(event) {
    		bubble($$self, event);
    	}

    	function input_handler_2(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_3(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_3(event) {
    		bubble($$self, event);
    	}

    	function change_handler_3(event) {
    		bubble($$self, event);
    	}

    	function input_handler_3(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_4(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_4(event) {
    		bubble($$self, event);
    	}

    	function change_handler_4(event) {
    		bubble($$self, event);
    	}

    	function input_handler_4(event) {
    		bubble($$self, event);
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(1, value);
    	}

    	function input_change_handler() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(14, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(15, className = $$new_props.class);
    		if ("name" in $$new_props) $$invalidate(2, name = $$new_props.name);
    		if ("id" in $$new_props) $$invalidate(3, id = $$new_props.id);
    		if ("type" in $$new_props) $$invalidate(4, type = $$new_props.type);
    		if ("label" in $$new_props) $$invalidate(5, label = $$new_props.label);
    		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ("disabled" in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ("inline" in $$new_props) $$invalidate(16, inline = $$new_props.inline);
    		if ("valid" in $$new_props) $$invalidate(17, valid = $$new_props.valid);
    		if ("value" in $$new_props) $$invalidate(1, value = $$new_props.value);
    		if ("invalid" in $$new_props) $$invalidate(18, invalid = $$new_props.invalid);
    		if ("bsSize" in $$new_props) $$invalidate(19, bsSize = $$new_props.bsSize);
    		if ("placeholder" in $$new_props) $$invalidate(7, placeholder = $$new_props.placeholder);
    		if ("for" in $$new_props) $$invalidate(20, htmlFor = $$new_props.for);
    		if ("$$scope" in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		name,
    		id,
    		type,
    		label,
    		checked,
    		disabled,
    		inline,
    		valid,
    		value,
    		invalid,
    		bsSize,
    		placeholder,
    		htmlFor,
    		customClass,
    		validationClassNames,
    		combinedClasses,
    		fileClasses,
    		wrapperClasses,
    		customControlClasses,
    		labelHtmlFor
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(15, className = $$new_props.className);
    		if ("name" in $$props) $$invalidate(2, name = $$new_props.name);
    		if ("id" in $$props) $$invalidate(3, id = $$new_props.id);
    		if ("type" in $$props) $$invalidate(4, type = $$new_props.type);
    		if ("label" in $$props) $$invalidate(5, label = $$new_props.label);
    		if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ("disabled" in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ("inline" in $$props) $$invalidate(16, inline = $$new_props.inline);
    		if ("valid" in $$props) $$invalidate(17, valid = $$new_props.valid);
    		if ("value" in $$props) $$invalidate(1, value = $$new_props.value);
    		if ("invalid" in $$props) $$invalidate(18, invalid = $$new_props.invalid);
    		if ("bsSize" in $$props) $$invalidate(19, bsSize = $$new_props.bsSize);
    		if ("placeholder" in $$props) $$invalidate(7, placeholder = $$new_props.placeholder);
    		if ("htmlFor" in $$props) $$invalidate(20, htmlFor = $$new_props.htmlFor);
    		if ("customClass" in $$props) $$invalidate(8, customClass = $$new_props.customClass);
    		if ("validationClassNames" in $$props) $$invalidate(21, validationClassNames = $$new_props.validationClassNames);
    		if ("combinedClasses" in $$props) $$invalidate(9, combinedClasses = $$new_props.combinedClasses);
    		if ("fileClasses" in $$props) $$invalidate(10, fileClasses = $$new_props.fileClasses);
    		if ("wrapperClasses" in $$props) $$invalidate(11, wrapperClasses = $$new_props.wrapperClasses);
    		if ("customControlClasses" in $$props) $$invalidate(12, customControlClasses = $$new_props.customControlClasses);
    		if ("labelHtmlFor" in $$props) $$invalidate(13, labelHtmlFor = $$new_props.labelHtmlFor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*className, type, bsSize*/ 557072) {
    			$$invalidate(8, customClass = classnames(className, `custom-${type}`, bsSize ? `custom-${type}-${bsSize}` : false));
    		}

    		if ($$self.$$.dirty[0] & /*invalid, valid*/ 393216) {
    			$$invalidate(21, validationClassNames = classnames(invalid && "is-invalid", valid && "is-valid"));
    		}

    		if ($$self.$$.dirty[0] & /*customClass, validationClassNames*/ 2097408) {
    			$$invalidate(9, combinedClasses = classnames(customClass, validationClassNames));
    		}

    		if ($$self.$$.dirty[0] & /*validationClassNames*/ 2097152) {
    			$$invalidate(10, fileClasses = classnames(validationClassNames, "custom-file-input"));
    		}

    		if ($$self.$$.dirty[0] & /*customClass, inline*/ 65792) {
    			$$invalidate(11, wrapperClasses = classnames(customClass, "custom-control", { "custom-control-inline": inline }));
    		}

    		if ($$self.$$.dirty[0] & /*validationClassNames*/ 2097152) {
    			$$invalidate(12, customControlClasses = classnames(validationClassNames, "custom-control-input"));
    		}

    		if ($$self.$$.dirty[0] & /*htmlFor, id*/ 1048584) {
    			$$invalidate(13, labelHtmlFor = htmlFor || id);
    		}
    	};

    	return [
    		checked,
    		value,
    		name,
    		id,
    		type,
    		label,
    		disabled,
    		placeholder,
    		customClass,
    		combinedClasses,
    		fileClasses,
    		wrapperClasses,
    		customControlClasses,
    		labelHtmlFor,
    		$$restProps,
    		className,
    		inline,
    		valid,
    		invalid,
    		bsSize,
    		htmlFor,
    		validationClassNames,
    		$$scope,
    		slots,
    		blur_handler,
    		focus_handler,
    		change_handler,
    		input_handler,
    		blur_handler_1,
    		focus_handler_1,
    		change_handler_1,
    		input_handler_1,
    		blur_handler_2,
    		focus_handler_2,
    		change_handler_2,
    		input_handler_2,
    		blur_handler_3,
    		focus_handler_3,
    		change_handler_3,
    		input_handler_3,
    		blur_handler_4,
    		focus_handler_4,
    		change_handler_4,
    		input_handler_4,
    		select_change_handler,
    		input_change_handler
    	];
    }

    class CustomInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$x,
    			create_fragment$x,
    			safe_not_equal,
    			{
    				class: 15,
    				name: 2,
    				id: 3,
    				type: 4,
    				label: 5,
    				checked: 0,
    				disabled: 6,
    				inline: 16,
    				valid: 17,
    				value: 1,
    				invalid: 18,
    				bsSize: 19,
    				placeholder: 7,
    				for: 20
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomInput",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get class() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bsSize() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bsSize(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get for() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set for(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Form.svelte generated by Svelte v3.37.0 */
    const file$w = "node_modules/sveltestrap/src/Form.svelte";

    function create_fragment$w(ctx) {
    	let form;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let form_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let form_data = {};

    	for (let i = 0; i < form_levels.length; i += 1) {
    		form_data = assign(form_data, form_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			form = element("form");
    			if (default_slot) default_slot.c();
    			set_attributes(form, form_data);
    			add_location(form, file$w, 10, 0, 212);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);

    			if (default_slot) {
    				default_slot.m(form, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*submit_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(form, form_data = get_spread_update(form_levels, [
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
    			if (detaching) detach_dev(form);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","inline"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Form", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { inline = false } = $$props;

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("inline" in $$new_props) $$invalidate(3, inline = $$new_props.inline);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, inline, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("inline" in $$props) $$invalidate(3, inline = $$new_props.inline);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, inline*/ 12) {
    			$$invalidate(0, classes = classnames(className, inline ? "form-inline" : false));
    		}
    	};

    	return [classes, $$restProps, className, inline, $$scope, slots, submit_handler];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { class: 2, inline: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get class() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/FormGroup.svelte generated by Svelte v3.37.0 */
    const file$v = "node_modules/sveltestrap/src/FormGroup.svelte";

    // (25:0) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$v, 25, 2, 574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
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
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(25:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if tag === 'fieldset'}
    function create_if_block$9(ctx) {
    	let fieldset;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let fieldset_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let fieldset_data = {};

    	for (let i = 0; i < fieldset_levels.length; i += 1) {
    		fieldset_data = assign(fieldset_data, fieldset_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			if (default_slot) default_slot.c();
    			set_attributes(fieldset, fieldset_data);
    			add_location(fieldset, file$v, 21, 2, 493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);

    			if (default_slot) {
    				default_slot.m(fieldset, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(fieldset, fieldset_data = get_spread_update(fieldset_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
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
    			if (detaching) detach_dev(fieldset);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(21:0) {#if tag === 'fieldset'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[0] === "fieldset") return 0;
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
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","row","check","inline","disabled","tag"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FormGroup", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { row = false } = $$props;
    	let { check = false } = $$props;
    	let { inline = false } = $$props;
    	let { disabled = false } = $$props;
    	let { tag = null } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("row" in $$new_props) $$invalidate(4, row = $$new_props.row);
    		if ("check" in $$new_props) $$invalidate(5, check = $$new_props.check);
    		if ("inline" in $$new_props) $$invalidate(6, inline = $$new_props.inline);
    		if ("disabled" in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ("tag" in $$new_props) $$invalidate(0, tag = $$new_props.tag);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		tag,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("row" in $$props) $$invalidate(4, row = $$new_props.row);
    		if ("check" in $$props) $$invalidate(5, check = $$new_props.check);
    		if ("inline" in $$props) $$invalidate(6, inline = $$new_props.inline);
    		if ("disabled" in $$props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ("tag" in $$props) $$invalidate(0, tag = $$new_props.tag);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, row, check, inline, disabled*/ 248) {
    			$$invalidate(1, classes = classnames(className, row ? "row" : false, check ? "form-check" : "form-group", check && inline ? "form-check-inline" : false, check && disabled ? "disabled" : false));
    		}
    	};

    	return [
    		tag,
    		classes,
    		$$restProps,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		$$scope,
    		slots
    	];
    }

    class FormGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			class: 3,
    			row: 4,
    			check: 5,
    			inline: 6,
    			disabled: 7,
    			tag: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormGroup",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get class() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Label.svelte generated by Svelte v3.37.0 */
    const file$u = "node_modules/sveltestrap/src/Label.svelte";

    function create_fragment$u(ctx) {
    	let label;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	let label_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ for: /*fore*/ ctx[0] }
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    			add_location(label, file$u, 69, 0, 1625);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			}

    			set_attributes(label, label_data = get_spread_update(label_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*fore*/ 1) && { for: /*fore*/ ctx[0] }
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
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
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

    function instance$u($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","hidden","check","size","for","xs","sm","md","lg","xl","widths"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Label", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { hidden = false } = $$props;
    	let { check = false } = $$props;
    	let { size = "" } = $$props;
    	let { for: fore = null } = $$props;
    	let { xs = "" } = $$props;
    	let { sm = "" } = $$props;
    	let { md = "" } = $$props;
    	let { lg = "" } = $$props;
    	let { xl = "" } = $$props;
    	const colWidths = { xs, sm, md, lg, xl };
    	let { widths = Object.keys(colWidths) } = $$props;
    	const colClasses = [];

    	widths.forEach(colWidth => {
    		let columnProp = $$props[colWidth];

    		if (!columnProp && columnProp !== "") {
    			return;
    		}

    		const isXs = colWidth === "xs";
    		let colClass;

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			colClasses.push(classnames({
    				[colClass]: columnProp.size || columnProp.size === "",
    				[`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
    				[`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
    			}));
    		} else {
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp);
    			colClasses.push(colClass);
    		}
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("hidden" in $$new_props) $$invalidate(4, hidden = $$new_props.hidden);
    		if ("check" in $$new_props) $$invalidate(5, check = $$new_props.check);
    		if ("size" in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ("for" in $$new_props) $$invalidate(0, fore = $$new_props.for);
    		if ("xs" in $$new_props) $$invalidate(7, xs = $$new_props.xs);
    		if ("sm" in $$new_props) $$invalidate(8, sm = $$new_props.sm);
    		if ("md" in $$new_props) $$invalidate(9, md = $$new_props.md);
    		if ("lg" in $$new_props) $$invalidate(10, lg = $$new_props.lg);
    		if ("xl" in $$new_props) $$invalidate(11, xl = $$new_props.xl);
    		if ("widths" in $$new_props) $$invalidate(12, widths = $$new_props.widths);
    		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		getColumnSizeClass,
    		isObject,
    		className,
    		hidden,
    		check,
    		size,
    		fore,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		colWidths,
    		widths,
    		colClasses,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("hidden" in $$props) $$invalidate(4, hidden = $$new_props.hidden);
    		if ("check" in $$props) $$invalidate(5, check = $$new_props.check);
    		if ("size" in $$props) $$invalidate(6, size = $$new_props.size);
    		if ("fore" in $$props) $$invalidate(0, fore = $$new_props.fore);
    		if ("xs" in $$props) $$invalidate(7, xs = $$new_props.xs);
    		if ("sm" in $$props) $$invalidate(8, sm = $$new_props.sm);
    		if ("md" in $$props) $$invalidate(9, md = $$new_props.md);
    		if ("lg" in $$props) $$invalidate(10, lg = $$new_props.lg);
    		if ("xl" in $$props) $$invalidate(11, xl = $$new_props.xl);
    		if ("widths" in $$props) $$invalidate(12, widths = $$new_props.widths);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, hidden, check, size*/ 120) {
    			$$invalidate(1, classes = classnames(className, hidden ? "sr-only" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : false));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		fore,
    		classes,
    		$$restProps,
    		className,
    		hidden,
    		check,
    		size,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		widths,
    		$$scope,
    		slots
    	];
    }

    class Label extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			class: 3,
    			hidden: 4,
    			check: 5,
    			size: 6,
    			for: 0,
    			xs: 7,
    			sm: 8,
    			md: 9,
    			lg: 10,
    			xl: 11,
    			widths: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Label",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get class() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hidden() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get for() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set for(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get widths() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set widths(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Modal.svelte generated by Svelte v3.37.0 */

    const file$t = "node_modules/sveltestrap/src/Modal.svelte";
    const get_external_slot_changes = dirty => ({});
    const get_external_slot_context = ctx => ({});

    // (217:0) {#if _isMounted}
    function create_if_block$8(ctx) {
    	let div;
    	let current;
    	let if_block = /*isOpen*/ ctx[1] && create_if_block_1$6(ctx);

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
    			add_location(div, file$t, 217, 2, 4706);
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
    					if_block = create_if_block_1$6(ctx);
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(217:0) {#if _isMounted}",
    		ctx
    	});

    	return block;
    }

    // (222:4) {#if isOpen}
    function create_if_block_1$6(ctx) {
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
    	let if_block = /*backdrop*/ ctx[3] && !/*staticModal*/ ctx[0] && create_if_block_2$1(ctx);

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
    			add_location(div0, file$t, 237, 10, 5340);
    			attr_dev(div1, "class", /*classes*/ ctx[13]);
    			attr_dev(div1, "role", "document");
    			add_location(div1, file$t, 236, 8, 5272);
    			attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[2]);

    			attr_dev(div2, "class", div2_class_value = classnames("modal", /*modalClassName*/ ctx[5], {
    				show: /*isOpen*/ ctx[1],
    				"d-block": /*isOpen*/ ctx[1],
    				"d-none": !/*isOpen*/ ctx[1],
    				"position-static": /*staticModal*/ ctx[0]
    			}));

    			attr_dev(div2, "role", "dialog");
    			add_location(div2, file$t, 222, 6, 4800);
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
    					if_block = create_if_block_2$1(ctx);
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
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(222:4) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (244:6) {#if backdrop && !staticModal}
    function create_if_block_2$1(ctx) {
    	let div;
    	let div_class_value;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = classnames("modal-backdrop", "show", /*backdropClassName*/ ctx[6]));
    			add_location(div, file$t, 244, 8, 5548);
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(244:6) {#if backdrop && !staticModal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*_isMounted*/ ctx[11] && create_if_block$8(ctx);

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
    		id: create_fragment$t.name,
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

    function instance$t($$self, $$props, $$invalidate) {
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
    			instance$t,
    			create_fragment$t,
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
    			id: create_fragment$t.name
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

    	get fade() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

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

    	set unmountOnClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

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

    /* node_modules/sveltestrap/src/ModalBody.svelte generated by Svelte v3.37.0 */
    const file$s = "node_modules/sveltestrap/src/ModalBody.svelte";

    function create_fragment$s(ctx) {
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
    			add_location(div, file$s, 9, 0, 165);
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalBody",
    			options,
    			id: create_fragment$s.name
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
    const file$r = "node_modules/sveltestrap/src/ModalFooter.svelte";

    function create_fragment$r(ctx) {
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
    			add_location(div, file$r, 9, 0, 167);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalFooter",
    			options,
    			id: create_fragment$r.name
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
    const file$q = "node_modules/sveltestrap/src/ModalHeader.svelte";
    const get_close_slot_changes = dirty => ({});
    const get_close_slot_context = ctx => ({});

    // (21:4) {:else}
    function create_else_block$3(ctx) {
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(21:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if children}
    function create_if_block_1$5(ctx) {
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(19:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if typeof toggle === 'function'}
    function create_if_block$7(ctx) {
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
    			add_location(span, file$q, 31, 8, 735);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "close");
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$q, 26, 6, 612);
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(26:4) {#if typeof toggle === 'function'}",
    		ctx
    	});

    	return block;
    }

    // (25:21)      
    function fallback_block$3(ctx) {
    	let if_block_anchor;
    	let if_block = typeof /*toggle*/ ctx[0] === "function" && create_if_block$7(ctx);

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
    					if_block = create_if_block$7(ctx);
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
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(25:21)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div;
    	let h5;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1$5, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const close_slot_template = /*#slots*/ ctx[9].close;
    	const close_slot = create_slot(close_slot_template, ctx, /*$$scope*/ ctx[8], get_close_slot_context);
    	const close_slot_or_fallback = close_slot || fallback_block$3(ctx);
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
    			add_location(h5, file$q, 17, 2, 439);
    			set_attributes(div, div_data);
    			add_location(div, file$q, 16, 0, 398);
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {
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
    			id: create_fragment$q.name
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
    const file$p = "node_modules/sveltestrap/src/Nav.svelte";

    function create_fragment$p(ctx) {
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
    			add_location(ul, file$p, 39, 0, 941);
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
    		id: create_fragment$p.name,
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

    function instance$p($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
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
    			id: create_fragment$p.name
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
    const file$o = "node_modules/sveltestrap/src/Navbar.svelte";

    function create_fragment$o(ctx) {
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
    			add_location(nav, file$o, 31, 0, 719);
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
    		id: create_fragment$o.name,
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

    function instance$o($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
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
    			id: create_fragment$o.name
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
    const file$n = "node_modules/sveltestrap/src/NavItem.svelte";

    function create_fragment$n(ctx) {
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
    			add_location(li, file$n, 10, 0, 219);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { class: 2, active: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavItem",
    			options,
    			id: create_fragment$n.name
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
    const file$m = "node_modules/sveltestrap/src/NavLink.svelte";

    function create_fragment$m(ctx) {
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
    			add_location(a, file$m, 27, 0, 472);
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","disabled","active","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavLink", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { disabled = false } = $$props;
    	let { active = false } = $$props;
    	let { href = "#" } = $$props;

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
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			class: 4,
    			disabled: 5,
    			active: 6,
    			href: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$m.name
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
    const file$l = "node_modules/sveltestrap/src/NavbarBrand.svelte";

    function create_fragment$l(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

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
    			add_location(a, file$l, 10, 0, 192);
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { class: 3, href: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarBrand",
    			options,
    			id: create_fragment$l.name
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
    const file$k = "node_modules/sveltestrap/src/NavbarToggler.svelte";

    // (13:8)      
    function fallback_block$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file$k, 13, 4, 274);
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
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(13:8)      ",
    		ctx
    	});

    	return block;
    }

    // (12:0) <Button {...$$restProps} on:click class={classes}>
    function create_default_slot$c(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

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
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(12:0) <Button {...$$restProps} on:click class={classes}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let button;
    	let current;
    	const button_spread_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];

    	let button_props = {
    		$$slots: { default: [create_default_slot$c] },
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarToggler",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get class() {
    		throw new Error("<NavbarToggler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavbarToggler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Pagination.svelte generated by Svelte v3.37.0 */
    const file$j = "node_modules/sveltestrap/src/Pagination.svelte";

    function create_fragment$j(ctx) {
    	let nav;
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let nav_levels = [
    		/*$$restProps*/ ctx[3],
    		{ class: /*classes*/ ctx[1] },
    		{ "aria-label": /*ariaLabel*/ ctx[0] }
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			add_location(ul, file$j, 17, 2, 414);
    			set_attributes(nav, nav_data);
    			add_location(nav, file$j, 16, 0, 350);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 128) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*listClasses*/ 4) {
    				attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*ariaLabel*/ 1) && { "aria-label": /*ariaLabel*/ ctx[0] }
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

    function instance$j($$self, $$props, $$invalidate) {
    	let classes;
    	let listClasses;
    	const omit_props_names = ["class","listClassName","size","ariaLabel"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Pagination", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { listClassName = "" } = $$props;
    	let { size = "" } = $$props;
    	let { ariaLabel = "pagination" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("listClassName" in $$new_props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		listClassName,
    		size,
    		ariaLabel,
    		classes,
    		listClasses
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("listClassName" in $$props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("listClasses" in $$props) $$invalidate(2, listClasses = $$new_props.listClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 16) {
    			$$invalidate(1, classes = classnames(className));
    		}

    		if ($$self.$$.dirty & /*listClassName, size*/ 96) {
    			$$invalidate(2, listClasses = classnames(listClassName, "pagination", { [`pagination-${size}`]: !!size }));
    		}
    	};

    	return [
    		ariaLabel,
    		classes,
    		listClasses,
    		$$restProps,
    		className,
    		listClassName,
    		size,
    		$$scope,
    		slots
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			class: 4,
    			listClassName: 5,
    			size: 6,
    			ariaLabel: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listClassName() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listClassName(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/PaginationItem.svelte generated by Svelte v3.37.0 */
    const file$i = "node_modules/sveltestrap/src/PaginationItem.svelte";

    function create_fragment$i(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
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
    			add_location(li, file$i, 14, 0, 256);
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
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
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
    	const omit_props_names = ["class","active","disabled"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PaginationItem", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		disabled,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active, disabled*/ 28) {
    			$$invalidate(0, classes = classnames(className, "page-item", { active, disabled }));
    		}
    	};

    	return [classes, $$restProps, className, active, disabled, $$scope, slots];
    }

    class PaginationItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { class: 2, active: 3, disabled: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationItem",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/PaginationLink.svelte generated by Svelte v3.37.0 */
    const file$h = "node_modules/sveltestrap/src/PaginationLink.svelte";

    // (47:2) {:else}
    function create_else_block$2(ctx) {
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(47:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:2) {#if previous || next || first || last}
    function create_if_block$6(ctx) {
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			span1 = element("span");
    			t1 = text(/*realLabel*/ ctx[7]);
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$h, 42, 4, 948);
    			attr_dev(span1, "class", "sr-only");
    			add_location(span1, file$h, 45, 4, 1024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*defaultCaret*/ 32) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty & /*realLabel*/ 128) set_data_dev(t1, /*realLabel*/ ctx[7]);
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
    			if (detaching) detach_dev(span0);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(42:2) {#if previous || next || first || last}",
    		ctx
    	});

    	return block;
    }

    // (44:12) {defaultCaret}
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*defaultCaret*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*defaultCaret*/ 32) set_data_dev(t, /*defaultCaret*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(44:12) {defaultCaret}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*previous*/ ctx[1] || /*next*/ ctx[0] || /*first*/ ctx[2] || /*last*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[8],
    		{ class: /*classes*/ ctx[6] },
    		{ href: /*href*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$h, 40, 0, 849);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[14], false, false, false);
    				mounted = true;
    			}
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
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8],
    				(!current || dirty & /*classes*/ 64) && { class: /*classes*/ ctx[6] },
    				(!current || dirty & /*href*/ 16) && { href: /*href*/ ctx[4] }
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
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let classes;
    	let realLabel;
    	const omit_props_names = ["class","next","previous","first","last","ariaLabel","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PaginationLink", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { next = false } = $$props;
    	let { previous = false } = $$props;
    	let { first = false } = $$props;
    	let { last = false } = $$props;
    	let { ariaLabel = "" } = $$props;
    	let { href = "" } = $$props;
    	let defaultAriaLabel;
    	let defaultCaret;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ("next" in $$new_props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$new_props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$new_props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$new_props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$new_props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$new_props) $$invalidate(4, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		next,
    		previous,
    		first,
    		last,
    		ariaLabel,
    		href,
    		defaultAriaLabel,
    		defaultCaret,
    		classes,
    		realLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(9, className = $$new_props.className);
    		if ("next" in $$props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$props) $$invalidate(4, href = $$new_props.href);
    		if ("defaultAriaLabel" in $$props) $$invalidate(11, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ("defaultCaret" in $$props) $$invalidate(5, defaultCaret = $$new_props.defaultCaret);
    		if ("classes" in $$props) $$invalidate(6, classes = $$new_props.classes);
    		if ("realLabel" in $$props) $$invalidate(7, realLabel = $$new_props.realLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 512) {
    			$$invalidate(6, classes = classnames(className, "page-link"));
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			if (previous) {
    				$$invalidate(11, defaultAriaLabel = "Previous");
    			} else if (next) {
    				$$invalidate(11, defaultAriaLabel = "Next");
    			} else if (first) {
    				$$invalidate(11, defaultAriaLabel = "First");
    			} else if (last) {
    				$$invalidate(11, defaultAriaLabel = "Last");
    			}
    		}

    		if ($$self.$$.dirty & /*ariaLabel, defaultAriaLabel*/ 3072) {
    			$$invalidate(7, realLabel = ariaLabel || defaultAriaLabel);
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			if (previous) {
    				$$invalidate(5, defaultCaret = "‹");
    			} else if (next) {
    				$$invalidate(5, defaultCaret = "›");
    			} else if (first) {
    				$$invalidate(5, defaultCaret = "«");
    			} else if (last) {
    				$$invalidate(5, defaultCaret = "»");
    			}
    		}
    	};

    	return [
    		next,
    		previous,
    		first,
    		last,
    		href,
    		defaultCaret,
    		classes,
    		realLabel,
    		$$restProps,
    		className,
    		ariaLabel,
    		defaultAriaLabel,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class PaginationLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			class: 9,
    			next: 0,
    			previous: 1,
    			first: 2,
    			last: 3,
    			ariaLabel: 10,
    			href: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationLink",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get next() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set next(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get previous() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set previous(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get first() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get last() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set last(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function getBoundingClientRect(element) {
      var rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        x: rect.left,
        y: rect.top
      };
    }

    function getWindow(node) {
      if (node == null) {
        return window;
      }

      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }

      return node;
    }

    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }

    function isElement(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }

    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }

    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }

      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }

    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }

    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }

    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }

    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle$1(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    // Composite means it takes into account transforms as well as layout.

    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }

      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement);
      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };

      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }

        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }

      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    // means it doesn't take into account transforms.

    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223

      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }

      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }

      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }

    function getParentNode(element) {
      if (getNodeName(element) === 'html') {
        return element;
      }

      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        getDocumentElement(element) // fallback

      );
    }

    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }

      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }

      return getScrollParent(getParentNode(node));
    }

    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */

    function listScrollParents(element, list) {
      var _element$ownerDocumen;

      if (list === void 0) {
        list = [];
      }

      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
    }

    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle$1(element).position === 'fixed') {
        return null;
      }

      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block


    function getContainingBlock(element) {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
      var isIE = navigator.userAgent.indexOf('Trident') !== -1;

      if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = getComputedStyle$1(element);

        if (elementCss.position === 'fixed') {
          return null;
        }
      }

      var currentNode = getParentNode(element);

      while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }

      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.


    function getOffsetParent(element) {
      var window = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);

      while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }

      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
        return window;
      }

      return offsetParent || getContainingBlock(element) || window;
    }

    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM

    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers

    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively

      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);

            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }

      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }

    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase

      return modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }

    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }

        return pending;
      };
    }

    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }

    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values

      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }

    function getViewportRect(element) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
      // can be obscured underneath it.
      // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
      // if it isn't open, so if this isn't available, the popper will be detected
      // to overflow the bottom of the screen too early.

      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
        // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
        // errors due to floating point numbers, so we need to check precision.
        // Safari returns a number <= 0, usually < -1 when pinch-zoomed
        // Feature detection fails in mobile emulation mode in Chrome.
        // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
        // 0.001
        // Fallback here: "Not Safari" userAgent

        if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }

      return {
        width: width,
        height: height,
        x: x + getWindowScrollBarX(element),
        y: y
      };
    }

    var max = Math.max;
    var min = Math.min;
    var round = Math.round;

    // of the `<html>` and `<body>` rect bounds if horizontally scrollable

    function getDocumentRect(element) {
      var _element$ownerDocumen;

      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;

      if (getComputedStyle$1(body || html).direction === 'rtl') {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }

      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }

    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;

          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...


            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false


      return false;
    }

    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }

    function getInnerBoundingClientRect(element) {
      var rect = getBoundingClientRect(element);
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }

    function getClientRectFromMixedType(element, clippingParent) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`


    function getClippingParents(element) {
      var clippingParents = listScrollParents(getParentNode(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

      if (!isElement(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


      return clippingParents.filter(function (clippingParent) {
        return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents


    function getClippingRect(element, boundary, rootBoundary) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }

    function getVariation(placement) {
      return placement.split('-')[1];
    }

    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;

      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;

        case bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;

        case right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;

        case left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;

        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }

      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';

        switch (variation) {
          case start:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;

          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
        }
      }

      return offsets;
    }

    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }

    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }

    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }

    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var referenceElement = state.elements.reference;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
      var referenceClientRect = getBoundingClientRect(referenceElement);
      var popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect

      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

      if (elementContext === popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }

      return overflowOffsets;
    }

    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };

    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }

    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }

      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }

        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(options) {
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties

            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            }); // Validate the provided modifiers so that the consumer will get warned

            runModifierEffects();
            return instance.update();
          },
          // Sync update – it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }

            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore

            if (!areValidElements(reference, popper)) {

              return;
            } // Store the reference and popper rects to be read by modifiers


            state.rects = {
              reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
              popper: getLayoutRect(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect

            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`

            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });

            for (var index = 0; index < state.orderedModifiers.length; index++) {

              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }

              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;

              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update – it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: debounce(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };

        if (!areValidElements(reference, popper)) {

          return instance;
        }

        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.

        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref3) {
            var name = _ref3.name,
                _ref3$options = _ref3.options,
                options = _ref3$options === void 0 ? {} : _ref3$options,
                effect = _ref3.effect;

            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });

              var noopFn = function noopFn() {};

              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }

        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }

        return instance;
      };
    }

    var passive = {
      passive: true
    };

    function effect$2(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }

      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }

        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules


    var eventListeners = {
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect$2,
      data: {}
    };

    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var popperOffsets$1 = {
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    };

    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.

    function roundOffsetsByDPR(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(round(x * dpr) / dpr) || 0,
        y: round(round(y * dpr) / dpr) || 0
      };
    }

    function mapToStyles(_ref2) {
      var _Object$assign2;

      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets;

      var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
          _ref3$x = _ref3.x,
          x = _ref3$x === void 0 ? 0 : _ref3$x,
          _ref3$y = _ref3.y,
          y = _ref3$y === void 0 ? 0 : _ref3$y;

      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = left;
      var sideY = top;
      var win = window;

      if (adaptive) {
        var offsetParent = getOffsetParent(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';

        if (offsetParent === getWindow(popper)) {
          offsetParent = getDocumentElement(popper);

          if (getComputedStyle$1(offsetParent).position !== 'static') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


        offsetParent = offsetParent;

        if (placement === top) {
          sideY = bottom; // $FlowFixMe[prop-missing]

          y -= offsetParent[heightProp] - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }

        if (placement === left) {
          sideX = right; // $FlowFixMe[prop-missing]

          x -= offsetParent[widthProp] - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }

      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);

      if (gpuAcceleration) {
        var _Object$assign;

        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }

      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }

    function computeStyles(_ref4) {
      var state = _ref4.state,
          options = _ref4.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

      var commonStyles = {
        placement: getBasePlacement(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration
      };

      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }

      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }

      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var computeStyles$1 = {
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    };

    // and applies them to the HTMLElements such as popper and arrow

    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]


        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];

          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }

    function effect$1(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }

      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements

          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }

          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules


    var applyStyles$1 = {
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect$1,
      requires: ['computeStyles']
    };

    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];

      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }

    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;

      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var offset$1 = {
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    };

    var hash$1 = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash$1[matched];
      });
    }

    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }

    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
        return getVariation(placement) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });

      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[getBasePlacement(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }

    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }

      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }

    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;

      if (state.modifiersData[name]._skip) {
        return;
      }

      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var _basePlacement = getBasePlacement(placement);

        var isStartVariation = getVariation(placement) === start;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }

        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];

        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }

        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }

        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }

        checksMap.set(placement, checks);
      }

      if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;

        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);

            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });

          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };

        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);

          if (_ret === "break") break;
        }
      }

      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules


    var flip$1 = {
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    };

    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }

    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }

    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var data = {
        x: 0,
        y: 0
      };

      if (!popperOffsets) {
        return;
      }

      if (checkMainAxis || checkAltAxis) {
        var mainSide = mainAxis === 'y' ? top : left;
        var altSide = mainAxis === 'y' ? bottom : right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
        var max$1 = popperOffsets[mainAxis] - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds

        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)

        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
        var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

        if (checkMainAxis) {
          var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
          popperOffsets[mainAxis] = preventedOffset;
          data[mainAxis] = preventedOffset - offset;
        }

        if (checkAltAxis) {
          var _mainSide = mainAxis === 'x' ? top : left;

          var _altSide = mainAxis === 'x' ? bottom : right;

          var _offset = popperOffsets[altAxis];

          var _min = _offset + overflow[_mainSide];

          var _max = _offset - overflow[_altSide];

          var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

          popperOffsets[altAxis] = _preventedOffset;
          data[altAxis] = _preventedOffset - _offset;
        }
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var preventOverflow$1 = {
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    };

    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    };

    function arrow(_ref) {
      var _state$modifiersData$;

      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';

      if (!arrowElement || !popperOffsets) {
        return;
      }

      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === 'y' ? top : left;
      var maxProp = axis === 'y' ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds

      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = within(min, center, max); // Prevents breaking syntax highlighting...

      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }

    function effect(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

      if (arrowElement == null) {
        return;
      } // CSS selector


      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);

        if (!arrowElement) {
          return;
        }
      }

      if (!contains(state.elements.popper, arrowElement)) {

        return;
      }

      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules


    var arrow$1 = {
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    };

    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }

      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }

    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function (side) {
        return overflow[side] >= 0;
      });
    }

    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules


    var hide$1 = {
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    };

    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules

    /* node_modules/sveltestrap/src/Popover.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1 } = globals;
    const file$g = "node_modules/sveltestrap/src/Popover.svelte";
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (103:0) {#if isOpen}
    function create_if_block$5(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let h3;
    	let t1;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const title_slot_template = /*#slots*/ ctx[16].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[15], get_title_slot_context);
    	const title_slot_or_fallback = title_slot || fallback_block(ctx);
    	const if_block_creators = [create_if_block_1$4, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let div2_levels = [
    		/*$$restProps*/ ctx[6],
    		{ class: /*classes*/ ctx[5] },
    		{ role: "tooltip" },
    		{
    			"x-placement": /*popperPlacement*/ ctx[4]
    		}
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			h3 = element("h3");
    			if (title_slot_or_fallback) title_slot_or_fallback.c();
    			t1 = space();
    			div1 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "arrow");
    			attr_dev(div0, "data-popper-arrow", "");
    			add_location(div0, file$g, 109, 4, 2739);
    			attr_dev(h3, "class", "popover-header");
    			add_location(h3, file$g, 110, 4, 2783);
    			attr_dev(div1, "class", "popover-body");
    			add_location(div1, file$g, 113, 4, 2865);
    			set_attributes(div2, div2_data);
    			add_location(div2, file$g, 103, 2, 2609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, h3);

    			if (title_slot_or_fallback) {
    				title_slot_or_fallback.m(h3, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			/*div2_binding*/ ctx[17](div2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (title_slot) {
    				if (title_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(title_slot, title_slot_template, ctx, /*$$scope*/ ctx[15], dirty, get_title_slot_changes, get_title_slot_context);
    				}
    			} else {
    				if (title_slot_or_fallback && title_slot_or_fallback.p && dirty & /*title*/ 4) {
    					title_slot_or_fallback.p(ctx, dirty);
    				}
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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 32) && { class: /*classes*/ ctx[5] },
    				{ role: "tooltip" },
    				(!current || dirty & /*popperPlacement*/ 16) && {
    					"x-placement": /*popperPlacement*/ ctx[4]
    				}
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot_or_fallback, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot_or_fallback, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
    			if_blocks[current_block_type_index].d();
    			/*div2_binding*/ ctx[17](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(103:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (112:25) {title}
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(112:25) {title}",
    		ctx
    	});

    	return block;
    }

    // (117:6) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

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
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
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
    		source: "(117:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (115:6) {#if children}
    function create_if_block_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
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
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(115:6) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","animation","children","dismissible","isOpen","placement","target","title","trigger"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Popover", slots, ['title','default']);
    	let { class: className = "" } = $$props;
    	let { animation = true } = $$props;
    	let { children = undefined } = $$props;
    	let { dismissible = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { placement = "top" } = $$props;
    	let { target = "" } = $$props;
    	let { title = "" } = $$props;
    	let { trigger = "click" } = $$props;
    	let targetEl;
    	let popoverEl;
    	let popperInstance;
    	let popperPlacement = placement;

    	const checkPopperPlacement = {
    		name: "checkPopperPlacement",
    		enabled: true,
    		phase: "main",
    		fn({ state }) {
    			$$invalidate(4, popperPlacement = state.placement);
    		}
    	};

    	const open = () => $$invalidate(0, isOpen = true);
    	const close = () => $$invalidate(0, isOpen = false);
    	const toggle = () => $$invalidate(0, isOpen = !isOpen);

    	onMount(() => {
    		$$invalidate(13, targetEl = document.querySelector(`#${target}`));

    		switch (trigger) {
    			case "hover":
    				targetEl.addEventListener("mouseover", open);
    				targetEl.addEventListener("mouseleave", close);
    				break;
    			case "focus":
    				targetEl.addEventListener("focus", open);
    				targetEl.addEventListener("blur", close);
    				break;
    			default:
    				targetEl.addEventListener("click", toggle);
    				if (dismissible) targetEl.addEventListener("blur", close);
    				break;
    		}

    		return () => {
    			switch (trigger) {
    				case "hover":
    					targetEl.removeEventListener("mouseover", open);
    					targetEl.removeEventListener("mouseleave", close);
    					break;
    				case "focus":
    					targetEl.removeEventListener("focus", open);
    					targetEl.removeEventListener("blur", close);
    					break;
    				default:
    					targetEl.removeEventListener("click", toggle);
    					if (dismissible) targetEl.removeEventListener("blur", close);
    					break;
    			}
    		};
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			popoverEl = $$value;
    			$$invalidate(3, popoverEl);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(7, className = $$new_props.class);
    		if ("animation" in $$new_props) $$invalidate(8, animation = $$new_props.animation);
    		if ("children" in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ("dismissible" in $$new_props) $$invalidate(9, dismissible = $$new_props.dismissible);
    		if ("isOpen" in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ("placement" in $$new_props) $$invalidate(10, placement = $$new_props.placement);
    		if ("target" in $$new_props) $$invalidate(11, target = $$new_props.target);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("trigger" in $$new_props) $$invalidate(12, trigger = $$new_props.trigger);
    		if ("$$scope" in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createPopper,
    		classnames,
    		className,
    		animation,
    		children,
    		dismissible,
    		isOpen,
    		placement,
    		target,
    		title,
    		trigger,
    		targetEl,
    		popoverEl,
    		popperInstance,
    		popperPlacement,
    		checkPopperPlacement,
    		open,
    		close,
    		toggle,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(7, className = $$new_props.className);
    		if ("animation" in $$props) $$invalidate(8, animation = $$new_props.animation);
    		if ("children" in $$props) $$invalidate(1, children = $$new_props.children);
    		if ("dismissible" in $$props) $$invalidate(9, dismissible = $$new_props.dismissible);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ("placement" in $$props) $$invalidate(10, placement = $$new_props.placement);
    		if ("target" in $$props) $$invalidate(11, target = $$new_props.target);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("trigger" in $$props) $$invalidate(12, trigger = $$new_props.trigger);
    		if ("targetEl" in $$props) $$invalidate(13, targetEl = $$new_props.targetEl);
    		if ("popoverEl" in $$props) $$invalidate(3, popoverEl = $$new_props.popoverEl);
    		if ("popperInstance" in $$props) $$invalidate(14, popperInstance = $$new_props.popperInstance);
    		if ("popperPlacement" in $$props) $$invalidate(4, popperPlacement = $$new_props.popperPlacement);
    		if ("classes" in $$props) $$invalidate(5, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isOpen, popoverEl, targetEl, placement, popperInstance*/ 25609) {
    			{
    				if (isOpen && popoverEl) {
    					$$invalidate(14, popperInstance = createPopper(targetEl, popoverEl, {
    						placement,
    						modifiers: [
    							checkPopperPlacement,
    							{
    								name: "offset",
    								options: {
    									offset: () => {
    										return [0, 8];
    									}
    								}
    							}
    						]
    					}));
    				} else if (popperInstance) {
    					popperInstance.destroy();
    					$$invalidate(14, popperInstance = undefined);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*target*/ 2048) {
    			if (!target) {
    				throw new Error("Need target!");
    			}
    		}

    		if ($$self.$$.dirty & /*className, animation, popperPlacement, isOpen*/ 401) {
    			$$invalidate(5, classes = classnames(className, "popover", animation ? "fade" : false, `bs-popover-${popperPlacement}`, isOpen ? "show" : false));
    		}
    	};

    	return [
    		isOpen,
    		children,
    		title,
    		popoverEl,
    		popperPlacement,
    		classes,
    		$$restProps,
    		className,
    		animation,
    		dismissible,
    		placement,
    		target,
    		trigger,
    		targetEl,
    		popperInstance,
    		$$scope,
    		slots,
    		div2_binding
    	];
    }

    class Popover extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			class: 7,
    			animation: 8,
    			children: 1,
    			dismissible: 9,
    			isOpen: 0,
    			placement: 10,
    			target: 11,
    			title: 2,
    			trigger: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Popover",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animation() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animation(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dismissible() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dismissible(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placement() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placement(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get target() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trigger() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trigger(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Table.svelte generated by Svelte v3.37.0 */
    const file$f = "node_modules/sveltestrap/src/Table.svelte";

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
    			add_location(table, file$f, 35, 2, 861);
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
    function create_if_block$4(ctx) {
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
    			add_location(table, file$f, 30, 4, 773);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$f, 29, 2, 735);
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(29:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block];
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
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
    			id: create_fragment$f.name
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

    const file$e = "src/frontend/Header.svelte";

    // (21:2) <NavbarBrand href="/" class="mr-auto">
    function create_default_slot_9$7(ctx) {
    	let strong;

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			strong.textContent = "SOS2021-10";
    			add_location(strong, file$e, 20, 40, 321);
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
    		id: create_default_slot_9$7.name,
    		type: "slot",
    		source: "(21:2) <NavbarBrand href=\\\"/\\\" class=\\\"mr-auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:8) <NavLink href="#/foodconsumption-stats">
    function create_default_slot_8$7(ctx) {
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
    		id: create_default_slot_8$7.name,
    		type: "slot",
    		source: "(26:8) <NavLink href=\\\"#/foodconsumption-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:6) <NavItem>
    function create_default_slot_7$7(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/foodconsumption-stats",
    				$$slots: { default: [create_default_slot_8$7] },
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
    		id: create_default_slot_7$7.name,
    		type: "slot",
    		source: "(25:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (29:8) <NavLink href="#/obesity-stats">
    function create_default_slot_6$7(ctx) {
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
    		id: create_default_slot_6$7.name,
    		type: "slot",
    		source: "(29:8) <NavLink href=\\\"#/obesity-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:6) <NavItem>
    function create_default_slot_5$7(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/obesity-stats",
    				$$slots: { default: [create_default_slot_6$7] },
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
    		id: create_default_slot_5$7.name,
    		type: "slot",
    		source: "(28:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (32:8) <NavLink href="#/sanity-stats">
    function create_default_slot_4$8(ctx) {
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
    		id: create_default_slot_4$8.name,
    		type: "slot",
    		source: "(32:8) <NavLink href=\\\"#/sanity-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:3) <NavItem>
    function create_default_slot_3$9(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/sanity-stats",
    				$$slots: { default: [create_default_slot_4$8] },
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
    		id: create_default_slot_3$9.name,
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
    				$$slots: { default: [create_default_slot_7$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_5$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_3$9] },
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
    function create_default_slot$b(ctx) {
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
    				$$slots: { default: [create_default_slot_9$7] },
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
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(19:0) <Navbar style=\\\"background-color:#24355C;\\\" dark class=\\\"fixed-top\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let main;
    	let navbar;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "background-color:#24355C;",
    				dark: true,
    				class: "fixed-top",
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			add_location(main, file$e, 16, 0, 207);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/frontend/NotFound.svelte generated by Svelte v3.37.0 */
    const file$d = "src/frontend/NotFound.svelte";

    function create_fragment$d(ctx) {
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
    			add_location(br, file$d, 8, 2, 159);
    			add_location(h3, file$d, 9, 2, 166);
    			set_style(div, "margin", "auto");
    			set_style(div, "width", "60%");
    			set_style(div, "text-align", "center");
    			set_style(div, "padding-top", "275px");
    			add_location(div, file$d, 7, 1, 79);
    			add_location(main, file$d, 5, 0, 60);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header });
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/frontend/obesity/ObesitySv.svelte generated by Svelte v3.37.0 */

    const { console: console_1$6 } = globals;
    const file$c = "src/frontend/obesity/ObesitySv.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	return child_ctx;
    }

    // (240:2) {#if errorMsg}
    function create_if_block_1$3(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[0]);
    			add_location(p, file$c, 240, 3, 6251);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*errorMsg*/ 1) set_data_dev(t1, /*errorMsg*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(240:2) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (239:1) <Alert color="danger" isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_23$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[0] && create_if_block_1$3(ctx);

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
    			if (/*errorMsg*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
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
    		id: create_default_slot_23$3.name,
    		type: "slot",
    		source: "(239:1) <Alert color=\\\"danger\\\" isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (245:2) {#if okMsg}
    function create_if_block$3(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Correcto: ");
    			t1 = text(/*okMsg*/ ctx[1]);
    			add_location(p, file$c, 245, 3, 6393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*okMsg*/ 2) set_data_dev(t1, /*okMsg*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(245:2) {#if okMsg}",
    		ctx
    	});

    	return block;
    }

    // (244:1) <Alert color="success" isOpen={visibleOk} toggle={() => (visibleOk = false)}>
    function create_default_slot_22$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*okMsg*/ ctx[1] && create_if_block$3(ctx);

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
    			if (/*okMsg*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
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
    		id: create_default_slot_22$3.name,
    		type: "slot",
    		source: "(244:1) <Alert color=\\\"success\\\" isOpen={visibleOk} toggle={() => (visibleOk = false)}>",
    		ctx
    	});

    	return block;
    }

    // (252:5) <Button id={`btn-${placement}`}>
    function create_default_slot_21$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
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
    		id: create_default_slot_21$3.name,
    		type: "slot",
    		source: "(252:5) <Button id={`btn-${placement}`}>",
    		ctx
    	});

    	return block;
    }

    // (257:5) <CustomInput type="checkbox" id="filtroPais" label="País" >
    function create_default_slot_20$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "svelte-1h2kj47");
    			add_location(input, file$c, 256, 64, 6744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterObesity*/ ctx[9].country);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterObesity*/ 512 && input.value !== /*filterObesity*/ ctx[9].country) {
    				set_input_value(input, /*filterObesity*/ ctx[9].country);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$3.name,
    		type: "slot",
    		source: "(257:5) <CustomInput type=\\\"checkbox\\\" id=\\\"filtroPais\\\" label=\\\"País\\\" >",
    		ctx
    	});

    	return block;
    }

    // (258:5) <CustomInput type="checkbox" id="filtroAnyoFrom" label="Desde el año:" >
    function create_default_slot_19$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-1h2kj47");
    			add_location(input, file$c, 257, 77, 6880);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterObesity*/ ctx[9].fromyear);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[20]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterObesity*/ 512 && to_number(input.value) !== /*filterObesity*/ ctx[9].fromyear) {
    				set_input_value(input, /*filterObesity*/ ctx[9].fromyear);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$3.name,
    		type: "slot",
    		source: "(258:5) <CustomInput type=\\\"checkbox\\\" id=\\\"filtroAnyoFrom\\\" label=\\\"Desde el año:\\\" >",
    		ctx
    	});

    	return block;
    }

    // (259:5) <CustomInput type="checkbox" id="filtroAnyoTo" label="Antes el año:" >
    function create_default_slot_18$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-1h2kj47");
    			add_location(input, file$c, 258, 75, 7027);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterObesity*/ ctx[9].toyear);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterObesity*/ 512 && to_number(input.value) !== /*filterObesity*/ ctx[9].toyear) {
    				set_input_value(input, /*filterObesity*/ ctx[9].toyear);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$3.name,
    		type: "slot",
    		source: "(259:5) <CustomInput type=\\\"checkbox\\\" id=\\\"filtroAnyoTo\\\" label=\\\"Antes el año:\\\" >",
    		ctx
    	});

    	return block;
    }

    // (260:5) <CustomInput type="checkbox" id="filtroMan" label="Porcentaje de hombres" >
    function create_default_slot_17$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-1h2kj47");
    			add_location(input, file$c, 259, 80, 7177);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterObesity*/ ctx[9].man_percent);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_3*/ ctx[22]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterObesity*/ 512 && to_number(input.value) !== /*filterObesity*/ ctx[9].man_percent) {
    				set_input_value(input, /*filterObesity*/ ctx[9].man_percent);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$3.name,
    		type: "slot",
    		source: "(260:5) <CustomInput type=\\\"checkbox\\\" id=\\\"filtroMan\\\" label=\\\"Porcentaje de hombres\\\" >",
    		ctx
    	});

    	return block;
    }

    // (261:5) <CustomInput type="checkbox" id="filtroWoman" label="Porcentaje de mujeres" >
    function create_default_slot_16$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-1h2kj47");
    			add_location(input, file$c, 260, 82, 7334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterObesity*/ ctx[9].woman_percent);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_4*/ ctx[23]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterObesity*/ 512 && to_number(input.value) !== /*filterObesity*/ ctx[9].woman_percent) {
    				set_input_value(input, /*filterObesity*/ ctx[9].woman_percent);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$3.name,
    		type: "slot",
    		source: "(261:5) <CustomInput type=\\\"checkbox\\\" id=\\\"filtroWoman\\\" label=\\\"Porcentaje de mujeres\\\" >",
    		ctx
    	});

    	return block;
    }

    // (262:5) <CustomInput type="checkbox" id="filtroTotal" label="Población total" >
    function create_default_slot_15$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-1h2kj47");
    			add_location(input, file$c, 261, 76, 7487);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterObesity*/ ctx[9].total_population);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_5*/ ctx[24]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterObesity*/ 512 && to_number(input.value) !== /*filterObesity*/ ctx[9].total_population) {
    				set_input_value(input, /*filterObesity*/ ctx[9].total_population);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$3.name,
    		type: "slot",
    		source: "(262:5) <CustomInput type=\\\"checkbox\\\" id=\\\"filtroTotal\\\" label=\\\"Población total\\\" >",
    		ctx
    	});

    	return block;
    }

    // (264:5) <Button on:click={getFiltro}>
    function create_default_slot_14$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Filtrar");
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
    		id: create_default_slot_14$4.name,
    		type: "slot",
    		source: "(264:5) <Button on:click={getFiltro}>",
    		ctx
    	});

    	return block;
    }

    // (265:5) <Button outline color="secondary" on:click="{getObesity}">
    function create_default_slot_13$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
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
    		id: create_default_slot_13$4.name,
    		type: "slot",
    		source: "(265:5) <Button outline color=\\\"secondary\\\" on:click=\\\"{getObesity}\\\">",
    		ctx
    	});

    	return block;
    }

    // (255:6) <FormGroup>
    function create_default_slot_12$4(ctx) {
    	let custominput0;
    	let t0;
    	let custominput1;
    	let t1;
    	let custominput2;
    	let t2;
    	let custominput3;
    	let t3;
    	let custominput4;
    	let t4;
    	let custominput5;
    	let t5;
    	let br;
    	let t6;
    	let button0;
    	let t7;
    	let button1;
    	let current;

    	custominput0 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroPais",
    				label: "País",
    				$$slots: { default: [create_default_slot_20$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput1 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroAnyoFrom",
    				label: "Desde el año:",
    				$$slots: { default: [create_default_slot_19$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput2 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroAnyoTo",
    				label: "Antes el año:",
    				$$slots: { default: [create_default_slot_18$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput3 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroMan",
    				label: "Porcentaje de hombres",
    				$$slots: { default: [create_default_slot_17$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput4 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroWoman",
    				label: "Porcentaje de mujeres",
    				$$slots: { default: [create_default_slot_16$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput5 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroTotal",
    				label: "Población total",
    				$$slots: { default: [create_default_slot_15$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_14$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*getFiltro*/ ctx[12]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_13$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*getObesity*/ ctx[11]);

    	const block = {
    		c: function create() {
    			create_component(custominput0.$$.fragment);
    			t0 = space();
    			create_component(custominput1.$$.fragment);
    			t1 = space();
    			create_component(custominput2.$$.fragment);
    			t2 = space();
    			create_component(custominput3.$$.fragment);
    			t3 = space();
    			create_component(custominput4.$$.fragment);
    			t4 = space();
    			create_component(custominput5.$$.fragment);
    			t5 = space();
    			br = element("br");
    			t6 = space();
    			create_component(button0.$$.fragment);
    			t7 = space();
    			create_component(button1.$$.fragment);
    			add_location(br, file$c, 262, 5, 7572);
    		},
    		m: function mount(target, anchor) {
    			mount_component(custominput0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(custominput1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(custominput2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(custominput3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(custominput4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(custominput5, target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custominput0_changes = {};

    			if (dirty[0] & /*filterObesity*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				custominput0_changes.$$scope = { dirty, ctx };
    			}

    			custominput0.$set(custominput0_changes);
    			const custominput1_changes = {};

    			if (dirty[0] & /*filterObesity*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				custominput1_changes.$$scope = { dirty, ctx };
    			}

    			custominput1.$set(custominput1_changes);
    			const custominput2_changes = {};

    			if (dirty[0] & /*filterObesity*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				custominput2_changes.$$scope = { dirty, ctx };
    			}

    			custominput2.$set(custominput2_changes);
    			const custominput3_changes = {};

    			if (dirty[0] & /*filterObesity*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				custominput3_changes.$$scope = { dirty, ctx };
    			}

    			custominput3.$set(custominput3_changes);
    			const custominput4_changes = {};

    			if (dirty[0] & /*filterObesity*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				custominput4_changes.$$scope = { dirty, ctx };
    			}

    			custominput4.$set(custominput4_changes);
    			const custominput5_changes = {};

    			if (dirty[0] & /*filterObesity*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				custominput5_changes.$$scope = { dirty, ctx };
    			}

    			custominput5.$set(custominput5_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custominput0.$$.fragment, local);
    			transition_in(custominput1.$$.fragment, local);
    			transition_in(custominput2.$$.fragment, local);
    			transition_in(custominput3.$$.fragment, local);
    			transition_in(custominput4.$$.fragment, local);
    			transition_in(custominput5.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custominput0.$$.fragment, local);
    			transition_out(custominput1.$$.fragment, local);
    			transition_out(custominput2.$$.fragment, local);
    			transition_out(custominput3.$$.fragment, local);
    			transition_out(custominput4.$$.fragment, local);
    			transition_out(custominput5.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(custominput0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(custominput1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(custominput2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(custominput3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(custominput4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(custominput5, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t6);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$4.name,
    		type: "slot",
    		source: "(255:6) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (254:3) <Form>
    function create_default_slot_11$6(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_12$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty[0] & /*filterObesity*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$6.name,
    		type: "slot",
    		source: "(254:3) <Form>",
    		ctx
    	});

    	return block;
    }

    // (253:5) <Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
    function create_default_slot_10$6(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_11$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};

    			if (dirty[0] & /*filterObesity*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$6.name,
    		type: "slot",
    		source: "(253:5) <Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>",
    		ctx
    	});

    	return block;
    }

    // (277:8) <Button on:click={ObesityData}>
    function create_default_slot_9$6(ctx) {
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
    		id: create_default_slot_9$6.name,
    		type: "slot",
    		source: "(277:8) <Button on:click={ObesityData}>",
    		ctx
    	});

    	return block;
    }

    // (278:8) <Button on:click={deleteAll}>
    function create_default_slot_8$6(ctx) {
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
    		id: create_default_slot_8$6.name,
    		type: "slot",
    		source: "(278:8) <Button on:click={deleteAll}>",
    		ctx
    	});

    	return block;
    }

    // (298:8) <Button on:click={insertObesity}>
    function create_default_slot_7$6(ctx) {
    	let t;

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
    		id: create_default_slot_7$6.name,
    		type: "slot",
    		source: "(298:8) <Button on:click={insertObesity}>",
    		ctx
    	});

    	return block;
    }

    // (308:8) <Button on:click={deleteObesity(obe.country,obe.year)}>
    function create_default_slot_6$6(ctx) {
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
    		id: create_default_slot_6$6.name,
    		type: "slot",
    		source: "(308:8) <Button on:click={deleteObesity(obe.country,obe.year)}>",
    		ctx
    	});

    	return block;
    }

    // (300:3) {#each obesity as obe}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*obe*/ ctx[40].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*obe*/ ctx[40].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*obe*/ ctx[40].man_percent + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*obe*/ ctx[40].woman_percent + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*obe*/ ctx[40].total_population + "";
    	let t8;
    	let t9;
    	let td5;
    	let button;
    	let t10;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_6$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteObesity*/ ctx[15](/*obe*/ ctx[40].country, /*obe*/ ctx[40].year))) /*deleteObesity*/ ctx[15](/*obe*/ ctx[40].country, /*obe*/ ctx[40].year).apply(this, arguments);
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
    			attr_dev(a, "href", a_href_value = "#/obesity-stats/" + /*obe*/ ctx[40].country + "/" + /*obe*/ ctx[40].year);
    			add_location(a, file$c, 301, 8, 8608);
    			attr_dev(td0, "class", "svelte-1h2kj47");
    			add_location(td0, file$c, 301, 4, 8604);
    			attr_dev(td1, "class", "svelte-1h2kj47");
    			add_location(td1, file$c, 303, 4, 8687);
    			attr_dev(td2, "class", "svelte-1h2kj47");
    			add_location(td2, file$c, 304, 4, 8711);
    			attr_dev(td3, "class", "svelte-1h2kj47");
    			add_location(td3, file$c, 305, 4, 8742);
    			attr_dev(td4, "class", "svelte-1h2kj47");
    			add_location(td4, file$c, 306, 4, 8775);
    			attr_dev(td5, "class", "svelte-1h2kj47");
    			add_location(td5, file$c, 307, 4, 8811);
    			attr_dev(tr, "class", "svelte-1h2kj47");
    			add_location(tr, file$c, 300, 4, 8595);
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
    			if ((!current || dirty[0] & /*obesity*/ 4) && t0_value !== (t0_value = /*obe*/ ctx[40].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*obesity*/ 4 && a_href_value !== (a_href_value = "#/obesity-stats/" + /*obe*/ ctx[40].country + "/" + /*obe*/ ctx[40].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*obesity*/ 4) && t2_value !== (t2_value = /*obe*/ ctx[40].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*obesity*/ 4) && t4_value !== (t4_value = /*obe*/ ctx[40].man_percent + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*obesity*/ 4) && t6_value !== (t6_value = /*obe*/ ctx[40].woman_percent + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*obesity*/ 4) && t8_value !== (t8_value = /*obe*/ ctx[40].total_population + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
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
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(300:3) {#each obesity as obe}",
    		ctx
    	});

    	return block;
    }

    // (318:10) <PaginationItem class = {c_page === 1 ? "enable" : ""}>
    function create_default_slot_5$6(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/obesity-stats" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$6.name,
    		type: "slot",
    		source: "(318:10) <PaginationItem class = {c_page === 1 ? \\\"enable\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (323:15) <PaginationLink previous href="#/obesity-stats" on:click={() => cambiapag(page, (page - 1) * 10)}>
    function create_default_slot_4$7(ctx) {
    	let t_value = /*page*/ ctx[37] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*lastPage*/ 256 && t_value !== (t_value = /*page*/ ctx[37] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$7.name,
    		type: "slot",
    		source: "(323:15) <PaginationLink previous href=\\\"#/obesity-stats\\\" on:click={() => cambiapag(page, (page - 1) * 10)}>",
    		ctx
    	});

    	return block;
    }

    // (322:13) <PaginationItem class = {c_page === page ? "active" : ""}>
    function create_default_slot_3$8(ctx) {
    	let paginationlink;
    	let current;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[31](/*page*/ ctx[37]);
    	}

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/obesity-stats",
    				$$slots: { default: [create_default_slot_4$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", click_handler_1);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const paginationlink_changes = {};

    			if (dirty[0] & /*lastPage*/ 256 | dirty[1] & /*$$scope*/ 4096) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$8.name,
    		type: "slot",
    		source: "(322:13) <PaginationItem class = {c_page === page ? \\\"active\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (321:10) {#each range(lastPage, 1) as page}
    function create_each_block$3(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*c_page*/ ctx[7] === /*page*/ ctx[37] ? "active" : "",
    				$$slots: { default: [create_default_slot_3$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};
    			if (dirty[0] & /*c_page, lastPage*/ 384) paginationitem_changes.class = /*c_page*/ ctx[7] === /*page*/ ctx[37] ? "active" : "";

    			if (dirty[0] & /*lastPage*/ 256 | dirty[1] & /*$$scope*/ 4096) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(321:10) {#each range(lastPage, 1) as page}",
    		ctx
    	});

    	return block;
    }

    // (328:10) <PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
    function create_default_slot_2$8(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/obesity-stats" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[32]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$8.name,
    		type: "slot",
    		source: "(328:10) <PaginationItem class = {c_page === lastPage ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (317:8) <Pagination ariaLabel="Web pagination">
    function create_default_slot_1$8(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*c_page*/ ctx[7] === 1 ? "enable" : "",
    				$$slots: { default: [create_default_slot_5$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = range(/*lastPage*/ ctx[8], 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	paginationitem1 = new PaginationItem({
    			props: {
    				class: /*c_page*/ ctx[7] === /*lastPage*/ ctx[8]
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_2$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*c_page*/ 128) paginationitem0_changes.class = /*c_page*/ ctx[7] === 1 ? "enable" : "";

    			if (dirty[0] & /*c_page, c_offset*/ 192 | dirty[1] & /*$$scope*/ 4096) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (dirty[0] & /*c_page, lastPage, cambiapag*/ 8576) {
    				each_value = range(/*lastPage*/ ctx[8], 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*c_page, lastPage*/ 384) paginationitem1_changes.class = /*c_page*/ ctx[7] === /*lastPage*/ ctx[8]
    			? "disabled"
    			: "";

    			if (dirty[0] & /*c_page, c_offset*/ 192 | dirty[1] & /*$$scope*/ 4096) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(317:8) <Pagination ariaLabel=\\\"Web pagination\\\">",
    		ctx
    	});

    	return block;
    }

    // (273:1) <Table responsive>
    function create_default_slot$a(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let button0;
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
    	let t20;
    	let div;
    	let pagination;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_9$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*ObesityData*/ ctx[10]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_8$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteAll*/ ctx[16]);

    	button2 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_7$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*insertObesity*/ ctx[14]);
    	let each_value_1 = /*obesity*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web pagination",
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
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

    			t20 = space();
    			div = element("div");
    			create_component(pagination.$$.fragment);
    			attr_dev(td0, "class", "svelte-1h2kj47");
    			add_location(td0, file$c, 276, 4, 7810);
    			attr_dev(td1, "class", "svelte-1h2kj47");
    			add_location(td1, file$c, 277, 4, 7876);
    			attr_dev(tr0, "class", "svelte-1h2kj47");
    			add_location(tr0, file$c, 275, 3, 7801);
    			add_location(th0, file$c, 282, 4, 7967);
    			add_location(th1, file$c, 283, 4, 7985);
    			add_location(th2, file$c, 284, 4, 8002);
    			add_location(th3, file$c, 285, 4, 8037);
    			add_location(th4, file$c, 286, 4, 8070);
    			add_location(th5, file$c, 287, 4, 8099);
    			attr_dev(tr1, "class", "svelte-1h2kj47");
    			add_location(tr1, file$c, 281, 3, 7958);
    			add_location(thead, file$c, 274, 2, 7790);
    			attr_dev(input0, "class", "svelte-1h2kj47");
    			add_location(input0, file$c, 292, 8, 8161);
    			attr_dev(td2, "class", "svelte-1h2kj47");
    			add_location(td2, file$c, 292, 4, 8157);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-1h2kj47");
    			add_location(input1, file$c, 293, 8, 8216);
    			attr_dev(td3, "class", "svelte-1h2kj47");
    			add_location(td3, file$c, 293, 4, 8212);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "class", "svelte-1h2kj47");
    			add_location(input2, file$c, 294, 8, 8280);
    			attr_dev(td4, "class", "svelte-1h2kj47");
    			add_location(td4, file$c, 294, 4, 8276);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "class", "svelte-1h2kj47");
    			add_location(input3, file$c, 295, 8, 8351);
    			attr_dev(td5, "class", "svelte-1h2kj47");
    			add_location(td5, file$c, 295, 4, 8347);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "class", "svelte-1h2kj47");
    			add_location(input4, file$c, 296, 8, 8424);
    			attr_dev(td6, "class", "svelte-1h2kj47");
    			add_location(td6, file$c, 296, 4, 8420);
    			attr_dev(td7, "class", "svelte-1h2kj47");
    			add_location(td7, file$c, 297, 4, 8496);
    			attr_dev(tr2, "class", "svelte-1h2kj47");
    			add_location(tr2, file$c, 291, 3, 8148);
    			add_location(tbody, file$c, 290, 2, 8137);
    			add_location(div, file$c, 314, 2, 8939);
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
    			set_input_value(input0, /*newObesity*/ ctx[3].country);
    			append_dev(tr2, t14);
    			append_dev(tr2, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*newObesity*/ ctx[3].year);
    			append_dev(tr2, t15);
    			append_dev(tr2, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*newObesity*/ ctx[3].man_percent);
    			append_dev(tr2, t16);
    			append_dev(tr2, td5);
    			append_dev(td5, input3);
    			set_input_value(input3, /*newObesity*/ ctx[3].woman_percent);
    			append_dev(tr2, t17);
    			append_dev(tr2, td6);
    			append_dev(td6, input4);
    			set_input_value(input4, /*newObesity*/ ctx[3].total_population);
    			append_dev(tr2, t18);
    			append_dev(tr2, td7);
    			mount_component(button2, td7, null);
    			append_dev(tbody, t19);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t20, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(pagination, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[25]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[26]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[27]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[28]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[29])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty[0] & /*newObesity*/ 8 && input0.value !== /*newObesity*/ ctx[3].country) {
    				set_input_value(input0, /*newObesity*/ ctx[3].country);
    			}

    			if (dirty[0] & /*newObesity*/ 8 && to_number(input1.value) !== /*newObesity*/ ctx[3].year) {
    				set_input_value(input1, /*newObesity*/ ctx[3].year);
    			}

    			if (dirty[0] & /*newObesity*/ 8 && to_number(input2.value) !== /*newObesity*/ ctx[3].man_percent) {
    				set_input_value(input2, /*newObesity*/ ctx[3].man_percent);
    			}

    			if (dirty[0] & /*newObesity*/ 8 && to_number(input3.value) !== /*newObesity*/ ctx[3].woman_percent) {
    				set_input_value(input3, /*newObesity*/ ctx[3].woman_percent);
    			}

    			if (dirty[0] & /*newObesity*/ 8 && to_number(input4.value) !== /*newObesity*/ ctx[3].total_population) {
    				set_input_value(input4, /*newObesity*/ ctx[3].total_population);
    			}

    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);

    			if (dirty[0] & /*deleteObesity, obesity*/ 32772) {
    				each_value_1 = /*obesity*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*c_page, lastPage, c_offset*/ 448 | dirty[1] & /*$$scope*/ 4096) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(pagination.$$.fragment, local);
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

    			transition_out(pagination.$$.fragment, local);
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
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(div);
    			destroy_component(pagination);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(273:1) <Table responsive>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let main;
    	let alert0;
    	let t0;
    	let alert1;
    	let t1;
    	let div;
    	let button;
    	let t2;
    	let popover;
    	let t3;
    	let table;
    	let current;

    	alert0 = new Alert({
    			props: {
    				color: "danger",
    				isOpen: /*visible*/ ctx[4],
    				toggle: /*func*/ ctx[17],
    				$$slots: { default: [create_default_slot_23$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	alert1 = new Alert({
    			props: {
    				color: "success",
    				isOpen: /*visibleOk*/ ctx[5],
    				toggle: /*func_1*/ ctx[18],
    				$$slots: { default: [create_default_slot_22$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				id: `btn-${placement$2}`,
    				$$slots: { default: [create_default_slot_21$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	popover = new Popover({
    			props: {
    				target: `btn-${placement$2}`,
    				placement: placement$2,
    				title: `Filtros disponibles`,
    				$$slots: { default: [create_default_slot_10$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				responsive: true,
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert0.$$.fragment);
    			t0 = space();
    			create_component(alert1.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(button.$$.fragment);
    			t2 = space();
    			create_component(popover.$$.fragment);
    			t3 = space();
    			create_component(table.$$.fragment);
    			attr_dev(div, "class", "mt-3");
    			set_style(div, "position", "absolute");
    			set_style(div, "right", "80px");
    			add_location(div, file$c, 250, 1, 6444);
    			add_location(main, file$c, 236, 0, 6148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert0, main, null);
    			append_dev(main, t0);
    			mount_component(alert1, main, null);
    			append_dev(main, t1);
    			append_dev(main, div);
    			mount_component(button, div, null);
    			append_dev(div, t2);
    			mount_component(popover, div, null);
    			append_dev(main, t3);
    			mount_component(table, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert0_changes = {};
    			if (dirty[0] & /*visible*/ 16) alert0_changes.isOpen = /*visible*/ ctx[4];
    			if (dirty[0] & /*visible*/ 16) alert0_changes.toggle = /*func*/ ctx[17];

    			if (dirty[0] & /*errorMsg*/ 1 | dirty[1] & /*$$scope*/ 4096) {
    				alert0_changes.$$scope = { dirty, ctx };
    			}

    			alert0.$set(alert0_changes);
    			const alert1_changes = {};
    			if (dirty[0] & /*visibleOk*/ 32) alert1_changes.isOpen = /*visibleOk*/ ctx[5];
    			if (dirty[0] & /*visibleOk*/ 32) alert1_changes.toggle = /*func_1*/ ctx[18];

    			if (dirty[0] & /*okMsg*/ 2 | dirty[1] & /*$$scope*/ 4096) {
    				alert1_changes.$$scope = { dirty, ctx };
    			}

    			alert1.$set(alert1_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const popover_changes = {};

    			if (dirty[0] & /*filterObesity*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				popover_changes.$$scope = { dirty, ctx };
    			}

    			popover.$set(popover_changes);
    			const table_changes = {};

    			if (dirty[0] & /*c_page, lastPage, c_offset, obesity, newObesity*/ 460 | dirty[1] & /*$$scope*/ 4096) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert0.$$.fragment, local);
    			transition_in(alert1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(popover.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert0.$$.fragment, local);
    			transition_out(alert1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(popover.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert0);
    			destroy_component(alert1);
    			destroy_component(button);
    			destroy_component(popover);
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const placement$2 = "right";
    const BASE_CONTACT_API_PATH$1 = "/api/v2";

    function range(size, start = 0) {
    	return [...Array(size).keys()].map(i => i + start);
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ObesitySv", slots, []);
    	let errorMsg = "";
    	let okMsg = "";
    	let obesity = [];

    	let newObesity = {
    		country: "",
    		year: "",
    		man_percent: "",
    		woman_percent: "",
    		total_population: ""
    	};

    	let visible = false;
    	let visibleOk = false;
    	let c_offset = 0;
    	let offset = 0;
    	let limit = 10;
    	let c_page = 1;
    	let lastPage = 1;
    	let total = 0;

    	async function ObesityData() {
    		console.log("Loading data...");

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats/loadInitialData").then(res => {
    			getObesity();
    			$$invalidate(1, okMsg = "Los datos se introdujeron correctamente");
    			$$invalidate(5, visibleOk = true);
    			$$invalidate(4, visible = false);
    		});
    	}

    	async function getObesity() {
    		console.log("Fetching data...");
    		const res = await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats" + "?limit=" + limit + "&offset=" + c_offset);

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(2, obesity = json);
    			console.log(`We have ${obesity.length} obesity.`);
    			paginacion();
    		} else {
    			console.log("Error");
    		}
    	}

    	let filterObesity = {
    		country: "",
    		fromyear: 0,
    		toyear: 0,
    		man_percent: 0,
    		woman_percent: 0,
    		total_population: 0
    	};

    	async function getFiltro() {
    		let dbquery = "?";
    		document.getElementById("myselect");

    		if (document.getElementById("filtroPais").checked) {
    			dbquery += `country=${filterObesity.country}`;

    			if (document.getElementById("filtroAnyoFrom").checked || document.getElementById("filtroAnyoTo").checked || document.getElementById("filtroMan").checked || document.getElementById("filtroWoman").checked || document.getElementById("filtroTotal").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroAnyoFrom").checked) {
    			dbquery += `fromyear=${filterObesity.fromyear}`;

    			if (document.getElementById("filtroAnyoTo").checked || document.getElementById("filtroMan").checked || document.getElementById("filtroWoman").checked || document.getElementById("filtroTotal").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroAnyoTo").checked) {
    			dbquery += `toyear=${filterObesity.toyear}`;

    			if (document.getElementById("filtroMan").checked || document.getElementById("filtroWoman").checked || document.getElementById("filtroTotal").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroMan").checked) {
    			dbquery += `man_percent=${filterObesity.man_percent}`;

    			if (document.getElementById("filtroWoman").checked || document.getElementById("filtroTotal").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroWoman").checked) {
    			dbquery += `woman_percent=${filterObesity.woman_percent}`;

    			if (document.getElementById("filtroTotal").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroTotal").checked) {
    			dbquery += `total_population=${filterObesity.total_population}`;
    		}

    		const res = await fetch("/api/v2/obesity-stats" + dbquery);

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(2, obesity = json);

    			if (obesity.length > 0) {
    				$$invalidate(1, okMsg = "Datos filtrados");
    				$$invalidate(5, visibleOk = true);
    				$$invalidate(4, visible = false);
    				console.log(`We have ${obesity.length} obesity.`);
    				console.log(JSON.stringify(obesity));
    			} else {
    				$$invalidate(0, errorMsg = "No se encuentran datos con los filtros seleccionados");
    				$$invalidate(5, visibleOk = false);
    				$$invalidate(4, visible = true);
    				console.log("Error!");
    			}
    		}
    	}

    	async function paginacion() {
    		const data = await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats");

    		if (data.status == 200) {
    			const json = await data.json();
    			total = json.length;
    			cambiapag(c_page, c_offset);
    		}
    	}

    	function cambiapag(page, offset) {
    		$$invalidate(8, lastPage = Math.ceil(total / 10));
    		console.log("Last page = " + lastPage);

    		if (page !== c_page) {
    			$$invalidate(6, c_offset = offset);
    			$$invalidate(7, c_page = page);
    			getObesity();
    		}
    	}

    	async function insertObesity() {
    		console.log("Inserting data " + JSON.stringify(newObesity));

    		await fetch(BASE_CONTACT_API_PATH$1 + "/obesity-stats", {
    			method: "POST",
    			body: JSON.stringify(newObesity),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			if (res.ok) {
    				getObesity();
    				$$invalidate(1, okMsg = "El dato se introdujo correctamente");
    				$$invalidate(5, visibleOk = true);
    				$$invalidate(4, visible = false);
    			} else if (res.status === 409) {
    				$$invalidate(0, errorMsg = "Ya existe ese dato");
    				$$invalidate(5, visibleOk = false);
    				$$invalidate(4, visible = true);
    			} else if (res.status === 400) {
    				$$invalidate(0, errorMsg = "Campo mal introducido");
    				$$invalidate(5, visibleOk = false);
    				$$invalidate(4, visible = true);
    			}
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
    			if (res.ok) {
    				getObesity();
    				$$invalidate(1, okMsg = "Todos los datos se han eliminado");
    				$$invalidate(5, visibleOk = true);
    				$$invalidate(4, visible = false);
    			} else {
    				$$invalidate(0, errorMsg = "No hay datos que borrar");
    				$$invalidate(5, visibleOk = false);
    				$$invalidate(4, visible = true);
    			}
    		});
    	}

    	onMount(getObesity);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<ObesitySv> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(4, visible = false);
    	const func_1 = () => $$invalidate(5, visibleOk = false);

    	function input_input_handler() {
    		filterObesity.country = this.value;
    		$$invalidate(9, filterObesity);
    	}

    	function input_input_handler_1() {
    		filterObesity.fromyear = to_number(this.value);
    		$$invalidate(9, filterObesity);
    	}

    	function input_input_handler_2() {
    		filterObesity.toyear = to_number(this.value);
    		$$invalidate(9, filterObesity);
    	}

    	function input_input_handler_3() {
    		filterObesity.man_percent = to_number(this.value);
    		$$invalidate(9, filterObesity);
    	}

    	function input_input_handler_4() {
    		filterObesity.woman_percent = to_number(this.value);
    		$$invalidate(9, filterObesity);
    	}

    	function input_input_handler_5() {
    		filterObesity.total_population = to_number(this.value);
    		$$invalidate(9, filterObesity);
    	}

    	function input0_input_handler() {
    		newObesity.country = this.value;
    		$$invalidate(3, newObesity);
    	}

    	function input1_input_handler() {
    		newObesity.year = to_number(this.value);
    		$$invalidate(3, newObesity);
    	}

    	function input2_input_handler() {
    		newObesity.man_percent = to_number(this.value);
    		$$invalidate(3, newObesity);
    	}

    	function input3_input_handler() {
    		newObesity.woman_percent = to_number(this.value);
    		$$invalidate(3, newObesity);
    	}

    	function input4_input_handler() {
    		newObesity.total_population = to_number(this.value);
    		$$invalidate(3, newObesity);
    	}

    	const click_handler = () => cambiapag(c_page - 1, c_offset - 10);
    	const click_handler_1 = page => cambiapag(page, (page - 1) * 10);
    	const click_handler_2 = () => cambiapag(c_page + 1, c_offset + 10);

    	$$self.$capture_state = () => ({
    		onMount,
    		placement: placement$2,
    		Alert,
    		Table,
    		Button,
    		Popover,
    		CustomInput,
    		Form,
    		FormGroup,
    		Label,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		errorMsg,
    		okMsg,
    		obesity,
    		newObesity,
    		visible,
    		visibleOk,
    		c_offset,
    		offset,
    		limit,
    		c_page,
    		lastPage,
    		total,
    		BASE_CONTACT_API_PATH: BASE_CONTACT_API_PATH$1,
    		ObesityData,
    		getObesity,
    		filterObesity,
    		getFiltro,
    		paginacion,
    		range,
    		cambiapag,
    		insertObesity,
    		deleteObesity,
    		deleteAll
    	});

    	$$self.$inject_state = $$props => {
    		if ("errorMsg" in $$props) $$invalidate(0, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(1, okMsg = $$props.okMsg);
    		if ("obesity" in $$props) $$invalidate(2, obesity = $$props.obesity);
    		if ("newObesity" in $$props) $$invalidate(3, newObesity = $$props.newObesity);
    		if ("visible" in $$props) $$invalidate(4, visible = $$props.visible);
    		if ("visibleOk" in $$props) $$invalidate(5, visibleOk = $$props.visibleOk);
    		if ("c_offset" in $$props) $$invalidate(6, c_offset = $$props.c_offset);
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("limit" in $$props) limit = $$props.limit;
    		if ("c_page" in $$props) $$invalidate(7, c_page = $$props.c_page);
    		if ("lastPage" in $$props) $$invalidate(8, lastPage = $$props.lastPage);
    		if ("total" in $$props) total = $$props.total;
    		if ("filterObesity" in $$props) $$invalidate(9, filterObesity = $$props.filterObesity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		errorMsg,
    		okMsg,
    		obesity,
    		newObesity,
    		visible,
    		visibleOk,
    		c_offset,
    		c_page,
    		lastPage,
    		filterObesity,
    		ObesityData,
    		getObesity,
    		getFiltro,
    		cambiapag,
    		insertObesity,
    		deleteObesity,
    		deleteAll,
    		func,
    		func_1,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class ObesitySv extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ObesitySv",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/frontend/sanity/SanityAPI.svelte generated by Svelte v3.37.0 */

    const { console: console_1$5 } = globals;
    const file$b = "src/frontend/sanity/SanityAPI.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (186:2) <Alert    color="danger"    isOpen={visible}    toggle={() => (visible = false)}>
    function create_default_slot_29$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*mensaje*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mensaje*/ 2) set_data_dev(t, /*mensaje*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29$1.name,
    		type: "slot",
    		source: "(186:2) <Alert    color=\\\"danger\\\"    isOpen={visible}    toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (194:9) <Button id={`btn-${placement}`}>
    function create_default_slot_28$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Filtrar");
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
    		id: create_default_slot_28$1.name,
    		type: "slot",
    		source: "(194:9) <Button id={`btn-${placement}`}>",
    		ctx
    	});

    	return block;
    }

    // (199:8) <CustomInput               type="checkbox"                id="pais"               label="País" >
    function create_default_slot_27$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$b, 201, 28, 5126);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSanity*/ ctx[4].country);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[15]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSanity*/ 16 && input.value !== /*filterSanity*/ ctx[4].country) {
    				set_input_value(input, /*filterSanity*/ ctx[4].country);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27$1.name,
    		type: "slot",
    		source: "(199:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"pais\\\"               label=\\\"País\\\" >",
    		ctx
    	});

    	return block;
    }

    // (204:8) <CustomInput               type="checkbox"                id="filtrodesdeaño"               label="Año desde" >
    function create_default_slot_26$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$b, 206, 33, 5304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSanity*/ ctx[4].fromyear);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[16]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSanity*/ 16 && to_number(input.value) !== /*filterSanity*/ ctx[4].fromyear) {
    				set_input_value(input, /*filterSanity*/ ctx[4].fromyear);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26$2.name,
    		type: "slot",
    		source: "(204:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtrodesdeaño\\\"               label=\\\"Año desde\\\" >",
    		ctx
    	});

    	return block;
    }

    // (208:8) <CustomInput               type="checkbox"                id="filtrohastaaño"               label="Año hasta" >
    function create_default_slot_25$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$b, 210, 33, 5494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSanity*/ ctx[4].toyear);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSanity*/ 16 && to_number(input.value) !== /*filterSanity*/ ctx[4].toyear) {
    				set_input_value(input, /*filterSanity*/ ctx[4].toyear);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25$2.name,
    		type: "slot",
    		source: "(208:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtrohastaaño\\\"               label=\\\"Año hasta\\\" >",
    		ctx
    	});

    	return block;
    }

    // (212:8) <CustomInput               type="checkbox"                id="filtrodesdesanidad"               label="Costes sanidad desde" >
    function create_default_slot_24$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$b, 214, 44, 5697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSanity*/ ctx[4].fromhealth);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_3*/ ctx[18]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSanity*/ 16 && to_number(input.value) !== /*filterSanity*/ ctx[4].fromhealth) {
    				set_input_value(input, /*filterSanity*/ ctx[4].fromhealth);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24$2.name,
    		type: "slot",
    		source: "(212:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtrodesdesanidad\\\"               label=\\\"Costes sanidad desde\\\" >",
    		ctx
    	});

    	return block;
    }

    // (216:8) <CustomInput               type="checkbox"                id="filtrohastasanidad"               label="Costes sanidad hasta" >
    function create_default_slot_23$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$b, 218, 44, 5904);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSanity*/ ctx[4].tohealth);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_4*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSanity*/ 16 && to_number(input.value) !== /*filterSanity*/ ctx[4].tohealth) {
    				set_input_value(input, /*filterSanity*/ ctx[4].tohealth);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23$2.name,
    		type: "slot",
    		source: "(216:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtrohastasanidad\\\"               label=\\\"Costes sanidad hasta\\\" >",
    		ctx
    	});

    	return block;
    }

    // (219:114) <CustomInput               type="checkbox"                id="filtrodesdemedicos"               label="Médicos desde" >
    function create_default_slot_22$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$b, 221, 37, 6093);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSanity*/ ctx[4].fromdoctor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_5*/ ctx[20]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSanity*/ 16 && to_number(input.value) !== /*filterSanity*/ ctx[4].fromdoctor) {
    				set_input_value(input, /*filterSanity*/ ctx[4].fromdoctor);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22$2.name,
    		type: "slot",
    		source: "(219:114) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtrodesdemedicos\\\"               label=\\\"Médicos desde\\\" >",
    		ctx
    	});

    	return block;
    }

    // (223:8) <CustomInput               type="checkbox"                id="filtrohastamedicos"               label="Médicos hasta" >
    function create_default_slot_21$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$b, 225, 37, 6293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSanity*/ ctx[4].todoctor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_6*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSanity*/ 16 && to_number(input.value) !== /*filterSanity*/ ctx[4].todoctor) {
    				set_input_value(input, /*filterSanity*/ ctx[4].todoctor);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21$2.name,
    		type: "slot",
    		source: "(223:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtrohastamedicos\\\"               label=\\\"Médicos hasta\\\" >",
    		ctx
    	});

    	return block;
    }

    // (226:107) <CustomInput               type="checkbox"                id="filtrodesdecamas"               label="Camas desde" >
    function create_default_slot_20$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$b, 228, 35, 6478);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSanity*/ ctx[4].frombed);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_7*/ ctx[22]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSanity*/ 16 && to_number(input.value) !== /*filterSanity*/ ctx[4].frombed) {
    				set_input_value(input, /*filterSanity*/ ctx[4].frombed);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$2.name,
    		type: "slot",
    		source: "(226:107) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtrodesdecamas\\\"               label=\\\"Camas desde\\\" >",
    		ctx
    	});

    	return block;
    }

    // (230:8) <CustomInput               type="checkbox"                id="filtrohastacamas"               label="Camas hasta" >
    function create_default_slot_19$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$b, 232, 35, 6671);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSanity*/ ctx[4].tobed);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_8*/ ctx[23]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSanity*/ 16 && to_number(input.value) !== /*filterSanity*/ ctx[4].tobed) {
    				set_input_value(input, /*filterSanity*/ ctx[4].tobed);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$2.name,
    		type: "slot",
    		source: "(230:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtrohastacamas\\\"               label=\\\"Camas hasta\\\" >",
    		ctx
    	});

    	return block;
    }

    // (235:8) <Button on:click={getFiltro}>
    function create_default_slot_18$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Filtrar");
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
    		id: create_default_slot_18$2.name,
    		type: "slot",
    		source: "(235:8) <Button on:click={getFiltro}>",
    		ctx
    	});

    	return block;
    }

    // (197:10) <FormGroup>
    function create_default_slot_17$2(ctx) {
    	let custominput0;
    	let t0;
    	let custominput1;
    	let t1;
    	let custominput2;
    	let t2;
    	let custominput3;
    	let t3;
    	let custominput4;
    	let custominput5;
    	let t4;
    	let custominput6;
    	let custominput7;
    	let t5;
    	let custominput8;
    	let t6;
    	let br;
    	let t7;
    	let button;
    	let current;

    	custominput0 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "pais",
    				label: "País",
    				$$slots: { default: [create_default_slot_27$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput1 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtrodesdeaño",
    				label: "Año desde",
    				$$slots: { default: [create_default_slot_26$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput2 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtrohastaaño",
    				label: "Año hasta",
    				$$slots: { default: [create_default_slot_25$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput3 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtrodesdesanidad",
    				label: "Costes sanidad desde",
    				$$slots: { default: [create_default_slot_24$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput4 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtrohastasanidad",
    				label: "Costes sanidad hasta",
    				$$slots: { default: [create_default_slot_23$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput5 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtrodesdemedicos",
    				label: "Médicos desde",
    				$$slots: { default: [create_default_slot_22$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput6 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtrohastamedicos",
    				label: "Médicos hasta",
    				$$slots: { default: [create_default_slot_21$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput7 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtrodesdecamas",
    				label: "Camas desde",
    				$$slots: { default: [create_default_slot_20$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput8 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtrohastacamas",
    				label: "Camas hasta",
    				$$slots: { default: [create_default_slot_19$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_18$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*getFiltro*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(custominput0.$$.fragment);
    			t0 = space();
    			create_component(custominput1.$$.fragment);
    			t1 = space();
    			create_component(custominput2.$$.fragment);
    			t2 = space();
    			create_component(custominput3.$$.fragment);
    			t3 = space();
    			create_component(custominput4.$$.fragment);
    			create_component(custominput5.$$.fragment);
    			t4 = space();
    			create_component(custominput6.$$.fragment);
    			create_component(custominput7.$$.fragment);
    			t5 = space();
    			create_component(custominput8.$$.fragment);
    			t6 = space();
    			br = element("br");
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(br, file$b, 233, 8, 6747);
    		},
    		m: function mount(target, anchor) {
    			mount_component(custominput0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(custominput1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(custominput2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(custominput3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(custominput4, target, anchor);
    			mount_component(custominput5, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(custominput6, target, anchor);
    			mount_component(custominput7, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(custominput8, target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custominput0_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				custominput0_changes.$$scope = { dirty, ctx };
    			}

    			custominput0.$set(custominput0_changes);
    			const custominput1_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				custominput1_changes.$$scope = { dirty, ctx };
    			}

    			custominput1.$set(custominput1_changes);
    			const custominput2_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				custominput2_changes.$$scope = { dirty, ctx };
    			}

    			custominput2.$set(custominput2_changes);
    			const custominput3_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				custominput3_changes.$$scope = { dirty, ctx };
    			}

    			custominput3.$set(custominput3_changes);
    			const custominput4_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				custominput4_changes.$$scope = { dirty, ctx };
    			}

    			custominput4.$set(custominput4_changes);
    			const custominput5_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				custominput5_changes.$$scope = { dirty, ctx };
    			}

    			custominput5.$set(custominput5_changes);
    			const custominput6_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				custominput6_changes.$$scope = { dirty, ctx };
    			}

    			custominput6.$set(custominput6_changes);
    			const custominput7_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				custominput7_changes.$$scope = { dirty, ctx };
    			}

    			custominput7.$set(custominput7_changes);
    			const custominput8_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				custominput8_changes.$$scope = { dirty, ctx };
    			}

    			custominput8.$set(custominput8_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custominput0.$$.fragment, local);
    			transition_in(custominput1.$$.fragment, local);
    			transition_in(custominput2.$$.fragment, local);
    			transition_in(custominput3.$$.fragment, local);
    			transition_in(custominput4.$$.fragment, local);
    			transition_in(custominput5.$$.fragment, local);
    			transition_in(custominput6.$$.fragment, local);
    			transition_in(custominput7.$$.fragment, local);
    			transition_in(custominput8.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custominput0.$$.fragment, local);
    			transition_out(custominput1.$$.fragment, local);
    			transition_out(custominput2.$$.fragment, local);
    			transition_out(custominput3.$$.fragment, local);
    			transition_out(custominput4.$$.fragment, local);
    			transition_out(custominput5.$$.fragment, local);
    			transition_out(custominput6.$$.fragment, local);
    			transition_out(custominput7.$$.fragment, local);
    			transition_out(custominput8.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(custominput0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(custominput1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(custominput2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(custominput3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(custominput4, detaching);
    			destroy_component(custominput5, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(custominput6, detaching);
    			destroy_component(custominput7, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(custominput8, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t7);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$2.name,
    		type: "slot",
    		source: "(197:10) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (196:7) <Form>
    function create_default_slot_16$2(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_17$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$2.name,
    		type: "slot",
    		source: "(196:7) <Form>",
    		ctx
    	});

    	return block;
    }

    // (195:9) <Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
    function create_default_slot_15$2(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_16$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$2.name,
    		type: "slot",
    		source: "(195:9) <Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>",
    		ctx
    	});

    	return block;
    }

    // (247:8) <Button  on:click={SanityData}>
    function create_default_slot_14$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar Datos Iniciales");
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
    		id: create_default_slot_14$3.name,
    		type: "slot",
    		source: "(247:8) <Button  on:click={SanityData}>",
    		ctx
    	});

    	return block;
    }

    // (248:8) <Button  on:click={Delete}>
    function create_default_slot_13$3(ctx) {
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
    		id: create_default_slot_13$3.name,
    		type: "slot",
    		source: "(248:8) <Button  on:click={Delete}>",
    		ctx
    	});

    	return block;
    }

    // (266:8) <Button on:click={PostSanity(NewSanity)}>
    function create_default_slot_12$3(ctx) {
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
    		id: create_default_slot_12$3.name,
    		type: "slot",
    		source: "(266:8) <Button on:click={PostSanity(NewSanity)}>",
    		ctx
    	});

    	return block;
    }

    // (267:8) <Button on:click={PutSanity(NewSanity)}>
    function create_default_slot_11$5(ctx) {
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
    		id: create_default_slot_11$5.name,
    		type: "slot",
    		source: "(267:8) <Button on:click={PutSanity(NewSanity)}>",
    		ctx
    	});

    	return block;
    }

    // (276:8) <Button Button color="secondary" on:click={DeleteContact(sani.country,sani.year)}>
    function create_default_slot_10$5(ctx) {
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
    		id: create_default_slot_10$5.name,
    		type: "slot",
    		source: "(276:8) <Button Button color=\\\"secondary\\\" on:click={DeleteContact(sani.country,sani.year)}>",
    		ctx
    	});

    	return block;
    }

    // (269:3) {#each sanity as sani}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*sani*/ ctx[36].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*sani*/ ctx[36].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*sani*/ ctx[36].health_expenditure_in_percentage + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*sani*/ ctx[36].doctor_per_1000_habitant + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*sani*/ ctx[36].hospital_bed + "";
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
    				$$slots: { default: [create_default_slot_10$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*DeleteContact*/ ctx[11](/*sani*/ ctx[36].country, /*sani*/ ctx[36].year))) /*DeleteContact*/ ctx[11](/*sani*/ ctx[36].country, /*sani*/ ctx[36].year).apply(this, arguments);
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
    			attr_dev(a, "href", a_href_value = "#/sanity-stats/" + /*sani*/ ctx[36].country + "/" + /*sani*/ ctx[36].year);
    			add_location(a, file$b, 270, 8, 7829);
    			attr_dev(td0, "class", "svelte-ycj1m8");
    			add_location(td0, file$b, 270, 4, 7825);
    			attr_dev(td1, "class", "svelte-ycj1m8");
    			add_location(td1, file$b, 271, 4, 7905);
    			attr_dev(td2, "class", "svelte-ycj1m8");
    			add_location(td2, file$b, 272, 4, 7930);
    			attr_dev(td3, "class", "svelte-ycj1m8");
    			add_location(td3, file$b, 273, 4, 7983);
    			attr_dev(td4, "class", "svelte-ycj1m8");
    			add_location(td4, file$b, 274, 4, 8028);
    			attr_dev(td5, "class", "svelte-ycj1m8");
    			add_location(td5, file$b, 275, 4, 8061);
    			attr_dev(tr, "class", "svelte-ycj1m8");
    			add_location(tr, file$b, 269, 4, 7816);
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
    			if ((!current || dirty[0] & /*sanity*/ 4) && t0_value !== (t0_value = /*sani*/ ctx[36].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*sanity*/ 4 && a_href_value !== (a_href_value = "#/sanity-stats/" + /*sani*/ ctx[36].country + "/" + /*sani*/ ctx[36].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*sanity*/ 4) && t2_value !== (t2_value = /*sani*/ ctx[36].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*sanity*/ 4) && t4_value !== (t4_value = /*sani*/ ctx[36].health_expenditure_in_percentage + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*sanity*/ 4) && t6_value !== (t6_value = /*sani*/ ctx[36].doctor_per_1000_habitant + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*sanity*/ 4) && t8_value !== (t8_value = /*sani*/ ctx[36].hospital_bed + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(269:3) {#each sanity as sani}",
    		ctx
    	});

    	return block;
    }

    // (244:1) <Table responsive>
    function create_default_slot_9$5(ctx) {
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
    				$$slots: { default: [create_default_slot_14$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*SanityData*/ ctx[9]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_13$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*Delete*/ ctx[10]);

    	button2 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_12$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", function () {
    		if (is_function(/*PostSanity*/ ctx[12](/*NewSanity*/ ctx[3]))) /*PostSanity*/ ctx[12](/*NewSanity*/ ctx[3]).apply(this, arguments);
    	});

    	button3 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_11$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", function () {
    		if (is_function(/*PutSanity*/ ctx[13](/*NewSanity*/ ctx[3]))) /*PutSanity*/ ctx[13](/*NewSanity*/ ctx[3]).apply(this, arguments);
    	});

    	let each_value = /*sanity*/ ctx[2];
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
    			add_location(td0, file$b, 246, 4, 6922);
    			attr_dev(td1, "class", "svelte-ycj1m8");
    			add_location(td1, file$b, 247, 4, 6998);
    			attr_dev(tr0, "class", "svelte-ycj1m8");
    			add_location(tr0, file$b, 245, 3, 6913);
    			attr_dev(td2, "class", "svelte-ycj1m8");
    			add_location(td2, file$b, 250, 4, 7077);
    			attr_dev(td3, "class", "svelte-ycj1m8");
    			add_location(td3, file$b, 251, 4, 7095);
    			attr_dev(td4, "class", "svelte-ycj1m8");
    			add_location(td4, file$b, 252, 4, 7112);
    			attr_dev(td5, "class", "svelte-ycj1m8");
    			add_location(td5, file$b, 253, 4, 7156);
    			attr_dev(td6, "class", "svelte-ycj1m8");
    			add_location(td6, file$b, 254, 4, 7203);
    			attr_dev(tr1, "class", "svelte-ycj1m8");
    			add_location(tr1, file$b, 249, 3, 7068);
    			add_location(thead, file$b, 244, 2, 6902);
    			attr_dev(input0, "class", "svelte-ycj1m8");
    			add_location(input0, file$b, 260, 8, 7280);
    			attr_dev(td7, "class", "svelte-ycj1m8");
    			add_location(td7, file$b, 260, 4, 7276);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-ycj1m8");
    			add_location(input1, file$b, 261, 8, 7334);
    			attr_dev(td8, "class", "svelte-ycj1m8");
    			add_location(td8, file$b, 261, 4, 7330);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "class", "svelte-ycj1m8");
    			add_location(input2, file$b, 262, 8, 7395);
    			attr_dev(td9, "class", "svelte-ycj1m8");
    			add_location(td9, file$b, 262, 4, 7391);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "class", "svelte-ycj1m8");
    			add_location(input3, file$b, 263, 8, 7484);
    			attr_dev(td10, "class", "svelte-ycj1m8");
    			add_location(td10, file$b, 263, 4, 7480);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "class", "svelte-ycj1m8");
    			add_location(input4, file$b, 264, 8, 7565);
    			attr_dev(td11, "class", "svelte-ycj1m8");
    			add_location(td11, file$b, 264, 4, 7561);
    			attr_dev(td12, "class", "svelte-ycj1m8");
    			add_location(td12, file$b, 265, 4, 7630);
    			attr_dev(td13, "class", "svelte-ycj1m8");
    			add_location(td13, file$b, 266, 4, 7704);
    			attr_dev(tr2, "class", "svelte-ycj1m8");
    			add_location(tr2, file$b, 259, 3, 7267);
    			add_location(tbody, file$b, 257, 2, 7252);
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
    			set_input_value(input0, /*NewSanity*/ ctx[3].country);
    			append_dev(tr2, t12);
    			append_dev(tr2, td8);
    			append_dev(td8, input1);
    			set_input_value(input1, /*NewSanity*/ ctx[3].year);
    			append_dev(tr2, t13);
    			append_dev(tr2, td9);
    			append_dev(td9, input2);
    			set_input_value(input2, /*NewSanity*/ ctx[3].health_expenditure_in_percentage);
    			append_dev(tr2, t14);
    			append_dev(tr2, td10);
    			append_dev(td10, input3);
    			set_input_value(input3, /*NewSanity*/ ctx[3].doctor_per_1000_habitant);
    			append_dev(tr2, t15);
    			append_dev(tr2, td11);
    			append_dev(td11, input4);
    			set_input_value(input4, /*NewSanity*/ ctx[3].hospital_bed);
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
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[24]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[25]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[26]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[27]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[28])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty[0] & /*NewSanity*/ 8 && input0.value !== /*NewSanity*/ ctx[3].country) {
    				set_input_value(input0, /*NewSanity*/ ctx[3].country);
    			}

    			if (dirty[0] & /*NewSanity*/ 8 && to_number(input1.value) !== /*NewSanity*/ ctx[3].year) {
    				set_input_value(input1, /*NewSanity*/ ctx[3].year);
    			}

    			if (dirty[0] & /*NewSanity*/ 8 && to_number(input2.value) !== /*NewSanity*/ ctx[3].health_expenditure_in_percentage) {
    				set_input_value(input2, /*NewSanity*/ ctx[3].health_expenditure_in_percentage);
    			}

    			if (dirty[0] & /*NewSanity*/ 8 && to_number(input3.value) !== /*NewSanity*/ ctx[3].doctor_per_1000_habitant) {
    				set_input_value(input3, /*NewSanity*/ ctx[3].doctor_per_1000_habitant);
    			}

    			if (dirty[0] & /*NewSanity*/ 8 && to_number(input4.value) !== /*NewSanity*/ ctx[3].hospital_bed) {
    				set_input_value(input4, /*NewSanity*/ ctx[3].hospital_bed);
    			}

    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);

    			if (dirty[0] & /*DeleteContact, sanity*/ 2052) {
    				each_value = /*sanity*/ ctx[2];
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
    		id: create_default_slot_9$5.name,
    		type: "slot",
    		source: "(244:1) <Table responsive>",
    		ctx
    	});

    	return block;
    }

    // (288:2) <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
    function create_default_slot_8$5(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/sanity-stats" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[29]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$5.name,
    		type: "slot",
    		source: "(288:2) <PaginationItem class=\\\"{currentPage === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (293:2) {#if currentPage != 1}
    function create_if_block_1$2(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_6$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(293:2) {#if currentPage != 1}",
    		ctx
    	});

    	return block;
    }

    // (295:3) <PaginationLink href="#/sanity-stats" on:click="{() => incrementOffset(-1)}" >
    function create_default_slot_7$5(ctx) {
    	let t_value = /*currentPage*/ ctx[5] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$5.name,
    		type: "slot",
    		source: "(295:3) <PaginationLink href=\\\"#/sanity-stats\\\" on:click=\\\"{() => incrementOffset(-1)}\\\" >",
    		ctx
    	});

    	return block;
    }

    // (294:2) <PaginationItem>
    function create_default_slot_6$5(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				href: "#/sanity-stats",
    				$$slots: { default: [create_default_slot_7$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$5.name,
    		type: "slot",
    		source: "(294:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (299:3) <PaginationLink href="#/sanity-stats" >
    function create_default_slot_5$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*currentPage*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32) set_data_dev(t, /*currentPage*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$5.name,
    		type: "slot",
    		source: "(299:3) <PaginationLink href=\\\"#/sanity-stats\\\" >",
    		ctx
    	});

    	return block;
    }

    // (298:2) <PaginationItem active>
    function create_default_slot_4$6(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				href: "#/sanity-stats",
    				$$slots: { default: [create_default_slot_5$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$6.name,
    		type: "slot",
    		source: "(298:2) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (303:2) {#if moreData}
    function create_if_block$2(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(303:2) {#if moreData}",
    		ctx
    	});

    	return block;
    }

    // (305:3) <PaginationLink href="#/sanity-stats" on:click="{() => incrementOffset(1)}">
    function create_default_slot_3$7(ctx) {
    	let t_value = /*currentPage*/ ctx[5] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$7.name,
    		type: "slot",
    		source: "(305:3) <PaginationLink href=\\\"#/sanity-stats\\\" on:click=\\\"{() => incrementOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (304:2) <PaginationItem >
    function create_default_slot_2$7(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				href: "#/sanity-stats",
    				$$slots: { default: [create_default_slot_3$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$7.name,
    		type: "slot",
    		source: "(304:2) <PaginationItem >",
    		ctx
    	});

    	return block;
    }

    // (309:2) <PaginationItem class="{moreData ? '' : 'disabled'}">
    function create_default_slot_1$7(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/sanity-stats" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[32]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(309:2) <PaginationItem class=\\\"{moreData ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (285:1) <Pagination ariaLabel="Cambiar de página">
    function create_default_slot$9(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let t2;
    	let t3;
    	let paginationitem2;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*currentPage*/ ctx[5] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_8$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*currentPage*/ ctx[5] != 1 && create_if_block_1$2(ctx);

    	paginationitem1 = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_4$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*moreData*/ ctx[6] && create_if_block$2(ctx);

    	paginationitem2 = new PaginationItem({
    			props: {
    				class: /*moreData*/ ctx[6] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(paginationitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(paginationitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*currentPage*/ 32) paginationitem0_changes.class = /*currentPage*/ ctx[5] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 256) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (/*currentPage*/ ctx[5] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentPage*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);

    			if (/*moreData*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*moreData*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const paginationitem2_changes = {};
    			if (dirty[0] & /*moreData*/ 64) paginationitem2_changes.class = /*moreData*/ ctx[6] ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 256) {
    				paginationitem2_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem2.$set(paginationitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(paginationitem1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(paginationitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(paginationitem1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(paginationitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(paginationitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(285:1) <Pagination ariaLabel=\\\"Cambiar de página\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let alert;
    	let t0;
    	let div;
    	let button;
    	let t1;
    	let popover;
    	let t2;
    	let table;
    	let t3;
    	let pagination;
    	let current;

    	alert = new Alert({
    			props: {
    				color: "danger",
    				isOpen: /*visible*/ ctx[0],
    				toggle: /*func*/ ctx[14],
    				$$slots: { default: [create_default_slot_29$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				id: `btn-${placement$1}`,
    				$$slots: { default: [create_default_slot_28$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	popover = new Popover({
    			props: {
    				target: `btn-${placement$1}`,
    				placement: placement$1,
    				title: `Filtros disponibles`,
    				$$slots: { default: [create_default_slot_15$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				responsive: true,
    				$$slots: { default: [create_default_slot_9$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Cambiar de página",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(button.$$.fragment);
    			t1 = space();
    			create_component(popover.$$.fragment);
    			t2 = space();
    			create_component(table.$$.fragment);
    			t3 = space();
    			create_component(pagination.$$.fragment);
    			attr_dev(div, "class", "mt-3");
    			set_style(div, "position", "absolute");
    			set_style(div, "right", "80px");
    			add_location(div, file$b, 192, 2, 4779);
    			add_location(main, file$b, 183, 0, 4657);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			mount_component(button, div, null);
    			append_dev(div, t1);
    			mount_component(popover, div, null);
    			append_dev(main, t2);
    			mount_component(table, main, null);
    			append_dev(main, t3);
    			mount_component(pagination, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_changes = {};
    			if (dirty[0] & /*visible*/ 1) alert_changes.isOpen = /*visible*/ ctx[0];
    			if (dirty[0] & /*visible*/ 1) alert_changes.toggle = /*func*/ ctx[14];

    			if (dirty[0] & /*mensaje*/ 2 | dirty[1] & /*$$scope*/ 256) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const popover_changes = {};

    			if (dirty[0] & /*filterSanity*/ 16 | dirty[1] & /*$$scope*/ 256) {
    				popover_changes.$$scope = { dirty, ctx };
    			}

    			popover.$set(popover_changes);
    			const table_changes = {};

    			if (dirty[0] & /*sanity, NewSanity*/ 12 | dirty[1] & /*$$scope*/ 256) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const pagination_changes = {};

    			if (dirty[0] & /*moreData, currentPage*/ 96 | dirty[1] & /*$$scope*/ 256) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(popover.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(popover.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert);
    			destroy_component(button);
    			destroy_component(popover);
    			destroy_component(table);
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const placement$1 = "right";

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SanityAPI", slots, []);
    	let visible = false;
    	let mensaje = "";
    	let sanity = [];

    	let NewSanity = {
    		"country": "",
    		"year": 0,
    		"health_expenditure_in_percentage": 0,
    		"doctor_per_1000_habitant": 0,
    		"hospital_bed": 0
    	};

    	let filterSanity = {
    		country: "",
    		fromyear: 0,
    		toyear: 0,
    		fromhealth: 0,
    		tohealth: 0,
    		fromdoctor: 0,
    		todoctor: 0,
    		frombed: 0,
    		tobed: 0
    	};

    	///////////////
    	let numeroRecursos = 10;

    	let offset = 0;
    	let currentPage = 1;
    	let moreData = true;

    	function incrementOffset(valor) {
    		$$invalidate(5, currentPage += valor);

    		if (sanity.length < currentPage * numeroRecursos) {
    			$$invalidate(6, moreData = false);
    		}

    		getSanity();
    	}

    	///////////////////
    	async function getFiltro() {
    		console.log("Fetching foodconsumption...");
    		console.log(filterSanity);
    		let offset = (currentPage - 1) * numeroRecursos;
    		let limit = currentPage * numeroRecursos;
    		const res = await fetch("/api/v2/sanity-stats/statistics?country=" + filterSanity.country + "&fromyear=" + filterSanity.fromyear + "&toyear=" + filterSanity.toyear + "&fromhealth=" + filterSanity.fromhealth + "&tohealth=" + filterSanity.tohealth + "&fromdoctor=" + filterSanity.fromdoctor + "&todoctor=" + filterSanity.todoctor + "&frombed=" + filterSanity.frombed + "&tobed=" + filterSanity.tobed + "&offset=" + offset + "&limit=" + limit);

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(2, sanity = json);
    			console.log(`We have ${sanity.length} sanity.`);
    			console.log(JSON.stringify(sanity));
    		} else {
    			console.log("Error!");
    		}
    	}

    	async function SanityData() {
    		console.log("Loading data...");
    		const res = await fetch("/api/v2/sanity-stats/loadInitialData");

    		if (res.ok) {
    			console.log("Ok.");
    			getSanity();
    		} else {
    			console.log("Error");
    		}
    	}

    	async function getSanity() {
    		console.log("Fetching data...");
    		let offset = (currentPage - 1) * numeroRecursos;
    		let limit = currentPage * numeroRecursos;
    		const res = await fetch("/api/v2/sanity-stats?offset=" + offset + "&limit=" + limit);

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(2, sanity = json);
    			console.log(`We have ${sanity.length} Sanity.`);
    		} else {
    			console.log("Error");
    		}

    		if (res.status == 404) {
    			$$invalidate(1, mensaje = "No hemos encontrado ese dato, sorry");
    			$$invalidate(0, visible = true);
    		}

    		if (res.status == 500) {
    			$$invalidate(1, mensaje = "Ups, el server petó, intentalo de nuevo en unos segundos");
    			$$invalidate(0, visible = true);
    		}
    	}

    	async function Delete() {
    		console.log("Fetching data...");

    		await fetch("/api/v2/sanity-stats", { method: "Delete" }).then(res => {
    			if (res.status == 404) {
    				console.log("No hemos encontrado ese dato, sorry");
    				$$invalidate(0, visible = true);
    			}

    			getSanity();
    		});
    	}

    	async function DeleteContact(ContactName, ContactYear) {
    		console.log("Fetching data...");

    		await fetch("/api/v2/sanity-stats/" + ContactName + "/" + ContactYear, { method: "Delete" }).then(res => {
    			if (res.status == 404) {
    				$$invalidate(1, mensaje = "No hemos encontrado ese dato, sorry");
    				$$invalidate(0, visible = true);
    			}

    			getSanity();
    		});
    	}

    	async function PostSanity() {
    		console.log("Fetching data...");

    		await fetch("/api/v2/sanity-stats", {
    			method: "POST",
    			body: JSON.stringify(NewSanity),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			if (res.status == 400) {
    				$$invalidate(1, mensaje = "Campos mal definidos");
    				$$invalidate(0, visible = true);
    			}

    			if (res.status == 409) {
    				$$invalidate(1, mensaje = "Intestas modificar otro dato CUIDAO");
    				$$invalidate(0, visible = true);
    			}

    			getSanity();
    		});
    	}

    	async function PutSanity() {
    		console.log("Fetching data...");

    		await fetch("/api/v2/sanity-stats/" + NewSanity.country + "/" + NewSanity.year, {
    			method: "PUT",
    			body: JSON.stringify(NewSanity),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			if (res.status == 400) {
    				$$invalidate(1, mensaje = "Campos mal definidos");
    				$$invalidate(0, visible = true);
    			}

    			if (res.status == 409) {
    				$$invalidate(1, mensaje = "Intestas modificar otro dato CUIDAO");
    				$$invalidate(0, visible = true);
    			}

    			if (res.status == 404) {
    				$$invalidate(1, mensaje = "No hemos encontrado ese dato, sorry");
    				$$invalidate(0, visible = true);
    			}

    			getSanity();
    		});
    	}

    	onMount(getSanity);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<SanityAPI> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(0, visible = false);

    	function input_input_handler() {
    		filterSanity.country = this.value;
    		$$invalidate(4, filterSanity);
    	}

    	function input_input_handler_1() {
    		filterSanity.fromyear = to_number(this.value);
    		$$invalidate(4, filterSanity);
    	}

    	function input_input_handler_2() {
    		filterSanity.toyear = to_number(this.value);
    		$$invalidate(4, filterSanity);
    	}

    	function input_input_handler_3() {
    		filterSanity.fromhealth = to_number(this.value);
    		$$invalidate(4, filterSanity);
    	}

    	function input_input_handler_4() {
    		filterSanity.tohealth = to_number(this.value);
    		$$invalidate(4, filterSanity);
    	}

    	function input_input_handler_5() {
    		filterSanity.fromdoctor = to_number(this.value);
    		$$invalidate(4, filterSanity);
    	}

    	function input_input_handler_6() {
    		filterSanity.todoctor = to_number(this.value);
    		$$invalidate(4, filterSanity);
    	}

    	function input_input_handler_7() {
    		filterSanity.frombed = to_number(this.value);
    		$$invalidate(4, filterSanity);
    	}

    	function input_input_handler_8() {
    		filterSanity.tobed = to_number(this.value);
    		$$invalidate(4, filterSanity);
    	}

    	function input0_input_handler() {
    		NewSanity.country = this.value;
    		$$invalidate(3, NewSanity);
    	}

    	function input1_input_handler() {
    		NewSanity.year = to_number(this.value);
    		$$invalidate(3, NewSanity);
    	}

    	function input2_input_handler() {
    		NewSanity.health_expenditure_in_percentage = to_number(this.value);
    		$$invalidate(3, NewSanity);
    	}

    	function input3_input_handler() {
    		NewSanity.doctor_per_1000_habitant = to_number(this.value);
    		$$invalidate(3, NewSanity);
    	}

    	function input4_input_handler() {
    		NewSanity.hospital_bed = to_number(this.value);
    		$$invalidate(3, NewSanity);
    	}

    	const click_handler = () => incrementOffset(-1);
    	const click_handler_1 = () => incrementOffset(-1);
    	const click_handler_2 = () => incrementOffset(1);
    	const click_handler_3 = () => incrementOffset(1);

    	$$self.$capture_state = () => ({
    		placement: placement$1,
    		Button,
    		onMount,
    		Table,
    		Alert,
    		Popover,
    		CustomInput,
    		Form,
    		FormGroup,
    		Label,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		visible,
    		mensaje,
    		sanity,
    		NewSanity,
    		filterSanity,
    		numeroRecursos,
    		offset,
    		currentPage,
    		moreData,
    		incrementOffset,
    		getFiltro,
    		SanityData,
    		getSanity,
    		Delete,
    		DeleteContact,
    		PostSanity,
    		PutSanity
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("mensaje" in $$props) $$invalidate(1, mensaje = $$props.mensaje);
    		if ("sanity" in $$props) $$invalidate(2, sanity = $$props.sanity);
    		if ("NewSanity" in $$props) $$invalidate(3, NewSanity = $$props.NewSanity);
    		if ("filterSanity" in $$props) $$invalidate(4, filterSanity = $$props.filterSanity);
    		if ("numeroRecursos" in $$props) numeroRecursos = $$props.numeroRecursos;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("currentPage" in $$props) $$invalidate(5, currentPage = $$props.currentPage);
    		if ("moreData" in $$props) $$invalidate(6, moreData = $$props.moreData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		visible,
    		mensaje,
    		sanity,
    		NewSanity,
    		filterSanity,
    		currentPage,
    		moreData,
    		incrementOffset,
    		getFiltro,
    		SanityData,
    		Delete,
    		DeleteContact,
    		PostSanity,
    		PutSanity,
    		func,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7,
    		input_input_handler_8,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class SanityAPI extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SanityAPI",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/frontend/sanity/HomeSanity.svelte generated by Svelte v3.37.0 */

    const file$a = "src/frontend/sanity/HomeSanity.svelte";

    // (28:6) <BreadcrumbItem>
    function create_default_slot_11$4(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas de Sanidad";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/sanity-stats");
    			add_location(a, file$a, 27, 22, 395);
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
    		id: create_default_slot_11$4.name,
    		type: "slot",
    		source: "(28:6) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (29:4) <BreadcrumbItem active>
    function create_default_slot_10$4(ctx) {
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
    		id: create_default_slot_10$4.name,
    		type: "slot",
    		source: "(29:4) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (27:1) <Breadcrumb>
    function create_default_slot_9$4(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_11$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_10$4] },
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
    		id: create_default_slot_9$4.name,
    		type: "slot",
    		source: "(27:1) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (37:5) <Button outline color="warning" on:click={toggle}>
    function create_default_slot_8$4(ctx) {
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
    		id: create_default_slot_8$4.name,
    		type: "slot",
    		source: "(37:5) <Button outline color=\\\"warning\\\" on:click={toggle}>",
    		ctx
    	});

    	return block;
    }

    // (39:4) <ModalHeader {toggle}>
    function create_default_slot_7$4(ctx) {
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
    		id: create_default_slot_7$4.name,
    		type: "slot",
    		source: "(39:4) <ModalHeader {toggle}>",
    		ctx
    	});

    	return block;
    }

    // (41:5) <ModalBody>
    function create_default_slot_6$4(ctx) {
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
    		id: create_default_slot_6$4.name,
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
    function create_default_slot_4$5(ctx) {
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
    		id: create_default_slot_4$5.name,
    		type: "slot",
    		source: "(45:4) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (38:5) <Modal isOpen={open} {toggle} size="xl">
    function create_default_slot_3$6(ctx) {
    	let modalheader;
    	let t0;
    	let modalbody;
    	let t1;
    	let modalfooter;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle: /*toggle*/ ctx[1],
    				$$slots: { default: [create_default_slot_7$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_6$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalfooter = new ModalFooter({
    			props: {
    				$$slots: { default: [create_default_slot_4$5] },
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
    		id: create_default_slot_3$6.name,
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
    			add_location(a, file$a, 56, 20, 1243);
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
    function create_default_slot$8(ctx) {
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
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(55:1) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
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
    				$$slots: { default: [create_default_slot_9$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_8$4] },
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
    				$$slots: { default: [create_default_slot_3$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb1 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot$8] },
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
    			add_location(strong0, file$a, 24, 2, 331);
    			add_location(h20, file$a, 23, 1, 324);
    			add_location(strong1, file$a, 32, 2, 619);
    			add_location(h21, file$a, 31, 1, 612);
    			add_location(h5, file$a, 34, 1, 662);
    			add_location(strong2, file$a, 51, 2, 1078);
    			add_location(h22, file$a, 50, 1, 1071);
    			attr_dev(main, "class", "svelte-4fr9k");
    			add_location(main, file$a, 20, 0, 303);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeSanity",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/frontend/foodConsumption/EditFood.svelte generated by Svelte v3.37.0 */

    const { console: console_1$4 } = globals;
    const file$9 = "src/frontend/foodConsumption/EditFood.svelte";

    // (111:25) <Button outline  color="primary" on:click={updateFoodconsumption}>
    function create_default_slot_3$5(ctx) {
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
    		id: create_default_slot_3$5.name,
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
    				$$slots: { default: [create_default_slot_3$5] },
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
    			add_location(th0, file$9, 91, 20, 2787);
    			add_location(th1, file$9, 92, 20, 2821);
    			add_location(th2, file$9, 93, 5, 2839);
    			add_location(th3, file$9, 94, 5, 2868);
    			add_location(th4, file$9, 95, 5, 2903);
    			add_location(th5, file$9, 96, 5, 2936);
    			add_location(th6, file$9, 97, 5, 2965);
    			add_location(th7, file$9, 98, 20, 3011);
    			add_location(tr0, file$9, 90, 16, 2762);
    			add_location(thead, file$9, 89, 12, 2738);
    			add_location(td0, file$9, 103, 20, 3132);
    			add_location(td1, file$9, 104, 5, 3163);
    			add_location(td2, file$9, 105, 5, 3191);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$9, 106, 24, 3242);
    			add_location(td3, file$9, 106, 20, 3238);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$9, 107, 9, 3314);
    			add_location(td4, file$9, 107, 5, 3310);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$9, 108, 9, 3384);
    			add_location(td5, file$9, 108, 5, 3380);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$9, 109, 9, 3450);
    			add_location(td6, file$9, 109, 5, 3446);
    			add_location(td7, file$9, 110, 20, 3529);
    			add_location(tr1, file$9, 102, 16, 3107);
    			add_location(tbody, file$9, 101, 12, 3083);
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
    			t = text("Este dato no existe.");
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
    function create_default_slot$7(ctx) {
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
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(124:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
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
    				$$slots: { default: [create_default_slot$7] },
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
    			add_location(br, file$9, 86, 1, 2592);
    			add_location(strong, file$9, 87, 33, 2630);
    			add_location(h3, file$9, 87, 4, 2601);
    			add_location(main, file$9, 84, 0, 2570);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<EditFood> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditFood",
    			options,
    			id: create_fragment$9.name
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

    const file$8 = "src/frontend/Info.svelte";

    // (57:5) <BreadcrumbItem active>
    function create_default_slot_26$1(ctx) {
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
    		id: create_default_slot_26$1.name,
    		type: "slot",
    		source: "(57:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (58:3) <BreadcrumbItem active>
    function create_default_slot_25$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Enlace a Github";
    			attr_dev(a, "href", "https://github.com/AntonioJoseDiaz");
    			add_location(a, file$8, 57, 26, 778);
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
    		id: create_default_slot_25$1.name,
    		type: "slot",
    		source: "(58:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (56:2) <Breadcrumb class="peque">
    function create_default_slot_24$1(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_26$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_25$1] },
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
    		id: create_default_slot_24$1.name,
    		type: "slot",
    		source: "(56:2) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    // (61:5) <BreadcrumbItem active>
    function create_default_slot_23$1(ctx) {
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
    		id: create_default_slot_23$1.name,
    		type: "slot",
    		source: "(61:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (62:3) <BreadcrumbItem active>
    function create_default_slot_22$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Enlace a Github";
    			attr_dev(a, "href", "https://github.com/almgonlop");
    			add_location(a, file$8, 61, 26, 996);
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
    		id: create_default_slot_22$1.name,
    		type: "slot",
    		source: "(62:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (60:2) <Breadcrumb>
    function create_default_slot_21$1(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_23$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_22$1] },
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
    		id: create_default_slot_21$1.name,
    		type: "slot",
    		source: "(60:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (65:5) <BreadcrumbItem active>
    function create_default_slot_20$1(ctx) {
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
    		id: create_default_slot_20$1.name,
    		type: "slot",
    		source: "(65:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (66:3) <BreadcrumbItem active>
    function create_default_slot_19$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Enlace a Github";
    			attr_dev(a, "href", "https://github.com/aliperbol");
    			add_location(a, file$8, 65, 26, 1195);
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
    		id: create_default_slot_19$1.name,
    		type: "slot",
    		source: "(66:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (64:2) <Breadcrumb>
    function create_default_slot_18$1(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_20$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_19$1] },
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
    		id: create_default_slot_18$1.name,
    		type: "slot",
    		source: "(64:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (88:5) <BreadcrumbItem>
    function create_default_slot_17$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas de Sanidad";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/sanity-stats");
    			add_location(a, file$8, 87, 21, 1863);
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
    		id: create_default_slot_17$1.name,
    		type: "slot",
    		source: "(88:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (89:3) <BreadcrumbItem active>
    function create_default_slot_16$1(ctx) {
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
    		id: create_default_slot_16$1.name,
    		type: "slot",
    		source: "(89:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (87:2) <Breadcrumb class="peque">
    function create_default_slot_15$1(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_17$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_16$1] },
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
    		id: create_default_slot_15$1.name,
    		type: "slot",
    		source: "(87:2) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    // (93:5) <BreadcrumbItem>
    function create_default_slot_14$2(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas de Obesidad";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/obesity-stats");
    			add_location(a, file$8, 92, 21, 2113);
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
    		id: create_default_slot_14$2.name,
    		type: "slot",
    		source: "(93:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (94:3) <BreadcrumbItem active>
    function create_default_slot_13$2(ctx) {
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
    		id: create_default_slot_13$2.name,
    		type: "slot",
    		source: "(94:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (92:2) <Breadcrumb>
    function create_default_slot_12$2(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_14$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_13$2] },
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
    		id: create_default_slot_12$2.name,
    		type: "slot",
    		source: "(92:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (97:5) <BreadcrumbItem>
    function create_default_slot_11$3(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas del Consumo de Comida";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/foodconsumption-stats");
    			add_location(a, file$8, 96, 21, 2368);
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
    		source: "(97:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (98:3) <BreadcrumbItem active>
    function create_default_slot_10$3(ctx) {
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
    		id: create_default_slot_10$3.name,
    		type: "slot",
    		source: "(98:3) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (96:2) <Breadcrumb>
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
    		id: create_default_slot_9$3.name,
    		type: "slot",
    		source: "(96:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (109:5) <BreadcrumbItem active>
    function create_default_slot_8$3(ctx) {
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
    		id: create_default_slot_8$3.name,
    		type: "slot",
    		source: "(109:5) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (110:5) <BreadcrumbItem>
    function create_default_slot_7$3(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Sanity_postman";
    			attr_dev(a, "href", "https://documenter.getpostman.com/view/9683594/TzJoE1Qx");
    			add_location(a, file$8, 109, 21, 2773);
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
    		id: create_default_slot_7$3.name,
    		type: "slot",
    		source: "(110:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (108:2) <Breadcrumb class="peque">
    function create_default_slot_6$3(ctx) {
    	let breadcrumbitem0;
    	let t;
    	let breadcrumbitem1;
    	let current;

    	breadcrumbitem0 = new BreadcrumbItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_8$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumbitem1 = new BreadcrumbItem({
    			props: {
    				$$slots: { default: [create_default_slot_7$3] },
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
    		id: create_default_slot_6$3.name,
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
    function create_default_slot_4$4(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Obesity_postman";
    			attr_dev(a, "href", "https://documenter.getpostman.com/view/14950492/TzJoDfvw");
    			add_location(a, file$8, 114, 21, 3001);
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
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(115:5) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (113:2) <Breadcrumb>
    function create_default_slot_3$4(ctx) {
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
    				$$slots: { default: [create_default_slot_4$4] },
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
    		id: create_default_slot_3$4.name,
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
    			add_location(a, file$8, 118, 21, 3237);
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
    function create_default_slot$6(ctx) {
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
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(117:2) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
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
    				$$slots: { default: [create_default_slot_24$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb1 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_21$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb2 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_18$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb3 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot_15$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb4 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_12$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb5 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_9$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb6 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb7 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb8 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot$6] },
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
    			add_location(strong0, file$8, 49, 2, 582);
    			attr_dev(h1, "class", "svelte-1ji5f57");
    			add_location(h1, file$8, 48, 1, 575);
    			add_location(h20, file$8, 51, 1, 618);
    			add_location(ul0, file$8, 54, 1, 646);
    			add_location(h21, file$8, 70, 1, 1302);
    			add_location(p0, file$8, 73, 1, 1343);
    			add_location(strong1, file$8, 77, 2, 1530);
    			attr_dev(a0, "href", "https://github.com/gti-sos/SOS2021-10");
    			add_location(a0, file$8, 77, 33, 1561);
    			add_location(p1, file$8, 76, 1, 1524);
    			add_location(strong2, file$8, 80, 2, 1665);
    			attr_dev(a1, "href", "http://sos2021-10.herokuapp.com");
    			add_location(a1, file$8, 80, 24, 1687);
    			add_location(p2, file$8, 79, 1, 1659);
    			add_location(h22, file$8, 82, 1, 1773);
    			add_location(ul1, file$8, 85, 1, 1808);
    			add_location(h23, file$8, 103, 1, 2609);
    			add_location(ul2, file$8, 106, 1, 2650);
    			attr_dev(div, "class", "position svelte-1ji5f57");
    			add_location(div, file$8, 47, 1, 551);
    			add_location(main, file$8, 41, 0, 528);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/frontend/Landing.svelte generated by Svelte v3.37.0 */
    const file$7 = "src/frontend/Landing.svelte";

    function create_fragment$7(ctx) {
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
    			add_location(h2, file$7, 13, 5, 205);
    			attr_dev(hr, "class", "hr-light");
    			add_location(hr, file$7, 16, 5, 331);
    			attr_dev(a, "href", "#/info");
    			add_location(a, file$7, 20, 10, 501);
    			add_location(h4, file$7, 20, 6, 497);
    			set_style(div0, "background-color", "white");
    			set_style(div0, "border-radius", "5px");
    			set_style(div0, "max-width", "180px");
    			set_style(div0, "max-height", "50px");
    			set_style(div0, "margin", "auto");
    			add_location(div0, file$7, 19, 5, 385);
    			attr_dev(div1, "class", "col-md-10");
    			add_location(div1, file$7, 10, 4, 153);
    			attr_dev(div2, "class", "row d-flex justify-content-center text-center");
    			add_location(div2, file$7, 8, 3, 88);
    			attr_dev(main, "class", "svelte-78my9w");
    			add_location(main, file$7, 4, 1, 60);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Landing",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/frontend/foodConsumption/TableFood.svelte generated by Svelte v3.37.0 */

    const { console: console_1$3 } = globals;
    const file$6 = "src/frontend/foodConsumption/TableFood.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	return child_ctx;
    }

    // (263:3) {#if errorMsg}
    function create_if_block_2(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*errorMsg*/ ctx[2]);
    			set_style(p, "color", "#063257 ");
    			add_location(p, file$6, 263, 16, 7015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*errorMsg*/ 4) set_data_dev(t, /*errorMsg*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(263:3) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (259:2) <Alert    color={color}    isOpen={visible}    toggle={() => (visible = false)}>
    function create_default_slot_29(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[2] && create_if_block_2(ctx);

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
    			if (/*errorMsg*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
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
    		id: create_default_slot_29.name,
    		type: "slot",
    		source: "(259:2) <Alert    color={color}    isOpen={visible}    toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (270:9) <Button id={`btn-${placement}`}>
    function create_default_slot_28(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
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
    		id: create_default_slot_28.name,
    		type: "slot",
    		source: "(270:9) <Button id={`btn-${placement}`}>",
    		ctx
    	});

    	return block;
    }

    // (275:8) <CustomInput               type="checkbox"                id="filtroPais"               label="País" >
    function create_default_slot_27(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$6, 277, 28, 7454);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterFoodconsumption*/ ctx[6].country);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[16]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterFoodconsumption*/ 64 && input.value !== /*filterFoodconsumption*/ ctx[6].country) {
    				set_input_value(input, /*filterFoodconsumption*/ ctx[6].country);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(275:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtroPais\\\"               label=\\\"País\\\" >",
    		ctx
    	});

    	return block;
    }

    // (279:8) <CustomInput               type="checkbox"                id="filtroAnyo"               label="Año" >
    function create_default_slot_26(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$6, 281, 27, 7630);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterFoodconsumption*/ ctx[6].year);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterFoodconsumption*/ 64 && to_number(input.value) !== /*filterFoodconsumption*/ ctx[6].year) {
    				set_input_value(input, /*filterFoodconsumption*/ ctx[6].year);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(279:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtroAnyo\\\"               label=\\\"Año\\\" >",
    		ctx
    	});

    	return block;
    }

    // (288:10) <CustomInput type="select" id="myselect">
    function create_default_slot_25(ctx) {
    	let option0;
    	let t1;
    	let option1;
    	let t3;
    	let option2;
    	let t5;
    	let option3;
    	let t7;
    	let option4;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "Carne";
    			t1 = space();
    			option1 = element("option");
    			option1.textContent = "Huevos y lácteos";
    			t3 = space();
    			option2 = element("option");
    			option2.textContent = "Producido";
    			t5 = space();
    			option3 = element("option");
    			option3.textContent = "Cereales";
    			t7 = space();
    			option4 = element("option");
    			option4.textContent = "Grasas y azúcares";
    			option0.__value = "Meat";
    			option0.value = option0.__value;
    			add_location(option0, file$6, 288, 12, 7914);
    			option1.__value = "DairyAndEggs";
    			option1.value = option1.__value;
    			add_location(option1, file$6, 289, 12, 7962);
    			option2.__value = "Produce";
    			option2.value = option2.__value;
    			add_location(option2, file$6, 290, 12, 8029);
    			option3.__value = "Grain";
    			option3.value = option3.__value;
    			add_location(option3, file$6, 291, 12, 8084);
    			option4.__value = "SugarAndFat";
    			option4.value = option4.__value;
    			add_location(option4, file$6, 292, 12, 8136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, option4, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(option4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(288:10) <CustomInput type=\\\"select\\\" id=\\\"myselect\\\">",
    		ctx
    	});

    	return block;
    }

    // (287:9) <FormGroup>
    function create_default_slot_24(ctx) {
    	let custominput;
    	let current;

    	custominput = new CustomInput({
    			props: {
    				type: "select",
    				id: "myselect",
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(custominput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(custominput, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custominput_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				custominput_changes.$$scope = { dirty, ctx };
    			}

    			custominput.$set(custominput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custominput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custominput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(custominput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(287:9) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (283:8) <CustomInput               type="checkbox"                id="filtroComida"               label="Tipo de comida" >
    function create_default_slot_23(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(283:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtroComida\\\"               label=\\\"Tipo de comida\\\" >",
    		ctx
    	});

    	return block;
    }

    // (297:8) <CustomInput               type="checkbox"                id="filtroCalPer"               label="Calorías por persona mayor que" >
    function create_default_slot_22(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$6, 299, 54, 8402);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterFoodconsumption*/ ctx[6].caloryperperson);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[18]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterFoodconsumption*/ 64 && to_number(input.value) !== /*filterFoodconsumption*/ ctx[6].caloryperperson) {
    				set_input_value(input, /*filterFoodconsumption*/ ctx[6].caloryperperson);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(297:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtroCalPer\\\"               label=\\\"Calorías por persona mayor que\\\" >",
    		ctx
    	});

    	return block;
    }

    // (301:8) <CustomInput               type="checkbox"                id="filtroGramPer"               label="Gramos por persona mayor que" >
    function create_default_slot_21(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$6, 303, 52, 8626);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterFoodconsumption*/ ctx[6].gramperperson);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_3*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterFoodconsumption*/ 64 && to_number(input.value) !== /*filterFoodconsumption*/ ctx[6].gramperperson) {
    				set_input_value(input, /*filterFoodconsumption*/ ctx[6].gramperperson);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(301:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtroGramPer\\\"               label=\\\"Gramos por persona mayor que\\\" >",
    		ctx
    	});

    	return block;
    }

    // (305:8) <CustomInput               type="checkbox"                id="filtroGramDia"               label="Gramos diarios mayor que" >
    function create_default_slot_20(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$6, 307, 48, 8844);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterFoodconsumption*/ ctx[6].dailygram);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_4*/ ctx[20]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterFoodconsumption*/ 64 && to_number(input.value) !== /*filterFoodconsumption*/ ctx[6].dailygram) {
    				set_input_value(input, /*filterFoodconsumption*/ ctx[6].dailygram);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(305:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtroGramDia\\\"               label=\\\"Gramos diarios mayor que\\\" >",
    		ctx
    	});

    	return block;
    }

    // (309:8) <CustomInput               type="checkbox"                id="filtroCalDia"               label="Calorías diarias mayor que" >
    function create_default_slot_19(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "svelte-ycj1m8");
    			add_location(input, file$6, 311, 50, 9059);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterFoodconsumption*/ ctx[6].dailycalory);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_5*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterFoodconsumption*/ 64 && to_number(input.value) !== /*filterFoodconsumption*/ ctx[6].dailycalory) {
    				set_input_value(input, /*filterFoodconsumption*/ ctx[6].dailycalory);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(309:8) <CustomInput               type=\\\"checkbox\\\"                id=\\\"filtroCalDia\\\"               label=\\\"Calorías diarias mayor que\\\" >",
    		ctx
    	});

    	return block;
    }

    // (314:8) <Button on:click={getFiltro}>
    function create_default_slot_18(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Filtrar");
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
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(314:8) <Button on:click={getFiltro}>",
    		ctx
    	});

    	return block;
    }

    // (315:8) <Button outline color="secondary" on:click="{getFoodconsumption}">
    function create_default_slot_17(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
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
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(315:8) <Button outline color=\\\"secondary\\\" on:click=\\\"{getFoodconsumption}\\\">",
    		ctx
    	});

    	return block;
    }

    // (273:10) <FormGroup>
    function create_default_slot_16(ctx) {
    	let custominput0;
    	let t0;
    	let custominput1;
    	let t1;
    	let custominput2;
    	let t2;
    	let custominput3;
    	let t3;
    	let custominput4;
    	let t4;
    	let custominput5;
    	let t5;
    	let custominput6;
    	let t6;
    	let br;
    	let t7;
    	let button0;
    	let t8;
    	let button1;
    	let current;

    	custominput0 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroPais",
    				label: "País",
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput1 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroAnyo",
    				label: "Año",
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput2 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroComida",
    				label: "Tipo de comida",
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput3 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroCalPer",
    				label: "Calorías por persona mayor que",
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput4 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroGramPer",
    				label: "Gramos por persona mayor que",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput5 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroGramDia",
    				label: "Gramos diarios mayor que",
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custominput6 = new CustomInput({
    			props: {
    				type: "checkbox",
    				id: "filtroCalDia",
    				label: "Calorías diarias mayor que",
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*getFiltro*/ ctx[10]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*getFoodconsumption*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(custominput0.$$.fragment);
    			t0 = space();
    			create_component(custominput1.$$.fragment);
    			t1 = space();
    			create_component(custominput2.$$.fragment);
    			t2 = space();
    			create_component(custominput3.$$.fragment);
    			t3 = space();
    			create_component(custominput4.$$.fragment);
    			t4 = space();
    			create_component(custominput5.$$.fragment);
    			t5 = space();
    			create_component(custominput6.$$.fragment);
    			t6 = space();
    			br = element("br");
    			t7 = space();
    			create_component(button0.$$.fragment);
    			t8 = space();
    			create_component(button1.$$.fragment);
    			add_location(br, file$6, 312, 8, 9150);
    		},
    		m: function mount(target, anchor) {
    			mount_component(custominput0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(custominput1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(custominput2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(custominput3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(custominput4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(custominput5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(custominput6, target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custominput0_changes = {};

    			if (dirty[0] & /*filterFoodconsumption*/ 64 | dirty[1] & /*$$scope*/ 1024) {
    				custominput0_changes.$$scope = { dirty, ctx };
    			}

    			custominput0.$set(custominput0_changes);
    			const custominput1_changes = {};

    			if (dirty[0] & /*filterFoodconsumption*/ 64 | dirty[1] & /*$$scope*/ 1024) {
    				custominput1_changes.$$scope = { dirty, ctx };
    			}

    			custominput1.$set(custominput1_changes);
    			const custominput2_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				custominput2_changes.$$scope = { dirty, ctx };
    			}

    			custominput2.$set(custominput2_changes);
    			const custominput3_changes = {};

    			if (dirty[0] & /*filterFoodconsumption*/ 64 | dirty[1] & /*$$scope*/ 1024) {
    				custominput3_changes.$$scope = { dirty, ctx };
    			}

    			custominput3.$set(custominput3_changes);
    			const custominput4_changes = {};

    			if (dirty[0] & /*filterFoodconsumption*/ 64 | dirty[1] & /*$$scope*/ 1024) {
    				custominput4_changes.$$scope = { dirty, ctx };
    			}

    			custominput4.$set(custominput4_changes);
    			const custominput5_changes = {};

    			if (dirty[0] & /*filterFoodconsumption*/ 64 | dirty[1] & /*$$scope*/ 1024) {
    				custominput5_changes.$$scope = { dirty, ctx };
    			}

    			custominput5.$set(custominput5_changes);
    			const custominput6_changes = {};

    			if (dirty[0] & /*filterFoodconsumption*/ 64 | dirty[1] & /*$$scope*/ 1024) {
    				custominput6_changes.$$scope = { dirty, ctx };
    			}

    			custominput6.$set(custominput6_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custominput0.$$.fragment, local);
    			transition_in(custominput1.$$.fragment, local);
    			transition_in(custominput2.$$.fragment, local);
    			transition_in(custominput3.$$.fragment, local);
    			transition_in(custominput4.$$.fragment, local);
    			transition_in(custominput5.$$.fragment, local);
    			transition_in(custominput6.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custominput0.$$.fragment, local);
    			transition_out(custominput1.$$.fragment, local);
    			transition_out(custominput2.$$.fragment, local);
    			transition_out(custominput3.$$.fragment, local);
    			transition_out(custominput4.$$.fragment, local);
    			transition_out(custominput5.$$.fragment, local);
    			transition_out(custominput6.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(custominput0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(custominput1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(custominput2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(custominput3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(custominput4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(custominput5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(custominput6, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t7);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(273:10) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (272:7) <Form>
    function create_default_slot_15(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty[0] & /*filterFoodconsumption*/ 64 | dirty[1] & /*$$scope*/ 1024) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(272:7) <Form>",
    		ctx
    	});

    	return block;
    }

    // (271:9) <Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
    function create_default_slot_14$1(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};

    			if (dirty[0] & /*filterFoodconsumption*/ 64 | dirty[1] & /*$$scope*/ 1024) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(271:9) <Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>",
    		ctx
    	});

    	return block;
    }

    // (323:9) <Button on:click={loadInitialData}>
    function create_default_slot_13$1(ctx) {
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
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(323:9) <Button on:click={loadInitialData}>",
    		ctx
    	});

    	return block;
    }

    // (324:9) <Button on:click={deleteTodo}>
    function create_default_slot_12$1(ctx) {
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
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(324:9) <Button on:click={deleteTodo}>",
    		ctx
    	});

    	return block;
    }

    // (349:9) <Button on:click={insertFoodconsumption}>
    function create_default_slot_11$2(ctx) {
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
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(349:9) <Button on:click={insertFoodconsumption}>",
    		ctx
    	});

    	return block;
    }

    // (362:9) <Button on:click={deleteFood(datafood.country,datafood.year, datafood.foodtype )}>
    function create_default_slot_10$2(ctx) {
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
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(362:9) <Button on:click={deleteFood(datafood.country,datafood.year, datafood.foodtype )}>",
    		ctx
    	});

    	return block;
    }

    // (352:4) {#each foodconsumption as datafood}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*datafood*/ ctx[38].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*datafood*/ ctx[38].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*datafood*/ ctx[38].foodtype + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*datafood*/ ctx[38].caloryperperson + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*datafood*/ ctx[38].gramperperson + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*datafood*/ ctx[38].dailygram + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12_value = /*datafood*/ ctx[38].dailycalory + "";
    	let t12;
    	let t13;
    	let td7;
    	let button;
    	let t14;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteFood*/ ctx[13](/*datafood*/ ctx[38].country, /*datafood*/ ctx[38].year, /*datafood*/ ctx[38].foodtype))) /*deleteFood*/ ctx[13](/*datafood*/ ctx[38].country, /*datafood*/ ctx[38].year, /*datafood*/ ctx[38].foodtype).apply(this, arguments);
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
    			attr_dev(a, "href", a_href_value = "#/foodconsumption-stats/" + /*datafood*/ ctx[38].country + "/" + /*datafood*/ ctx[38].year + "/" + /*datafood*/ ctx[38].foodtype);
    			add_location(a, file$6, 354, 9, 10483);
    			attr_dev(td0, "class", "svelte-ycj1m8");
    			add_location(td0, file$6, 354, 5, 10479);
    			attr_dev(td1, "class", "svelte-ycj1m8");
    			add_location(td1, file$6, 355, 5, 10601);
    			attr_dev(td2, "class", "svelte-ycj1m8");
    			add_location(td2, file$6, 356, 5, 10631);
    			attr_dev(td3, "class", "svelte-ycj1m8");
    			add_location(td3, file$6, 357, 5, 10665);
    			attr_dev(td4, "class", "svelte-ycj1m8");
    			add_location(td4, file$6, 358, 5, 10706);
    			attr_dev(td5, "class", "svelte-ycj1m8");
    			add_location(td5, file$6, 359, 5, 10745);
    			attr_dev(td6, "class", "svelte-ycj1m8");
    			add_location(td6, file$6, 360, 5, 10780);
    			attr_dev(td7, "class", "svelte-ycj1m8");
    			add_location(td7, file$6, 361, 5, 10817);
    			attr_dev(tr, "class", "svelte-ycj1m8");
    			add_location(tr, file$6, 352, 5, 10468);
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
    			if ((!current || dirty[0] & /*foodconsumption*/ 1) && t0_value !== (t0_value = /*datafood*/ ctx[38].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*foodconsumption*/ 1 && a_href_value !== (a_href_value = "#/foodconsumption-stats/" + /*datafood*/ ctx[38].country + "/" + /*datafood*/ ctx[38].year + "/" + /*datafood*/ ctx[38].foodtype)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*foodconsumption*/ 1) && t2_value !== (t2_value = /*datafood*/ ctx[38].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*foodconsumption*/ 1) && t4_value !== (t4_value = /*datafood*/ ctx[38].foodtype + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*foodconsumption*/ 1) && t6_value !== (t6_value = /*datafood*/ ctx[38].caloryperperson + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*foodconsumption*/ 1) && t8_value !== (t8_value = /*datafood*/ ctx[38].gramperperson + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty[0] & /*foodconsumption*/ 1) && t10_value !== (t10_value = /*datafood*/ ctx[38].dailygram + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty[0] & /*foodconsumption*/ 1) && t12_value !== (t12_value = /*datafood*/ ctx[38].dailycalory + "")) set_data_dev(t12, t12_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
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
    		source: "(352:4) {#each foodconsumption as datafood}",
    		ctx
    	});

    	return block;
    }

    // (320:2) <Table responsive>
    function create_default_slot_9$2(ctx) {
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
    				$$slots: { default: [create_default_slot_13$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadInitialData*/ ctx[11]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteTodo*/ ctx[14]);

    	button2 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*insertFoodconsumption*/ ctx[12]);
    	let each_value = /*foodconsumption*/ ctx[0];
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
    			add_location(td0, file$6, 322, 5, 9414);
    			attr_dev(td1, "class", "svelte-ycj1m8");
    			add_location(td1, file$6, 323, 5, 9485);
    			attr_dev(tr0, "class", "svelte-ycj1m8");
    			add_location(tr0, file$6, 321, 4, 9404);
    			attr_dev(td2, "class", "svelte-ycj1m8");
    			add_location(td2, file$6, 328, 5, 9582);
    			attr_dev(td3, "class", "svelte-ycj1m8");
    			add_location(td3, file$6, 329, 5, 9601);
    			attr_dev(td4, "class", "svelte-ycj1m8");
    			add_location(td4, file$6, 330, 5, 9619);
    			attr_dev(td5, "class", "svelte-ycj1m8");
    			add_location(td5, file$6, 331, 5, 9648);
    			attr_dev(td6, "class", "svelte-ycj1m8");
    			add_location(td6, file$6, 332, 5, 9683);
    			attr_dev(td7, "class", "svelte-ycj1m8");
    			add_location(td7, file$6, 333, 5, 9716);
    			attr_dev(td8, "class", "svelte-ycj1m8");
    			add_location(td8, file$6, 334, 5, 9745);
    			attr_dev(tr1, "class", "svelte-ycj1m8");
    			add_location(tr1, file$6, 327, 4, 9572);
    			add_location(thead, file$6, 320, 3, 9392);
    			attr_dev(input0, "class", "svelte-ycj1m8");
    			add_location(input0, file$6, 341, 9, 9824);
    			attr_dev(td9, "class", "svelte-ycj1m8");
    			add_location(td9, file$6, 341, 5, 9820);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-ycj1m8");
    			add_location(input1, file$6, 342, 9, 9888);
    			attr_dev(td10, "class", "svelte-ycj1m8");
    			add_location(td10, file$6, 342, 5, 9884);
    			attr_dev(input2, "class", "svelte-ycj1m8");
    			add_location(input2, file$6, 343, 9, 9961);
    			attr_dev(td11, "class", "svelte-ycj1m8");
    			add_location(td11, file$6, 343, 5, 9957);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "class", "svelte-ycj1m8");
    			add_location(input3, file$6, 344, 9, 10026);
    			attr_dev(td12, "class", "svelte-ycj1m8");
    			add_location(td12, file$6, 344, 5, 10022);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "class", "svelte-ycj1m8");
    			add_location(input4, file$6, 345, 9, 10110);
    			attr_dev(td13, "class", "svelte-ycj1m8");
    			add_location(td13, file$6, 345, 5, 10106);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "class", "svelte-ycj1m8");
    			add_location(input5, file$6, 346, 9, 10192);
    			attr_dev(td14, "class", "svelte-ycj1m8");
    			add_location(td14, file$6, 346, 5, 10188);
    			attr_dev(input6, "type", "number");
    			attr_dev(input6, "class", "svelte-ycj1m8");
    			add_location(input6, file$6, 347, 9, 10270);
    			attr_dev(td15, "class", "svelte-ycj1m8");
    			add_location(td15, file$6, 347, 5, 10266);
    			attr_dev(td16, "class", "svelte-ycj1m8");
    			add_location(td16, file$6, 348, 5, 10346);
    			attr_dev(tr2, "class", "svelte-ycj1m8");
    			add_location(tr2, file$6, 340, 4, 9810);
    			add_location(tbody, file$6, 338, 3, 9797);
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
    			set_input_value(input0, /*newFoodconsumption*/ ctx[4].country);
    			append_dev(tr2, t16);
    			append_dev(tr2, td10);
    			append_dev(td10, input1);
    			set_input_value(input1, /*newFoodconsumption*/ ctx[4].year);
    			append_dev(tr2, t17);
    			append_dev(tr2, td11);
    			append_dev(td11, input2);
    			set_input_value(input2, /*newFoodconsumption*/ ctx[4].foodtype);
    			append_dev(tr2, t18);
    			append_dev(tr2, td12);
    			append_dev(td12, input3);
    			set_input_value(input3, /*newFoodconsumption*/ ctx[4].caloryperperson);
    			append_dev(tr2, t19);
    			append_dev(tr2, td13);
    			append_dev(td13, input4);
    			set_input_value(input4, /*newFoodconsumption*/ ctx[4].gramperperson);
    			append_dev(tr2, t20);
    			append_dev(tr2, td14);
    			append_dev(td14, input5);
    			set_input_value(input5, /*newFoodconsumption*/ ctx[4].dailygram);
    			append_dev(tr2, t21);
    			append_dev(tr2, td15);
    			append_dev(td15, input6);
    			set_input_value(input6, /*newFoodconsumption*/ ctx[4].dailycalory);
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
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[22]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[23]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[24]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[25]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[26]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[27]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[28])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty[0] & /*newFoodconsumption*/ 16 && input0.value !== /*newFoodconsumption*/ ctx[4].country) {
    				set_input_value(input0, /*newFoodconsumption*/ ctx[4].country);
    			}

    			if (dirty[0] & /*newFoodconsumption*/ 16 && to_number(input1.value) !== /*newFoodconsumption*/ ctx[4].year) {
    				set_input_value(input1, /*newFoodconsumption*/ ctx[4].year);
    			}

    			if (dirty[0] & /*newFoodconsumption*/ 16 && input2.value !== /*newFoodconsumption*/ ctx[4].foodtype) {
    				set_input_value(input2, /*newFoodconsumption*/ ctx[4].foodtype);
    			}

    			if (dirty[0] & /*newFoodconsumption*/ 16 && to_number(input3.value) !== /*newFoodconsumption*/ ctx[4].caloryperperson) {
    				set_input_value(input3, /*newFoodconsumption*/ ctx[4].caloryperperson);
    			}

    			if (dirty[0] & /*newFoodconsumption*/ 16 && to_number(input4.value) !== /*newFoodconsumption*/ ctx[4].gramperperson) {
    				set_input_value(input4, /*newFoodconsumption*/ ctx[4].gramperperson);
    			}

    			if (dirty[0] & /*newFoodconsumption*/ 16 && to_number(input5.value) !== /*newFoodconsumption*/ ctx[4].dailygram) {
    				set_input_value(input5, /*newFoodconsumption*/ ctx[4].dailygram);
    			}

    			if (dirty[0] & /*newFoodconsumption*/ 16 && to_number(input6.value) !== /*newFoodconsumption*/ ctx[4].dailycalory) {
    				set_input_value(input6, /*newFoodconsumption*/ ctx[4].dailycalory);
    			}

    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);

    			if (dirty[0] & /*deleteFood, foodconsumption*/ 8193) {
    				each_value = /*foodconsumption*/ ctx[0];
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
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(320:2) <Table responsive>",
    		ctx
    	});

    	return block;
    }

    // (372:2) <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
    function create_default_slot_8$2(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/foodconsumption-stats"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[29]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(372:2) <PaginationItem class=\\\"{currentPage === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (377:2) {#if currentPage != 1}
    function create_if_block_1$1(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 1024) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(377:2) {#if currentPage != 1}",
    		ctx
    	});

    	return block;
    }

    // (379:3) <PaginationLink href="#/foodconsumption-stats" on:click="{() => incrementOffset(-1)}" >
    function create_default_slot_7$2(ctx) {
    	let t_value = /*currentPage*/ ctx[5] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(379:3) <PaginationLink href=\\\"#/foodconsumption-stats\\\" on:click=\\\"{() => incrementOffset(-1)}\\\" >",
    		ctx
    	});

    	return block;
    }

    // (378:2) <PaginationItem>
    function create_default_slot_6$2(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				href: "#/foodconsumption-stats",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 1024) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(378:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (383:3) <PaginationLink href="#/foodconsumption-stats" >
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*currentPage*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32) set_data_dev(t, /*currentPage*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(383:3) <PaginationLink href=\\\"#/foodconsumption-stats\\\" >",
    		ctx
    	});

    	return block;
    }

    // (382:2) <PaginationItem active>
    function create_default_slot_4$3(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				href: "#/foodconsumption-stats",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 1024) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(382:2) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (387:2) {#if moreData}
    function create_if_block$1(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 1024) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(387:2) {#if moreData}",
    		ctx
    	});

    	return block;
    }

    // (389:3) <PaginationLink href="#/foodconsumption-stats" on:click="{() => incrementOffset(1)}">
    function create_default_slot_3$3(ctx) {
    	let t_value = /*currentPage*/ ctx[5] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(389:3) <PaginationLink href=\\\"#/foodconsumption-stats\\\" on:click=\\\"{() => incrementOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (388:2) <PaginationItem >
    function create_default_slot_2$3(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				href: "#/foodconsumption-stats",
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 1024) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(388:2) <PaginationItem >",
    		ctx
    	});

    	return block;
    }

    // (393:2) <PaginationItem class="{moreData ? '' : 'disabled'}">
    function create_default_slot_1$3(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: {
    				next: true,
    				href: "#/foodconsumption-stats"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[32]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(393:2) <PaginationItem class=\\\"{moreData ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (369:2) <Pagination ariaLabel="Cambiar de página">
    function create_default_slot$5(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let t2;
    	let t3;
    	let paginationitem2;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*currentPage*/ ctx[5] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*currentPage*/ ctx[5] != 1 && create_if_block_1$1(ctx);

    	paginationitem1 = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*moreData*/ ctx[7] && create_if_block$1(ctx);

    	paginationitem2 = new PaginationItem({
    			props: {
    				class: /*moreData*/ ctx[7] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(paginationitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(paginationitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*currentPage*/ 32) paginationitem0_changes.class = /*currentPage*/ ctx[5] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 1024) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (/*currentPage*/ ctx[5] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentPage*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 1024) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    			if (/*moreData*/ ctx[7]) if_block1.p(ctx, dirty);
    			const paginationitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				paginationitem2_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem2.$set(paginationitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(paginationitem1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(paginationitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(paginationitem1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(paginationitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(paginationitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(369:2) <Pagination ariaLabel=\\\"Cambiar de página\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let main;
    	let alert;
    	let t0;
    	let div;
    	let button;
    	let t1;
    	let popover;
    	let t2;
    	let table;
    	let t3;
    	let pagination;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[3],
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[15],
    				$$slots: { default: [create_default_slot_29] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				id: `btn-${placement}`,
    				$$slots: { default: [create_default_slot_28] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	popover = new Popover({
    			props: {
    				target: `btn-${placement}`,
    				placement,
    				title: `Filtros disponibles`,
    				$$slots: { default: [create_default_slot_14$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				responsive: true,
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Cambiar de página",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(button.$$.fragment);
    			t1 = space();
    			create_component(popover.$$.fragment);
    			t2 = space();
    			create_component(table.$$.fragment);
    			t3 = space();
    			create_component(pagination.$$.fragment);
    			attr_dev(div, "class", "mt-3");
    			set_style(div, "position", "absolute");
    			set_style(div, "right", "80px");
    			add_location(div, file$6, 268, 2, 7092);
    			add_location(main, file$6, 256, 0, 6889);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			mount_component(button, div, null);
    			append_dev(div, t1);
    			mount_component(popover, div, null);
    			append_dev(main, t2);
    			mount_component(table, main, null);
    			append_dev(main, t3);
    			mount_component(pagination, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_changes = {};
    			if (dirty[0] & /*color*/ 8) alert_changes.color = /*color*/ ctx[3];
    			if (dirty[0] & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty[0] & /*visible*/ 2) alert_changes.toggle = /*func*/ ctx[15];

    			if (dirty[0] & /*errorMsg*/ 4 | dirty[1] & /*$$scope*/ 1024) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const popover_changes = {};

    			if (dirty[0] & /*filterFoodconsumption*/ 64 | dirty[1] & /*$$scope*/ 1024) {
    				popover_changes.$$scope = { dirty, ctx };
    			}

    			popover.$set(popover_changes);
    			const table_changes = {};

    			if (dirty[0] & /*foodconsumption, newFoodconsumption*/ 17 | dirty[1] & /*$$scope*/ 1024) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const pagination_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 1024) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(popover.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(popover.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert);
    			destroy_component(button);
    			destroy_component(popover);
    			destroy_component(table);
    			destroy_component(pagination);
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

    const placement = "right";

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TableFood", slots, []);
    	let open = false;

    	const toggle = () => {
    		open = !open;
    	};

    	let foodconsumption = [];
    	let visible = false;
    	let errorMsg = "";
    	let color = "";

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
    	let numeroRecursos = 10;
    	let offset = 0;
    	let currentPage = 1;
    	let moreData = true;

    	function incrementOffset(valor) {
    		offset += valor;
    		$$invalidate(5, currentPage += valor);
    		getSanity();
    	}

    	async function getFoodconsumption() {
    		let offset = (currentPage - 1) * numeroRecursos;
    		console.log("Fetching foodconsumption...");
    		const res = await fetch("/api/v1/foodconsumption-stats?offset=" + offset + "&limit=10");

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

    	let filterFoodconsumption = {
    		country: "",
    		year: 0,
    		foodtype: "",
    		caloryperperson: 0,
    		gramperperson: 0,
    		dailygram: 0,
    		dailycalory: 0
    	};

    	async function getFiltro() {
    		let offset = (currentPage - 1) * numeroRecursos;
    		let dbquery = "?offset=" + offset + "&limit=10";
    		var e = document.getElementById("myselect");
    		var tipocomida = e.options[e.selectedIndex].value;

    		if (document.getElementById("filtroPais").checked) {
    			dbquery += `country=${filterFoodconsumption.country}`;

    			if (document.getElementById("filtroAnyo").checked || document.getElementById("filtroComida").checked || document.getElementById("filtroCalPer").checked || document.getElementById("filtroGramPer").checked || document.getElementById("filtroGramDia").checked || document.getElementById("filtroCalDia").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroAnyo").checked) {
    			dbquery += `year=${filterFoodconsumption.year}`;

    			if (document.getElementById("filtroComida").checked || document.getElementById("filtroCalPer").checked || document.getElementById("filtroGramPer").checked || document.getElementById("filtroGramDia").checked || document.getElementById("filtroCalDia").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroComida").checked) {
    			dbquery += `footype=${tipocomida}`;

    			if (document.getElementById("filtroCalPer").checked || document.getElementById("filtroGramPer").checked || document.getElementById("filtroGramDia").checked || document.getElementById("filtroCalDia").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroCalPer").checked) {
    			dbquery += `caloryperpersonAbove=${filterFoodconsumption.caloryperperson}`;

    			if (document.getElementById("filtroGramPer").checked || document.getElementById("filtroGramDia").checked || document.getElementById("filtroCalDia").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroGramPer").checked) {
    			dbquery += `gramperpersonAbove=${filterFoodconsumption.gramperperson}`;

    			if (document.getElementById("filtroGramDia").checked || document.getElementById("filtroCalDia").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroGramDia").checked) {
    			dbquery += `dailygramAbove=${filterFoodconsumption.dailygram}`;

    			if (document.getElementById("filtroCalDia").checked) {
    				dbquery += `&`;
    			}
    		}

    		if (document.getElementById("filtroCalDia").checked) {
    			dbquery += `dailycaloryAbove=${filterFoodconsumption.dailycalory}`;
    		}

    		const res = await fetch("/api/v1/foodconsumption-stats" + dbquery);

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(0, foodconsumption = json);
    			console.log(`We have ${foodconsumption.length} foodconsumption.`);
    			console.log(JSON.stringify(foodconsumption));
    			$$invalidate(2, errorMsg = "Datos filtrados correctamente.");
    			$$invalidate(1, visible = true);
    			$$invalidate(3, color = "success");
    		} else {
    			if (res.status === 404) {
    				$$invalidate(2, errorMsg = "ERROR: No se encuentran tales datos.");
    				$$invalidate(1, visible = true);
    				$$invalidate(3, color = "danger");
    			}

    			console.log("Error!");
    		}
    	}

    	async function loadInitialData() {
    		console.log("Fetching foodconsumption...");

    		await fetch("/api/v1/foodconsumption-stats/loadInitialData").then(res => {
    			getFoodconsumption();

    			if (res.ok) {
    				$$invalidate(2, errorMsg = "Datos cargados correctamente.");
    				$$invalidate(1, visible = true);
    				$$invalidate(3, color = "success");
    			}
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
    				$$invalidate(2, errorMsg = "ERROR: Algunos campos en el dato están mal formados.");
    				$$invalidate(1, visible = true);
    				$$invalidate(3, color = "danger");
    			} else if (res.status === 409) {
    				$$invalidate(2, errorMsg = "ERROR: Este dato ya existe.");
    				$$invalidate(1, visible = true);
    				$$invalidate(3, color = "danger");
    			} else if (res.ok) {
    				$$invalidate(2, errorMsg = "El dato ha sido añadido correctamente.");
    				$$invalidate(1, visible = true);
    				$$invalidate(3, color = "success");
    			}
    		});
    	}

    	async function deleteFood(country, year, foodtype) {
    		console.log("Deleting foodconsumption with country " + JSON.stringify(country) + " year " + JSON.stringify(year) + " and foodtype " + JSON.stringify(foodtype));

    		await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats/" + country + "/" + year + "/" + foodtype, { method: "DELETE" }).then(res => {
    			getFoodconsumption();

    			if (res.ok) {
    				$$invalidate(2, errorMsg = "El dato ha sido eliminado correctamente.");
    				$$invalidate(1, visible = true);
    				$$invalidate(3, color = "success");
    			}
    		});
    	}

    	async function deleteTodo() {
    		await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats", { method: "DELETE" }).then(res => {
    			getFoodconsumption();

    			if (res.ok) {
    				$$invalidate(2, errorMsg = "Base de datos eliminada correctamente.");
    				$$invalidate(1, visible = true);
    				$$invalidate(3, color = "success");
    			}
    		});
    	}

    	onMount(getFoodconsumption);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<TableFood> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input_input_handler() {
    		filterFoodconsumption.country = this.value;
    		$$invalidate(6, filterFoodconsumption);
    	}

    	function input_input_handler_1() {
    		filterFoodconsumption.year = to_number(this.value);
    		$$invalidate(6, filterFoodconsumption);
    	}

    	function input_input_handler_2() {
    		filterFoodconsumption.caloryperperson = to_number(this.value);
    		$$invalidate(6, filterFoodconsumption);
    	}

    	function input_input_handler_3() {
    		filterFoodconsumption.gramperperson = to_number(this.value);
    		$$invalidate(6, filterFoodconsumption);
    	}

    	function input_input_handler_4() {
    		filterFoodconsumption.dailygram = to_number(this.value);
    		$$invalidate(6, filterFoodconsumption);
    	}

    	function input_input_handler_5() {
    		filterFoodconsumption.dailycalory = to_number(this.value);
    		$$invalidate(6, filterFoodconsumption);
    	}

    	function input0_input_handler() {
    		newFoodconsumption.country = this.value;
    		$$invalidate(4, newFoodconsumption);
    	}

    	function input1_input_handler() {
    		newFoodconsumption.year = to_number(this.value);
    		$$invalidate(4, newFoodconsumption);
    	}

    	function input2_input_handler() {
    		newFoodconsumption.foodtype = this.value;
    		$$invalidate(4, newFoodconsumption);
    	}

    	function input3_input_handler() {
    		newFoodconsumption.caloryperperson = to_number(this.value);
    		$$invalidate(4, newFoodconsumption);
    	}

    	function input4_input_handler() {
    		newFoodconsumption.gramperperson = to_number(this.value);
    		$$invalidate(4, newFoodconsumption);
    	}

    	function input5_input_handler() {
    		newFoodconsumption.dailygram = to_number(this.value);
    		$$invalidate(4, newFoodconsumption);
    	}

    	function input6_input_handler() {
    		newFoodconsumption.dailycalory = to_number(this.value);
    		$$invalidate(4, newFoodconsumption);
    	}

    	const click_handler = () => incrementOffset(-1);
    	const click_handler_1 = () => incrementOffset(-1);
    	const click_handler_2 = () => incrementOffset(1);
    	const click_handler_3 = () => incrementOffset(1);

    	$$self.$capture_state = () => ({
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		pop,
    		placement,
    		onMount,
    		open,
    		toggle,
    		Table,
    		foodconsumption,
    		Button,
    		Alert,
    		Popover,
    		CustomInput,
    		Form,
    		FormGroup,
    		Label,
    		visible,
    		errorMsg,
    		color,
    		newFoodconsumption,
    		BASE_CONTACT_API_PATH,
    		numeroRecursos,
    		offset,
    		currentPage,
    		moreData,
    		incrementOffset,
    		getFoodconsumption,
    		filterFoodconsumption,
    		getFiltro,
    		loadInitialData,
    		insertFoodconsumption,
    		deleteFood,
    		deleteTodo
    	});

    	$$self.$inject_state = $$props => {
    		if ("open" in $$props) open = $$props.open;
    		if ("foodconsumption" in $$props) $$invalidate(0, foodconsumption = $$props.foodconsumption);
    		if ("visible" in $$props) $$invalidate(1, visible = $$props.visible);
    		if ("errorMsg" in $$props) $$invalidate(2, errorMsg = $$props.errorMsg);
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    		if ("newFoodconsumption" in $$props) $$invalidate(4, newFoodconsumption = $$props.newFoodconsumption);
    		if ("BASE_CONTACT_API_PATH" in $$props) BASE_CONTACT_API_PATH = $$props.BASE_CONTACT_API_PATH;
    		if ("numeroRecursos" in $$props) numeroRecursos = $$props.numeroRecursos;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("currentPage" in $$props) $$invalidate(5, currentPage = $$props.currentPage);
    		if ("moreData" in $$props) $$invalidate(7, moreData = $$props.moreData);
    		if ("filterFoodconsumption" in $$props) $$invalidate(6, filterFoodconsumption = $$props.filterFoodconsumption);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		foodconsumption,
    		visible,
    		errorMsg,
    		color,
    		newFoodconsumption,
    		currentPage,
    		filterFoodconsumption,
    		moreData,
    		incrementOffset,
    		getFoodconsumption,
    		getFiltro,
    		loadInitialData,
    		insertFoodconsumption,
    		deleteFood,
    		deleteTodo,
    		func,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class TableFood extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableFood",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/frontend/foodConsumption/HomeFood.svelte generated by Svelte v3.37.0 */

    const file$5 = "src/frontend/foodConsumption/HomeFood.svelte";

    // (28:6) <BreadcrumbItem>
    function create_default_slot_11$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas del Consumo de Comida";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/foodconsumption-stats");
    			add_location(a, file$5, 27, 22, 392);
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
    function create_default_slot_4$2(ctx) {
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
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(45:4) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (38:5) <Modal isOpen={open} {toggle} size="xl">
    function create_default_slot_3$2(ctx) {
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
    				$$slots: { default: [create_default_slot_4$2] },
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
    		id: create_default_slot_3$2.name,
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
    			add_location(a, file$5, 56, 20, 1285);
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
    function create_default_slot$4(ctx) {
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
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(55:1) <Breadcrumb class=\\\"peque\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
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
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb1 = new Breadcrumb({
    			props: {
    				class: "peque",
    				$$slots: { default: [create_default_slot$4] },
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
    			add_location(strong0, file$5, 24, 2, 328);
    			add_location(h20, file$5, 23, 1, 321);
    			add_location(strong1, file$5, 32, 2, 630);
    			add_location(h21, file$5, 31, 1, 623);
    			add_location(h5, file$5, 34, 1, 673);
    			add_location(strong2, file$5, 51, 2, 1108);
    			add_location(h22, file$5, 50, 1, 1101);
    			attr_dev(main, "class", "svelte-4fr9k");
    			add_location(main, file$5, 20, 0, 300);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeFood",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/frontend/obesity/HomeObesity.svelte generated by Svelte v3.37.0 */

    const file$4 = "src/frontend/obesity/HomeObesity.svelte";

    // (28:6) <BreadcrumbItem>
    function create_default_slot_14(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas de Obesidad";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v1/obesity-stats");
    			add_location(a, file$4, 27, 22, 401);
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
    		source: "(28:6) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (29:4) <BreadcrumbItem active>
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
    		source: "(29:4) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (27:1) <Breadcrumb>
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
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(27:1) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (32:6) <BreadcrumbItem>
    function create_default_slot_11(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Estaditicas de Obesidad v2";
    			attr_dev(a, "href", "https://sos2021-10.herokuapp.com/api/v2/obesity-stats");
    			add_location(a, file$4, 31, 22, 656);
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
    		source: "(32:6) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (33:4) <BreadcrumbItem active>
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
    		source: "(33:4) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (31:1) <Breadcrumb>
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
    		source: "(31:1) <Breadcrumb>",
    		ctx
    	});

    	return block;
    }

    // (41:2) <Button outline color="warning" on:click={toggleob}>
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
    		source: "(41:2) <Button outline color=\\\"warning\\\" on:click={toggleob}>",
    		ctx
    	});

    	return block;
    }

    // (43:3) <ModalHeader {toggleob}>
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
    		source: "(43:3) <ModalHeader {toggleob}>",
    		ctx
    	});

    	return block;
    }

    // (44:3) <ModalBody>
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
    		source: "(44:3) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (48:4) <Button color="secondary" on:click={toggleob}>
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
    		source: "(48:4) <Button color=\\\"secondary\\\" on:click={toggleob}>",
    		ctx
    	});

    	return block;
    }

    // (47:3) <ModalFooter>
    function create_default_slot_4$1(ctx) {
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
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(47:3) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (42:2) <Modal isOpen={openob} {toggleob} size= 'xl'>
    function create_default_slot_3$1(ctx) {
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
    		source: "(42:2) <Modal isOpen={openob} {toggleob} size= 'xl'>",
    		ctx
    	});

    	return block;
    }

    // (58:2) <BreadcrumbItem active>
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
    		source: "(58:2) <BreadcrumbItem active>",
    		ctx
    	});

    	return block;
    }

    // (59:4) <BreadcrumbItem>
    function create_default_slot_1$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Obesity_postman";
    			attr_dev(a, "href", "https://documenter.getpostman.com/view/14950492/TzJoDfvw");
    			add_location(a, file$4, 58, 20, 1495);
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
    		source: "(59:4) <BreadcrumbItem>",
    		ctx
    	});

    	return block;
    }

    // (57:1) <Breadcrumb class="peque">
    function create_default_slot$3(ctx) {
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
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(57:1) <Breadcrumb class=\\\"peque\\\">",
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
    	let breadcrumb1;
    	let t4;
    	let h21;
    	let strong1;
    	let t6;
    	let h5;
    	let t8;
    	let button;
    	let t9;
    	let modal;
    	let t10;
    	let h22;
    	let strong2;
    	let t12;
    	let breadcrumb2;
    	let current;
    	header = new Header({ $$inline: true });

    	breadcrumb0 = new Breadcrumb({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb1 = new Breadcrumb({
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
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	breadcrumb2 = new Breadcrumb({
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
    			create_component(breadcrumb1.$$.fragment);
    			t4 = space();
    			h21 = element("h2");
    			strong1 = element("strong");
    			strong1.textContent = "Front-end Svelte:";
    			t6 = space();
    			h5 = element("h5");
    			h5.textContent = "Estaditicas de Obesidad:";
    			t8 = space();
    			create_component(button.$$.fragment);
    			t9 = space();
    			create_component(modal.$$.fragment);
    			t10 = space();
    			h22 = element("h2");
    			strong2 = element("strong");
    			strong2.textContent = "Documentación en Postman:";
    			t12 = space();
    			create_component(breadcrumb2.$$.fragment);
    			add_location(strong0, file$4, 24, 2, 337);
    			add_location(h20, file$4, 23, 1, 330);
    			add_location(strong1, file$4, 36, 2, 890);
    			add_location(h21, file$4, 35, 1, 883);
    			add_location(h5, file$4, 38, 1, 933);
    			add_location(strong2, file$4, 53, 2, 1328);
    			add_location(h22, file$4, 52, 1, 1321);
    			attr_dev(main, "class", "svelte-1pldhn0");
    			add_location(main, file$4, 20, 0, 309);
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
    			mount_component(breadcrumb1, main, null);
    			append_dev(main, t4);
    			append_dev(main, h21);
    			append_dev(h21, strong1);
    			append_dev(main, t6);
    			append_dev(main, h5);
    			append_dev(main, t8);
    			mount_component(button, main, null);
    			append_dev(main, t9);
    			mount_component(modal, main, null);
    			append_dev(main, t10);
    			append_dev(main, h22);
    			append_dev(h22, strong2);
    			append_dev(main, t12);
    			mount_component(breadcrumb2, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrumb0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumb0_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb0.$set(breadcrumb0_changes);
    			const breadcrumb1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumb1_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb1.$set(breadcrumb1_changes);
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
    			const breadcrumb2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				breadcrumb2_changes.$$scope = { dirty, ctx };
    			}

    			breadcrumb2.$set(breadcrumb2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(breadcrumb0.$$.fragment, local);
    			transition_in(breadcrumb1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			transition_in(breadcrumb2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(breadcrumb0.$$.fragment, local);
    			transition_out(breadcrumb1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			transition_out(breadcrumb2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(breadcrumb0);
    			destroy_component(breadcrumb1);
    			destroy_component(button);
    			destroy_component(modal);
    			destroy_component(breadcrumb2);
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeObesity",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/frontend/obesity/EditObe.svelte generated by Svelte v3.37.0 */

    const { console: console_1$2 } = globals;
    const file$3 = "src/frontend/obesity/EditObe.svelte";

    // (123:6) {#if errorMsg}
    function create_if_block_1(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[6]);
    			add_location(p, file$3, 123, 7, 3235);
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
    		source: "(123:6) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (122:5) <Alert color="danger" isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_4(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[6] && create_if_block_1(ctx);

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
    			if (/*errorMsg*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
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
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(122:5) <Alert color=\\\"danger\\\" isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (128:6) {#if okMsg}
    function create_if_block(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Correcto: ");
    			t1 = text(/*okMsg*/ ctx[7]);
    			add_location(p, file$3, 128, 7, 3397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*okMsg*/ 128) set_data_dev(t1, /*okMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(128:6) {#if okMsg}",
    		ctx
    	});

    	return block;
    }

    // (127:5) <Alert color="success" isOpen={visibleOk} toggle={() => (visibleOk = false)}>
    function create_default_slot_3(ctx) {
    	let if_block_anchor;
    	let if_block = /*okMsg*/ ctx[7] && create_if_block(ctx);

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
    			if (/*okMsg*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
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
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(127:5) <Alert color=\\\"success\\\" isOpen={visibleOk} toggle={() => (visibleOk = false)}>",
    		ctx
    	});

    	return block;
    }

    // (153:9) <Button on:click={updateObesity}>
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
    		source: "(153:9) <Button on:click={updateObesity}>",
    		ctx
    	});

    	return block;
    }

    // (119:8) <Table bordered>
    function create_default_slot_1(ctx) {
    	let thead;
    	let div;
    	let alert0;
    	let t0;
    	let alert1;
    	let t1;
    	let tr0;
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
    	let tr1;
    	let td0;
    	let t14;
    	let t15;
    	let td1;
    	let t16;
    	let t17;
    	let td2;
    	let input0;
    	let t18;
    	let td3;
    	let input1;
    	let t19;
    	let td4;
    	let input2;
    	let t20;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	alert0 = new Alert({
    			props: {
    				color: "danger",
    				isOpen: /*visible*/ ctx[8],
    				toggle: /*func*/ ctx[11],
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	alert1 = new Alert({
    			props: {
    				color: "success",
    				isOpen: /*visibleOk*/ ctx[9],
    				toggle: /*func_1*/ ctx[12],
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateObesity*/ ctx[10]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			div = element("div");
    			create_component(alert0.$$.fragment);
    			t0 = space();
    			create_component(alert1.$$.fragment);
    			t1 = space();
    			tr0 = element("tr");
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
    			tr1 = element("tr");
    			td0 = element("td");
    			t14 = text(/*upCountry*/ ctx[1]);
    			t15 = space();
    			td1 = element("td");
    			t16 = text(/*upYear*/ ctx[2]);
    			t17 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t18 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t19 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t20 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(div, file$3, 120, 4, 3123);
    			add_location(th0, file$3, 135, 20, 3512);
    			add_location(th1, file$3, 136, 5, 3531);
    			add_location(th2, file$3, 137, 5, 3549);
    			add_location(th3, file$3, 138, 5, 3585);
    			add_location(th4, file$3, 139, 5, 3619);
    			add_location(th5, file$3, 140, 5, 3649);
    			add_location(tr0, file$3, 134, 16, 3487);
    			add_location(thead, file$3, 119, 12, 3111);
    			add_location(td0, file$3, 147, 20, 3777);
    			add_location(td1, file$3, 148, 5, 3803);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$3, 149, 24, 3845);
    			add_location(td2, file$3, 149, 20, 3841);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$3, 150, 9, 3908);
    			add_location(td3, file$3, 150, 5, 3904);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$3, 151, 9, 3973);
    			add_location(td4, file$3, 151, 5, 3969);
    			add_location(td5, file$3, 152, 5, 4037);
    			add_location(tr1, file$3, 146, 16, 3752);
    			add_location(tbody, file$3, 144, 12, 3724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, div);
    			mount_component(alert0, div, null);
    			append_dev(div, t0);
    			mount_component(alert1, div, null);
    			append_dev(thead, t1);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t3);
    			append_dev(tr0, th1);
    			append_dev(tr0, t5);
    			append_dev(tr0, th2);
    			append_dev(tr0, t7);
    			append_dev(tr0, th3);
    			append_dev(tr0, t9);
    			append_dev(tr0, th4);
    			append_dev(tr0, t11);
    			append_dev(tr0, th5);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td1);
    			append_dev(td1, t16);
    			append_dev(tr1, t17);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*upMan_percent*/ ctx[3]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*upWoman_percent*/ ctx[4]);
    			append_dev(tr1, t19);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*upTotal_population*/ ctx[5]);
    			append_dev(tr1, t20);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[15])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const alert0_changes = {};
    			if (dirty & /*visible*/ 256) alert0_changes.isOpen = /*visible*/ ctx[8];
    			if (dirty & /*visible*/ 256) alert0_changes.toggle = /*func*/ ctx[11];

    			if (dirty & /*$$scope, errorMsg*/ 524352) {
    				alert0_changes.$$scope = { dirty, ctx };
    			}

    			alert0.$set(alert0_changes);
    			const alert1_changes = {};
    			if (dirty & /*visibleOk*/ 512) alert1_changes.isOpen = /*visibleOk*/ ctx[9];
    			if (dirty & /*visibleOk*/ 512) alert1_changes.toggle = /*func_1*/ ctx[12];

    			if (dirty & /*$$scope, okMsg*/ 524416) {
    				alert1_changes.$$scope = { dirty, ctx };
    			}

    			alert1.$set(alert1_changes);
    			if (!current || dirty & /*upCountry*/ 2) set_data_dev(t14, /*upCountry*/ ctx[1]);
    			if (!current || dirty & /*upYear*/ 4) set_data_dev(t16, /*upYear*/ ctx[2]);

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

    			if (dirty & /*$$scope*/ 524288) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert0.$$.fragment, local);
    			transition_in(alert1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert0.$$.fragment, local);
    			transition_out(alert1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_component(alert0);
    			destroy_component(alert1);
    			if (detaching) detach_dev(t13);
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
    		source: "(119:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (160:2) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$2(ctx) {
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
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(160:2) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
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
    	let button;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$2] },
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
    			create_component(button.$$.fragment);
    			add_location(strong0, file$3, 117, 22, 3005);
    			add_location(strong1, file$3, 117, 55, 3038);
    			add_location(h3, file$3, 117, 4, 2987);
    			attr_dev(main, "class", "svelte-qkkln6");
    			add_location(main, file$3, 116, 0, 2976);
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
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].country + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].year + "")) set_data_dev(t2, t2_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, upTotal_population, upWoman_percent, upMan_percent, upYear, upCountry, visibleOk, okMsg, visible, errorMsg*/ 525310) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
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
    			destroy_component(button);
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

    const BASE_CONTACT_API_PATH = "/api/v2";

    function instance$3($$self, $$props, $$invalidate) {
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

    	let { params = {} } = $$props;
    	let obesity = {};
    	let upCountry = "XXXX";
    	let upYear = 12345;
    	let upMan_percent = 123.4;
    	let upWoman_percent = 123.4;
    	let upTotal_population = 12345;
    	let errorMsg = "";
    	let okMsg = "";
    	let visible = false;
    	let visibleOk = false;
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
    			if (res.status === 404) {
    				$$invalidate(6, errorMsg = `No existe dato con pais: ${params.country} y fecha: ${params.year}`);
    				console.log("ERROR!" + errorMsg);
    				$$invalidate(9, visibleOk = false);
    				$$invalidate(8, visible = true);
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
    				$$invalidate(9, visibleOk = true);
    				$$invalidate(8, visible = false);
    			} else {
    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "El dato solicitado no existe");
    					$$invalidate(9, visibleOk = false);
    					$$invalidate(8, visible = true);
    				}
    			}

    			getObesity();
    			console.log("ERROR!" + errorMsg);
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<EditObe> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(8, visible = false);
    	const func_1 = () => $$invalidate(9, visibleOk = false);

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
    		visible,
    		visibleOk,
    		getObesity,
    		updateObesity
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("obesity" in $$props) obesity = $$props.obesity;
    		if ("upCountry" in $$props) $$invalidate(1, upCountry = $$props.upCountry);
    		if ("upYear" in $$props) $$invalidate(2, upYear = $$props.upYear);
    		if ("upMan_percent" in $$props) $$invalidate(3, upMan_percent = $$props.upMan_percent);
    		if ("upWoman_percent" in $$props) $$invalidate(4, upWoman_percent = $$props.upWoman_percent);
    		if ("upTotal_population" in $$props) $$invalidate(5, upTotal_population = $$props.upTotal_population);
    		if ("errorMsg" in $$props) $$invalidate(6, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(7, okMsg = $$props.okMsg);
    		if ("visible" in $$props) $$invalidate(8, visible = $$props.visible);
    		if ("visibleOk" in $$props) $$invalidate(9, visibleOk = $$props.visibleOk);
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
    		visible,
    		visibleOk,
    		updateObesity,
    		func,
    		func_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditObe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditObe",
    			options,
    			id: create_fragment$3.name
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

    const { console: console_1$1 } = globals;
    const file$2 = "src/frontend/sanity/JustOneSanity.svelte";

    // (37:1) <Table bordered>
    function create_default_slot$1(ctx) {
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
    			add_location(td0, file$2, 39, 4, 843);
    			attr_dev(td1, "class", "svelte-lohyvn");
    			add_location(td1, file$2, 40, 4, 861);
    			attr_dev(td2, "class", "svelte-lohyvn");
    			add_location(td2, file$2, 41, 4, 878);
    			attr_dev(td3, "class", "svelte-lohyvn");
    			add_location(td3, file$2, 42, 4, 922);
    			attr_dev(td4, "class", "svelte-lohyvn");
    			add_location(td4, file$2, 43, 4, 969);
    			attr_dev(tr0, "class", "svelte-lohyvn");
    			add_location(tr0, file$2, 38, 3, 834);
    			add_location(thead, file$2, 37, 2, 823);
    			attr_dev(td5, "class", "svelte-lohyvn");
    			add_location(td5, file$2, 48, 3, 1037);
    			attr_dev(td6, "class", "svelte-lohyvn");
    			add_location(td6, file$2, 49, 3, 1066);
    			attr_dev(td7, "class", "svelte-lohyvn");
    			add_location(td7, file$2, 50, 3, 1092);
    			attr_dev(td8, "class", "svelte-lohyvn");
    			add_location(td8, file$2, 51, 3, 1146);
    			attr_dev(td9, "class", "svelte-lohyvn");
    			add_location(td9, file$2, 52, 3, 1192);
    			attr_dev(tr1, "class", "svelte-lohyvn");
    			add_location(tr1, file$2, 47, 3, 1029);
    			add_location(tbody, file$2, 46, 2, 1018);
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(37:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
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
    				$$slots: { default: [create_default_slot$1] },
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
    			add_location(br0, file$2, 34, 4, 793);
    			add_location(br1, file$2, 34, 8, 797);
    			add_location(main, file$2, 32, 0, 768);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<JustOneSanity> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JustOneSanity",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/frontend/sanity/FromTo.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/frontend/sanity/FromTo.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (50:3) {#each sanity as sani}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*sani*/ ctx[6].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*sani*/ ctx[6].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*sani*/ ctx[6].health_expenditure_in_percentage + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*sani*/ ctx[6].doctor_per_1000_habitant + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*sani*/ ctx[6].hospital_bed + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
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
    			attr_dev(td0, "class", "svelte-lohyvn");
    			add_location(td0, file$1, 51, 3, 1083);
    			attr_dev(td1, "class", "svelte-lohyvn");
    			add_location(td1, file$1, 52, 3, 1110);
    			attr_dev(td2, "class", "svelte-lohyvn");
    			add_location(td2, file$1, 53, 3, 1134);
    			attr_dev(td3, "class", "svelte-lohyvn");
    			add_location(td3, file$1, 54, 3, 1186);
    			attr_dev(td4, "class", "svelte-lohyvn");
    			add_location(td4, file$1, 55, 3, 1230);
    			attr_dev(tr, "class", "svelte-lohyvn");
    			add_location(tr, file$1, 50, 3, 1075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
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
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sanity*/ 1 && t0_value !== (t0_value = /*sani*/ ctx[6].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*sanity*/ 1 && t2_value !== (t2_value = /*sani*/ ctx[6].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*sanity*/ 1 && t4_value !== (t4_value = /*sani*/ ctx[6].health_expenditure_in_percentage + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*sanity*/ 1 && t6_value !== (t6_value = /*sani*/ ctx[6].doctor_per_1000_habitant + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*sanity*/ 1 && t8_value !== (t8_value = /*sani*/ ctx[6].hospital_bed + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(50:3) {#each sanity as sani}",
    		ctx
    	});

    	return block;
    }

    // (39:1) <Table bordered>
    function create_default_slot(ctx) {
    	let thead;
    	let tr;
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
    	let each_value = /*sanity*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
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

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td0, "class", "svelte-lohyvn");
    			add_location(td0, file$1, 41, 4, 863);
    			attr_dev(td1, "class", "svelte-lohyvn");
    			add_location(td1, file$1, 42, 4, 881);
    			attr_dev(td2, "class", "svelte-lohyvn");
    			add_location(td2, file$1, 43, 4, 898);
    			attr_dev(td3, "class", "svelte-lohyvn");
    			add_location(td3, file$1, 44, 4, 942);
    			attr_dev(td4, "class", "svelte-lohyvn");
    			add_location(td4, file$1, 45, 4, 989);
    			attr_dev(tr, "class", "svelte-lohyvn");
    			add_location(tr, file$1, 40, 3, 854);
    			add_location(thead, file$1, 39, 2, 843);
    			add_location(tbody, file$1, 48, 2, 1038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, td0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sanity*/ 1) {
    				each_value = /*sanity*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(39:1) <Table bordered>",
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
    			add_location(br0, file$1, 36, 4, 813);
    			add_location(br1, file$1, 36, 8, 817);
    			add_location(main, file$1, 34, 0, 788);
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

    			if (dirty & /*$$scope, sanity*/ 513) {
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
    	validate_slots("FromTo", slots, []);
    	let sanity = [];
    	const url = window.location.hash;
    	console.log(url);
    	const param = url.split("/");
    	console.log(param);
    	const from = parseInt(param[4]);
    	const to = parseInt(param[6]);
    	console.log(from);
    	console.log(to);

    	async function getSanity() {
    		console.log("Fetching data...");
    		const res = await fetch("/api/v1/sanity-stats?from=" + from + "&to=" + to);
    		console.log(res);

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			console.log(json);
    			$$invalidate(0, sanity = json);
    		} else {
    			console.log("Error");
    		}
    	}

    	onMount(getSanity);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<FromTo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		onMount,
    		Table,
    		sanity,
    		url,
    		param,
    		from,
    		to,
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

    class FromTo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FromTo",
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
    			add_location(main, file, 33, 0, 1014);
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
    		//	"/sanity-stats/statistics/from/:in/to/:t": FromTo,
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
    		FromTo,
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
