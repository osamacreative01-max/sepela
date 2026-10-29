"use client";
import { useState } from "react";
import CanScene from "./CanScene";
import { products, PACKS, CURRENCY } from "../data/products";

export default function Flavors() {
  const [i, setI] = useState(0);
  const [pack, setPack] = useState(PACKS[1]);
  const [cart, setCart] = useState(0);
  const [msg, setMsg] = useState("");
  const p = products[i];
  const total = p.pricePerCan * pack;

  const add = () => {
    setCart((c) => c + pack);
    setMsg(`${pack} × ${p.name} added. Checkout is not connected yet.`);
  };

  return (
    <>
      <div id="story" className="story">
        <CanScene />
        <nav className="nav">
          <a className="logo" href="#story" aria-label="SEPELA home"><img src="/logo.png" alt="SEPELA" /></a>
          <a className="cartlink" href="#shop">Cart ({cart})</a>
        </nav>

        <section className="panel hero">
          <img className="wordmark" src="/logo.png" alt="" aria-hidden="true" />
          <div className="ptext">
            <h1>Cocktails,<br /><em>canned.</em></h1>
            <p className="lead">Three classics, poured and sealed. 250 ml, 7% Vol. Scroll to meet them.</p>
          </div>
        </section>

        {products.map((x, k) => (
          <section key={x.id} className={`panel flavor ${k % 2 === 0 ? "canright" : "canleft"}`}>
            <div className="ptext">
              <h2>{x.name}</h2>
              <p className="lead">{x.blurb}</p>
              <p className="meta">{x.size} · {x.abv}</p>
              <a className="btn gold" href="#shop" onClick={() => setI(k)}>Order this flavor</a>
            </div>
          </section>
        ))}
      </div>

      <div className="after">
        <section className="lineup">
          <h2>The lineup</h2>
          <div className="grid">
            {products.map((x, k) => (
              <a key={x.id} className="card" href="#shop" onClick={() => setI(k)} style={{ "--c": x.bg }}>
                <div
                  className="minican"
                  role="img"
                  aria-label={`SEPELA ${x.name} can`}
                  style={{ backgroundImage: `url(${x.label})`, backgroundPositionX: `${((x.faceU - 0.1786) / 0.6429) * 100}%` }}
                />
                <h3>{x.name}</h3>
                <p>{x.blurb}</p>
                <span className="meta">{x.size} · {x.abv}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="shop" className="shop">
          <div>
            <h2>Order {p.name}</h2>
            <p className="lead dark">{p.blurb}</p>
            <div className="packs" role="radiogroup" aria-label="Flavor">
              {products.map((x, k) => (
                <button key={x.id} role="radio" aria-checked={i === k} className={i === k ? "pk on" : "pk"} onClick={() => setI(k)}>
                  {x.name}
                </button>
              ))}
            </div>
          </div>
          <div className="buy">
            <div className="packs" role="radiogroup" aria-label="Pack size">
              {PACKS.map((n) => (
                <button key={n} role="radio" aria-checked={pack === n} className={pack === n ? "pk on" : "pk"} onClick={() => setPack(n)}>
                  {n} cans
                </button>
              ))}
            </div>
            <div className="price">{CURRENCY} {total.toLocaleString()}</div>
            <button className="btn gold" onClick={add}>Add to cart</button>
            <p className="note" aria-live="polite">{msg}</p>
          </div>
        </section>
      </div>
    </>
  );
}
