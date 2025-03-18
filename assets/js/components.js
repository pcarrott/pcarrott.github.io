// Page template components
class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header id="header">
                <div class="content">
                    <a class="button simple flavicon" href="/">
                        <img src="/images/icon.svg" height="100%" alt="" />
                    </a>

                    <h1>P<span>&exist;</span>dro C<span>&forall;</span>rrott</h1>

                    <nav class="links">
                        <ul>
                            <li><a href="/research">Research</a></li>
                            <li><a href="/publications">Publications</a></li>
                            <li><a href="/experience">Experience</a></li>
                            <li><a href="/personal">Personal</a></li>
                        </ul>
                    </nav>

                    <a class="button simple menu" href="#menu">
                        <i class="fa fa-bars"></i>
                    </a>
                </div>
            </header>
        `;
    }
}

class Menu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <ul class="links">
                <li>
                    <a href="/research">
                        <h3>Research</h3>
                    </a>
                </li>
                <li>
                    <a href="/publications">
                        <h3>Publications</h3>
                    </a>
                </li>
                <li>
                    <a href="/experience">
                        <h3>Experience</h3>
                    </a>
                </li>
                <li>
                    <a href="/personal">
                        <h3>Personal</h3>
                    </a>
                </li>
            </ul>
        `;
    }
}

class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const date = new Date();
        this.innerHTML = `
            <section id="footer">
                <p class="copyright">
                    <b>
                        &copy; ${date.getFullYear()}
                        Pedro Carrott.
                    </b>
                    <i>Meme design is my passion.</i>
                    <br><br>
                    Based on <i><u style="text-underline-offset: 1px;">Future Imperfect</u></i> by <a href="http://html5up.net" target="_blank">HTML5 UP</a>
                </p>
            </section>
        `;
    }
}

customElements.define('header-component', Header);
customElements.define('menu-component', Menu);
customElements.define('footer-component', Footer);


