
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
    function init_binding_group(group) {
        let _inputs;
        return {
            /* push */ p(...inputs) {
                _inputs = inputs;
                _inputs.forEach(input => group.push(input));
            },
            /* remove */ r() {
                _inputs.forEach(input => group.splice(group.indexOf(input), 1));
            }
        };
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
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
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
            flush_render_callbacks($$.after_update);
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
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
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
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
            if (!is_function(callback)) {
                return noop;
            }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
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

    class FlowCalculator {
        static fliessgeschwindigkeit(A, gef, U, kSt) {
    		//Fließgeschwindigkeit mit Hilfe der Mannig-Stricklerformel berechnen
    		try {
    			// Hydraulischer Radius
    			const R = A / U;

    			// Formel Mittlere Fließgeschwindigkeit nach Gauckler-Manning-Strickler
    			const vMittel = kSt * Math.pow(R, 2 / 3) * Math.sqrt(gef / 100);

    			// Durchflussmenge
    			const volMenge = vMittel * A;

    			return { vMittel, volMenge };
    		} catch (ex) {
    			console.error(ex.message);
    			throw ex; // Rethrow the exception for further handling
    		}
    	}

    	static rechteck(breite, hoehe, gefaelle, strickler) {
    		//Rechteckquerschnitt, benetzten Umfang berechnen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
    		const querschnittsflaeche = breite * hoehe;
    		const benetzterUmfang = breite + 2 * hoehe;
    		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
    			querschnittsflaeche,
    			gefaelle,
    			benetzterUmfang,
    			strickler,
    		);
    		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
    	}

    	static gleichschenkligesTrapez(
    		//Trapezquerschnitt, benetzten Umfang berechnen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
    		breiteOben,
    		breiteUnten,
    		hoehe,
    		gefaelle,
    		strickler,
    	) {
    		const querschnittsflaeche = ((breiteOben + breiteUnten) * hoehe) / 2;
    		const benetzterUmfang =
    			breiteUnten +
    			2 *
    				((hoehe ** 2 + Math.abs(breiteOben - breiteUnten) / 2) ** 2) **
    					(1 / 2);
    		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
    			querschnittsflaeche,
    			gefaelle,
    			benetzterUmfang,
    			strickler,
    		);
    		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
    	}

    	static allgemeinesTrapez(
    		//Trapezquerschnitt, benetzten Umfang berechnen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
    		breiteOben,
    		breiteUnten,
    		xWert,
    		hoehe,
    		gefaelle,
    		strickler,
    	) {
    		const querschnittsflaeche = ((breiteOben + breiteUnten) * hoehe) / 2;
    		const seite1 = Math.sqrt(
    			(breiteOben - breiteUnten - xWert) ** 2 + hoehe ** 2,
    		);
    		const seite2 = Math.sqrt(xWert ** 2 + hoehe ** 2);
    		const benetzterUmfang = breiteUnten + seite1 + seite2;
    		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
    			querschnittsflaeche,
    			gefaelle,
    			benetzterUmfang,
    			strickler,
    		);
    		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
    	}

    	static rohrsegment(breite, hoehe, gefaelle, strickler) {
    		//Rohrsegmentquerschnitt, benetzten Umfang berechnen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
    		const radius = hoehe / 2 + breite ** 2 / (8 * hoehe);
    		const winkel = 2 * Math.asin(breite / (2 * radius));
    		const querschnittsflaeche =
    			0.5 * radius ** 2 * (winkel - Math.sin(winkel));
    		const benetzterUmfang = winkel * radius;
    		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
    			querschnittsflaeche,
    			gefaelle,
    			benetzterUmfang,
    			strickler,
    		);
    		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
    	}

    	static benutzerdefiniert(gefaelle, strickler, querschnittEingabe, umfangEingabe) {
    		//Benutzerdefinierten Querschnitt, benetzten Umfang auslesen, danach die Fließgeschwindigkeit und Durchflussmenge berechnen
    		const querschnittsflaeche = querschnittEingabe;
    		const benetzterUmfang = umfangEingabe;
    		const { vMittel, volMenge } = this.fliessgeschwindigkeit(
    			querschnittsflaeche,
    			gefaelle,
    			benetzterUmfang,
    			strickler,
    		);
    		return { querschnittsflaeche, benetzterUmfang, vMittel, volMenge };
    	}

    	static gefaelleRechnen(hoehenunterschied, laengeFluss) {
    		//Gefälle berechnen
    		if (hoehenunterschied === 0 || laengeFluss === 0) {
    			return 0;
    		} else {
    			//const gefaelle =(hoehenunterschied ** 2 /(laengeFluss ** 2 - hoehenunterschied ** 2) ** 0.5) *100;
    			const gefaelle = (hoehenunterschied / laengeFluss) * 100;
    			return parseFloat(gefaelle.toFixed(2));
    		}
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[48] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[51] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[54] = list[i];
    	return child_ctx;
    }

    // (352:1) {#if message}
    function create_if_block_10(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*message*/ ctx[15]);
    			attr_dev(p, "class", "message svelte-rbyv5g");
    			add_location(p, file, 352, 2, 9065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*message*/ 32768) set_data_dev(t, /*message*/ ctx[15]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(352:1) {#if message}",
    		ctx
    	});

    	return block;
    }

    // (359:3) {#each kategories as kategory}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*kategory*/ ctx[54] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*kategory*/ ctx[54];
    			option.value = option.__value;
    			add_location(option, file, 359, 4, 9292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(359:3) {#each kategories as kategory}",
    		ctx
    	});

    	return block;
    }

    // (364:3) {#each bewuechse as bewuchs}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*bewuchs*/ ctx[51] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*bewuchs*/ ctx[51];
    			option.value = option.__value;
    			add_location(option, file, 364, 4, 9452);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*bewuechse*/ 16384 && t_value !== (t_value = /*bewuchs*/ ctx[51] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*bewuechse*/ 16384 && option_value_value !== (option_value_value = /*bewuchs*/ ctx[51])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(364:3) {#each bewuechse as bewuchs}",
    		ctx
    	});

    	return block;
    }

    // (409:42) 
    function create_if_block_9(ctx) {
    	let div;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let label2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label0 = element("label");
    			label0.textContent = "Höhenunterschied";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "m Länge des Flusses";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			label2 = element("label");
    			label2.textContent = "m";
    			attr_dev(label0, "for", "hoehenunterschied");
    			attr_dev(label0, "class", "svelte-rbyv5g");
    			add_location(label0, file, 410, 3, 10421);
    			attr_dev(input0, "id", "hoehenunterschied");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "1");
    			attr_dev(input0, "class", "svelte-rbyv5g");
    			add_location(input0, file, 411, 3, 10480);
    			attr_dev(label1, "for", "meter");
    			attr_dev(label1, "class", "svelte-rbyv5g");
    			add_location(label1, file, 417, 3, 10596);
    			attr_dev(input1, "id", "laengeFluss");
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "1");
    			attr_dev(input1, "class", "svelte-rbyv5g");
    			add_location(input1, file, 418, 3, 10646);
    			attr_dev(label2, "for", "meter");
    			attr_dev(label2, "class", "svelte-rbyv5g");
    			add_location(label2, file, 424, 3, 10750);
    			attr_dev(div, "class", "form-group small-margin svelte-rbyv5g");
    			add_location(div, file, 409, 2, 10380);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(div, t1);
    			append_dev(div, input0);
    			set_input_value(input0, /*hoehenunterschied*/ ctx[8]);
    			append_dev(div, t2);
    			append_dev(div, label1);
    			append_dev(div, t4);
    			append_dev(div, input1);
    			set_input_value(input1, /*laengeFluss*/ ctx[9]);
    			append_dev(div, t5);
    			append_dev(div, label2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[38]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[39])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hoehenunterschied*/ 256 && to_number(input0.value) !== /*hoehenunterschied*/ ctx[8]) {
    				set_input_value(input0, /*hoehenunterschied*/ ctx[8]);
    			}

    			if (dirty[0] & /*laengeFluss*/ 512 && to_number(input1.value) !== /*laengeFluss*/ ctx[9]) {
    				set_input_value(input1, /*laengeFluss*/ ctx[9]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(409:42) ",
    		ctx
    	});

    	return block;
    }

    // (399:1) {#if gefaelleOption === "eingeben"}
    function create_if_block_8(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			label.textContent = "%";
    			attr_dev(input, "id", "gefaelle");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "placeholder", "1");
    			attr_dev(input, "class", "svelte-rbyv5g");
    			add_location(input, file, 400, 3, 10196);
    			attr_dev(label, "for", "prozent");
    			attr_dev(label, "class", "svelte-rbyv5g");
    			add_location(label, file, 406, 3, 10294);
    			attr_dev(div, "class", "form-group small-margin svelte-rbyv5g");
    			add_location(div, file, 399, 2, 10155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*gefaelle*/ ctx[1]);
    			append_dev(div, t0);
    			append_dev(div, label);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[37]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*gefaelle*/ 2 && to_number(input.value) !== /*gefaelle*/ ctx[1]) {
    				set_input_value(input, /*gefaelle*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(399:1) {#if gefaelleOption === \\\"eingeben\\\"}",
    		ctx
    	});

    	return block;
    }

    // (432:3) {#each querschnitte as querschnitt}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*querschnitt*/ ctx[48] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*querschnitt*/ ctx[48];
    			option.value = option.__value;
    			add_location(option, file, 432, 4, 10997);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(432:3) {#each querschnitte as querschnitt}",
    		ctx
    	});

    	return block;
    }

    // (438:1) {#if imageSrc}
    function create_if_block(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let if_block0 = /*breiteVisible*/ ctx[25] && create_if_block_7(ctx);
    	let if_block1 = /*hoeheVisible*/ ctx[24] && create_if_block_6(ctx);
    	let if_block2 = /*breiteobenVisible*/ ctx[23] && create_if_block_5(ctx);
    	let if_block3 = /*breiteuntenVisible*/ ctx[22] && create_if_block_4(ctx);
    	let if_block4 = /*xVisible*/ ctx[21] && create_if_block_3(ctx);
    	let if_block5 = /*querschnittEingabeVisible*/ ctx[28] && create_if_block_2(ctx);
    	let if_block6 = /*umfangEingabeVisible*/ ctx[27] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			if (if_block4) if_block4.c();
    			t5 = space();
    			if (if_block5) if_block5.c();
    			t6 = space();
    			if (if_block6) if_block6.c();
    			if (!src_url_equal(img.src, img_src_value = /*imageSrc*/ ctx[26])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Querschnitt Bild");
    			attr_dev(img, "class", "svelte-rbyv5g");
    			add_location(img, file, 439, 3, 11133);
    			attr_dev(div0, "class", "input-fields svelte-rbyv5g");
    			add_location(div0, file, 440, 3, 11182);
    			attr_dev(div1, "class", "image-input-group svelte-rbyv5g");
    			add_location(div1, file, 438, 2, 11098);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t1);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t2);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t3);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div0, t4);
    			if (if_block4) if_block4.m(div0, null);
    			append_dev(div0, t5);
    			if (if_block5) if_block5.m(div0, null);
    			append_dev(div0, t6);
    			if (if_block6) if_block6.m(div0, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*imageSrc*/ 67108864 && !src_url_equal(img.src, img_src_value = /*imageSrc*/ ctx[26])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (/*breiteVisible*/ ctx[25]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(div0, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*hoeheVisible*/ ctx[24]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					if_block1.m(div0, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*breiteobenVisible*/ ctx[23]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					if_block2.m(div0, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*breiteuntenVisible*/ ctx[22]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_4(ctx);
    					if_block3.c();
    					if_block3.m(div0, t4);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*xVisible*/ ctx[21]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_3(ctx);
    					if_block4.c();
    					if_block4.m(div0, t5);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*querschnittEingabeVisible*/ ctx[28]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_2(ctx);
    					if_block5.c();
    					if_block5.m(div0, t6);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*umfangEingabeVisible*/ ctx[27]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_1(ctx);
    					if_block6.c();
    					if_block6.m(div0, null);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(438:1) {#if imageSrc}",
    		ctx
    	});

    	return block;
    }

    // (442:4) {#if breiteVisible}
    function create_if_block_7(ctx) {
    	let div;
    	let label0;
    	let t1;
    	let input;
    	let t2;
    	let label1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label0 = element("label");
    			label0.textContent = "b";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "m";
    			attr_dev(label0, "for", "breite");
    			attr_dev(label0, "class", "svelte-rbyv5g");
    			add_location(label0, file, 443, 6, 11269);
    			attr_dev(input, "id", "breite");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "placeholder", "50");
    			attr_dev(input, "class", "svelte-rbyv5g");
    			add_location(input, file, 444, 6, 11305);
    			attr_dev(label1, "for", "breite");
    			attr_dev(label1, "class", "svelte-rbyv5g");
    			add_location(label1, file, 450, 6, 11422);
    			attr_dev(div, "class", "form-group svelte-rbyv5g");
    			add_location(div, file, 442, 5, 11238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*breiteOben*/ ctx[2]);
    			append_dev(div, t2);
    			append_dev(div, label1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[41]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*breiteOben*/ 4 && to_number(input.value) !== /*breiteOben*/ ctx[2]) {
    				set_input_value(input, /*breiteOben*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(442:4) {#if breiteVisible}",
    		ctx
    	});

    	return block;
    }

    // (455:4) {#if hoeheVisible}
    function create_if_block_6(ctx) {
    	let div;
    	let label0;
    	let t1;
    	let input;
    	let t2;
    	let label1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label0 = element("label");
    			label0.textContent = "h";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "m";
    			attr_dev(label0, "for", "hoehe");
    			attr_dev(label0, "class", "svelte-rbyv5g");
    			add_location(label0, file, 456, 6, 11534);
    			attr_dev(input, "id", "hoehe");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "placeholder", "50");
    			attr_dev(input, "class", "svelte-rbyv5g");
    			add_location(input, file, 457, 6, 11569);
    			attr_dev(label1, "for", "hoehe");
    			attr_dev(label1, "class", "svelte-rbyv5g");
    			add_location(label1, file, 463, 6, 11680);
    			attr_dev(div, "class", "form-group svelte-rbyv5g");
    			add_location(div, file, 455, 5, 11503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*hoehe*/ ctx[4]);
    			append_dev(div, t2);
    			append_dev(div, label1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[42]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hoehe*/ 16 && to_number(input.value) !== /*hoehe*/ ctx[4]) {
    				set_input_value(input, /*hoehe*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(455:4) {#if hoeheVisible}",
    		ctx
    	});

    	return block;
    }

    // (468:4) {#if breiteobenVisible}
    function create_if_block_5(ctx) {
    	let div;
    	let label0;
    	let t0;
    	let sub;
    	let t2;
    	let input;
    	let t3;
    	let label1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label0 = element("label");
    			t0 = text("b");
    			sub = element("sub");
    			sub.textContent = "o";
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			label1 = element("label");
    			label1.textContent = "m";
    			add_location(sub, file, 469, 31, 11821);
    			attr_dev(label0, "for", "breiteoben");
    			attr_dev(label0, "class", "svelte-rbyv5g");
    			add_location(label0, file, 469, 6, 11796);
    			attr_dev(input, "id", "breiteoben");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "placeholder", "50");
    			attr_dev(input, "class", "svelte-rbyv5g");
    			add_location(input, file, 470, 6, 11848);
    			attr_dev(label1, "for", "breiteoben");
    			attr_dev(label1, "class", "svelte-rbyv5g");
    			add_location(label1, file, 476, 6, 11969);
    			attr_dev(div, "class", "form-group svelte-rbyv5g");
    			add_location(div, file, 468, 5, 11765);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(label0, t0);
    			append_dev(label0, sub);
    			append_dev(div, t2);
    			append_dev(div, input);
    			set_input_value(input, /*breiteOben*/ ctx[2]);
    			append_dev(div, t3);
    			append_dev(div, label1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_3*/ ctx[43]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*breiteOben*/ 4 && to_number(input.value) !== /*breiteOben*/ ctx[2]) {
    				set_input_value(input, /*breiteOben*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(468:4) {#if breiteobenVisible}",
    		ctx
    	});

    	return block;
    }

    // (481:4) {#if breiteuntenVisible}
    function create_if_block_4(ctx) {
    	let div;
    	let label0;
    	let t0;
    	let sub;
    	let t2;
    	let input;
    	let t3;
    	let label1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label0 = element("label");
    			t0 = text("b");
    			sub = element("sub");
    			sub.textContent = "u";
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			label1 = element("label");
    			label1.textContent = "m";
    			add_location(sub, file, 482, 32, 12117);
    			attr_dev(label0, "for", "breiteunten");
    			attr_dev(label0, "class", "svelte-rbyv5g");
    			add_location(label0, file, 482, 6, 12091);
    			attr_dev(input, "id", "breiteunten");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "placeholder", "50");
    			attr_dev(input, "class", "svelte-rbyv5g");
    			add_location(input, file, 483, 6, 12144);
    			attr_dev(label1, "for", "breiteunten");
    			attr_dev(label1, "class", "svelte-rbyv5g");
    			add_location(label1, file, 489, 6, 12267);
    			attr_dev(div, "class", "form-group svelte-rbyv5g");
    			add_location(div, file, 481, 5, 12060);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(label0, t0);
    			append_dev(label0, sub);
    			append_dev(div, t2);
    			append_dev(div, input);
    			set_input_value(input, /*breiteUnten*/ ctx[3]);
    			append_dev(div, t3);
    			append_dev(div, label1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_4*/ ctx[44]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*breiteUnten*/ 8 && to_number(input.value) !== /*breiteUnten*/ ctx[3]) {
    				set_input_value(input, /*breiteUnten*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(481:4) {#if breiteuntenVisible}",
    		ctx
    	});

    	return block;
    }

    // (494:4) {#if xVisible}
    function create_if_block_3(ctx) {
    	let div;
    	let label0;
    	let t1;
    	let input;
    	let t2;
    	let label1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label0 = element("label");
    			label0.textContent = "x";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "m";
    			attr_dev(label0, "for", "x");
    			attr_dev(label0, "class", "svelte-rbyv5g");
    			add_location(label0, file, 495, 6, 12380);
    			attr_dev(input, "id", "x");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "placeholder", "50");
    			attr_dev(input, "class", "svelte-rbyv5g");
    			add_location(input, file, 496, 6, 12411);
    			attr_dev(label1, "for", "x");
    			attr_dev(label1, "class", "svelte-rbyv5g");
    			add_location(label1, file, 502, 6, 12518);
    			attr_dev(div, "class", "form-group svelte-rbyv5g");
    			add_location(div, file, 494, 5, 12349);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*xWert*/ ctx[5]);
    			append_dev(div, t2);
    			append_dev(div, label1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_5*/ ctx[45]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*xWert*/ 32 && to_number(input.value) !== /*xWert*/ ctx[5]) {
    				set_input_value(input, /*xWert*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(494:4) {#if xVisible}",
    		ctx
    	});

    	return block;
    }

    // (507:4) {#if querschnittEingabeVisible}
    function create_if_block_2(ctx) {
    	let div;
    	let label0;
    	let t1;
    	let input;
    	let t2;
    	let label1;
    	let t3;
    	let sup;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label0 = element("label");
    			label0.textContent = "Fläche";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			label1 = element("label");
    			t3 = text("m");
    			sup = element("sup");
    			sup.textContent = "2";
    			attr_dev(label0, "for", "querschnittEingabe");
    			attr_dev(label0, "class", "svelte-rbyv5g");
    			add_location(label0, file, 508, 6, 12638);
    			attr_dev(input, "id", "querschnittEingabe");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "placeholder", "50");
    			attr_dev(input, "class", "svelte-rbyv5g");
    			add_location(input, file, 509, 6, 12691);
    			add_location(sup, file, 515, 39, 12861);
    			attr_dev(label1, "for", "querschnittEingabe");
    			attr_dev(label1, "class", "svelte-rbyv5g");
    			add_location(label1, file, 515, 6, 12828);
    			attr_dev(div, "class", "form-group svelte-rbyv5g");
    			add_location(div, file, 507, 5, 12607);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*querschnittEingabe*/ ctx[6]);
    			append_dev(div, t2);
    			append_dev(div, label1);
    			append_dev(label1, t3);
    			append_dev(label1, sup);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_6*/ ctx[46]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*querschnittEingabe*/ 64 && to_number(input.value) !== /*querschnittEingabe*/ ctx[6]) {
    				set_input_value(input, /*querschnittEingabe*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(507:4) {#if querschnittEingabeVisible}",
    		ctx
    	});

    	return block;
    }

    // (520:4) {#if umfangEingabeVisible}
    function create_if_block_1(ctx) {
    	let div;
    	let label0;
    	let t1;
    	let input;
    	let t2;
    	let label1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label0 = element("label");
    			label0.textContent = "Umfang";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "m";
    			attr_dev(label0, "for", "umfangEingabe");
    			attr_dev(label0, "class", "svelte-rbyv5g");
    			add_location(label0, file, 521, 6, 12972);
    			attr_dev(input, "id", "umfangEingabe");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "placeholder", "50");
    			attr_dev(input, "class", "svelte-rbyv5g");
    			add_location(input, file, 522, 6, 13020);
    			attr_dev(label1, "for", "umfangEingabe");
    			attr_dev(label1, "class", "svelte-rbyv5g");
    			add_location(label1, file, 528, 6, 13147);
    			attr_dev(div, "class", "form-group svelte-rbyv5g");
    			add_location(div, file, 520, 5, 12941);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*umfangEingabe*/ ctx[7]);
    			append_dev(div, t2);
    			append_dev(div, label1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_7*/ ctx[47]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*umfangEingabe*/ 128 && to_number(input.value) !== /*umfangEingabe*/ ctx[7]) {
    				set_input_value(input, /*umfangEingabe*/ ctx[7]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(520:4) {#if umfangEingabeVisible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let hr0;
    	let t3;
    	let h20;
    	let t5;
    	let t6;
    	let div1;
    	let label0;
    	let strong0;
    	let t8;
    	let select0;
    	let t9;
    	let select1;
    	let t10;
    	let div2;
    	let label1;
    	let strong1;
    	let t12;
    	let input0;
    	let t13;
    	let div3;
    	let label2;
    	let strong2;
    	let t15;
    	let label3;
    	let input1;
    	let t16;
    	let t17;
    	let label4;
    	let input2;
    	let t18;
    	let t19;
    	let t20;
    	let div4;
    	let label5;
    	let strong3;
    	let t22;
    	let select2;
    	let t23;
    	let t24;
    	let hr1;
    	let t25;
    	let h21;
    	let t27;
    	let div5;
    	let table;
    	let tr0;
    	let td0;
    	let label6;
    	let t29;
    	let td1;
    	let span0;
    	let t30;
    	let t31;
    	let td2;
    	let label7;
    	let t32;
    	let sup0;
    	let t34;
    	let tr1;
    	let td3;
    	let label8;
    	let t36;
    	let td4;
    	let span1;
    	let t37;
    	let t38;
    	let td5;
    	let label9;
    	let t40;
    	let tr2;
    	let td6;
    	let label10;
    	let t42;
    	let td7;
    	let span2;
    	let t43;
    	let t44;
    	let td8;
    	let label11;
    	let t46;
    	let tr3;
    	let td9;
    	let label12;
    	let t48;
    	let td10;
    	let span3;
    	let t49;
    	let t50;
    	let td11;
    	let label13;
    	let t52;
    	let tr4;
    	let td12;
    	let label14;
    	let t54;
    	let td13;
    	let span4;
    	let t55;
    	let t56;
    	let td14;
    	let label15;
    	let t57;
    	let sup1;
    	let t59;
    	let binding_group;
    	let mounted;
    	let dispose;
    	let if_block0 = /*message*/ ctx[15] && create_if_block_10(ctx);
    	let each_value_2 = /*kategories*/ ctx[29];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*bewuechse*/ ctx[14];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*gefaelleOption*/ ctx[10] === "eingeben") return create_if_block_8;
    		if (/*gefaelleOption*/ ctx[10] === "berechnen") return create_if_block_9;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);
    	let each_value = /*querschnitte*/ ctx[30];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block2 = /*imageSrc*/ ctx[26] && create_if_block(ctx);
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[35][0]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Berechnung der Fliessgeschwindigkeit";
    			t2 = space();
    			hr0 = element("hr");
    			t3 = space();
    			h20 = element("h2");
    			h20.textContent = "Eingaben";
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			div1 = element("div");
    			label0 = element("label");
    			strong0 = element("strong");
    			strong0.textContent = "Kategorie";
    			t8 = space();
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t9 = space();
    			select1 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t10 = space();
    			div2 = element("div");
    			label1 = element("label");
    			strong1 = element("strong");
    			strong1.textContent = "Stricklerindex";
    			t12 = space();
    			input0 = element("input");
    			t13 = space();
    			div3 = element("div");
    			label2 = element("label");
    			strong2 = element("strong");
    			strong2.textContent = "Gefälle";
    			t15 = space();
    			label3 = element("label");
    			input1 = element("input");
    			t16 = text("\n\t\t\teingeben");
    			t17 = space();
    			label4 = element("label");
    			input2 = element("input");
    			t18 = text("\n\t\t\tberechnen");
    			t19 = space();
    			if (if_block1) if_block1.c();
    			t20 = space();
    			div4 = element("div");
    			label5 = element("label");
    			strong3 = element("strong");
    			strong3.textContent = "Flußquerschnitt";
    			t22 = space();
    			select2 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t23 = space();
    			if (if_block2) if_block2.c();
    			t24 = space();
    			hr1 = element("hr");
    			t25 = space();
    			h21 = element("h2");
    			h21.textContent = "Ergebnisse";
    			t27 = space();
    			div5 = element("div");
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			label6 = element("label");
    			label6.textContent = "Querschnittsfläche";
    			t29 = space();
    			td1 = element("td");
    			span0 = element("span");
    			t30 = text(/*flaeche*/ ctx[16]);
    			t31 = space();
    			td2 = element("td");
    			label7 = element("label");
    			t32 = text("m");
    			sup0 = element("sup");
    			sup0.textContent = "2";
    			t34 = space();
    			tr1 = element("tr");
    			td3 = element("td");
    			label8 = element("label");
    			label8.textContent = "Benetzter Umfang";
    			t36 = space();
    			td4 = element("td");
    			span1 = element("span");
    			t37 = text(/*umfang*/ ctx[17]);
    			t38 = space();
    			td5 = element("td");
    			label9 = element("label");
    			label9.textContent = "m";
    			t40 = space();
    			tr2 = element("tr");
    			td6 = element("td");
    			label10 = element("label");
    			label10.textContent = "Geschwindigkeit";
    			t42 = space();
    			td7 = element("td");
    			span2 = element("span");
    			t43 = text(/*geschwindigkeitms*/ ctx[18]);
    			t44 = space();
    			td8 = element("td");
    			label11 = element("label");
    			label11.textContent = "m/s";
    			t46 = space();
    			tr3 = element("tr");
    			td9 = element("td");
    			label12 = element("label");
    			label12.textContent = "Geschwindigkeit";
    			t48 = space();
    			td10 = element("td");
    			span3 = element("span");
    			t49 = text(/*geschwindigkeitkt*/ ctx[19]);
    			t50 = space();
    			td11 = element("td");
    			label13 = element("label");
    			label13.textContent = "kt";
    			t52 = space();
    			tr4 = element("tr");
    			td12 = element("td");
    			label14 = element("label");
    			label14.textContent = "Durchfluss";
    			t54 = space();
    			td13 = element("td");
    			span4 = element("span");
    			t55 = text(/*durchfluss*/ ctx[20]);
    			t56 = space();
    			td14 = element("td");
    			label15 = element("label");
    			t57 = text("m");
    			sup1 = element("sup");
    			sup1.textContent = "3";
    			t59 = text("/s");
    			if (!src_url_equal(img.src, img_src_value = "/GeoInfoSim.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Logo");
    			set_style(img, "width", "150px");
    			set_style(img, "height", "150px");
    			attr_dev(img, "class", "svelte-rbyv5g");
    			add_location(img, file, 341, 2, 8875);
    			add_location(h1, file, 346, 2, 8966);
    			attr_dev(div0, "class", "form-group svelte-rbyv5g");
    			add_location(div0, file, 340, 1, 8848);
    			add_location(hr0, file, 349, 1, 9022);
    			add_location(h20, file, 350, 1, 9030);
    			add_location(strong0, file, 356, 28, 9160);
    			attr_dev(label0, "for", "cmbkategorie");
    			attr_dev(label0, "class", "svelte-rbyv5g");
    			add_location(label0, file, 356, 2, 9134);
    			attr_dev(select0, "id", "cmbkategorie");
    			if (/*selectedKategory*/ ctx[13] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[31].call(select0));
    			add_location(select0, file, 357, 2, 9197);
    			attr_dev(select1, "id", "cmbbewuchs");
    			if (/*selectedBewuchs*/ ctx[12] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[32].call(select1));
    			add_location(select1, file, 362, 2, 9362);
    			attr_dev(div1, "class", "form-group svelte-rbyv5g");
    			add_location(div1, file, 355, 1, 9107);
    			add_location(strong1, file, 369, 25, 9577);
    			attr_dev(label1, "for", "strickler");
    			attr_dev(label1, "class", "svelte-rbyv5g");
    			add_location(label1, file, 369, 2, 9554);
    			attr_dev(input0, "id", "strickler");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "35");
    			attr_dev(input0, "class", "svelte-rbyv5g");
    			add_location(input0, file, 370, 2, 9619);
    			attr_dev(div2, "class", "form-group svelte-rbyv5g");
    			add_location(div2, file, 368, 1, 9527);
    			add_location(strong2, file, 378, 24, 9783);
    			attr_dev(label2, "for", "gefaelle");
    			attr_dev(label2, "class", "svelte-rbyv5g");
    			add_location(label2, file, 378, 2, 9761);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "gefaelleOption");
    			input1.__value = "eingeben";
    			input1.value = input1.__value;
    			attr_dev(input1, "class", "svelte-rbyv5g");
    			add_location(input1, file, 380, 3, 9829);
    			attr_dev(label3, "class", "svelte-rbyv5g");
    			add_location(label3, file, 379, 2, 9818);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "gefaelleOption");
    			input2.__value = "berechnen";
    			input2.value = input2.__value;
    			attr_dev(input2, "class", "svelte-rbyv5g");
    			add_location(input2, file, 389, 3, 9974);
    			attr_dev(label4, "class", "svelte-rbyv5g");
    			add_location(label4, file, 388, 2, 9963);
    			attr_dev(div3, "class", "form-group small-margin svelte-rbyv5g");
    			add_location(div3, file, 377, 1, 9721);
    			add_location(strong3, file, 429, 27, 10849);
    			attr_dev(label5, "for", "querschnitt");
    			attr_dev(label5, "class", "svelte-rbyv5g");
    			add_location(label5, file, 429, 2, 10824);
    			attr_dev(select2, "id", "cmbquerschnitt");
    			if (/*selectedQuerschnitt*/ ctx[11] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[40].call(select2));
    			add_location(select2, file, 430, 2, 10892);
    			attr_dev(div4, "class", "form-group svelte-rbyv5g");
    			add_location(div4, file, 428, 1, 10797);
    			add_location(hr1, file, 535, 1, 13234);
    			add_location(h21, file, 536, 1, 13242);
    			attr_dev(label6, "for", "flaeche");
    			attr_dev(label6, "class", "svelte-rbyv5g");
    			add_location(label6, file, 541, 5, 13344);
    			attr_dev(td0, "class", "svelte-rbyv5g");
    			add_location(td0, file, 540, 4, 13334);
    			attr_dev(span0, "id", "flaeche");
    			add_location(span0, file, 544, 5, 13416);
    			attr_dev(td1, "class", "svelte-rbyv5g");
    			add_location(td1, file, 543, 4, 13406);
    			add_location(sup0, file, 547, 20, 13491);
    			attr_dev(label7, "for", "");
    			attr_dev(label7, "class", "svelte-rbyv5g");
    			add_location(label7, file, 547, 5, 13476);
    			attr_dev(td2, "class", "svelte-rbyv5g");
    			add_location(td2, file, 546, 4, 13466);
    			add_location(tr0, file, 539, 3, 13325);
    			attr_dev(label8, "for", "umfang");
    			attr_dev(label8, "class", "svelte-rbyv5g");
    			add_location(label8, file, 552, 5, 13553);
    			attr_dev(td3, "class", "svelte-rbyv5g");
    			add_location(td3, file, 551, 4, 13543);
    			attr_dev(span1, "id", "umfang");
    			add_location(span1, file, 555, 5, 13622);
    			attr_dev(td4, "class", "svelte-rbyv5g");
    			add_location(td4, file, 554, 4, 13612);
    			attr_dev(label9, "for", "");
    			attr_dev(label9, "class", "svelte-rbyv5g");
    			add_location(label9, file, 558, 5, 13680);
    			attr_dev(td5, "class", "svelte-rbyv5g");
    			add_location(td5, file, 557, 4, 13670);
    			add_location(tr1, file, 550, 3, 13534);
    			attr_dev(label10, "for", "geschwindigkeit");
    			attr_dev(label10, "class", "svelte-rbyv5g");
    			add_location(label10, file, 563, 5, 13745);
    			attr_dev(td6, "class", "svelte-rbyv5g");
    			add_location(td6, file, 562, 4, 13735);
    			attr_dev(span2, "id", "geschwindigkeitms");
    			add_location(span2, file, 566, 5, 13822);
    			attr_dev(td7, "class", "svelte-rbyv5g");
    			add_location(td7, file, 565, 4, 13812);
    			attr_dev(label11, "for", "");
    			attr_dev(label11, "class", "svelte-rbyv5g");
    			add_location(label11, file, 569, 5, 13902);
    			attr_dev(td8, "class", "svelte-rbyv5g");
    			add_location(td8, file, 568, 4, 13892);
    			add_location(tr2, file, 561, 3, 13726);
    			attr_dev(label12, "for", "geschwindigkeitkt");
    			attr_dev(label12, "class", "svelte-rbyv5g");
    			add_location(label12, file, 574, 5, 13970);
    			attr_dev(td9, "class", "svelte-rbyv5g");
    			add_location(td9, file, 573, 4, 13960);
    			attr_dev(span3, "id", "geschwindigkeitkt");
    			add_location(span3, file, 577, 5, 14049);
    			attr_dev(td10, "class", "svelte-rbyv5g");
    			add_location(td10, file, 576, 4, 14039);
    			attr_dev(label13, "for", "");
    			attr_dev(label13, "class", "svelte-rbyv5g");
    			add_location(label13, file, 580, 5, 14129);
    			attr_dev(td11, "class", "svelte-rbyv5g");
    			add_location(td11, file, 579, 4, 14119);
    			add_location(tr3, file, 572, 3, 13951);
    			attr_dev(label14, "for", "durchfluss");
    			attr_dev(label14, "class", "svelte-rbyv5g");
    			add_location(label14, file, 585, 5, 14195);
    			attr_dev(td12, "class", "svelte-rbyv5g");
    			add_location(td12, file, 584, 4, 14185);
    			attr_dev(span4, "id", "durchfluss");
    			add_location(span4, file, 588, 5, 14262);
    			attr_dev(td13, "class", "svelte-rbyv5g");
    			add_location(td13, file, 587, 4, 14252);
    			add_location(sup1, file, 591, 21, 14344);
    			attr_dev(label15, "for", "");
    			attr_dev(label15, "class", "svelte-rbyv5g");
    			add_location(label15, file, 591, 5, 14328);
    			attr_dev(td14, "class", "svelte-rbyv5g");
    			add_location(td14, file, 590, 4, 14318);
    			add_location(tr4, file, 583, 3, 14176);
    			attr_dev(table, "class", "form-table svelte-rbyv5g");
    			add_location(table, file, 538, 2, 13295);
    			attr_dev(div5, "class", "table-container svelte-rbyv5g");
    			add_location(div5, file, 537, 1, 13263);
    			attr_dev(main, "class", "svelte-rbyv5g");
    			add_location(main, file, 339, 0, 8840);
    			binding_group.p(input1, input2);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, h1);
    			append_dev(main, t2);
    			append_dev(main, hr0);
    			append_dev(main, t3);
    			append_dev(main, h20);
    			append_dev(main, t5);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t6);
    			append_dev(main, div1);
    			append_dev(div1, label0);
    			append_dev(label0, strong0);
    			append_dev(div1, t8);
    			append_dev(div1, select0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(select0, null);
    				}
    			}

    			select_option(select0, /*selectedKategory*/ ctx[13], true);
    			append_dev(div1, t9);
    			append_dev(div1, select1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(select1, null);
    				}
    			}

    			select_option(select1, /*selectedBewuchs*/ ctx[12], true);
    			append_dev(main, t10);
    			append_dev(main, div2);
    			append_dev(div2, label1);
    			append_dev(label1, strong1);
    			append_dev(div2, t12);
    			append_dev(div2, input0);
    			set_input_value(input0, /*strickler*/ ctx[0]);
    			append_dev(main, t13);
    			append_dev(main, div3);
    			append_dev(div3, label2);
    			append_dev(label2, strong2);
    			append_dev(div3, t15);
    			append_dev(div3, label3);
    			append_dev(label3, input1);
    			input1.checked = input1.__value === /*gefaelleOption*/ ctx[10];
    			append_dev(label3, t16);
    			append_dev(div3, t17);
    			append_dev(div3, label4);
    			append_dev(label4, input2);
    			input2.checked = input2.__value === /*gefaelleOption*/ ctx[10];
    			append_dev(label4, t18);
    			append_dev(main, t19);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t20);
    			append_dev(main, div4);
    			append_dev(div4, label5);
    			append_dev(label5, strong3);
    			append_dev(div4, t22);
    			append_dev(div4, select2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select2, null);
    				}
    			}

    			select_option(select2, /*selectedQuerschnitt*/ ctx[11], true);
    			append_dev(main, t23);
    			if (if_block2) if_block2.m(main, null);
    			append_dev(main, t24);
    			append_dev(main, hr1);
    			append_dev(main, t25);
    			append_dev(main, h21);
    			append_dev(main, t27);
    			append_dev(main, div5);
    			append_dev(div5, table);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, label6);
    			append_dev(tr0, t29);
    			append_dev(tr0, td1);
    			append_dev(td1, span0);
    			append_dev(span0, t30);
    			append_dev(tr0, t31);
    			append_dev(tr0, td2);
    			append_dev(td2, label7);
    			append_dev(label7, t32);
    			append_dev(label7, sup0);
    			append_dev(table, t34);
    			append_dev(table, tr1);
    			append_dev(tr1, td3);
    			append_dev(td3, label8);
    			append_dev(tr1, t36);
    			append_dev(tr1, td4);
    			append_dev(td4, span1);
    			append_dev(span1, t37);
    			append_dev(tr1, t38);
    			append_dev(tr1, td5);
    			append_dev(td5, label9);
    			append_dev(table, t40);
    			append_dev(table, tr2);
    			append_dev(tr2, td6);
    			append_dev(td6, label10);
    			append_dev(tr2, t42);
    			append_dev(tr2, td7);
    			append_dev(td7, span2);
    			append_dev(span2, t43);
    			append_dev(tr2, t44);
    			append_dev(tr2, td8);
    			append_dev(td8, label11);
    			append_dev(table, t46);
    			append_dev(table, tr3);
    			append_dev(tr3, td9);
    			append_dev(td9, label12);
    			append_dev(tr3, t48);
    			append_dev(tr3, td10);
    			append_dev(td10, span3);
    			append_dev(span3, t49);
    			append_dev(tr3, t50);
    			append_dev(tr3, td11);
    			append_dev(td11, label13);
    			append_dev(table, t52);
    			append_dev(table, tr4);
    			append_dev(tr4, td12);
    			append_dev(td12, label14);
    			append_dev(tr4, t54);
    			append_dev(tr4, td13);
    			append_dev(td13, span4);
    			append_dev(span4, t55);
    			append_dev(tr4, t56);
    			append_dev(tr4, td14);
    			append_dev(td14, label15);
    			append_dev(label15, t57);
    			append_dev(label15, sup1);
    			append_dev(label15, t59);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[31]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[32]),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[33]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[34]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[36]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[40])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*message*/ ctx[15]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					if_block0.m(main, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*kategories*/ 536870912) {
    				each_value_2 = /*kategories*/ ctx[29];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*selectedKategory, kategories*/ 536879104) {
    				select_option(select0, /*selectedKategory*/ ctx[13]);
    			}

    			if (dirty[0] & /*bewuechse*/ 16384) {
    				each_value_1 = /*bewuechse*/ ctx[14];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*selectedBewuchs, bewuechse*/ 20480) {
    				select_option(select1, /*selectedBewuchs*/ ctx[12]);
    			}

    			if (dirty[0] & /*strickler*/ 1 && to_number(input0.value) !== /*strickler*/ ctx[0]) {
    				set_input_value(input0, /*strickler*/ ctx[0]);
    			}

    			if (dirty[0] & /*gefaelleOption*/ 1024) {
    				input1.checked = input1.__value === /*gefaelleOption*/ ctx[10];
    			}

    			if (dirty[0] & /*gefaelleOption*/ 1024) {
    				input2.checked = input2.__value === /*gefaelleOption*/ ctx[10];
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(main, t20);
    				}
    			}

    			if (dirty[0] & /*querschnitte*/ 1073741824) {
    				each_value = /*querschnitte*/ ctx[30];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*selectedQuerschnitt, querschnitte*/ 1073743872) {
    				select_option(select2, /*selectedQuerschnitt*/ ctx[11]);
    			}

    			if (/*imageSrc*/ ctx[26]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					if_block2.m(main, t24);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty[0] & /*flaeche*/ 65536) set_data_dev(t30, /*flaeche*/ ctx[16]);
    			if (dirty[0] & /*umfang*/ 131072) set_data_dev(t37, /*umfang*/ ctx[17]);
    			if (dirty[0] & /*geschwindigkeitms*/ 262144) set_data_dev(t43, /*geschwindigkeitms*/ ctx[18]);
    			if (dirty[0] & /*geschwindigkeitkt*/ 524288) set_data_dev(t49, /*geschwindigkeitkt*/ ctx[19]);
    			if (dirty[0] & /*durchfluss*/ 1048576) set_data_dev(t55, /*durchfluss*/ ctx[20]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);

    			if (if_block1) {
    				if_block1.d();
    			}

    			destroy_each(each_blocks, detaching);
    			if (if_block2) if_block2.d();
    			binding_group.r();
    			mounted = false;
    			run_all(dispose);
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
    	let bewuechse;
    	let imageSrc;
    	let breiteVisible;
    	let hoeheVisible;
    	let breiteobenVisible;
    	let breiteuntenVisible;
    	let xVisible;
    	let querschnittEingabeVisible;
    	let umfangEingabeVisible;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let strickler = 0; // Declare strickler
    	let gefaelle = 0; // Declare gefaelle
    	let message = "";
    	let breiteOben = 10; // Declare breiteOben
    	let breiteUnten = 5; // Declare breiteUnten
    	let hoehe = 1; // Declare hoehe
    	let xWert = 0; // Declare xWert
    	let querschnittEingabe = 50; // Declare querschnittEingabe
    	let umfangEingabe = 50; // Declare umfangEingabe
    	let hoehenunterschied = 0; // Declare hoehenunterschied
    	let laengeFluss = 0; // Declare laengeFluss
    	let gefaelleOption = "eingeben"; // Declare gefaelleOption

    	// Variable to store the selected value
    	let selectedQuerschnitt = "";

    	let selectedBewuchs = "";
    	let flaeche = 0;
    	let umfang = 0;
    	let geschwindigkeitms = 0;
    	let geschwindigkeitkt = 0;
    	let durchfluss = 0;

    	//Kategorien des Fliessgewässers festlegen
    	let kategories = ["Bach", "Fluss", "Kanal", "Sonstige Fläche"];

    	let selectedKategory = kategories[1];

    	//Querschnitte definieren und ein-/ausblenden je nach  Bedarf
    	let querschnitte = [
    		"Rechteck",
    		"Gleichschenkliges Trapez",
    		"Allgemeines Trapez",
    		"Rohrsegment",
    		"Benutzerdefiniert"
    	];

    	selectedQuerschnitt = querschnitte[0];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function select0_change_handler() {
    		selectedKategory = select_value(this);
    		$$invalidate(13, selectedKategory);
    		$$invalidate(29, kategories);
    	}

    	function select1_change_handler() {
    		selectedBewuchs = select_value(this);
    		$$invalidate(12, selectedBewuchs);
    		($$invalidate(14, bewuechse), $$invalidate(13, selectedKategory));
    	}

    	function input0_input_handler() {
    		strickler = to_number(this.value);
    		((($$invalidate(0, strickler), $$invalidate(13, selectedKategory)), $$invalidate(14, bewuechse)), $$invalidate(12, selectedBewuchs));
    	}

    	function input1_change_handler() {
    		gefaelleOption = this.__value;
    		$$invalidate(10, gefaelleOption);
    	}

    	function input2_change_handler() {
    		gefaelleOption = this.__value;
    		$$invalidate(10, gefaelleOption);
    	}

    	function input_input_handler() {
    		gefaelle = to_number(this.value);
    		((($$invalidate(1, gefaelle), $$invalidate(10, gefaelleOption)), $$invalidate(8, hoehenunterschied)), $$invalidate(9, laengeFluss));
    	}

    	function input0_input_handler_1() {
    		hoehenunterschied = to_number(this.value);
    		$$invalidate(8, hoehenunterschied);
    	}

    	function input1_input_handler() {
    		laengeFluss = to_number(this.value);
    		$$invalidate(9, laengeFluss);
    	}

    	function select2_change_handler() {
    		selectedQuerschnitt = select_value(this);
    		$$invalidate(11, selectedQuerschnitt);
    		$$invalidate(30, querschnitte);
    	}

    	function input_input_handler_1() {
    		breiteOben = to_number(this.value);
    		$$invalidate(2, breiteOben);
    	}

    	function input_input_handler_2() {
    		hoehe = to_number(this.value);
    		$$invalidate(4, hoehe);
    	}

    	function input_input_handler_3() {
    		breiteOben = to_number(this.value);
    		$$invalidate(2, breiteOben);
    	}

    	function input_input_handler_4() {
    		breiteUnten = to_number(this.value);
    		$$invalidate(3, breiteUnten);
    	}

    	function input_input_handler_5() {
    		xWert = to_number(this.value);
    		$$invalidate(5, xWert);
    	}

    	function input_input_handler_6() {
    		querschnittEingabe = to_number(this.value);
    		$$invalidate(6, querschnittEingabe);
    	}

    	function input_input_handler_7() {
    		umfangEingabe = to_number(this.value);
    		$$invalidate(7, umfangEingabe);
    	}

    	$$self.$capture_state = () => ({
    		FlowCalculator,
    		strickler,
    		gefaelle,
    		message,
    		breiteOben,
    		breiteUnten,
    		hoehe,
    		xWert,
    		querschnittEingabe,
    		umfangEingabe,
    		hoehenunterschied,
    		laengeFluss,
    		gefaelleOption,
    		selectedQuerschnitt,
    		selectedBewuchs,
    		flaeche,
    		umfang,
    		geschwindigkeitms,
    		geschwindigkeitkt,
    		durchfluss,
    		kategories,
    		selectedKategory,
    		querschnitte,
    		xVisible,
    		breiteuntenVisible,
    		breiteobenVisible,
    		hoeheVisible,
    		breiteVisible,
    		imageSrc,
    		umfangEingabeVisible,
    		querschnittEingabeVisible,
    		bewuechse
    	});

    	$$self.$inject_state = $$props => {
    		if ('strickler' in $$props) $$invalidate(0, strickler = $$props.strickler);
    		if ('gefaelle' in $$props) $$invalidate(1, gefaelle = $$props.gefaelle);
    		if ('message' in $$props) $$invalidate(15, message = $$props.message);
    		if ('breiteOben' in $$props) $$invalidate(2, breiteOben = $$props.breiteOben);
    		if ('breiteUnten' in $$props) $$invalidate(3, breiteUnten = $$props.breiteUnten);
    		if ('hoehe' in $$props) $$invalidate(4, hoehe = $$props.hoehe);
    		if ('xWert' in $$props) $$invalidate(5, xWert = $$props.xWert);
    		if ('querschnittEingabe' in $$props) $$invalidate(6, querschnittEingabe = $$props.querschnittEingabe);
    		if ('umfangEingabe' in $$props) $$invalidate(7, umfangEingabe = $$props.umfangEingabe);
    		if ('hoehenunterschied' in $$props) $$invalidate(8, hoehenunterschied = $$props.hoehenunterschied);
    		if ('laengeFluss' in $$props) $$invalidate(9, laengeFluss = $$props.laengeFluss);
    		if ('gefaelleOption' in $$props) $$invalidate(10, gefaelleOption = $$props.gefaelleOption);
    		if ('selectedQuerschnitt' in $$props) $$invalidate(11, selectedQuerschnitt = $$props.selectedQuerschnitt);
    		if ('selectedBewuchs' in $$props) $$invalidate(12, selectedBewuchs = $$props.selectedBewuchs);
    		if ('flaeche' in $$props) $$invalidate(16, flaeche = $$props.flaeche);
    		if ('umfang' in $$props) $$invalidate(17, umfang = $$props.umfang);
    		if ('geschwindigkeitms' in $$props) $$invalidate(18, geschwindigkeitms = $$props.geschwindigkeitms);
    		if ('geschwindigkeitkt' in $$props) $$invalidate(19, geschwindigkeitkt = $$props.geschwindigkeitkt);
    		if ('durchfluss' in $$props) $$invalidate(20, durchfluss = $$props.durchfluss);
    		if ('kategories' in $$props) $$invalidate(29, kategories = $$props.kategories);
    		if ('selectedKategory' in $$props) $$invalidate(13, selectedKategory = $$props.selectedKategory);
    		if ('querschnitte' in $$props) $$invalidate(30, querschnitte = $$props.querschnitte);
    		if ('xVisible' in $$props) $$invalidate(21, xVisible = $$props.xVisible);
    		if ('breiteuntenVisible' in $$props) $$invalidate(22, breiteuntenVisible = $$props.breiteuntenVisible);
    		if ('breiteobenVisible' in $$props) $$invalidate(23, breiteobenVisible = $$props.breiteobenVisible);
    		if ('hoeheVisible' in $$props) $$invalidate(24, hoeheVisible = $$props.hoeheVisible);
    		if ('breiteVisible' in $$props) $$invalidate(25, breiteVisible = $$props.breiteVisible);
    		if ('imageSrc' in $$props) $$invalidate(26, imageSrc = $$props.imageSrc);
    		if ('umfangEingabeVisible' in $$props) $$invalidate(27, umfangEingabeVisible = $$props.umfangEingabeVisible);
    		if ('querschnittEingabeVisible' in $$props) $$invalidate(28, querschnittEingabeVisible = $$props.querschnittEingabeVisible);
    		if ('bewuechse' in $$props) $$invalidate(14, bewuechse = $$props.bewuechse);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*selectedKategory*/ 8192) {
    			if (selectedKategory === "Bach") {
    				$$invalidate(14, bewuechse = [
    					"mäßiger Uferbewuchs",
    					"üppiger Uferbewuchs",
    					"verwachsen (Sträucher/Bäume)",
    					"mit großen Steinen",
    					"mit großen bewegten Steinen",
    					"Waldgraben; wenig Bewuchs",
    					"Betongerinne; neu/glatt",
    					"Betongerinne; alt/rau",
    					"Holzrinne",
    					"Gerinne; gepflastert",
    					"teils gepflastert, teils Wiese",
    					"naturnahe Sole; Ufermauern"
    				]);
    			} else if (selectedKategory === "Fluss") {
    				$$invalidate(14, bewuechse = [
    					"mäßiger Uferbewuchs",
    					"üppiger Uferbewuchs",
    					"verwachsen (Sträucher/Bäume)",
    					"mit großen Steinen",
    					"mit großen bewegten Steinen",
    					"Waldgraben; wenig Bewuchs",
    					"Betongerinne; neu/glatt",
    					"Betongerinne; alt/rau",
    					"Gerinne; gepflastert",
    					"teils gepflastert, teils Wiese",
    					"naturnahe Sole; Ufermauern"
    				]);
    			} else if (selectedKategory === "Kanal") {
    				$$invalidate(14, bewuechse = [
    					"Erdkanal; geringer Uferbewuchs",
    					"Erdkanal; üppiger Uferbewuchs",
    					"Beton; neu/glatt",
    					"Beton; alt/rau",
    					"Ziegel",
    					"Holz"
    				]);
    			} else if (selectedKategory === "Sonstige Fläche") {
    				$$invalidate(14, bewuechse = [
    					"Beton; neu/glatt",
    					"Beton; alt/rau",
    					"Asphalt",
    					"Holz",
    					"Erdboden; glatt",
    					"Erdboden; rau",
    					"Wiese; mittelhoch"
    				]);
    			} else {
    				//Fehlermeldung
    				console.log("Error");
    			}
    		}

    		if ($$self.$$.dirty[0] & /*selectedKategory, bewuechse, selectedBewuchs, strickler*/ 28673) {
    			// Stricklerindizes für die verschiednen Gewässerkategorien zuordnen
    			{
    				if (selectedKategory === "Bach") {
    					switch (bewuechse.indexOf(selectedBewuchs)) {
    						case 0:
    							if (strickler === 0) $$invalidate(0, strickler = 30);
    							break;
    						case 1:
    							if (strickler === 0) $$invalidate(0, strickler = 22.5);
    							break;
    						case 2:
    							if (strickler === 0) $$invalidate(0, strickler = 15);
    							break;
    						case 3:
    							if (strickler === 0) $$invalidate(0, strickler = 22.5);
    							break;
    						case 4:
    							if (strickler === 0) $$invalidate(0, strickler = 15);
    							break;
    						case 5:
    							if (strickler === 0) $$invalidate(0, strickler = 30);
    							break;
    						case 6:
    							if (strickler === 0) $$invalidate(0, strickler = 90);
    							break;
    						case 7:
    							if (strickler === 0) $$invalidate(0, strickler = 60);
    							break;
    						case 8:
    							if (strickler === 0) $$invalidate(0, strickler = 75);
    							break;
    						case 9:
    							if (strickler === 0) $$invalidate(0, strickler = 50);
    							break;
    						case 10:
    							if (strickler === 0) $$invalidate(0, strickler = 40);
    							break;
    						case 11:
    							if (strickler === 0) $$invalidate(0, strickler = 40);
    							break;
    					}
    				} else if (selectedKategory === "Fluss") {
    					switch (bewuechse.indexOf(selectedBewuchs)) {
    						case 0:
    							if (strickler === 0) $$invalidate(0, strickler = 35);
    							break;
    						case 1:
    							if (strickler === 0) $$invalidate(0, strickler = 30);
    							break;
    						case 2:
    							if (strickler === 0) $$invalidate(0, strickler = 25);
    							break;
    						case 3:
    							if (strickler === 0) $$invalidate(0, strickler = 20);
    							break;
    						case 4:
    							if (strickler === 0) $$invalidate(0, strickler = 90);
    							break;
    						case 5:
    							if (strickler === 0) $$invalidate(0, strickler = 60);
    							break;
    						case 6:
    							if (strickler === 0) $$invalidate(0, strickler = 50);
    							break;
    						case 7:
    							if (strickler === 0) $$invalidate(0, strickler = 40);
    							break;
    						case 8:
    							if (strickler === 0) $$invalidate(0, strickler = 40);
    							break;
    					}
    				} else if (selectedKategory === "Kanal") {
    					switch (bewuechse.indexOf(selectedBewuchs)) {
    						case 0:
    							if (strickler === 0) $$invalidate(0, strickler = 40);
    							break;
    						case 1:
    							if (strickler === 0) $$invalidate(0, strickler = 30);
    							break;
    						case 2:
    							if (strickler === 0) $$invalidate(0, strickler = 90);
    							break;
    						case 3:
    							if (strickler === 0) $$invalidate(0, strickler = 60);
    							break;
    						case 4:
    							if (strickler === 0) $$invalidate(0, strickler = 70);
    							break;
    						case 5:
    							if (strickler === 0) $$invalidate(0, strickler = 75);
    							break;
    					}
    				} else if (selectedKategory === "Sonstige Fläche") {
    					switch (bewuechse.indexOf(selectedBewuchs)) {
    						case 0:
    							if (strickler === 0) $$invalidate(0, strickler = 90);
    							break;
    						case 1:
    							if (strickler === 0) $$invalidate(0, strickler = 60);
    							break;
    						case 2:
    							if (strickler === 0) $$invalidate(0, strickler = 70);
    							break;
    						case 3:
    							if (strickler === 0) $$invalidate(0, strickler = 75);
    							break;
    						case 4:
    							if (strickler === 0) $$invalidate(0, strickler = 50);
    							break;
    						case 5:
    							if (strickler === 0) $$invalidate(0, strickler = 35);
    							break;
    					}
    				} else {
    					$$invalidate(0, strickler = 0);

    					//Fehlermeldung
    					console.log("Error");
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*selectedQuerschnitt*/ 2048) {
    			if (selectedQuerschnitt === "Rechteck") {
    				$$invalidate(26, imageSrc = "/Rechteck_Ausschnitt.png");
    				$$invalidate(25, breiteVisible = true);
    				$$invalidate(24, hoeheVisible = true);
    				$$invalidate(23, breiteobenVisible = false);
    				$$invalidate(22, breiteuntenVisible = false);
    				$$invalidate(21, xVisible = false);
    				$$invalidate(28, querschnittEingabeVisible = false);
    				$$invalidate(27, umfangEingabeVisible = false);
    			} else if (selectedQuerschnitt === "Gleichschenkliges Trapez") {
    				$$invalidate(26, imageSrc = "/GleichschenkligesTrapez_Ausschnitt.png");
    				$$invalidate(25, breiteVisible = false);
    				$$invalidate(24, hoeheVisible = true);
    				$$invalidate(23, breiteobenVisible = true);
    				$$invalidate(22, breiteuntenVisible = true);
    				$$invalidate(21, xVisible = false);
    				$$invalidate(28, querschnittEingabeVisible = false);
    				$$invalidate(27, umfangEingabeVisible = false);
    			} else if (selectedQuerschnitt === "Allgemeines Trapez") {
    				$$invalidate(26, imageSrc = "/AllgemeinesTrapez_Ausschnitt.png");
    				$$invalidate(25, breiteVisible = false);
    				$$invalidate(24, hoeheVisible = true);
    				$$invalidate(23, breiteobenVisible = true);
    				$$invalidate(22, breiteuntenVisible = true);
    				$$invalidate(21, xVisible = true);
    				$$invalidate(28, querschnittEingabeVisible = false);
    				$$invalidate(27, umfangEingabeVisible = false);
    			} else if (selectedQuerschnitt === "Rohrsegment") {
    				$$invalidate(26, imageSrc = "/Rohrsegement_Ausschnitt.png");
    				$$invalidate(25, breiteVisible = false);
    				$$invalidate(24, hoeheVisible = true);
    				$$invalidate(23, breiteobenVisible = true);
    				$$invalidate(22, breiteuntenVisible = false);
    				$$invalidate(21, xVisible = false);
    				$$invalidate(28, querschnittEingabeVisible = false);
    				$$invalidate(27, umfangEingabeVisible = false);
    			} else if (selectedQuerschnitt === "Benutzerdefiniert") {
    				$$invalidate(26, imageSrc = "/Benutzerdefiniert.png");
    				$$invalidate(25, breiteVisible = false);
    				$$invalidate(24, hoeheVisible = false);
    				$$invalidate(23, breiteobenVisible = false);
    				$$invalidate(22, breiteuntenVisible = false);
    				$$invalidate(21, xVisible = false);
    				$$invalidate(28, querschnittEingabeVisible = true);
    				$$invalidate(27, umfangEingabeVisible = true);
    			} else {
    				$$invalidate(26, imageSrc = "");
    				$$invalidate(25, breiteVisible = false);
    				$$invalidate(24, hoeheVisible = false);
    				$$invalidate(23, breiteobenVisible = false);
    				$$invalidate(22, breiteuntenVisible = false);
    				$$invalidate(21, xVisible = false);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*gefaelleOption, hoehenunterschied, laengeFluss, gefaelle*/ 1794) {
    			{
    				if (gefaelleOption === "berechnen") {
    					$$invalidate(1, gefaelle = FlowCalculator.gefaelleRechnen(hoehenunterschied, laengeFluss));
    					$$invalidate(1, gefaelle = parseFloat(gefaelle.toFixed(2)));
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*strickler, gefaelle, selectedQuerschnitt, breiteOben, hoehe, breiteUnten, xWert, querschnittEingabe, umfangEingabe*/ 2303) {
    			{
    				//Ergebnisse bereitstellen und fehlende Eingaben abfangen
    				if (strickler === 0 || gefaelle === 0) {
    					$$invalidate(16, flaeche = 0);
    					$$invalidate(17, umfang = 0);
    					$$invalidate(18, geschwindigkeitms = 0);
    					$$invalidate(19, geschwindigkeitkt = 0);
    					$$invalidate(20, durchfluss = 0);
    					$$invalidate(15, message = "Bitte geben Sie einen Stricklerindex und ein Gefälle ein.");
    				} else {
    					$$invalidate(15, message = "");
    				}

    				let result;

    				if (selectedQuerschnitt === "Rechteck") {
    					result = FlowCalculator.rechteck(breiteOben, hoehe, gefaelle, strickler);
    				} else if (selectedQuerschnitt === "Gleichschenkliges Trapez") {
    					result = FlowCalculator.gleichschenkligesTrapez(breiteOben, breiteUnten, hoehe, gefaelle, strickler);
    				} else if (selectedQuerschnitt === "Allgemeines Trapez") {
    					result = FlowCalculator.allgemeinesTrapez(breiteOben, breiteUnten, xWert, hoehe, gefaelle, strickler);
    				} else if (selectedQuerschnitt === "Rohrsegment") {
    					result = FlowCalculator.rohrsegment(breiteOben, hoehe, gefaelle, strickler);
    				} else if (selectedQuerschnitt === "Benutzerdefiniert") {
    					result = FlowCalculator.benutzerdefiniert(gefaelle, strickler, querschnittEingabe, umfangEingabe);
    				}

    				if (result) {
    					$$invalidate(16, flaeche = parseFloat(result.querschnittsflaeche.toFixed(1)));
    					$$invalidate(17, umfang = parseFloat(result.benetzterUmfang.toFixed(1)));
    					$$invalidate(18, geschwindigkeitms = parseFloat(result.vMittel.toFixed(1)));
    					$$invalidate(19, geschwindigkeitkt = parseFloat((result.vMittel * 3.6 / 1.852).toFixed(1)));
    					$$invalidate(20, durchfluss = parseFloat(result.volMenge.toFixed(1)));
    				}
    			}
    		}
    	};

    	$$invalidate(14, bewuechse = []);
    	$$invalidate(26, imageSrc = "");
    	$$invalidate(25, breiteVisible = false);
    	$$invalidate(24, hoeheVisible = false);
    	$$invalidate(23, breiteobenVisible = false);
    	$$invalidate(22, breiteuntenVisible = false);
    	$$invalidate(21, xVisible = false);
    	$$invalidate(28, querschnittEingabeVisible = false);
    	$$invalidate(27, umfangEingabeVisible = false);

    	return [
    		strickler,
    		gefaelle,
    		breiteOben,
    		breiteUnten,
    		hoehe,
    		xWert,
    		querschnittEingabe,
    		umfangEingabe,
    		hoehenunterschied,
    		laengeFluss,
    		gefaelleOption,
    		selectedQuerschnitt,
    		selectedBewuchs,
    		selectedKategory,
    		bewuechse,
    		message,
    		flaeche,
    		umfang,
    		geschwindigkeitms,
    		geschwindigkeitkt,
    		durchfluss,
    		xVisible,
    		breiteuntenVisible,
    		breiteobenVisible,
    		hoeheVisible,
    		breiteVisible,
    		imageSrc,
    		umfangEingabeVisible,
    		querschnittEingabeVisible,
    		kategories,
    		querschnitte,
    		select0_change_handler,
    		select1_change_handler,
    		input0_input_handler,
    		input1_change_handler,
    		$$binding_groups,
    		input2_change_handler,
    		input_input_handler,
    		input0_input_handler_1,
    		input1_input_handler,
    		select2_change_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

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

})();
//# sourceMappingURL=bundle.js.map
