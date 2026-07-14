# Configuration file for the Sphinx documentation builder.
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
project = "ADCS Introduction Handbook"
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
html_title = "ADCS Introduction Handbook"
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
numfig_format = {"figure": "Figure %s", "table": "Table %s", "code-block": "Listing %s"}
math_number_all = True
math_eqref_format = "Eq.{number}"


# -- Custom "example" admonition (green box) ---------------------------------
# Registers a ::: {example} ... ::: directive, styled green in custom.css,
# mirroring the built-in ::: {note} box.
from docutils import nodes
from docutils.parsers.rst.directives.admonitions import BaseAdmonition


class ExampleDirective(BaseAdmonition):
    node_class = nodes.admonition
    required_arguments = 0
    optional_arguments = 1
    final_argument_whitespace = True

    def run(self):
        # Default the title to "Example" when none is given after the name.
        self.arguments = self.arguments or ["Example"]
        classes = self.options.setdefault("class", [])
        if "example" not in classes:
            classes.append("example")
        return super().run()


def setup(app):
    app.add_directive("example", ExampleDirective)
