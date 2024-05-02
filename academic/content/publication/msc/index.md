---
title: 'Formal Specification and Verification of the Lazy JellyFish Skip List'
subtitle: 'A Case Study in Iris on the Verification of Concurrent Maps with Version Control'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - admin

date: '2022-11-25T14:30:00Z'

# Schedule page publish date (NOT publication's date).
publishDate: '2022-11-25T14:30:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['7']
advisors:
  - joao-ferreira
examiners:
  - ralf-jung
publication: |-
  [MSc Thesis, Instituto Superior Técnico](https://scholar.tecnico.ulisboa.pt/records/WcX0DzHiRG0JbSdINpsBWX_h8g9go2ZN2yrC)
publication_short: MSc Thesis

abstract: 'Concurrent append-only skip lists are widely used in data store applications, so as to maintain multiple versions of the same data with different timestamps, rather than delete outdated information. One such skip list implementation is JellyFish, which greatly mitigates the drop in performance witnessed in other skip lists induced by the append-only design. JellyFish accomplishes this feat by storing in each node a consistent timeline of values as a linked list, instead of inserting new nodes in the skip list. 
<br> <br>
In this work, we present a lock-based variant of JellyFish, using a lazy synchronization strategy, and formally verify its functional correctness. We further show that this data structure satisfies the specification of a concurrent map. To reason about concurrent updates on values, we define a novel resource algebra over timestamped domains. Using the argmax operator for this algebra, we prove that concurrent updates to the map always maintain the most recent values. We also show that updates to a node maintain its history of values consistent. Our proofs are mechanized in Coq using the concurrent separation logic of Iris.'

tags: []

# Display this page in the Featured widget?
featured: true

# Custom links (uncomment lines below)
links:
- name: Extended Abstract
  url: extended-abstract.pdf
- name: Coq development
  url: https://github.com/sr-lab/iris-jellyfish

slides: msc
---
