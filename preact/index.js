import { h } from 'https://esm.sh/preact';
import { useState } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

function Ceshi(props) {
    const [count, setCount] = useState(45);
    return html`
        <div>
            <div>ceshi${count * 100}</div>
        </div>
    `;
}

export default Ceshi;
