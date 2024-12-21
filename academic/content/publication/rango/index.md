---
title: 'Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification'
subtitle: ''

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - kyle-thompson
  - nuno-saavedra
  - admin
  - kevin-fisher
  - alex-sanchez-stern
  - yuriy-brun
  - joao-ferreira
  - sorin-lerner
  - emily-first

date: '2025-04-30T14:30:00'

# Schedule page publish date (NOT publication's date).
publishDate: '2024-12-18T17:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['1']
publication: In [International Conference on Software Engineering 2024](https://conf.researchr.org/home/icse-2025)
publication_short: In [ICSE 2025](https://conf.researchr.org/home/icse-2025)

abstract: 'Formal verification using proof assistants, such as Coq, enables the creation of high-quality software. However, the verification process requires significant expertise and manual effort to write proofs. Recent work has explored automating proof synthesis using machine learning and large language models (LLMs). This work has shown that identifying relevant premises, such as lemmas and definitions, can aid synthesis. We present Rango, a fully automated proof synthesis tool for Coq that automatically identifies relevant premises and also similar proofs from the current project and uses them during synthesis. Rango uses retrieval augmentation at every step of the proof to automatically determine which proofs and premises to include in the context of its fine-tuned LLM.  In this way, Rango adapts to the project and to the evolving state of the proof. We create a new dataset, CoqStoq, of 2,226 open-source Coq projects and 196,929 theorems from GitHub, which includes both training data and a curated evaluation benchmark of well-maintained projects. On this benchmark, Rango synthesizes proofs for 32.0% of the theorems, which is 29% more theorems than the prior state-of-the-art tool Tactician. Our evaluation also shows that Rango adding relevant proofs to its context leads to a 47% increase in the number of theorems proven.'

tags: []

# Display this page in the Featured widget?
featured: true

# Custom links (uncomment lines below)
links:
- name: Pre-print
  url: https://arxiv.org/abs/2412.14063

url_code: https://github.com/rkthomps/coq-modeling
url_dataset: https://github.com/rkthomps/CoqStoq
---
