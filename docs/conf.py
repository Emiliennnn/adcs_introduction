# Configuration file for the Sphinx documentation builder.
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
project = "Space GNC Handbook"
author = "Emilien Coudurier"
copyright = "2026, Emilien Coudurier"
release = "0.1.0"

# -- General configuration ---------------------------------------------------
extensions = [
    "myst_parser",
    "sphinxcontrib.bibtex",
    "sphinx_copybutton",
    "sphinx_design",
]

# MyST Markdown extensions
myst_enable_extensions = [
    "amsmath",       # LaTeX-style aligned math environments
    "colon_fence",   # ::: fenced directives
    "deflist",       # definition lists
    "dollarmath",    # $inline$ and $$block$$ math
    "html_image",    # <img> tags in Markdown
    "linkify",       # auto-detect bare URLs
    "substitution",  # variable substitution
    "tasklist",      # - [ ] checkboxes
]
myst_heading_anchors = 3  # auto-generate anchors for h1-h3

# Bibliography
bibtex_bibfiles = ["refs.bib"]
bibtex_reference_style = "author_year"

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

# -- Options for HTML output -------------------------------------------------
html_theme = "furo"
html_title = "Space GNC Handbook"
html_static_path = ["_static"]
html_css_files = ["custom.css"]

html_theme_options = {
    "source_repository": "https://github.com/Emiliennnn/adcs_introduction/",
    "source_branch": "main",
    "source_directory": "docs/",
}

# -- MathJax -----------------------------------------------------------------
# Enable equation numbering across the whole document set.
numfig = True
math_number_all = True
math_eqref_format = "Eq.{number}"
