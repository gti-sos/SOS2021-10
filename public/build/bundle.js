
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
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
            update: noop,
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
            this.$destroy = noop;
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
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
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

    /* src/App.svelte generated by Svelte v3.37.0 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let strong0;
    	let t1;
    	let h20;
    	let t3;
    	let ul0;
    	let li0;
    	let t5;
    	let li1;
    	let t7;
    	let li2;
    	let t9;
    	let h21;
    	let t11;
    	let p0;
    	let t13;
    	let p1;
    	let strong1;
    	let t15;
    	let t16;
    	let p2;
    	let strong2;
    	let t18;
    	let t19;
    	let p3;
    	let strong3;
    	let t21;
    	let ul1;
    	let li3;
    	let a0;
    	let t23;
    	let t24;
    	let li4;
    	let a1;
    	let t26;
    	let t27;
    	let li5;
    	let a2;
    	let t29;
    	let t30;
    	let p4;
    	let strong4;
    	let t32;
    	let ul2;
    	let li6;
    	let t33;
    	let a3;
    	let t35;
    	let li7;
    	let t36;
    	let a4;
    	let t38;
    	let li8;
    	let t39;
    	let a5;
    	let t41;
    	let p5;
    	let strong5;
    	let t43;
    	let ul3;
    	let li9;
    	let t44;
    	let a6;
    	let t46;
    	let li10;
    	let t47;
    	let a7;
    	let t49;
    	let li11;
    	let t50;
    	let a8;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			strong0 = element("strong");
    			strong0.textContent = "SOS2021-10";
    			t1 = space();
    			h20 = element("h2");
    			h20.textContent = "Team";
    			t3 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Antonio José Díaz González (https://github.com/AntonioJoseDiaz)";
    			t5 = space();
    			li1 = element("li");
    			li1.textContent = "Almudena González López de Letona (https://github.com/almgonlop)";
    			t7 = space();
    			li2 = element("li");
    			li2.textContent = "Alicia Pérez Bolaños (https://github.com/aliperbol)";
    			t9 = space();
    			h21 = element("h2");
    			h21.textContent = "Project description:";
    			t11 = space();
    			p0 = element("p");
    			p0.textContent = "Nuestras fuentes de información esta orientadas a analizar la relación que existe entre la obesidad, el consumo de distintos tipos de comida y la sanidad en el mundo.";
    			t13 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Repository:";
    			t15 = text(" [gti-sos/SOS2021-10](https://github.com/gti-sos/SOS2021-10)");
    			t16 = space();
    			p2 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "URL:";
    			t18 = text(" http://sos2021-10.herokuapp.com");
    			t19 = space();
    			p3 = element("p");
    			strong3 = element("strong");
    			strong3.textContent = "APIs:";
    			t21 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			a0 = element("a");
    			a0.textContent = "sanity-stats";
    			t23 = text(" (developed by Antonio José Díaz González)");
    			t24 = space();
    			li4 = element("li");
    			a1 = element("a");
    			a1.textContent = "obesity-stats";
    			t26 = text(" (developed by Almudena González López de Letona)");
    			t27 = space();
    			li5 = element("li");
    			a2 = element("a");
    			a2.textContent = "foodconsumption-stats";
    			t29 = text(" (developed by Alicia Pérez Bolaños)");
    			t30 = space();
    			p4 = element("p");
    			strong4 = element("strong");
    			strong4.textContent = "Front-end Svelte:";
    			t32 = space();
    			ul2 = element("ul");
    			li6 = element("li");
    			t33 = text("Obesity-stats: ");
    			a3 = element("a");
    			a3.textContent = "Obesity_Front-end";
    			t35 = space();
    			li7 = element("li");
    			t36 = text("FoodConsumption-stats: ");
    			a4 = element("a");
    			a4.textContent = "Food_Front-end";
    			t38 = space();
    			li8 = element("li");
    			t39 = text("Sanity-stats: ");
    			a5 = element("a");
    			a5.textContent = "Sanity_Front-end";
    			t41 = space();
    			p5 = element("p");
    			strong5 = element("strong");
    			strong5.textContent = "Postman's Documentation:";
    			t43 = space();
    			ul3 = element("ul");
    			li9 = element("li");
    			t44 = text("Obesity-stats: ");
    			a6 = element("a");
    			a6.textContent = "Obesity_postman";
    			t46 = space();
    			li10 = element("li");
    			t47 = text("FoodConsumption-stats: ");
    			a7 = element("a");
    			a7.textContent = "Food_postman";
    			t49 = space();
    			li11 = element("li");
    			t50 = text("Sanity-stats: ");
    			a8 = element("a");
    			a8.textContent = "Sanity_postman";
    			add_location(strong0, file, 6, 2, 37);
    			attr_dev(h1, "class", "svelte-175ol03");
    			add_location(h1, file, 5, 1, 30);
    			add_location(h20, file, 8, 1, 73);
    			add_location(li0, file, 12, 2, 100);
    			add_location(li1, file, 13, 2, 175);
    			add_location(li2, file, 14, 2, 251);
    			add_location(ul0, file, 11, 1, 93);
    			add_location(h21, file, 17, 1, 324);
    			add_location(p0, file, 20, 1, 360);
    			add_location(strong1, file, 24, 2, 546);
    			add_location(p1, file, 23, 1, 540);
    			add_location(strong2, file, 27, 2, 650);
    			add_location(p2, file, 26, 1, 644);
    			add_location(strong3, file, 30, 2, 719);
    			add_location(p3, file, 29, 1, 713);
    			attr_dev(a0, "href", "https://sos2021-10.herokuapp.com/api/v1/sanity-stats");
    			add_location(a0, file, 34, 7, 765);
    			add_location(li3, file, 34, 3, 761);
    			attr_dev(a1, "href", "https://sos2021-10.herokuapp.com/api/v1/obesity-stats");
    			add_location(a1, file, 35, 7, 899);
    			add_location(li4, file, 35, 3, 895);
    			attr_dev(a2, "href", "https://sos2021-10.herokuapp.com/api/v1/foodconsumption-stats");
    			add_location(a2, file, 36, 7, 1042);
    			add_location(li5, file, 36, 3, 1038);
    			add_location(ul1, file, 33, 2, 753);
    			add_location(strong4, file, 40, 2, 1200);
    			add_location(p4, file, 39, 2, 1194);
    			attr_dev(a3, "href", "obesity.html");
    			add_location(a3, file, 45, 22, 1275);
    			add_location(li6, file, 45, 3, 1256);
    			attr_dev(a4, "href", "foodconsumption.svelte");
    			add_location(a4, file, 46, 30, 1355);
    			add_location(li7, file, 46, 3, 1328);
    			attr_dev(a5, "href", "sanity.html");
    			add_location(a5, file, 47, 21, 1433);
    			add_location(li8, file, 47, 3, 1415);
    			add_location(ul2, file, 43, 2, 1246);
    			add_location(strong5, file, 51, 2, 1499);
    			add_location(p5, file, 50, 1, 1493);
    			attr_dev(a6, "href", "https://documenter.getpostman.com/view/14950492/TzJoDfvw");
    			add_location(a6, file, 56, 22, 1581);
    			add_location(li9, file, 56, 3, 1562);
    			attr_dev(a7, "href", "https://documenter.getpostman.com/view/14948248/TzJoDfvx");
    			add_location(a7, file, 57, 30, 1703);
    			add_location(li10, file, 57, 3, 1676);
    			attr_dev(a8, "href", "https://documenter.getpostman.com/view/9683594/TzJoE1Qx");
    			add_location(a8, file, 58, 21, 1813);
    			add_location(li11, file, 58, 3, 1795);
    			add_location(ul3, file, 54, 2, 1552);
    			attr_dev(main, "class", "svelte-175ol03");
    			add_location(main, file, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, strong0);
    			append_dev(main, t1);
    			append_dev(main, h20);
    			append_dev(main, t3);
    			append_dev(main, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t5);
    			append_dev(ul0, li1);
    			append_dev(ul0, t7);
    			append_dev(ul0, li2);
    			append_dev(main, t9);
    			append_dev(main, h21);
    			append_dev(main, t11);
    			append_dev(main, p0);
    			append_dev(main, t13);
    			append_dev(main, p1);
    			append_dev(p1, strong1);
    			append_dev(p1, t15);
    			append_dev(main, t16);
    			append_dev(main, p2);
    			append_dev(p2, strong2);
    			append_dev(p2, t18);
    			append_dev(main, t19);
    			append_dev(main, p3);
    			append_dev(p3, strong3);
    			append_dev(main, t21);
    			append_dev(main, ul1);
    			append_dev(ul1, li3);
    			append_dev(li3, a0);
    			append_dev(li3, t23);
    			append_dev(ul1, t24);
    			append_dev(ul1, li4);
    			append_dev(li4, a1);
    			append_dev(li4, t26);
    			append_dev(ul1, t27);
    			append_dev(ul1, li5);
    			append_dev(li5, a2);
    			append_dev(li5, t29);
    			append_dev(main, t30);
    			append_dev(main, p4);
    			append_dev(p4, strong4);
    			append_dev(main, t32);
    			append_dev(main, ul2);
    			append_dev(ul2, li6);
    			append_dev(li6, t33);
    			append_dev(li6, a3);
    			append_dev(ul2, t35);
    			append_dev(ul2, li7);
    			append_dev(li7, t36);
    			append_dev(li7, a4);
    			append_dev(ul2, t38);
    			append_dev(ul2, li8);
    			append_dev(li8, t39);
    			append_dev(li8, a5);
    			append_dev(main, t41);
    			append_dev(main, p5);
    			append_dev(p5, strong5);
    			append_dev(main, t43);
    			append_dev(main, ul3);
    			append_dev(ul3, li9);
    			append_dev(li9, t44);
    			append_dev(li9, a6);
    			append_dev(ul3, t46);
    			append_dev(ul3, li10);
    			append_dev(li10, t47);
    			append_dev(li10, a7);
    			append_dev(ul3, t49);
    			append_dev(ul3, li11);
    			append_dev(li11, t50);
    			append_dev(li11, a8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
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

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	return [];
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
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