// Authors
function Entity(name, link, local = false) {
    return class extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            if (link === "") {
                this.innerHTML = name;
            } else if (local) {
                this.innerHTML = `<a href="${link}">${name}</a>`;
            } else {
                this.innerHTML = `<a href="${link}" target="_blank">${name}</a>`;
            }
        }
    };
}
class Admin extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<b>Pedro Carrott</b>`;
    }
}

// Me as author
customElements.define('pedro-carrott', Admin);

// Instituto Superior Técnico
customElements.define('tecnico-ul', Entity("Instituto Superior Técnico", "https://tecnico.ulisboa.pt/en"));
customElements.define('nuno-saavedra', Entity("Nuno Saavedra", "https://www.nuno.saavedra.pt"));
customElements.define('joao-ferreira', Entity("João F. Ferreira", "https://joaoff.com"));

// Imperial College London
customElements.define('imperial-college', Entity("Imperial College London", "https://www.imperial.ac.uk"));
customElements.define('azalea-raad', Entity("Azalea Raad", "https://www.soundandcomplete.org"));
customElements.define('sacha-ayoun', Entity("Sacha-Élie Ayoun", "https://www.doc.ic.ac.uk/~sja3417"));

// CoqPyt/Rango project
customElements.define('emily-first', Entity("Emily First", "https://efirst.github.io"));
customElements.define('kyle-thompson', Entity("Kyle Thompson", "https://rkthomps.github.io"));
customElements.define('yuriy-brun', Entity("Yuriy Brun", "https://people.cs.umass.edu/~brun"));
customElements.define('sorin-lerner', Entity("Sorin Lerner", "https://cseweb.ucsd.edu/~lerner"));
customElements.define('alex-sanchez-stern', Entity("Alex Sanchez-Stern", "https://www.alexsanchezstern.com"));
customElements.define('kevin-fisher', Entity("Kevin Fisher", ""));

// Conferences
customElements.define('popl-2024', Entity("POPL 2024", "https://popl24.sigplan.org"));
customElements.define('popl-2025', Entity("POPL 2025", "https://popl25.sigplan.org"));

// Iris
customElements.define('ralf-jung', Entity("Ralf Jung", "https://research.ralfj.de"));

// Other
customElements.define('goethe-institut', Entity("Goethe-Institut", "https://www.goethe.de/en"));


// Publications and talks
function ResearchItem(id, title, authors, venue) {
    return class extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            authors = authors
                .map(item => { return "<" + item + "></" + item + ">"; })
                .join(", ");
            this.innerHTML = `
                <article class="publication">
                    <header>
                        <div class="title"><a href="/research/${id}">${title}</a></div>
                        <div class="authors">${authors}</div>
                        <div class="venue">${venue}</div>
                    </header>
                </article>
            `;
        }
    };
}

function ResearchPage(title, authors, links, abstract, venue) {
    return class extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            authors = authors
                .map(item => { return "<" + item + "></" + item + ">"; })
                .join(", ");
            links = links
                .map(item => {
                    if (item[1] === "") {
                        return `<span class="button disabled">${item[0]}</span>`;
                    } else {
                        return `<a href="${item[1]}" target="_blank"><button>${item[0]}</button></a>`;
                    }
                })
                .join(" ");
            this.innerHTML = `
                <div>
                    <h1 class="research">${title}</h1>
                    <div class="authors" style="margin: 0 0 1em 0;">${authors}</div>

                    <h3>${links}</h3>

                    <h1>Abstract</h1>
                    ${abstract}
                    <br><br>
                    <h3 class="research">${venue}</h3>
                </div>
            `;
        }
    };
}

function defineResearchElement(id, title, authors, links, abstract, venue, distinguished = false) {
    title = title + (distinguished ? " <span class='distinguished'>(Distinguished Paper)</span>" : "");
    customElements.define(`${id}-link`, Entity(title, `/research/${id}`, true));
    customElements.define(`${id}-item`, ResearchItem(id, title, authors, venue));
    customElements.define(`${id}-page`, ResearchPage(title, authors, links, abstract, venue));
}

defineResearchElement('carrott2022thesis',
    "Formal Specification and Verification of the Lazy JellyFish Skip List",
    ["pedro-carrott"],
    [
        ['PDF', 'carrott2022thesis.pdf'],
        ['Extended Abstract', 'carrott2022abstract.pdf'],
        ['Rocq Development', 'https://github.com/sr-lab/iris-jellyfish']
    ],
    `
    Concurrent append-only skip lists are widely used in data store applications, so as to maintain multiple
    versions of the same data with different timestamps, rather than delete outdated information. One such
    skip
    list implementation is JellyFish, which greatly mitigates the drop in performance witnessed in other
    skip
    lists induced by the append-only design. JellyFish accomplishes this feat by storing in each node a
    consistent timeline of values as a linked list, instead of inserting new nodes in the skip list.

    <br><br>

    In this work, we present a lock-based variant of JellyFish, using a lazy synchronization strategy, and
    formally verify its functional correctness. We further show that this data structure satisfies the
    specification of a concurrent map. To reason about concurrent updates on values, we define a novel
    resource
    algebra over timestamped domains. Using the <b>argmax</b> operator for this algebra, we prove that
    concurrent updates to the map always maintain the most recent values. We also show that updates to a
    node
    maintain its history of values consistent. Our proofs are mechanized in Coq using the concurrent
    separation
    logic of Iris.
    `,
    "MSc Thesis, Instituto Superior Técnico, 2022"
);

defineResearchElement('carrott2024coqpyt',
    "CoqPyt: Proof Navigation in Python in the Era of LLMs",
    ["pedro-carrott", "nuno-saavedra", "kyle-thompson", "sorin-lerner", "joao-ferreira", "emily-first"],
    [
        ['DOI', 'https://doi.org/10.1145/3663529.3663814'],
        ['PDF', 'carrott2024coqpyt.pdf'],
        ['Code', 'https://github.com/sr-lab/coqpyt'],
        ['Video', 'https://youtu.be/fk74o0rePM8'],
        ['Pre-print', 'https://arxiv.org/abs/2405.04282']
    ],
    `
    Proof assistants enable users to develop machine-checked proofs regarding software-related properties.
    Unfortunately, the interactive nature of these proof assistants imposes most of the proof burden on the user, making
    formal verification a complex, and time-consuming endeavor. Recent automation techniques based on neural methods
    address this issue, but require good programmatic support for collecting data and interacting with proof assistants.
    This paper presents CoqPyt, a Python tool for interacting with the Coq proof assistant.
    CoqPyt improves on other Coq-related tools by providing novel features, such as the extraction of rich premise data.
    We expect our work to aid development of tools and techniques, especially LLM-based, designed for proof synthesis and repair.
    `,
    "FSE 2024: Companion Proceedings of the 32nd ACM International Conference on the Foundations of Software Engineering"
);

defineResearchElement('carrott2025unsafe',
    "Scalable Bug Detection for Internally Unsafe Libraries: A Logical Approach to Type Refutation",
    ["pedro-carrott", "sacha-ayoun", "azalea-raad"],
    [
        ['Slides', 'carrott2025unsafe.pdf'],
        ['Video', 'https://www.youtube.com/live/pdYtlOtP2Vk?si=YvEU5Sj57Mc-MnDl&t=14437']
    ],
    `
    Recent work has shown promising advances in techniques for scalable bug detection by leveraging <i>under-approximate</i> (UX) reasoning.
    This work presents a UX approach to <i>automatically</i> detect type unsoundness in libraries that rely on internal use of <i>unsafe features</i>.
    To reason about such libraries, we build on prior work by encoding type assignments as <i>separation logic</i> assertions.
    Our key insight is that undefined behaviour obtained from incorrect uses of unsafe features
    may be reasoned about by refuting such type assignments via <i>incorrectness logic</i>.
    We demonstrate how our approach may be used to detect memory safety bugs in a simple language with an ownership type system.
    `,
    "TPSA 2025: Workshop on Theory and Practice of Static Analysis"
);

defineResearchElement('thompson2025rango',
    "Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification",
    ["kyle-thompson", "nuno-saavedra", "pedro-carrott", "kevin-fisher", "alex-sanchez-stern", "yuriy-brun", "joao-ferreira", "sorin-lerner", "emily-first"],
    [
        ['DOI', 'https://doi.ieeecomputersociety.org/10.1109/ICSE55347.2025.00161'],
        ['PDF', 'thompson2025rango.pdf'],
        ['Code', 'https://github.com/rkthomps/coq-modeling'],
        ['Dataset', 'https://github.com/rkthomps/CoqStoq'],
        ['Pre-print', 'https://arxiv.org/abs/2412.14063']
    ],
    `
    Formal verification using proof assistants, such as Coq, enables the creation of high-quality software.
    However, the verification process requires significant expertise and manual effort to write proofs.
    Recent work has explored automating proof synthesis using machine learning and large language models (LLMs).
    This work has shown that identifying relevant premises, such as lemmas and definitions, can aid synthesis.
    We present Rango, a fully automated proof synthesis tool for Coq that automatically identifies relevant
    premises and also similar proofs from the current project and uses them during synthesis.
    Rango uses retrieval augmentation at every step of the proof to automatically determine
    which proofs and premises to include in the context of its fine-tuned LLM.
    In this way, Rango adapts to the project and to the evolving state of the proof.
    We create a new dataset, CoqStoq, of 2,226 open-source Coq projects and 196,929 theorems from GitHub,
    which includes both training data and a curated evaluation benchmark of well-maintained projects.
    On this benchmark, Rango synthesizes proofs for 32.0% of the theorems,
    which is 29% more theorems than the prior state-of-the-art tool Tactician.
    Our evaluation also shows that Rango adding relevant proofs to its context leads to a 47% increase in the number of theorems proven.
    `,
    "ICSE '25: Proceedings of the IEEE/ACM 47th International Conference on Software Engineering",
    true
)
