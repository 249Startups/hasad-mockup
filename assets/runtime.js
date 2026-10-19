/* Hasad mockup runtime: renders the page template with simple {{path}} bindings,
   data-for / data-if blocks and on* event bindings. No dependencies. */
(function () {
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) { Object.assign(this.state, patch); window.__hasadRender(); }
    renderVals() { return {}; }
  }
  window.DCLogic = DCLogic;

  function lookup(expr, scope) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    return expr.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
  }
  const ONE = /^\s*\{\{([^}]+)\}\}\s*$/;
  const ANY = /\{\{([^}]+)\}\}/g;
  function interp(str, scope) {
    return str.replace(ANY, (_, e) => { const v = lookup(e, scope); return v == null ? '' : String(v); });
  }

  function processNode(node, scope) {
    if (node.nodeType === 3) {
      if (node.nodeValue.indexOf('{{') !== -1) node.nodeValue = interp(node.nodeValue, scope);
      return;
    }
    if (node.nodeType !== 1) return;
    if (node.hasAttribute('data-for')) {
      const list = lookup(node.getAttribute('data-for').replace(/[{}]/g, ''), scope) || [];
      const as = node.getAttribute('data-as') || 'item';
      const parent = node.parentNode;
      list.forEach((item) => {
        const clone = node.cloneNode(true);
        clone.removeAttribute('data-for'); clone.removeAttribute('data-as');
        const child = Object.create(scope); child[as] = item;
        parent.insertBefore(clone, node);
        processNode(clone, child);
      });
      parent.removeChild(node);
      return;
    }
    if (node.hasAttribute('data-if')) {
      const v = lookup(node.getAttribute('data-if').replace(/[{}]/g, ''), scope);
      if (!v) { node.parentNode.removeChild(node); return; }
      node.removeAttribute('data-if');
    }
    Array.from(node.attributes).forEach((a) => {
      if (a.value.indexOf('{{') === -1) return;
      const name = a.name.toLowerCase();
      if (name.startsWith('on')) {
        const m = a.value.match(ONE);
        const fn = m ? lookup(m[1], scope) : null;
        node.removeAttribute(a.name);
        if (typeof fn === 'function') node.addEventListener(name.slice(2), fn);
      } else {
        node.setAttribute(a.name, interp(a.value, scope));
      }
    });
    Array.from(node.childNodes).forEach((c) => processNode(c, scope));
  }

  let instance = null;
  window.__hasadRender = function () {
    const root = document.getElementById('app');
    const tpl = document.getElementById('tpl');
    const frag = tpl.content.cloneNode(true);
    const scope = instance ? instance.renderVals() : {};
    Array.from(frag.childNodes).forEach((c) => processNode(c, scope));
    root.replaceChildren(frag);
  };
  window.__hasadMount = function (Cls, props) {
    instance = new Cls(props || {});
    instance.state = instance.state || {};
    window.__hasadRender();
  };
})();
