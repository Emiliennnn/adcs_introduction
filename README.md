# Space GNC Handbook

An open, public reference on spacecraft **Guidance, Navigation & Control** and
the surrounding subsystems. Built with [Sphinx](https://www.sphinx-doc.org/) +
[MyST Markdown](https://myst-parser.readthedocs.io/) and published on
[Read the Docs](https://readthedocs.org/).

## Topics

- Control
- State Estimation
- Orbit Dynamics
- Space Sensors & Actuators
- ADCS / AOCS
- Disturbances in Space
- Microcontroller Communication
- Monte Carlo Simulation
- FDIR (Fault Detection, Isolation & Recovery)

## Build locally

```bash
python -m venv .venv
# Windows:  .venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate
pip install -r docs/requirements.txt
sphinx-build -b html docs docs/_build/html
```

Then open `docs/_build/html/index.html` in a browser. For live reload while
writing, `pip install sphinx-autobuild` and run:

```bash
sphinx-autobuild docs docs/_build/html
```

## Writing content

Each topic lives in `docs/<topic>/index.md`. To add a subpage, create a new
`.md` file in that topic folder and list it in the topic's `toctree` (a
commented template is already in each `index.md`).

- **Math:** `$inline$` and `$$block$$` LaTeX via MathJax.
- **Citations:** add a BibTeX entry to `docs/refs.bib`, then cite with
  `` {cite}`key` ``. Everything shows up on the References page.
- **Admonitions, cards, grids:** provided by `sphinx-design` (see `index.md`).

## License

Documentation content is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — see [LICENSE](LICENSE).
