export class Component{
    root: HTMLElement;

constructor(
public parent: HTMLElement,
tagName: keyof HTMLElementTagNameMap,
arrStyles?: string[] | null,
content?: string | null,
attrProp?: string[] | null,
attrValue?: string[] | null
)
{
this.root = document.createElement(tagName);
if (arrStyles)
{
arrStyles.forEach((nameStyle) =>
{
this.root.classList.add(nameStyle);
});
}
if (content) this.root.innerHTML = content;
if (attrProp && attrValue && attrProp.length === attrValue.length)
{
attrProp.forEach((prop, i) => {
this.root.setAttribute(prop, attrValue[i]);
});
}
//this.root.setAttribute('value', 'показать');
this.render();
}

remove()
{
this.root.remove();
}

render()
{
this.parent.append(this.root);
}
    }